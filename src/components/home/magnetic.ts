import { useEffect } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   MAGNETIC LINKS.

   Anything marked data-mag leans toward the pointer as it approaches, up to
   MAX px, falling off with distance. It is a small thing and it is the
   difference between a link that sits there and a link that notices you.

   ONE WINDOW LISTENER, NOT ONE PER ELEMENT. Six links each tracking the
   pointer separately is six listeners doing the same arithmetic; this reads
   the pointer once a frame and writes whichever elements are close enough to
   care. Same reason the work grid's tilt works the way it does.

   THE DAMPING IS A CSS TRANSITION, NOT A LERP. Writing a transform every
   frame with a short transition on it gives a trailing, weighted follow for
   free, and — the part that matters on this page — it degrades to an
   instant, correct position when frames are scarce rather than to a
   half-finished animation. A JS spring stalls wherever the last frame left
   it. A transition lands.

   FINE POINTERS ONLY. On a touch device there is no hover, no approach, and
   nothing to be magnetic toward; the listener is never attached.
   ────────────────────────────────────────────────────────────────────────── */

/** px of pull at the closest approach */
const MAX = 6;
/** how far away an element starts noticing, relative to its own half-size */
const REACH = 2.2;

export function useMagnetic(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-mag]"));
    if (!els.length) return;

    let queued = false;
    let px = 0;
    let py = 0;

    const write = () => {
      queued = false;
      for (const el of els) {
        const b = el.getBoundingClientRect();
        /* Off screen elements cannot be approached, and measuring them is the
           only cost in this loop worth avoiding. */
        if (b.bottom < 0 || b.top > window.innerHeight) {
          if (el.style.transform) el.style.transform = "";
          continue;
        }
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        const nx = (px - cx) / (b.width / 2 || 1);
        const ny = (py - cy) / (b.height / 2 || 1);
        const near = Math.max(0, 1 - Math.hypot(nx, ny) / REACH);
        if (near <= 0) {
          if (el.style.transform) el.style.transform = "";
          continue;
        }
        el.style.transform = `translate3d(${(nx * MAX * near).toFixed(2)}px, ${(
          ny *
          MAX *
          near
        ).toFixed(2)}px, 0)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      for (const el of els) el.style.transform = "";
    };
  }, [enabled]);
}
