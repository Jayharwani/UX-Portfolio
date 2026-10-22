import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { pauseFrames } from "../../lib/clock";
import { getLenis } from "./SmoothScroll";

/* --------------------------------------------------------------------------
   THE SIXTY SECONDS, FULL SIZE.

   Mounted only while it is open, which is the whole reason it is a separate
   component: the file behind it is twenty-two megabytes, and a <video> that
   exists on the page is a <video> the browser may decide to reach for. Not
   existing is the only preload setting that is actually zero.

   THE PAGE BEHIND IT STOPS. Scroll is locked, Lenis is stopped, and the frame
   clock is paused, which takes the five thousand point field with it. A
   lattice that nobody can see is still a lattice the GPU is rasterising, and
   it was competing with video decode for the same machine.

   Native controls on purpose. A hand-built scrubber would be a worse one: no
   keyboard shortcuts, no picture-in-picture, no fullscreen, no captions menu
   when there are captions to show.

   IT IS PORTALLED OUT OF THE HERO AND IT HAS TO BE. The button lives inside
   .rs-hero-copy, which the hero's scroll choreography moves and fades with a
   GSAP transform. A transformed ancestor becomes the containing block for
   every fixed-position descendant, so rendering this in place would pin the
   overlay to the hero instead of the viewport and hand it the hero's fading
   opacity on the way out.

   It goes to the page root rather than to the body, because every token this
   thing is painted with — the ink, the accent, the spring curves — is
   declared on .v2.rs, and the stylesheet is scoped there too. Portalled to
   the body it would inherit none of them and match none of them.
   -------------------------------------------------------------------------- */

/* TWO CUTS OF THE SAME MINUTE, not one cut and a crop. The vertical one is a
   separate edit — the numeral is rescaled for the taller frame and the type is
   restacked — so a phone gets a film composed for a phone rather than a
   letterboxed strip of a widescreen one. */
/* THE FILMS ARE NOT SERVED FROM THIS SITE, AND THAT IS THE ONLY REASON
   SEEKING WORKS. Cloudflare Workers static assets answer a `Range` request
   with 200 and the entire file, so a player has no way to jump: measured on
   the live site, dragging forward past the buffer never resolved at any
   connection speed from unthrottled down to 3 Mbps, and a ten second nudge
   cost twelve seconds on 4G. GitHub Pages returns 206, so it does.

   The posters stay here. They are sixty kilobytes, nothing seeks them, and
   keeping them local means the still is already on screen while the film is
   still opening a connection to the other origin. */
const MEDIA = "https://jayharwani.github.io/media";
const WIDE = { src: `${MEDIA}/jay-60.mp4`, poster: "/jay-60-poster.jpg", tall: false };
const TALL = { src: `${MEDIA}/jay-60-tall.mp4`, poster: "/jay-60-tall-poster.jpg", tall: true };

/** phones and tablets held upright. Not simply `(orientation: portrait)`: a
 *  desktop window taller than it is wide is still a desktop. */
const UPRIGHT = "(orientation: portrait) and (max-width: 900px)";

export function ReelModal({ onClose }: { onClose: () => void }) {
  /* CHOSEN ONCE, WHEN THE DIALOG OPENS, and deliberately not watched after
     that. Swapping a video's src mid-playback reloads it and drops the
     viewer back to zero, so somebody who turns their phone halfway through
     keeps the film they started. The lazy initialiser is what makes it once:
     a plain call in the body would re-run on every render.

     In script rather than in markup, because <source media="..."> looks like
     the answer and is not — browsers only honour media-based source
     selection inside <picture>, and ignore it in <video>. */
  const [cut] = useState(() => (window.matchMedia(UPRIGHT).matches ? TALL : WIDE));
  const scrim = useRef<HTMLDivElement>(null);
  const shut = useRef<HTMLButtonElement>(null);
  const film = useRef<HTMLVideoElement>(null);

  /* the scrim closes, the stage inside it does not: a click that lands on the
     video or its controls is a click about the video */
  const onScrim = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === scrim.current) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const lenis = getLenis();
    const body = document.body;
    const was = body.style.overflow;

    lenis?.stop();
    pauseFrames(true);
    body.style.overflow = "hidden";
    shut.current?.focus();

    /* the click that opened this is still the user gesture that authorises
       sound, so this usually succeeds; if a browser disagrees, the controls
       are already there and the poster is already showing */
    void film.current?.play().catch(() => {});

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      /* TAB STAYS INSIDE. Two stops — the close button and the player — and
         wrapping between them by hand, because a dialog you can tab out of is
         a dialog a screen reader walks straight out of the back of. */
      if (e.key !== "Tab") return;
      const first = shut.current;
      const last = film.current;
      if (!first || !last) return;
      const on = document.activeElement;
      if (e.shiftKey && on === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && on === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      body.style.overflow = was;
      pauseFrames(false);
      lenis?.start();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="rs-reel-scrim"
      ref={scrim}
      onClick={onScrim}
      role="dialog"
      aria-modal="true"
      aria-label="Jay Harwani, level 1 to 10"
    >
      <div className="rs-reel-stage" data-cut={cut.tall ? "tall" : "wide"}>
        <video
          className="rs-reel-film"
          ref={film}
          src={cut.src}
          poster={cut.poster}
          controls
          playsInline
          preload="auto"
        />
      </div>
      <button type="button" className="rs-reel-shut" ref={shut} onClick={onClose} aria-label="Close the video">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      </button>
    </div>,
    document.querySelector<HTMLElement>(".v2.rs") ?? document.body,
  );
}
