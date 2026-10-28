import { useEffect, type RefObject } from "react";
import type { Fit } from "./fit";
import type { CardRefs } from "./Card";
import { endIntro, playIntro, playSettle, type IntroKind, type IntroParts } from "./intro";
import { getField, pauseDriver } from "../ResolveField";

/* --------------------------------------------------------------------------
   PLAYING THE OPENING, AND KNOWING WHEN TO STOP.

   The timeline itself lives in intro.ts; this is only the wiring — gathering
   the elements, standing the scroll driver down for the duration, and
   listening for the reader deciding they have seen enough.
   -------------------------------------------------------------------------- */

export type IntroOpts = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  kind: IntroKind;
  fit: Fit;
  fitRef: RefObject<Fit>;
  stage: RefObject<HTMLDivElement | null>;
  refs: CardRefs;
  floor: RefObject<HTMLDivElement | null>;
  tabs: RefObject<HTMLDivElement | null>;
  toggle: RefObject<HTMLButtonElement | null>;
  line: RefObject<HTMLDivElement | null>;
  scribble: RefObject<SVGPathElement | null>;
  skipEl: RefObject<HTMLButtonElement | null>;
  player: { current: { skip: () => void; kill: () => void } | null };
  handoff: RefObject<number>;
  pieces: RefObject<Map<string, HTMLElement>>;
  shapes: RefObject<Map<string, HTMLElement>>;
  tokens: RefObject<Map<string, HTMLElement>>;
};

export function useIntro(o: IntroOpts): void {
/* ── the opening ──────────────────────────────────────────────────────
   It owns the field and the o.stage until it is done, and anything the
   reader does ends it. Placed after the o.fit so every position it animates
   to has already been measured, and after place() so nothing in it reads
   layout once it is running. */
useEffect(() => {
  if (!o.playing || o.fit.layout === "none" || !o.stage.current || !o.refs.card.current) return;
  const field = getField();
  const hero = document.querySelector<HTMLElement>(".rs-hero");
  if (!field || !hero) {
    endIntro();
    o.setPlaying(false);
    return;
  }
  const parts: IntroParts = {
    stage: o.stage.current,
    hero,
    card: o.refs.card.current,
    back: o.refs.card.current.querySelector(".hc-back"),
    edge: o.refs.card.current.querySelector(".hc-edge"),
    wire: o.refs.wire.current,
    ui: o.refs.ui.current,
    overlay: o.refs.overlay.current,
    frame: o.refs.frame.current,
    lens: o.refs.lens.current,
    rim: o.refs.rim.current,
    tag: o.refs.tag.current,
    line: o.line.current,
    scribble: o.scribble.current,
    skip: o.skipEl.current,
    floor: o.floor.current,
    tabs: o.tabs.current,
    toggle: o.toggle.current,
    pieces: o.pieces.current,
    shapes: o.shapes.current,
    tokens: o.tokens.current,
  };
  pauseDriver(true);
  const done = () => {
    pauseDriver(false);
    o.setPlaying(false);
  };
  const live = o.fitRef.current;
  if (live.layout === "none") {
    endIntro();
    return;
  }
  const run = o.kind === "full" ? playIntro(parts, field, live, done) : playSettle(parts, field, done);
  o.player.current = run;

  /* ANYTHING THE READER DOES ENDS IT. Somebody who has started scrolling,
     typing or clicking has told you they are finished watching. The reel
     button is the exception, because pressing it is not impatience. */
  const out = (e: Event) => {
    if (e.type === "pointerdown" && (e.target as HTMLElement)?.closest?.(".rs-reel")) return;
    run.skip();
  };
  window.addEventListener("keydown", out);
  window.addEventListener("wheel", out, { passive: true });
  window.addEventListener("touchstart", out, { passive: true });
  window.addEventListener("pointerdown", out);
  return () => {
    window.removeEventListener("keydown", out);
    window.removeEventListener("wheel", out);
    window.removeEventListener("touchstart", out);
    window.removeEventListener("pointerdown", out);
    run.kill();
    o.player.current = null;
    pauseDriver(false);
  };
  /* KEYED ON THE SHAPE OF THE LAYOUT, NEVER ON THE FIT OBJECT. The o.fit is
     measured again when the fonts land, which is about 170ms in, and a new
     object there restarted the whole opening from nothing — measured, it
     was killing the timeline at six per cent and beginning again. Only a
     change of layout is worth starting over for. */
  // eslint-disable-next-o.line react-hooks/exhaustive-deps
}, [o.playing, o.fit.layout, o.fit.layout === "none" ? "" : o.fit.mode]);
}
