import { HERO_CARDS, type ProductKey } from "../../../data/heroCards";
import { shapesFor } from "./Shapes";
import { BASE_H, BASE_W, type Fit } from "./fit";
import { CORNERS, projector, type Pose } from "./projector";
import { placeLens, REST_X, REST_Y } from "./lens";
import { setCardLight } from "./light";
import { cardSample, setCardSource } from "./cardPoints";

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
    p.floor.style.cssText = `left:${f.cx - fw / 2}px;top:${bottom + 28 - fh / 2}px;width:${fw}px;height:${fh}px`;
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
    /* THE RAIL IS A BOX, NOT A COLUMN. Clamping x against it unconditionally
       pushed the amber shape ninety pixels left at 1664 and parked it on top
       of the call to action — and the rail is only three hundred pixels
       tall, so the shape was never near it. Only move out of the way of
       something you would actually have hit. */
    if (rail && rail.width && hy < rail.bottom + edge && hy + size > rail.top - edge) {
      hx = Math.min(hx, rail.left - edge - size);
    }

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
  if (p.tabs) p.tabs.style.cssText = `left:${f.cx}px;top:${bottom + gap}px`;
  if (p.toggle) p.toggle.style.cssText = `left:${f.cx}px;top:${bottom + gap + (stacked ? 28 : 54)}px`;

  placeLens(p.lens, p.rim, p.tag, REST_X, REST_Y, 1);

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
