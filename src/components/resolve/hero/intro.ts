import { gsap } from "gsap";
import { springEase } from "../../../lib/spring";
import { fragmentsFor } from "../../../data/heroFragments";
import { fitStage, type Fit } from "./fit";
import { LENS_R, REST_X, REST_Y } from "./lens";

/* --------------------------------------------------------------------------
   THE OPENING, AND IT IS THE PAGE'S OWN CLAIM ACTED OUT.

   The headline says this takes something messy and gives back one clear
   thing, so the first three and a half seconds do exactly that, literally: a
   line of light, a burst of everyday problems out of it, those problems
   pulled into one place, a wireframe, and then a working product screen with
   its own code underneath.

   ONE TIMELINE, BUILT AFTER EVERYTHING IS MEASURED. There is not a single
   layout read between `play()` and the end, which is the only way a sequence
   with this many moving parts holds 60fps on the frame it starts.

   THE FIELD IS DRIVEN BY PROXIES. A morph is a tween of `{ p }` whose
   onUpdate calls field.morph, so the particle formations sit on the same
   timeline as the DOM and skipping fast-forwards both together — there is no
   second clock to get out of step with.
   -------------------------------------------------------------------------- */

export type IntroParts = {
  stage: HTMLElement;
  hero: HTMLElement;
  card: HTMLElement;
  back: HTMLElement | null;
  edge: HTMLElement | null;
  wire: HTMLElement | null;
  ui: HTMLElement | null;
  overlay: HTMLElement | null;
  frame: HTMLElement | null;
  lens: HTMLElement | null;
  rim: HTMLElement | null;
  tag: HTMLElement | null;
  line: HTMLElement | null;
  scribble: SVGPathElement | null;
  skip: HTMLElement | null;
  floor: HTMLElement | null;
  tabs: HTMLElement | null;
  toggle: HTMLElement | null;
  pieces: Map<string, HTMLElement>;
  shapes: Map<string, HTMLElement>;
  tokens: Map<string, HTMLElement>;
};

/** what the intro needs from the field, and nothing more */
export type IntroField = {
  morph: (from: string, to: string, p: number) => void;
  setOpacity: (v: number) => void;
  setCode: (v: number) => void;
};

const ONCE = "rs-intro-played";

/* WHETHER AN OPENING IS RUNNING, for the two other pieces of choreography
   that would otherwise animate the same elements on their own clock. React
   commits children before parents, so the stage has set this before anything
   in HomeResolve's effects asks. */
let running = false;
export const introRunning = (): boolean => running;
/** for the paths where an opening was expected and then could not happen */
export const endIntro = (): void => {
  running = false;
  document.documentElement.removeAttribute('data-intro');
};

export type IntroKind = "full" | "settle" | "none";

/** WHICH OPENING THIS VISIT GETS. A page you come back to that insists on
 *  introducing itself again is a page that does not remember you. */
export function introKind(): IntroKind {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  if (location.hash || window.scrollY > 4) return "none";
  /* AND THERE HAS TO BE A CARD TO BUILD. A landscape phone has no stage, so
     the hero keeps the plain copy entrance it has always had and the scroll
     cue keeps its own timing. */
  if (fitStage().layout === "none") return "none";
  try {
    if (sessionStorage.getItem(ONCE)) {
      running = true;
      return "settle";
    }
    sessionStorage.setItem(ONCE, "1");
  } catch {
    /* a browser with storage switched off gets the full intro every time,
       which is the friendlier of the two ways to be wrong */
  }
  /* SET HERE, DURING RENDER, AND NOT IN AN EFFECT. React flushes a parent's
     passive effects before a child's state change re-renders it, so a flag
     raised inside the stage's own effect was still false when HomeResolve
     asked — and the scroll cue arrived at 1.4 seconds, over a card that was
     not built yet. A render runs before every effect on the page. */
  running = true;
  return "full";
}

/** a field morph as a tween: the formations ride the same clock as the DOM */
function formation(
  tl: gsap.core.Timeline,
  field: IntroField,
  from: string,
  to: string,
  at: number,
  duration: number,
  ease: gsap.EaseFunction | string,
): void {
  const proxy = { p: 0 };
  tl.to(
    proxy,
    { p: 1, duration, ease, onUpdate: () => field.morph(from, to, proxy.p), onComplete: () => field.morph(from, to, 1) },
    at,
  );
}

export function playIntro(
  p: IntroParts,
  field: IntroField,
  fit: Extract<Fit, { layout: "side" | "stacked" }>,
  onDone: () => void,
): { skip: () => void; kill: () => void } {
  const stacked = fit.layout === "stacked";
  /* STACKED IS THE SAME BEATS, COMPRESSED. A phone holds the card and the
     headline in one column, so there is less to look at and less reason to
     take your time over it. */
  const scale = stacked ? 0.75 : 1;
  const t = (s: number) => s * scale;

  const spatialFast = springEase("spatial-fast");
  const spatial = springEase("spatial-default");
  const spatialSlow = springEase("spatial-slow");
  const effectsFast = springEase("effects-fast");
  const effects = springEase("effects-default");
  const effectsSlow = springEase("effects-slow");
  const form = springEase("formation");

  const pieces = fragmentsFor(fit.mode)
    .map((f) => p.pieces.get(f.key))
    .filter((el): el is HTMLElement => !!el);
  const inner = pieces.map((el) => el.firstElementChild?.firstElementChild as HTMLElement).filter(Boolean);
  const shapes = Array.from(p.shapes.values());
  const rows = p.ui ? Array.from(p.ui.querySelectorAll<HTMLElement>("[data-hc-el]")) : [];
  const copy = [".rs-eyebrow", ".rs-byline", ".rs-reel-row", ".rs-cue"].map((sel) => p.hero.querySelector(sel));
  const lines = p.hero.querySelectorAll(".rs-line > *");

  /* THE INLINE SCRIPT'S ATTRIBUTE COMES OFF BEFORE ANYTHING IS SET, not
     after. It hides the hero with a stylesheet, and GSAP seeds a tween from
     the computed transform it finds — so setting yPercent 115 on a line the
     stylesheet had already pushed down by 115% gave a line sitting at 230%,
     and zeroing the yPercent later left it stranded at 115. Measured: the
     headline stopped at 116 pixels and never arrived. Removing it first and
     setting everything explicitly below means exactly one description of the
     start state, and no flash, because nothing paints between the two. */
  document.documentElement.removeAttribute("data-intro");

  /* ── the state everything starts from, set before a single frame runs ──
     Note what is NOT here: opacity on .hc itself. Anything below 1 there
     flattens preserve-3d and drops the plate and the edge into the face's
     own plane, so the card always fades by its children. */
  gsap.set(p.card.parentElement, { opacity: 0 });
  gsap.set([p.back, p.edge, p.ui, p.overlay, p.frame, p.lens, p.rim, p.tag, p.floor, p.tabs, p.toggle], { opacity: 0 });
  gsap.set(copy, { opacity: 0, y: 8 });
  gsap.set(lines, { yPercent: 115, y: 0 });
  if (p.line) gsap.set(p.line, { scaleX: 0, opacity: 0 });
  gsap.set(rows, { opacity: 0 });
  gsap.set(shapes, { opacity: 0 });
  gsap.set(Array.from(p.tokens.values()), { opacity: 0 });
  gsap.set(p.lens, { scale: 0, transformOrigin: "50% 50%" });
  field.setOpacity(0);
  field.setCode(0);
  field.morph("line", "line", 1);

  const len = p.scribble?.getTotalLength?.() ?? 0;
  if (p.scribble) gsap.set(p.scribble, { strokeDasharray: len, strokeDashoffset: len });

  running = true;
  const tl = gsap.timeline({
    onUpdate: () => p.stage.style.setProperty("--hc-intro", `${tl.progress()}`),
    onComplete: () => {
      running = false;
      p.stage.style.removeProperty("--hc-intro");
      onDone();
    },
  });

  /* ── 0.00 the line of light ──────────────────────────────────────────── */
  const lw = stacked ? 0.8 : 1;
  tl.to(p.line, { scaleX: lw, opacity: 1, duration: t(0.4), ease: "expo.out" }, 0);

  /* ── 0.25 it bursts ──────────────────────────────────────────────────── */
  formation(tl, field, "line", "mess", t(0.25), t(0.8), spatialSlow.ease);
  tl.to({ v: 0 }, { v: 1, duration: t(0.2), onUpdate(this: gsap.core.Tween) { field.setOpacity(this.progress()); } }, t(0.25));
  tl.to(p.line, { opacity: 0, duration: t(0.35), ease: "none" }, t(0.3));

  tl.to(p.skip, { opacity: 1, duration: effectsFast.duration, ease: effectsFast.ease }, t(0.3));

  /* ── 0.40 the mess lands ─────────────────────────────────────────────── */
  tl.to(
    inner,
    { opacity: 0.92, scale: 1, duration: spatialFast.duration, ease: spatialFast.ease, stagger: t(0.07) },
    t(0.4),
  );

  /* ── 0.45 the headline, which is the one thing that was always here ──── */
  tl.to(lines, { yPercent: 0, y: 0, duration: spatial.duration, ease: spatial.ease, stagger: 0.08 }, t(0.45));
  if (!stacked && p.scribble) {
    tl.to(p.scribble.parentElement, { opacity: 1, duration: 0.1, ease: "none" }, t(0.55));
    tl.to(p.scribble, { strokeDashoffset: 0, duration: effectsSlow.duration, ease: effectsSlow.ease }, t(0.55));
  }
  tl.to(copy[0], { opacity: 1, y: 0, duration: effects.duration, ease: effects.ease }, t(0.6));

  /* ── 1.05 the mess is pulled into one place ────────────────────────────
     Every fragment is positioned AT the card's centre and displaced from it,
     so going home is x and y to zero. No measurement, no layout read, and
     nothing that can be off by the width of a thing nobody measured. */
  tl.to(pieces, { x: 0, y: 0, scale: 0.4, duration: t(0.55), ease: "power3.in", stagger: t(0.04) }, t(1.05));
  tl.to(
    inner,
    { scale: 0.2, rotate: 40, filter: "blur(6px)", opacity: 0, duration: t(0.55), ease: "power3.in", stagger: t(0.04) },
    t(1.05),
  );
  if (p.scribble) tl.to(p.scribble.parentElement, { opacity: 0, duration: t(0.4), ease: "none" }, t(1.05));

  /* ── 1.05 and becomes a wireframe ────────────────────────────────────── */
  formation(tl, field, "mess", "wire", t(1.05), t(0.7), form.ease);
  tl.to(p.card.parentElement, { opacity: 1, duration: 0.01, ease: "none" }, t(1.35));
  tl.to(p.wire, { opacity: 1, duration: effects.duration, ease: effects.ease }, t(1.35));

  /* ── 1.65 the wireframe becomes a product ────────────────────────────── */
  tl.to(p.ui, { opacity: 1, duration: 0.01, ease: "none" }, t(1.65));
  tl.fromTo(
    rows,
    { opacity: 0, y: 10, filter: "blur(4px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: spatial.duration,
      ease: spatial.ease,
      stagger: t(0.045),
      clearProps: "filter",
    },
    t(1.65),
  );
  tl.to([p.back, p.edge, p.floor], { opacity: 1, duration: effects.duration, ease: effects.ease }, t(1.7));
  tl.to(p.wire, { opacity: 0, duration: effects.duration, ease: effects.ease }, t(1.7));
  formation(tl, field, "wire", "card", t(1.7), t(0.3), form.ease);
  tl.to({ v: 0 }, { v: 1, duration: t(0.3), onUpdate(this: gsap.core.Tween) { field.setCode(this.progress()); } }, t(1.7));

  /* THE NUMBER IS THE CLAIM, so it is the one thing that animates its value
     rather than its opacity. */
  const count = p.ui?.querySelector<HTMLElement>("[data-hc-count]");
  if (count) {
    const target = Number((count.dataset.hcCount || count.textContent || "0").replace(/[^\d]/g, "")) || 0;
    const n = { v: 0 };
    tl.to(
      n,
      {
        v: target,
        duration: t(0.6),
        ease: "expo.out",
        onUpdate: () => {
          count.textContent = Math.round(n.v).toLocaleString("en-US");
        },
        onComplete: () => {
          count.textContent = target.toLocaleString("en-US");
        },
      },
      t(1.7),
    );
  }

  /* ── 2.10 the room fills back in ─────────────────────────────────────── */
  tl.fromTo(
    shapes,
    { opacity: 0, scale: 0.4 },
    { opacity: 1, scale: 1, duration: spatialFast.duration, ease: spatialFast.ease, stagger: t(0.07) },
    t(2.1),
  );
  tl.to(p.overlay, { opacity: 1, duration: effects.duration, ease: effects.ease }, t(2.3));
  tl.to(p.frame, { opacity: 1, duration: effects.duration, ease: effects.ease }, t(2.6));
  tl.to(copy[1], { opacity: 1, y: 0, duration: effects.duration, ease: effects.ease }, t(2.7));

  /* ── 2.70 the lens opens where it rests ──────────────────────────────── */
  tl.to(p.lens, { scale: 1, opacity: 1, duration: spatial.duration, ease: spatial.ease }, t(2.7));
  tl.fromTo(
    p.rim,
    { opacity: 0, rotate: -90 },
    { opacity: 1, rotate: 0, duration: spatial.duration, ease: spatial.ease },
    t(2.7),
  );
  tl.fromTo(
    p.tag,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: spatialFast.duration, ease: spatialFast.ease },
    t(2.85),
  );
  tl.to(copy[2], { opacity: 1, y: 0, duration: effects.duration, ease: effects.ease }, t(2.8));
  tl.to(
    [p.tabs, p.toggle, ...p.tokens.values()],
    { opacity: 1, duration: effects.duration, ease: effects.ease, stagger: t(0.06) },
    t(3.0),
  );
  tl.to(copy[3], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, t(3.1));
  tl.to(p.skip, { opacity: 0, duration: effectsFast.duration, ease: effectsFast.ease }, t(3.3));
  /* and one empty beat, so the timeline's own length is the intro's length
     and the skip ring finishes where the intro does */
  tl.to({}, { duration: 0.01 }, t(3.4));

  const skip = () => {
    if (!tl.isActive() && tl.progress() === 1) return;
    gsap.to(tl, { progress: 1, duration: 0.25, ease: "power2.out", overwrite: true });
  };
  return {
    skip,
    kill: () => {
      running = false;
      tl.kill();
      p.stage.style.removeProperty("--hc-intro");
    },
  };
}

/** THE SHORT SETTLE, for every visit after the first in a session. The field
 *  gathers into the card and the card fades up over it. No mess, because you
 *  have already been told what the mess was. */
export function playSettle(p: IntroParts, field: IntroField, onDone: () => void): { skip: () => void; kill: () => void } {
  document.documentElement.removeAttribute("data-intro");
  const effects = springEase("effects-default");
  const form = springEase("formation");
  gsap.set([p.back, p.edge, p.ui, p.overlay, p.frame, p.tabs, p.toggle], { opacity: 0 });
  gsap.set(p.lens, { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(p.card.parentElement, { opacity: 1 });
  field.setOpacity(0);
  field.setCode(0);
  field.morph("mess", "mess", 1);

  const tl = gsap.timeline({
    onComplete: () => {
      document.documentElement.removeAttribute("data-intro");
      onDone();
    },
  });
  formation(tl, field, "mess", "card", 0, 1.2, form.ease);
  tl.to({ v: 0 }, { v: 1, duration: 0.3, onUpdate(this: gsap.core.Tween) { field.setOpacity(this.progress()); } }, 0);
  tl.to({ v: 0 }, { v: 1, duration: 0.5, onUpdate(this: gsap.core.Tween) { field.setCode(this.progress()); } }, 0.5);
  tl.to([p.back, p.edge, p.ui, p.overlay, p.frame, p.tabs, p.toggle], { opacity: 1, duration: 0.4, ease: effects.ease }, 0.4);
  tl.to(p.lens, { scale: 1, opacity: 1, duration: 0.4, ease: effects.ease }, 0.6);

  return {
    skip: () => gsap.to(tl, { progress: 1, duration: 0.25, ease: "power2.out", overwrite: true }),
    kill: () => tl.kill(),
  };
}

/** where the lens sits while it is opening, which the timeline needs before
 *  motion.ts has taken the stage over */
export const LENS_REST = { x: REST_X, y: REST_Y, r: LENS_R };
