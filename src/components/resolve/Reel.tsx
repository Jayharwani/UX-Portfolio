import { lazy, Suspense, useCallback, useRef, useState } from "react";

const ReelModal = lazy(() => import("./ReelModal").then((m) => ({ default: m.ReelModal })));

/* --------------------------------------------------------------------------
   SIXTY SECONDS, OFFERED.

   A circle and a play mark. That is the whole of it at rest, because the hero
   already has a headline, a promise and a lattice in it, and a fourth thing
   with two lines of its own type was a fourth thing competing. The first
   version was a pill carrying a label and a timecode, and it read as a banner
   rather than as a control.

   IT ONLY SPEAKS WHEN SPOKEN TO. Hovering is what asks the question, so
   hovering is what answers it: the name slides out from behind the circle,
   the ring draws, and the film itself fades up inside the well and plays. At
   rest none of that is on screen and none of it has been downloaded.

   THE NAME IS NOT IN THE BUTTON'S BOX. It is positioned beside it rather than
   laid out next to it, so the control stays exactly a circle — a label that
   participated in layout would make the hit target a long rectangle with a
   circle drawn at one end of it.

   ON A TOUCH SCREEN THE NAME IS ALWAYS THERE. There is no hover to discover
   it with, and an unlabelled circle is a guess.
   -------------------------------------------------------------------------- */

const PEEK = "/jay-60-peek.mp4";
const POSTER = "/jay-60-poster.jpg";
const NAME = "Learn about me in 60 seconds";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** the same test the field uses before it runs a pointer effect */
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function Reel() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const peek = useRef<HTMLVideoElement>(null);

  /* SET ON THE ELEMENT, NOT THROUGH STATE, and not until now. Neither the
     poster nor the preview is fetched on load: at rest the well is empty and
     the only thing in the circle is a triangle drawn in CSS.

     AND NOT AT ALL ON A TOUCH SCREEN. pointerenter fires on a tap, so a phone
     was pulling the poster and the preview — 450 kB — a few hundred
     milliseconds before opening the dialog, and then decoding that preview
     behind it. Neither can ever be seen there: the well only reveals the film
     on hover, and a device with no hover never reaches that state. */
  const wake = useCallback(() => {
    const v = peek.current;
    if (!v || reduced() || !canHover()) return;
    if (!v.getAttribute("src")) {
      v.setAttribute("poster", POSTER);
      v.setAttribute("src", PEEK);
    }
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
        aria-label={NAME}
        onPointerEnter={wake}
        onPointerLeave={rest}
        onFocus={wake}
        onBlur={rest}
        onClick={() => setOpen(true)}
      >
        <span className="rs-reel-well" aria-hidden="true">
          <video className="rs-reel-peek" ref={peek} muted loop playsInline preload="none" />
          <span className="rs-reel-play" />
        </span>
        <svg className="rs-reel-dial" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <circle cx="32" cy="32" r="30.6" />
        </svg>
      </button>

      {/* OUTSIDE THE BUTTON, AND IT HAS TO BE. Absolutely positioned inside a
          56px circle, the name's containing block is 56px wide, and Chrome
          clamps an intrinsic width to the space that leaves: the box came out
          50px — one word — with the line overflowing it. As a sibling it
          resolves against the row and measures what it draws.

          aria-hidden because the button already carries this as its label,
          and a name read twice is a name read wrong. */}
      <span className="rs-reel-say" aria-hidden="true">
        {NAME}
      </span>

      {open && (
        <Suspense fallback={null}>
          <ReelModal onClose={shut} />
        </Suspense>
      )}
    </div>
  );
}
