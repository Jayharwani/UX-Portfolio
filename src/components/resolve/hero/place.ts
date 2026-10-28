import { HERO_CARDS, type ProductKey } from "../../../data/heroCards";
import { shapesFor } from "./Shapes";
import { BASE_H, BASE_W, type Fit } from "./fit";
import { CORNERS, projector, type Pose } from "./projector";
import { placeLens, REST_X, REST_Y } from "./lens";
import { setCardLight } from "./light";
import { cardSample, measureWire, setCardSource, setCardWire, type CardRect } from "./cardPoints";
import { fragmentsFor } from "../../../data/heroFragments";

/* --------------------------------------------------------------------------
   WHERE EVERYTHING ON THE STAGE GOES.

   One fit in, every transform out: the card, the shadow, the shapes, their
   labels, the tabs, the lens, the page's light and the particle field's copy
   of the card. React renders the elements; this writes their positions, and
   it is the only thing that does.

   IT RUNS ON A LAYOUT, NEVER ON A FRAME — a resize, a font landing, a product
   change — which is why it is allowed the handful of getBoundingClientRects
   at the top and why the per-frame loop in motion.ts has none at all.
   -------------------------------------------------------------------------- */

/** HOW MANY PARTICLES THE CARD IS WORTH, and it is a fixed number rather
 *  than the field's own count: a slow device gets fewer points and simply
 *  draws the first N of a randomly ordered sample, which thins the listing
 *  evenly instead of cutting it off halfway down. */
const CARD_POINTS = 4900;
const CARD_HALO = 900;

const PERSP = 1800;
const REST_RY = -17;
const REST_RX = 7;

/** every element the placement writes to, gathered once by the component */
export type StageParts = {
  stage: HTMLElement;
  /** the intro's own furniture, absent on every visit after the first */
  line?: HTMLElement | null;
  scribble?: SVGElement | null;
  wire?: HTMLElement | null;
  layer?: HTMLElement | null;
  inner?: HTMLElement | null;
  pieces?: Map<string, HTMLElement>;
  floor: HTMLElement | null;
  tabs: HTMLElement | null;
  toggle: HTMLElement | null;
  lens: HTMLElement | null;
  rim: HTMLElement | null;
  tag: HTMLElement | null;
  shapes: Map<string, HTMLElement>;
  tokens: Map<string, HTMLElement>;
};

function headlineBox(): DOMRect | null {
  const lines = document.querySelectorAll(".rs-display .rs-line");
  if (!lines.length) return null;
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const line of lines) {
    const node = Array.from(line.querySelectorAll("span")).find((s) => s.firstChild?.nodeType === Node.TEXT_NODE);
    const range = document.createRange();
    range.selectNodeContents(node ?? line);
    const r = range.getBoundingClientRect();
    if (!r.width) continue;
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  }
  if (!Number.isFinite(left)) return null;
  return new DOMRect(left, top, right - left, bottom - top);
}


/** Draw the skeleton blocks once per layout. Children are reused where they
 *  can be, because a product change re-measures and this runs again. */
function drawWire(face: HTMLElement, rects: CardRect[]): void {
  while (face.children.length > rects.length) face.lastElementChild?.remove();
  while (face.children.length < rects.length) face.appendChild(document.createElement("i"));
  rects.forEach((r, i) => {
    const el = face.children[i] as HTMLElement;
    el.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
  });
}

/** CSSTEXT IS A LOADED GUN HERE AND IT WENT OFF THREE TIMES. Assigning it
 *  replaces the whole inline style, so a placement that ran while the intro
 *  was playing — and one does, because the fit is measured again when the
 *  fonts land — silently deleted the opacity GSAP had set, and the tab row,
 *  the code toggle and the floor were all on screen from the first frame.
 *  Writing the individual properties leaves everything else alone. */
function box(el: HTMLElement | null, left: number, top: number, w?: number, h?: number): void {
  if (!el) return;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  if (w !== undefined) el.style.width = `${w}px`;
  if (h !== undefined) el.style.height = `${h}px`;
}

export function placeStage(f: Fit, p: StageParts, product: ProductKey): void {
  if (f.layout === "none") return;
const el = p.stage;
  const tx = f.cx - BASE_W / 2;
  const ty = f.cy - BASE_H / 2;
  el.style.setProperty("--hc-tx", `${tx}px`);
  el.style.setProperty("--hc-ty", `${ty}px`);
  el.style.setProperty("--hc-k", `${f.k}`);

  const stacked = f.layout === "stacked";
  const pose: Pose = {
    tx,
    ty,
    ry: stacked ? -6 : REST_RY,
    rx: stacked ? 4 : REST_RX,
    rz: stacked ? -1 : -1.5,
    k: f.k,
    persp: PERSP,
    ox: window.innerWidth * 0.4,
    oy: window.innerHeight * 0.48,
  };
  if (stacked) {
    el.style.setProperty("--hc-ry", "-6deg");
    el.style.setProperty("--hc-rx", "4deg");
  }
  const project = projector(pose);
  const pts = CORNERS.map(([u, v]) => project(u, v));
  const bottom = Math.max(...pts.map((p) => p[1]));
  const cardLeft = Math.min(...pts.map((p) => p[0]));
  const cardRight = Math.max(...pts.map((p) => p[0]));
  const cardTop = Math.min(...pts.map((p) => p[1]));
  const cardBottom = bottom;

  /* the shadow sits under the projected bottom, not under the card's own
     box: the card is tilted, so those are two different places */
  if (p.floor) {
    const fw = f.w * 0.9;
    const fh = f.w * 0.144;
    box(p.floor, f.cx - fw / 2, bottom + 28 - fh / 2, fw, fh);
  }

  /* THE SHAPES HAVE TO BE KEPT OUT OF THREE THINGS: the window's edges, the
     progress rail, and the headline. The first two are clamps. The third is
     not — a shape nudged off the type lands somewhere arbitrary, so a shape
     that would sit on the words is simply dropped. Both boxes are read here
     because this runs once per layout, never per frame. */
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const rail = document.querySelector("nav.rs-rail")?.getBoundingClientRect();
  const head = headlineBox();
  const edge = stacked ? 12 : 24;

  for (const s of shapesFor(f.mode)) {
    const node = p.shapes.get(s.key);
    if (!node) continue;
    const size = f.w * s.size;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;

    let hx = f.cx + s.ox * f.w - size / 2;
    let hy = f.cy + s.oy * f.h - size / 2;
    hx = Math.min(Math.max(hx, edge), vw - edge - size);
    hy = Math.min(Math.max(hy, edge), vh - edge - size);
    /* A FRONT SHAPE MAY KISS THE CARD, NOT SWALLOW IT. The design has the
       clover crossing the top-left corner on purpose — that overlap is what
       puts it in front rather than beside. What it must not do is what the
       amber one did at 1664, which was sit on the call to action and cover
       the cursor. Thirty per cent of its own width is the line between the
       two, and past it the shape is pushed back out the way it came. */
    if (s.layer === "front" && hy < cardBottom && hy + size > cardTop) {
      const allow = size * 0.3;
      if (s.ox > 0) hx = Math.max(hx, cardRight - allow);
      else hx = Math.min(hx, cardLeft - size + allow);
      hx = Math.min(Math.max(hx, edge), vw - edge - size);
    }

    /* THE RAIL GETS THE LAST WORD, AND IT MOVES THE SHAPE DOWN, NOT LEFT.
       It is a box, not a column, so only a shape that would actually hit it
       moves at all — but pushing left ran straight back into the clamp above,
       which exists to keep front shapes beside the card, and the two undid
       each other at 1280, 1440 and 1664. Going under the rail satisfies both:
       there is always room below it, and nothing else lives there. */
    if (rail && rail.width && hx < rail.right + edge && hx + size > rail.left - edge) {
      /* AND IT CLEARS THE RAIL BY MORE THAN THE SHAPE IS PLACED AT. What is
         placed here is a resting position; what is drawn is that position
         plus an idle bob, a parallax lean, and the larger bounding box a
         rotated square has. Measured, a shape placed twenty-four pixels clear
         of the rail was still six pixels over it. FLOAT is the whole of that
         difference with room to spare. */
      const FLOAT = 56;
      if (hy < rail.bottom + FLOAT && hy + size > rail.top - FLOAT) {
        const below = rail.bottom + FLOAT;
        const above = rail.top - FLOAT - size;
        hy = below + size <= vh - edge ? below : Math.max(edge, above);
      }
    }

    const onType = head && hx < head.right && hx + size > head.left && hy < head.bottom && hy + size > head.top;
    node.style.visibility = onType ? "hidden" : "";

    node.dataset.hx = String(hx);
    node.dataset.hy = String(hy);
    node.style.transform = `translate3d(${hx}px, ${hy}px, 0) rotate(${s.rotate}deg)`;

    const tag = p.tokens.get(s.key);
    if (tag) {
      tag.style.visibility = onType ? "hidden" : "";
      /* the tag is wider than the shape it labels, so it gets its own
         clamp or it runs off the right edge at every laptop width */
      const tw = tag.offsetWidth || 150;
      const tx = Math.min(Math.max(hx, edge), vw - edge - tw);
      tag.style.transform = `translate3d(${tx}px, ${Math.min(hy + size + 10, vh - edge - 30)}px, 0)`;
    }
  }

  /* the page's own light system is told where the card is; the grid's mask
     follows it, so the floor is under the card and not under the middle of
     the window */
  setCardLight({ x: f.cx, y: f.cy, product: product });
  const page = document.querySelector<HTMLElement>(".v2.rs");
  page?.style.setProperty("--hc-light-x", `${f.cx}px`);
  page?.style.setProperty("--hc-light-y", `${f.cy}px`);

  /* 14 under the card when it is a pager, 40 when it is a tab row: the
     pager is small and belongs to the card, the row is furniture */
  const gap = stacked ? 14 : 40;
  box(p.tabs, f.cx, bottom + gap);
  box(p.toggle, f.cx, bottom + gap + (stacked ? 28 : 54));

  placeLens(p.lens, p.rim, p.tag, REST_X, REST_Y, 1);

  /* ── the intro's furniture, placed from the same fit ─────────────────── */
  if (p.line) {
    /* one and a bit card widths, across the card's own centre height. The
       field's `line` formation lies along the identical span, which is the
       only reason the burst looks like it comes out of this. */
    const lw = f.w * 1.6;
    box(p.line, f.cx - lw / 2, f.cy, lw);
  }
  if (p.scribble) {
    const sw = f.w * 1.9;
    p.scribble.setAttribute("width", `${sw}`);
    p.scribble.setAttribute("height", `${sw * 0.58}`);
    box(p.scribble as unknown as HTMLElement, f.cx - sw / 2, f.cy - sw * 0.29);
  }
  /* AND NOT UNTIL THE FONTS HAVE LANDED. The fragments are sized by their
     own text, so Instrument Serif arriving re-measures the fit and moves
     every one of them — revealing them on the first placement only swapped
     one shift for a later one. They are not needed until 0.4s and the fonts
     resolve inside 200ms, so nobody waits for this. */
  if (p.layer && document.fonts?.status !== "loading") p.layer.dataset.placed = "";
  if (p.pieces) {
    /* FRAGMENTS ARE PLACED AS AN OFFSET FROM THE CARD, so the mess is the
       same composition at every width, and the offset is what the intro
       tweens to zero — the pull-in needs no measurement at all, which is the
       whole point of putting the origin at the card's centre. */
    const k = Math.max(0.62, f.k);
    for (const frag of fragmentsFor(f.mode)) {
      const el = p.pieces.get(frag.key);
      if (!el) continue;
      const half = (el.firstElementChild?.firstElementChild as HTMLElement | null);
      const hw = ((half?.offsetWidth ?? 200) * k) / 2;
      const hh = ((half?.offsetHeight ?? 80) * k) / 2;
      /* and none of them may leave the window: the receipt and the right-hand
         note both ran off the edge at 1664, which is where the mess stops
         reading as a pile of things and starts reading as a bug */
      const x = Math.min(Math.max(f.cx + frag.ox * f.w, hw + 16), vw - hw - 16);
      const y = Math.min(Math.max(f.cy + frag.oy * f.h, hh + 16), vh - hh - 16);
      el.style.left = `${f.cx}px`;
      el.style.top = `${f.cy}px`;
      el.style.transform = `translate3d(${x - f.cx}px, ${y - f.cy}px, 0) rotate(${frag.angle}deg) scale(${k})`;
    }
  }
  /* THE SKELETON IS THE REAL LAYOUT, MEASURED. offsetLeft and friends are
     untransformed, so a tilted card still reports card-local boxes, and the
     particles and the DOM blocks come from one measurement rather than two
     descriptions that can disagree. */
  if (p.inner) {
    const rects = measureWire(p.inner);
    setCardWire(rects);
    if (p.wire) drawWire(p.wire, rects);
  }

  /* AND THE FIELD IS TOLD WHERE EVERY GLYPH ON THE CARD IS. One projector,
     shared: the DOM face and the particles under it are the same homography,
     which is the entire reason the code does not move when one becomes the
     other. Published from place() because that is exactly when it changes —
     a resize, a product change, nothing else. */
  const live = HERO_CARDS.find((c) => c.key === product) ?? HERO_CARDS[0];
  setCardSource({
    sample: cardSample(live, CARD_POINTS, CARD_HALO),
    project,
    product: live.key,
    vw,
    vh,
  });
}
