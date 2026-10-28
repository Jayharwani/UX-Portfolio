import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HERO_CARDS, type ProductKey, type Region } from "../../../data/heroCards";
import { Card, type CardRefs } from "./Card";
import { ShapeLayer, TOKEN_TAGS, shapesFor } from "./Shapes";
import { Tabs } from "./Tabs";
import { BASE_H, BASE_W, fitStage, type Fit } from "./fit";
import { CORNERS, projector, type Pose } from "./projector";
import { placeLens, REST_X, REST_Y } from "./lens";
import { setCardLight } from "./light";

/* --------------------------------------------------------------------------
   THE STAGE.

   One fixed layer holding the card and everything that orbits it. It is the
   first child of main, so the hero copy paints above it and the stacked
   layout's gradient can still darken it; it never takes part in layout, so it
   cannot shift anything and CLS stays zero.

   PLACEMENT IS IMPERATIVE AND MEASURED ONCE. Everything here is positioned
   from one fit: the card, the shapes, the shadow, the tabs. React renders the
   elements; this writes their transforms. A re-render per resize would be
   fine, a re-render per frame would not, and the later phases need the same
   handles anyway.
   -------------------------------------------------------------------------- */

const PERSP = 1800;
const REST_RY = -17;
const REST_RX = 7;

/** The union of the two headline lines' own text, not their boxes: `.rs-line`
 *  and `.rs-outline` are blocks as wide as the column, so their rectangles
 *  would reserve half the screen and every shape would be dropped. */
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

export function HeroStage() {
  const [product, setProduct] = useState<ProductKey>("headroom");
  /* place() is a stable callback, so it reads the live product through a ref
     rather than closing over a stale one */
  const productRef = useRef<ProductKey>("headroom");
  productRef.current = product;
  const [fit, setFit] = useState<Fit>({ layout: "none" });
  const [region] = useState<Region>("number");

  const stage = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const shapes = useRef<Map<string, HTMLElement>>(new Map());
  const tokens = useRef<Map<string, HTMLElement>>(new Map());

  const refs: CardRefs = {
    card: useRef<HTMLDivElement>(null),
    lens: useRef<HTMLDivElement>(null),
    rim: useRef<HTMLDivElement>(null),
    tag: useRef<HTMLDivElement>(null),
    snip: useRef<HTMLPreElement>(null),
    code: useRef<HTMLDivElement>(null),
    ui: useRef<HTMLDivElement>(null),
    overlay: useRef<HTMLDivElement>(null),
    frame: useRef<HTMLDivElement>(null),
  };

  const card = HERO_CARDS.find((c) => c.key === product) ?? HERO_CARDS[0];

  /** Write every position for the current fit. No layout reads beyond the
   *  fit itself, and the card's corners come from the analytic projector
   *  rather than from a bounding box, which a tilted plane does not have. */
  const place = useCallback((f: Fit) => {
    if (f.layout === "none" || !stage.current) return;
    const el = stage.current;
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
    if (floor.current) {
      const fw = f.w * 0.9;
      const fh = f.w * 0.144;
      floor.current.style.cssText = `left:${f.cx - fw / 2}px;top:${bottom + 28 - fh / 2}px;width:${fw}px;height:${fh}px`;
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
      const node = shapes.current.get(s.key);
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

      const tag = tokens.current.get(s.key);
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
    setCardLight({ x: f.cx, y: f.cy, product: productRef.current });
    const page = document.querySelector<HTMLElement>(".v2.rs");
    page?.style.setProperty("--hc-light-x", `${f.cx}px`);
    page?.style.setProperty("--hc-light-y", `${f.cy}px`);

    /* 14 under the card when it is a pager, 40 when it is a tab row: the
       pager is small and belongs to the card, the row is furniture */
    const gap = stacked ? 14 : 40;
    if (tabs.current) tabs.current.style.cssText = `left:${f.cx}px;top:${bottom + gap}px`;
    if (toggle.current) toggle.current.style.cssText = `left:${f.cx}px;top:${bottom + gap + (stacked ? 28 : 54)}px`;

    placeLens(refs.lens.current, refs.rim.current, refs.tag.current, REST_X, REST_Y, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* THE FIT WAITS FOR THE FONTS. It is measured from the right edge of the
     headline's text, and that edge moves when Geist lands. Measuring before
     then puts the card in the wrong place until something else resizes. */
  useLayoutEffect(() => {
    let frame = 0;
    const run = () => {
      const f = fitStage();
      setFit(f);
      frame = requestAnimationFrame(() => place(f));
    };
    run();
    document.fonts?.ready.then(run);

    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(run, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [place]);

  /* re-place when the product changes the shapes that exist */
  useEffect(() => {
    if (fit.layout !== "none") place(fit);
  }, [fit, product, place]);

  /* and take the light away when the stage is gone, so a landscape phone
     does not keep a card light with no card under it */
  useEffect(() => () => setCardLight(null), []);

  if (fit.layout === "none") return null;

  return (
    <div className="hero-stage" ref={stage} data-mode={fit.mode} data-product={product}>
      <div className="hc-floor" ref={floor} aria-hidden="true" />
      <ShapeLayer layer="back" mode={fit.mode} bag={shapes} />

      <Card card={card} region={region} refs={refs} />

      <ShapeLayer layer="front" mode={fit.mode} bag={shapes} />
      {fit.mode === "full" &&
        TOKEN_TAGS.map((t) => (
          <span
            key={t.key}
            className="hc-token"
            aria-hidden="true"
            ref={(el) => {
              if (el) tokens.current.set(t.key, el);
              else tokens.current.delete(t.key);
            }}
          >
            <i style={{ background: t.chip }} />
            {t.text}
          </span>
        ))}

      <Tabs active={product} onSelect={setProduct} panelId="hc-panel" pager={fit.mode === "stacked" || fit.mode === "minimal"} rowRef={tabs} />
      <button className="hc-code-toggle" type="button" aria-pressed={false} ref={toggle}>
        Show code
      </button>
      <p className="hc-sr" id="hc-panel" role="tabpanel" aria-live="polite">
        {card.srLabel}
      </p>
    </div>
  );
}
