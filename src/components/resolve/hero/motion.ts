import type { Region } from "../../../data/heroCards";
import { follow, stepFixed, stepSpring } from "../../../lib/spring";
import type { Fit } from "./fit";
import { CLAMP, driftAt, LENS_R, placeLens, REST_X, REST_Y, regionAt } from "./lens";
import { applyH, CORNERS, projector, screenToCard, type Pose, type Pt } from "./projector";
import { SHAPES, shapesFor } from "./Shapes";

/* --------------------------------------------------------------------------
   EVERYTHING THE STAGE DOES BETWEEN FRAMES.

   The lens follows and drifts, the card leans, the shapes bob and can be
   thrown. All of it runs off the page's one frame clock — the site has
   exactly one, and a second would be a second scheduler competing for the
   same 16 milliseconds.

   NO LAYOUT READS IN HERE. The pointer is mapped onto the tilted card
   through a homography built from the analytic projector, not from
   elementFromPoint or a bounding box, both of which describe the flattened
   box of a tilted plane rather than the plane. The homography is rebuilt only
   when the pose actually changes.

   THE SPRINGS RUN AT A FIXED 120Hz. A physics step fed whatever dt the frame
   happened to take is a different simulation on every machine, and it blows
   up after a long task.
   -------------------------------------------------------------------------- */

const PERSP = 1800;
const REST_RY = -17;
const REST_RX = 7;
/** how far the card leans, in degrees, at the edges of the stage */
const TILT_Y = 4;
const TILT_X = 3;
/** the pointer has to move the pose by this much before the maths is redone */
const POSE_EPS = 0.05;
/** without a pointer for this long, the lens goes back to wandering */
const IDLE_AFTER = 2.5;
/** and it holds where it was left for this long before gliding home */
const HOLD_AFTER_LEAVE = 1.5;

type Body = {
  el: HTMLElement;
  hx: number;
  hy: number;
  rot: number;
  size: number;
  front: boolean;
  px: number;
  py: number;
  x: { x: number; v: number };
  y: { x: number; v: number };
  r: { x: number; v: number };
  drag: boolean;
  amp: number;
  period: number;
  phase: number;
};

export type Motion = ReturnType<typeof createMotion>;

export function createMotion(opts: {
  stage: HTMLElement;
  card: HTMLElement;
  lens: () => HTMLElement | null;
  rim: () => HTMLElement | null;
  tag: () => HTMLElement | null;
  shapes: Map<string, HTMLElement>;
  onRegion: (r: Region) => void;
}) {
  let fit: Fit | null = null;
  let pose: Pose | null = null;
  let toCard: number[] | null = null;
  let project: ((u: number, v: number) => Pt) | null = null;

  /* pointer, in stage pixels and in card space */
  let px = 0;
  let py = 0;
  let inside = false;
  let haveSeen = false;
  let lastMove = -Infinity;
  let leftAt = -Infinity;

  const lens = { x: REST_X, y: REST_Y, s: 1 };
  let pressed = false;
  let region: Region = "number";

  const tilt = { ry: REST_RY, rx: REST_RX };
  let poseRy = REST_RY;
  let poseRx = REST_RX;

  let bodies: Body[] = [];
  const acc = { t: 0 };
  let enabled = true;
  /* the hand-off owns the card from a > 0; motion stands down */
  let handoff = 0;

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rebuildPose() {
    if (!fit || fit.layout === "none") return;
    pose = {
      tx: fit.cx - 230,
      ty: fit.cy - 312,
      ry: tilt.ry,
      rx: tilt.rx,
      rz: fit.layout === "stacked" ? -1 : -1.5,
      k: fit.k,
      persp: PERSP,
      ox: window.innerWidth * 0.4,
      oy: window.innerHeight * 0.48,
    };
    project = projector(pose);
    toCard = screenToCard(pose);
    poseRy = tilt.ry;
    poseRx = tilt.rx;
  }

  function setFit(f: Fit) {
    fit = f;
    if (f.layout === "none") return;
    if (f.layout === "stacked") {
      tilt.ry = -6;
      tilt.rx = 4;
    }
    rebuildPose();
    bodies = shapesFor(f.mode)
      .map((def) => {
        const el = opts.shapes.get(def.key);
        if (!el) return null;
        const size = f.w * def.size;
        const hx = Number(el.dataset.hx ?? 0);
        const hy = Number(el.dataset.hy ?? 0);
        const spec = SHAPES.find((s) => s.key === def.key)!;
        return {
          el,
          hx,
          hy,
          rot: spec.rotate,
          size,
          front: spec.layer === "front",
          px: 0,
          py: 0,
          x: { x: hx, v: 0 },
          y: { x: hy, v: 0 },
          r: { x: 0, v: 0 },
          drag: false,
          amp: 6,
          period: spec.period,
          phase: (def.key.charCodeAt(0) % 7) * 0.9,
        } as Body;
      })
      .filter((b): b is Body => b !== null);
  }

  /** the pointer, mapped through the tilt onto the card's own plane */
  function cardPoint(): Pt | null {
    if (!toCard) return null;
    return applyH(toCard, px, py);
  }

  function onPointerMove(e: PointerEvent) {
    px = e.clientX;
    py = e.clientY;
    lastMove = performance.now() / 1000;
    haveSeen = true;
    const p = cardPoint();
    /* "over the card, or within forty pixels of it" — generous, because the
       lens reaching out slightly before the pointer arrives reads as the card
       noticing you */
    inside = !!p && p[0] > -40 && p[0] < 500 && p[1] > -40 && p[1] < 664;
    if (!inside) leftAt = lastMove;
  }

  function setPressed(on: boolean) {
    pressed = on;
  }

  function setEnabled(on: boolean) {
    enabled = on;
  }

  function setHandoff(a: number) {
    handoff = a;
  }

  function tick(dt: number, time: number) {
    if (!fit || fit.layout === "none" || !enabled) return;
    const soft = reduced();
    const stacked = fit.layout === "stacked";

    /* ── the lens ─────────────────────────────────────────────────────── */
    const idle = soft || stacked || !haveSeen || time - lastMove > IDLE_AFTER;
    let tx: number;
    let ty: number;
    if (handoff > 0) {
      tx = REST_X;
      ty = REST_Y;
    } else if (idle) {
      if (soft) {
        tx = REST_X;
        ty = REST_Y;
      } else {
        const held = time - leftAt < HOLD_AFTER_LEAVE && !inside;
        [tx, ty] = held ? [lens.x, lens.y] : driftAt(time);
      }
    } else if (inside) {
      const p = cardPoint();
      tx = p ? Math.min(Math.max(p[0], CLAMP.minX), CLAMP.maxX) : REST_X;
      ty = p ? Math.min(Math.max(p[1], CLAMP.minY), CLAMP.maxY) : REST_Y;
    } else {
      tx = REST_X;
      ty = REST_Y;
    }
    /* fast when following a pointer, slow when gliding home */
    const speed = inside && !idle ? 14 : 4;
    lens.x = soft ? tx : follow(lens.x, tx, dt, speed);
    lens.y = soft ? ty : follow(lens.y, ty, dt, speed);
    const wantS = pressed && !soft ? 140 / LENS_R : 1;
    lens.s = soft ? wantS : follow(lens.s, wantS, dt, 18);
    placeLens(opts.lens(), opts.rim(), opts.tag(), lens.x, lens.y, lens.s);

    const next = regionAt(lens.y, region);
    if (next !== region) {
      region = next;
      opts.onRegion(next);
    }

    /* ── the card leans ───────────────────────────────────────────────── */
    if (!soft && !stacked && handoff <= 0) {
      const nx = Math.min(Math.max((px - window.innerWidth / 2) / (window.innerWidth / 2), -1), 1);
      const ny = Math.min(Math.max((py - window.innerHeight / 2) / (window.innerHeight / 2), -1), 1);
      /* speed 6, so it feels like something with mass rather than something
         glued to the cursor */
      tilt.ry = follow(tilt.ry, REST_RY + nx * TILT_Y, dt, 6);
      tilt.rx = follow(tilt.rx, REST_RX - ny * TILT_X, dt, 6);
      opts.stage.style.setProperty("--hc-ry", `${tilt.ry.toFixed(2)}deg`);
      opts.stage.style.setProperty("--hc-rx", `${tilt.rx.toFixed(2)}deg`);
      opts.stage.style.setProperty("--hc-glare", `${(nx * 6).toFixed(1)}%`);
      /* the plate's shadow leans the other way, which is what makes the lean
         read as a lean and not as a slide */
      opts.stage.style.setProperty("--hc-plate-x", `${(-nx * 10).toFixed(1)}px`);
      if (Math.abs(tilt.ry - poseRy) > POSE_EPS || Math.abs(tilt.rx - poseRx) > POSE_EPS) rebuildPose();
    }

    /* ── the shapes ───────────────────────────────────────────────────── */
    if (bodies.length) {
      const pnx = soft ? 0 : (px - window.innerWidth / 2) / (window.innerWidth / 2);
      const pny = soft ? 0 : (py - window.innerHeight / 2) / (window.innerHeight / 2);
      for (const b of bodies) {
        const k = b.front ? 0.04 : -0.02;
        b.px = soft ? 0 : follow(b.px, pnx * b.size * k * 4, dt, 5);
        b.py = soft ? 0 : follow(b.py, pny * b.size * k * 4, dt, 5);
      }
      if (soft) {
        for (const b of bodies) {
          b.x.x = b.hx;
          b.y.x = b.hy;
          b.r.x = 0;
        }
      } else {
        stepFixed(dt, acc, (h) => {
          for (const b of bodies) {
            const bob = Math.sin((time / b.period) * Math.PI * 2 + b.phase) * b.amp;
            const homeX = b.hx + b.px;
            const homeY = b.hy + b.py + bob;
            if (!b.drag) {
              stepSpring(b.x, homeX, 120, 0.6, h);
              stepSpring(b.y, homeY, 120, 0.6, h);
              b.r.v += b.x.v * 0.04 * h * 60;
              stepSpring(b.r, 0, 60, 0.55, h);
            }
            /* a thrown shape may not leave the stage: 180 pixels and it is
               reeled back in along the same line */
            const dx = b.x.x - homeX;
            const dy = b.y.x - homeY;
            const d = Math.hypot(dx, dy);
            if (d > 180) {
              b.x.x = homeX + (dx / d) * 180;
              b.y.x = homeY + (dy / d) * 180;
            }
          }
        });
      }
      for (const b of bodies) {
        b.el.style.transform = `translate3d(${b.x.x.toFixed(1)}px, ${b.y.x.toFixed(1)}px, 0) rotate(${(b.rot + b.r.x).toFixed(2)}deg)`;
      }
    }
  }

  /** screen-space corners, for anything that needs to know where the card is */
  function corners(): Pt[] {
    return project ? CORNERS.map(([u, v]) => project!(u, v)) : [];
  }

  function bodyFor(el: EventTarget | null): Body | undefined {
    return bodies.find((b) => b.el === el);
  }

  /* ── throwing a shape ───────────────────────────────────────────────────
     Three samples is enough to measure a flick and few enough that a slow
     drag ending in a stop does not inherit speed it no longer has. The cap
     is there because a fast mouse can report a velocity no spring should be
     asked to absorb. */
  const SAMPLES = 3;
  const MAX_V = 2400;
  let held: { b: Body; ox: number; oy: number; trail: Array<[number, number, number]> } | null = null;

  function grab(e: PointerEvent): boolean {
    if (reduced()) return false;
    const b = bodyFor(e.target);
    if (!b || !b.front) return false;
    b.drag = true;
    held = { b, ox: e.clientX - b.x.x, oy: e.clientY - b.y.x, trail: [[e.clientX, e.clientY, performance.now()]] };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    return true;
  }

  function dragTo(e: PointerEvent): void {
    if (!held) return;
    held.b.x.x = e.clientX - held.ox;
    held.b.y.x = e.clientY - held.oy;
    held.trail.push([e.clientX, e.clientY, performance.now()]);
    if (held.trail.length > SAMPLES) held.trail.shift();
  }

  function release(): { moved: boolean; body: Body } | null {
    if (!held) return null;
    const { b, trail } = held;
    const first = trail[0];
    const last = trail[trail.length - 1];
    const dt = (last[2] - first[2]) / 1000;
    const moved = Math.hypot(last[0] - first[0], last[1] - first[1]) > 4;
    if (dt > 0.001 && moved) {
      b.x.v = Math.max(-MAX_V, Math.min(MAX_V, (last[0] - first[0]) / dt));
      b.y.v = Math.max(-MAX_V, Math.min(MAX_V, (last[1] - first[1]) / dt));
    }
    b.drag = false;
    held = null;
    return { moved, body: b };
  }

  /** a click with no drag: a squash, which is the shape acknowledging you */
  function squash(b: Body): void {
    if (reduced()) return;
    b.el.animate(
      [
        { scale: "1 1" },
        { scale: "1.08 0.92", offset: 0.35 },
        { scale: "1 1" },
      ],
      { duration: 400, easing: "cubic-bezier(.23,1,.32,1)" },
    );
  }

  return {
    setFit,
    setPressed,
    setEnabled,
    setHandoff,
    onPointerMove,
    tick,
    corners,
    bodyFor,
    /** map any screen point onto the tilted card, for the reveal's origin */
    cardPoint: (x: number, y: number) => (toCard ? applyH(toCard, x, y) : null),
    grab,
    dragTo,
    release,
    squash,
  };
}
