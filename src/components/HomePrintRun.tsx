import { useCallback, useEffect, useRef, useState } from "react";
import { Field } from "./Field";
import type { FieldHandle } from "../lib/field";
import { Rail } from "./v2/Rail";
import { RouteMap } from "./v2/RouteMap";
import { Contact } from "./v2/Contact";
import { SmoothScroll, getLenis } from "./print-run/SmoothScroll";
import { onFrame } from "../lib/clock";
import { Cover } from "./print-run/Cover";
import { Intro } from "./print-run/intro/Intro";
import { chooseMode, forget, type Mode } from "./print-run/intro/mode";
import { Issues } from "./print-run/issues/Issues";
import type { EmblemHandle } from "./print-run/EmblemSlot";
import { ISSUES } from "../data/issues";
import { TOKENS, rgb } from "../styles/tokens";
import { getPerfTier } from "./home/perfTier";
import "../styles/v2.css";
import "../styles/v2-ported.css";
import "../styles/print-run.css";

/* --------------------------------------------------------------------------
   PRINT RUN — the homepage.

   A print run, and each shipped product is an issue with its own cover. The
   opening is the moment four colour plates lock into register and become
   Jay's monogram; the background field is the halftone screen behind it, and
   its scroll warp reads as speed lines.

   ONE ACCENT OWNER. Four things want to be the active colour at once: the
   rail per section, the issue run per cover, the CSS token and the WebGL
   emblem's rim. They all go through setAccent here, so there is exactly one
   place that decides and no chance of two of them fighting over it mid-scroll.

   THE TOKEN IS SET ON THE PAGE ROOT, NOT ON documentElement. The tokens are
   scoped to .v2.pr, which is a descendant: an inline custom property on <html>
   would be inherited and then immediately overridden by the scoped rule, and
   the accent would never move. Work.tsx found this out first.

   The tier verdict is waited for rather than guessed. Mounting the WebGL
   emblem speculatively and unmounting it when the watchdog reports back means
   a weak machine pays the whole download, compile and context creation and
   keeps none of it. perfTier.ts exists to prevent exactly that.
   -------------------------------------------------------------------------- */

export function HomePrintRun() {
  const field = useRef<FieldHandle | null>(null);
  const emblem = useRef<EmblemHandle>({ box: null, stage: null, live: false });
  const work = useRef<HTMLElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  /* BOTH OF THESE ARE LATCHED AT MOUNT, AND THAT IS THE POINT.
     perfTier's watchdog samples eighty-odd real frames before it reports,
     which is about 1.4 seconds. Waiting for it meant the intro mounted after
     the hero had already painted and then dropped a veil over a page the
     reader was looking at, and the emblem could not possibly be compiled in
     time for the swap at 1230ms. So the tier is read synchronously from the
     hard signals, which is what they are for.

     Latched, not live, so a late downgrade cannot unmount a WebGL context
     mid-session. The watchdog still records its verdict, and the next load on
     this machine starts in the lite tier from the first frame. */
  const [full] = useState(() => getPerfTier() === "full");
  const [mode] = useState<Mode>(() => chooseMode());
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.title = "Jay Harwani, product designer who writes the front end";
  }, []);

  const onFieldReady = useCallback((h: FieldHandle) => {
    field.current = h;
  }, []);

  const setAccent = useCallback((hex: string) => {
    page.current?.style.setProperty("--accent", hex);
    field.current?.setAccent(rgb(hex));
    emblem.current.stage?.setAccent(hex);
  }, []);

  /* The rail owns the accent everywhere except the issues, where the active
     cover owns it. Two owners on one section flickers; this is the same
     exclusion the previous homepage used and for the same reason. */
  const onRailHue = useCallback(
    ([r, g, b]: [number, number, number]) => setAccent(`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`),
    [setAccent],
  );

  const onIssueActive = useCallback((i: number) => setAccent(TOKENS[ISSUES[i].accent]), [setAccent]);

  const onIntroDone = useCallback(() => setIntroDone(true), []);

  /* THE FIELD RUNS ON THE PAGE'S CLOCK AND THE PAGE'S SCROLL VALUE.
     Its warp is already the speed lines this direction asks for: the faster
     the page moves, the further the stars streak. A second CSS streak layer
     on top was a weaker copy of an effect that was already working, so it is
     gone and the real one is simply fed properly. */
  useEffect(() => {
    return onFrame((_t, deltaMs) => {
      const f = field.current;
      if (!f) return;
      f.setScroll(getLenis()?.animatedScroll ?? window.scrollY);
      f.tick(deltaMs);
    });
  }, []);

  /* Replaying clears both flags and reloads, rather than re-running the
     timeline in place. The intro stops the scroll, moves the emblem out of
     its slot and writes final states on the way out; restarting it over a
     page that has already been scrolled and interacted with is a far larger
     surface than one reload. */
  const replay = useCallback(() => {
    forget();
    window.location.reload();
  }, []);

  return (
    <SmoothScroll>
      <div className="v2 pr" ref={page} data-intro={introDone ? undefined : ""}>
        <Field onReady={onFieldReady} external />
        <div className="vig" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <a className="pr-skiplink" href="#work">
          Skip to the work
        </a>

        <Intro mode={mode} emblem={emblem} onDone={onIntroDone} />

        <Rail onHue={onRailHue} />

        <div className="stage">
          <div className="wrap">
            <main>
              <Cover handle={emblem} full={full} />
              <RouteMap />
              <Issues section={work} veil={veil} onActive={onIssueActive} />
            </main>
            <footer>
              <Contact />
              <div className="pr-colophon">
                <span>Written, designed and built by Jay Harwani.</span>
                <button type="button" className="pr-replay" onClick={replay}>
                  Replay the intro
                </button>
              </div>
            </footer>
          </div>
        </div>

        {/* the page turn fades to the case study's own colour before the route
            changes, so the transition lands on the page it opens */}
        <div className="pr-exit" ref={veil} aria-hidden="true" />
      </div>
    </SmoothScroll>
  );
}

export default HomePrintRun;
