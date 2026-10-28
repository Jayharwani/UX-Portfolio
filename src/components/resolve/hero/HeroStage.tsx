import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HERO_CARDS, type ProductKey, type Region } from "../../../data/heroCards";
import { Card, type CardRefs } from "./Card";
import { ShapeLayer, TOKEN_TAGS } from "./Shapes";
import { Tabs } from "./Tabs";
import { fitStage, type Fit } from "./fit";
import { openCode } from "./lens";
import { setCardLight } from "./light";
import { placeStage } from "./place";
import { setCardSource } from "./cardPoints";
import { useAutoAdvance } from "./useAutoAdvance";
import { IntroLayer } from "./IntroLayer";
import { introKind, type IntroKind } from "./intro";
import { useIntro } from "./useIntro";
import { registerHero, releaseHero } from "./handoff";
import { createMotion, type Motion } from "./motion";
import { enter, leave, settle } from "./switching";
import { onFrame } from "../../../lib/clock";

/* --------------------------------------------------------------------------
   THE STAGE.

   One fixed layer holding the card and everything that orbits it. It is the
   first child of main, so the hero copy paints above it and the stacked
   layout's gradient can still darken it; it never takes part in layout, so it
   cannot shift anything and CLS stays zero.

   PLACEMENT IS IMPERATIVE AND MEASURED ONCE, and it lives in place.ts: a
   re-render per resize would be fine, a re-render per frame would not. What
   is left here is the component itself — the state, the switch, the loops and
   the elements.
   -------------------------------------------------------------------------- */

/** The union of the two headline lines' own text, not their boxes: `.rs-line`
 *  and `.rs-outline` are blocks as wide as the column, so their rectangles
 *  would reserve half the screen and every shape would be dropped. */
export function HeroStage() {
  const [product, setProduct] = useState<ProductKey>("headroom");
  /* place() is a stable callback, so it reads the live product through a ref
     rather than closing over a stale one */
  const productRef = useRef<ProductKey>("headroom");
  productRef.current = product;
  const [fit, setFit] = useState<Fit>({ layout: "none" });
  /* the live fit, for the things that must not restart when it is remeasured */
  const fitRef = useRef<Fit>(fit);
  fitRef.current = fit;


  const stage = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const shapes = useRef<Map<string, HTMLElement>>(new Map());
  const tokens = useRef<Map<string, HTMLElement>>(new Map());
  const pieces = useRef<Map<string, HTMLElement>>(new Map());
  const line = useRef<HTMLDivElement>(null);
  const scribble = useRef<SVGPathElement>(null);
  const skipEl = useRef<HTMLButtonElement>(null);
  const player = useRef<{ skip: () => void; kill: () => void } | null>(null);
  /** decided once, on the first render, because reading it later would read
   *  a session flag the first visit has already set */
  const [kind] = useState<IntroKind>(introKind);
  const [playing, setPlaying] = useState(kind !== "none");

  const refs: CardRefs = {
    card: useRef<HTMLDivElement>(null),
    lens: useRef<HTMLDivElement>(null),
    rim: useRef<HTMLDivElement>(null),
    tag: useRef<HTMLDivElement>(null),
    snip: useRef<HTMLPreElement>(null),
    code: useRef<HTMLDivElement>(null),
    ui: useRef<HTMLDivElement>(null),
    overlay: useRef<HTMLDivElement>(null),
    wire: useRef<HTMLDivElement>(null),
    frame: useRef<HTMLDivElement>(null),
  };

  const card = HERO_CARDS.find((c) => c.key === product) ?? HERO_CARDS[0];
  const motion = useRef<Motion | null>(null);
  const switching = useRef(false);
  const [showCode, setShowCode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [, setRegionTick] = useState(0);
  /** how far the hand-off has gone, read by the auto-advance so it never
   *  rebuilds a card the scroll is in the middle of taking apart */
  const handoff = useRef(0);
  const regionRef = useRef<Region>("number");

  /** Write every position for the current fit. Hands the elements to
   *  place.ts, which owns the arithmetic; this only knows where they are. */
  const place = useCallback((f: Fit) => {
    if (!stage.current) return;
    placeStage(
      f,
      {
        stage: stage.current,
        floor: floor.current,
        tabs: tabs.current,
        toggle: toggle.current,
        lens: refs.lens.current,
        rim: refs.rim.current,
        tag: refs.tag.current,
        shapes: shapes.current,
        tokens: tokens.current,
        line: line.current,
        scribble: scribble.current?.ownerSVGElement ?? null,
        wire: refs.wire.current,
        layer: stage.current.querySelector<HTMLElement>(".hc-intro"),
        inner: refs.ui.current?.firstElementChild as HTMLElement | null,
        pieces: pieces.current,
      },
      productRef.current,
    );
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

  /* THE SWITCH IS THREE ACTS AND REACT IS THE MIDDLE ONE. The old interface
     has to leave before the DOM is swapped, or there is nothing left to
     animate out; the new one lands after. So: play the exit, flip the state,
     and let a layout effect catch the new elements on the frame they appear. */
  const choose = useCallback(
    (next: ProductKey) => {
      if (next === productRef.current || switching.current) return;
      switching.current = true;
      const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      void leave(refs.ui.current, refs.overlay.current, soft).then(() => {
        setProduct(next);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useLayoutEffect(() => {
    if (!switching.current) return;
    switching.current = false;
    const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    settle(refs.ui.current, refs.overlay.current);
    enter(refs.ui.current, refs.overlay.current, card.number.value, soft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useAutoAdvance({
    stage,
    product: productRef,
    handoff,
    on: fit.layout !== "none" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    paused,
    choose,
  });

  /* ── the code, for anyone without a hover ─────────────────────────────
     The lens is a pointer instrument. A phone has no pointer and a keyboard
     cannot aim one, so the same content gets a plain control: the listing
     opens from where you touched, under the lens that fades out of its way. */
  const toggleCode = useCallback(
    (e?: { clientX: number; clientY: number }) => {
      const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* A KEYBOARD CLICK CARRIES (0, 0). el.click() synthesises an event with
         no coordinates, which mapped through the homography put the wipe's
         origin a thousand pixels off the card. Only a real pointer gets to
         choose where it opens from; everything else opens from the middle. */
      const origin =
        e && (e.clientX || e.clientY) ? (motion.current?.cardPoint(e.clientX, e.clientY) ?? null) : null;
      setShowCode((was) => {
        const on = !was;
        openCode({ code: refs.code.current, lens: refs.lens.current, rim: refs.rim.current }, on, origin, soft);
        setPaused(on);
        return on;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* re-place when the product changes the shapes that exist */
  useEffect(() => {
    if (fit.layout !== "none") place(fit);
  }, [fit, product, place]);

  /* THE HERO IS NEVER LEFT HIDDEN. `data-intro="pending"` is written by an
     inline script before the app exists and takes the hero's copy and the
     stage's parts off screen, so whatever happens next — a field that failed
     to start, a layout with no card, a throw inside the timeline — something
     has to take it away again. This is that something, and it is deliberately
     the dumbest possible version. */
  useEffect(() => {
    const t = window.setTimeout(() => document.documentElement.removeAttribute("data-intro"), 1400);
    return () => window.clearTimeout(t);
  }, []);

  useIntro({
    playing,
    setPlaying,
    kind,
    fit,
    fitRef,
    stage,
    refs,
    floor,
    tabs,
    toggle,
    line,
    scribble,
    skipEl,
    player,
    handoff,
    pieces,
    shapes,
    tokens,
  });

  /* AND IT ALL GOES BACK WHEN THE STAGE DOES, so a landscape phone is not
     left with a card light over no card, a scrubbed-away floor, or a field
     still trying to draw a listing. Defined above the registration below
     because React runs cleanups in the order they were declared, and this one
     needs the parts to still be registered when it runs. */
  useEffect(
    () => () => {
      releaseHero();
      setCardLight(null);
      setCardSource(null);
    },
    [],
  );

  /* ── what the hand-off is allowed to touch ────────────────────────────
     A list of elements rather than a query per frame, and it is re-published
     whenever the card is rebuilt, because a product change replaces the
     interface it names. */
  useEffect(() => {
    if (fit.layout === "none" || !stage.current || !refs.card.current) return;
    registerHero({
      page: document.querySelector<HTMLElement>(".v2.rs"),
      stage: stage.current,
      onExit: (a) => {
        handoff.current = a;
        motion.current?.setHandoff(a);
      },
      card: refs.card.current,
      code: refs.code.current,
      lens: refs.lens.current,
      rim: refs.rim.current,
      tag: refs.tag.current,
      ring: refs.card.current.querySelector<HTMLElement>(".hc-ring"),
      overlay: refs.overlay.current,
      frame: refs.frame.current,
      ui: refs.ui.current,
      back: refs.card.current.querySelector<HTMLElement>(".hc-back"),
      edge: refs.card.current.querySelector<HTMLElement>(".hc-edge"),
      shapes: Array.from(shapes.current.values()),
      extras: [tabs.current, toggle.current, floor.current, ...tokens.current.values()].filter(
        (el): el is HTMLElement => !!el,
      ),
    });
    /* ONLY DROP THE REGISTRATION. Releasing here would put the card back
       together every time the auto-advance swapped a product, including
       halfway through a hand-off; what is scrubbed is the scroll's business
       and the scroll is the only thing allowed to undo it. */
    return () => registerHero(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit, product]);

  /* ── everything that happens between frames ───────────────────────────
     One subscription to the page's only clock. The lens, the lean and the
     shapes all move here; nothing in the loop reads layout. */
  useEffect(() => {
    const st = stage.current;
    const cd = refs.card.current;
    if (!st || !cd || fit.layout === "none") return;

    const m = createMotion({
      stage: st,
      card: cd,
      lens: () => refs.lens.current,
      rim: () => refs.rim.current,
      tag: () => refs.tag.current,
      shapes: shapes.current,
      onRegion: (r) => {
        regionRef.current = r;
        setRegionTick((n) => n + 1);
      },
    });
    m.setFit(fit);
    motion.current = m;

    const move = (e: PointerEvent) => {
      m.onPointerMove(e);
      m.dragTo(e);
    };
    const down = (e: PointerEvent) => {
      if (!m.grab(e)) m.setPressed(true);
    };
    const up = () => {
      const r = m.release();
      /* a press that never travelled is a click, and a clicked shape
         squashes rather than flies */
      if (r && !r.moved) m.squash(r.body);
      m.setPressed(false);
    };
    window.addEventListener("pointermove", move, { passive: true });
    st.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    /* PAUSED WHEN NOBODY CAN SEE IT. A hidden tab or a hero scrolled past is
       a loop spending frames on an invisible card. */
    const io = new IntersectionObserver(([e]) => m.setEnabled(e.isIntersecting && !document.hidden), { threshold: 0 });
    const top = document.querySelector("#top");
    if (top) io.observe(top);
    const vis = () => m.setEnabled(!document.hidden);
    document.addEventListener("visibilitychange", vis);

    const stop = onFrame((t, deltaMs) => m.tick(Math.min(deltaMs / 1000, 0.05), t));
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pointermove", move);
      st.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      motion.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit]);

  if (fit.layout === "none") return null;

  return (
    <div className="hero-stage" ref={stage} data-mode={fit.mode} data-product={product}>
      <div className="hc-floor" ref={floor} aria-hidden="true" />
      {playing && kind === "full" && (
        <IntroLayer
          mode={fit.mode}
          bag={pieces}
          line={line}
          scribble={scribble}
          skip={skipEl}
          onSkip={() => player.current?.skip()}
        />
      )}
      <ShapeLayer layer="back" mode={fit.mode} bag={shapes} />

      <Card card={card} region={regionRef.current} refs={refs} />

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

      <Tabs active={product} onSelect={choose} panelId="hc-panel" pager={fit.mode === "stacked" || fit.mode === "minimal"} rowRef={tabs} />
      <button
        className="hc-code-toggle"
        type="button"
        aria-pressed={showCode}
        ref={toggle}
        onClick={(e) => toggleCode({ clientX: e.clientX, clientY: e.clientY })}
      >
        {showCode ? "Show design" : "Show code"}
      </button>
      <p className="hc-sr" id="hc-panel" role="tabpanel" aria-live="polite">
        {card.srLabel}
      </p>
    </div>
  );
}
