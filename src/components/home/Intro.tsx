import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   THE INTRO.

   A hairline draws. The name arrives out of focus and sharpens. A frame
   opens around it. Then the whole plate pushes past the camera and the
   portfolio is already there behind it.

   WHY IT LOOKS LIKE THIS. The site's entire visual language is hairline
   frames in depth, so the intro is made of one hairline and one frame. An
   opening title that introduced a different vocabulary would be a trailer
   for a different film. The rack focus — blurred and wide, resolving to
   sharp and tight — is the one cinematic device here, and it is doing a real
   job: it makes the name ARRIVE rather than fade, which a fade cannot.

   ── THE PART THAT MATTERS MORE THAN THE LOOK ─────────────────────────────

   An intro is a screen in front of the content, and this codebase has been
   bitten four separate times by content parked behind something that needs
   animation frames to get out of the way: the hero entrance, the work cards,
   the band reveals and the scene. Every one of them was found blank on a
   document that mounted hidden and produced no frames.

   So the intro's exit does not depend on a frame ever being produced:

     · DISMISSAL IS setTimeout, not requestAnimationFrame, not a
       transitionend. setTimeout fires in documents that never paint. The
       overlay is gone at END_MS whatever else has happened.
     · IT NEVER PLAYS IN A DOCUMENT THAT CANNOT SHOW IT. Hidden tab, reduced
       motion, or already seen this session — it does not mount at all, so
       there is nothing to strand.
     · ANY INPUT SKIPS IT. Pointer, key, wheel, touch. Nobody who wants to
       get on with it has to wait.
     · IT IS aria-hidden AND IT DOES NOT TRAP FOCUS. A screen reader reads
       the page underneath, which was always the real content.

   The overlay is also rendered by React and nothing else, so a JavaScript
   failure produces no intro rather than an intro with no exit.
   ────────────────────────────────────────────────────────────────────────── */

const KEY = "jh.intro.v1";

/** when the plate starts pushing past the camera */
const EXIT_MS = 2050;
/** and when the overlay is gone, no matter what */
const END_MS = 2650;

/** Whether the intro will play on this load. Exported because the hero needs
    the same answer: if the intro is running, the hero must already be settled
    behind it, or the dissolve reveals a name mid-entrance and the match cut
    becomes a jump cut. Read-only, and read during render before this
    component's effect writes the session key, so both callers agree. */
export function introWillPlay() {
  return shouldPlay();
}

function shouldPlay() {
  if (typeof window === "undefined") return false;
  /* Reduced motion gets no intro at all. Not a shorter one: the whole thing
     IS motion, so the honest reduced version is the page. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  /* ?intro=1 replays it on demand. Useful for showing someone the opening
     without clearing storage, and it is the only way to see it in a tool
     that reports the document as hidden. Reduced motion still wins. */
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  /* A tab opened in the background has nobody watching, and by the time it
     is looked at the intro would be over. Skipping is both kinder and one
     fewer way to end up stuck behind a still frame. */
  if (document.hidden) return false;
  /* Once a session. Coming back from a case study should feel like coming
     back, not like arriving. sessionStorage throws in some privacy modes,
     so a failure to read it means play it. */
  try {
    if (sessionStorage.getItem(KEY)) return false;
  } catch {
    /* ignore */
  }
  return true;
}

export default function Intro() {
  const [state, setState] = useState<"play" | "out" | "off">(() =>
    shouldPlay() ? "play" : "off"
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (state === "off") return;

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }

    /* The page must not scroll under the overlay, or a stray wheel event
       leaves the reader somewhere in the middle of the work section when it
       lifts. Restored unconditionally in the cleanup, so an unmount for any
       reason cannot leave the page locked. */
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      setState("off");
      document.body.style.overflow = prevOverflow;
    };

    const skip = () => {
      setState("out");
      timers.current.push(window.setTimeout(finish, 420));
    };

    timers.current.push(window.setTimeout(() => setState("out"), EXIT_MS));
    timers.current.push(window.setTimeout(finish, END_MS));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") return skip();
      skip();
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });
    window.addEventListener("keydown", onKey, { once: true });

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", onKey);
    };
    /* Deliberately mount-only: re-running this would restart the sequence. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "off") return null;

  return (
    <div className={`intro${state === "out" ? " is-out" : ""}`} aria-hidden="true">
      {/* The same two elements the hero plate holds, in the same order, at
          the same sizes. That is what makes the dissolve a match cut rather
          than a cut: when the overlay goes, nothing moves. */}
      <div className="intro__plate">
        {/* the frame, opening out of the line it was drawn from */}
        <span className="intro__frame" />
        {/* the line itself: the site's one mark, drawn before anything else */}
        <span className="intro__rule" />
        <p className="micro intro__welcome">Welcome to my portfolio</p>
        <h2 className="intro__name">Jay Harwani</h2>
      </div>
    </div>
  );
}
