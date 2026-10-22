import { lazy, Suspense, useCallback, useRef, useState } from "react";

const ReelModal = lazy(() => import("./ReelModal").then((m) => ({ default: m.ReelModal })));

/* --------------------------------------------------------------------------
   SIXTY SECONDS, OFFERED.

   The one thing in the hero that is not the lattice, so it has to earn the
   attention it takes. It earns it by being a window rather than a label: the
   well is a real frame of the film, and hovering starts it playing, so what
   the button promises is the thing the button is already showing you.

   NOTHING IS FETCHED UNTIL SOMEBODY LEANS IN. The poster is fifty kilobytes
   and carries the resting state; the preview's src is not set until a pointer
   or a focus ring arrives, and the full film is a separate chunk that is not
   imported until the dialog opens. A hero that costs twenty-two megabytes to
   look at is not a hero.

   THE DIAL IS A MINUTE. It draws once around the well while you hover, which
   is the length of the thing being offered, and it is the only moving part
   that is not the film itself. It is not a progress bar and must not pretend
   to be one: the preview is six seconds of the sixty.
   -------------------------------------------------------------------------- */

const PEEK = "/jay-60-peek.mp4";
const POSTER = "/jay-60-poster.jpg";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reel() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const peek = useRef<HTMLVideoElement>(null);

  /* SET ON THE ELEMENT, NOT THROUGH STATE. Re-rendering to add a src would
     re-render the hero, and the only thing that has to change is one
     attribute on one video that React is not otherwise touching. */
  const wake = useCallback(() => {
    const v = peek.current;
    if (!v || reduced()) return;
    if (!v.getAttribute("src")) v.setAttribute("src", PEEK);
    void v.play().catch(() => {});
  }, []);

  const rest = useCallback(() => {
    const v = peek.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  /* focus comes back to the button, because that is where it was */
  const shut = useCallback(() => {
    setOpen(false);
    btn.current?.focus();
  }, []);

  return (
    <div className="rs-reel-row">
      <button
        type="button"
        className="rs-reel"
        ref={btn}
        aria-haspopup="dialog"
        onPointerEnter={wake}
        onPointerLeave={rest}
        onFocus={wake}
        onBlur={rest}
        onClick={() => setOpen(true)}
      >
        <span className="rs-reel-well" aria-hidden="true">
          <video className="rs-reel-peek" ref={peek} poster={POSTER} muted loop playsInline preload="none" />
          <svg className="rs-reel-dial" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <circle cx="32" cy="32" r="30.4" />
          </svg>
          <span className="rs-reel-play" />
        </span>
        {/* rs-btn-text is what the page's magnet leans a little further than
            the tile, and it has to be the whole text block or the two lines
            drift apart from each other as the pointer moves */}
        <span className="rs-btn-text rs-reel-say">
          <span className="rs-reel-label">Learn about me in 60 seconds</span>
          <span className="mono rs-reel-meta">Level 1 to 10 · 01:00</span>
        </span>
      </button>

      {open && (
        <Suspense fallback={null}>
          <ReelModal onClose={shut} />
        </Suspense>
      )}
    </div>
  );
}
