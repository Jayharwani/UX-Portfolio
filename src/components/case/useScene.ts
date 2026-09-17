import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   SCROLL SCENES — CASES.md §4.

   One passive scroll listener and one rAF per page, shared by every scene.
   Each registered element gets a `--p` custom property, 0 at the moment it
   starts crossing the window and 1 when it has finished, and the CSS does the
   rest. Nothing here reads layout during the scroll event — positions are
   measured on resize and on registration, so a scroll never forces a reflow.

   WHY NOT animation-timeline. `view()` is the current technique and it is the
   one this would be written with if the audience were other front-end people.
   It sits around 83% support and is not Baseline, because Firefox stable still
   keeps it behind a flag. A portfolio cannot serve a sixth of its readers a
   page with no motion, and the people this site is aimed at open links in
   whatever browser is already running. So: a driver that works everywhere.

   THE LOOP ONLY RUNS WHEN SOMETHING CHANGED. A rAF that recomputes identical
   values sixty times a second on a static page is a battery cost with nothing
   to show for it, so scrolling arms the loop and the loop disarms itself once
   the smoothed value has caught up.
   -------------------------------------------------------------------------- */

type Scene = {
  el: HTMLElement;
  /** viewport fraction where p reaches 0 → 1, measured from the element */
  top: number;
  height: number;
  last: number;
  /** optional reader, for the values CSS cannot express — a formatted number */
  on?: (p: number) => void;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

class Driver {
  private scenes = new Set<Scene>();
  private raf = 0;
  private running = false;
  private reduced = false;
  private ro: ResizeObserver | null = null;
  private lastH = 0;

  constructor() {
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.addEventListener("scroll", this.arm, { passive: true });
    window.addEventListener("resize", this.remeasure, { passive: true });

    /* A scene measured at mount is measured before the page has settled: lazy
       images have not loaded, the webfont has not swapped, and on a long case
       study everything below the fold then sits hundreds of pixels from where
       it was recorded. The scene never fires, and it looks exactly like a
       broken effect rather than a stale number.

       Watching the document's own height catches all of it — images, fonts,
       reveals adding height — and the height guard keeps this out of a
       ResizeObserver feedback loop, since the properties written here can
       change layout inside a scene. */
    this.lastH = document.documentElement.scrollHeight;
    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver(() => {
        const h = document.documentElement.scrollHeight;
        if (h === this.lastH) return;
        this.lastH = h;
        this.remeasure();
      });
      this.ro.observe(document.documentElement);
    }
    document.fonts?.ready.then(() => this.remeasure()).catch(() => {});
  }

  add(el: HTMLElement, on?: (p: number) => void) {
    const scene: Scene = { el, top: 0, height: 1, last: -1, on };
    this.scenes.add(scene);
    this.measure(scene);
    /* Land it once immediately. Under reduced motion that is the whole
       contract; otherwise it stops a scene that begins in view from sitting
       at its start value until the reader happens to scroll. */
    this.apply(scene, this.reduced ? 1 : undefined);
    if (!this.reduced) this.arm();
    return () => {
      this.scenes.delete(scene);
    };
  }

  private measure(s: Scene) {
    const r = s.el.getBoundingClientRect();
    s.top = r.top + window.scrollY;
    s.height = r.height || 1;
  }

  private remeasure = () => {
    this.scenes.forEach((s) => this.measure(s));
    this.scenes.forEach((s) => {
      s.last = -1;
    });
    this.arm();
  };

  private apply(s: Scene, force?: number) {
    let p: number;
    if (force !== undefined) {
      p = force;
    } else {
      const vh = window.innerHeight || 1;
      /* 0 when the element's top reaches the bottom of the window,
         1 when its bottom reaches the top */
      const travel = s.height + vh;
      p = clamp01((window.scrollY + vh - s.top) / travel);
    }
    /* Two decimals is under half a pixel on anything this drives, and it is
       what stops an identical frame being written as a different string. */
    const q = Math.round(p * 1000) / 1000;
    if (q === s.last) return false;
    s.last = q;
    s.el.style.setProperty("--p", String(q));
    s.on?.(q);
    return true;
  }

  private arm = () => {
    if (this.reduced || this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.tick);
  };

  private tick = () => {
    let changed = false;
    this.scenes.forEach((s) => {
      if (this.apply(s)) changed = true;
    });
    if (changed) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.running = false;
    }
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.running = false;
    window.removeEventListener("scroll", this.arm);
    window.removeEventListener("resize", this.remeasure);
    this.ro?.disconnect();
    this.ro = null;
    this.scenes.clear();
  }
}

let driver: Driver | null = null;
let refs = 0;

function acquire() {
  if (!driver) driver = new Driver();
  refs++;
  return driver;
}
function release() {
  refs--;
  if (refs <= 0 && driver) {
    driver.destroy();
    driver = null;
    refs = 0;
  }
}

/**
 * Registers the returned ref's element as a scroll scene. Read the progress in
 * CSS as `var(--p)` — it is 0 as the element enters and 1 as it leaves.
 */
export function useScene<T extends HTMLElement>(onProgress?: (p: number) => void) {
  const ref = useRef<T>(null);
  /* kept in a ref so passing an inline arrow does not re-register the scene
     on every render — which would re-measure and reset it mid-scroll */
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const d = acquire();
    const remove = d.add(el, (p) => cb.current?.(p));
    return () => {
      remove();
      release();
    };
  }, []);
  return ref;
}

/* --------------------------------------------------------------------------
   REVEAL — the same shape the homepage settled on, and for the same reason.
   The observer is backed by a timer, because a section that never arrives is
   indistinguishable from a section that was never written.
   -------------------------------------------------------------------------- */
export function useReveal<T extends HTMLElement>(threshold = 0.15, failsafeMs = 2200) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          setSeen(true);
        }
      },
      { threshold }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      io.disconnect();
      setSeen(true);
    }, failsafeMs);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [threshold, failsafeMs, seen]);

  return [ref, seen] as const;
}

/* --------------------------------------------------------------------------
   TILT — CSS 3D, no library, no WebGL.

   Writes --rx/--ry onto the element so the transform stays in the stylesheet
   where it can be overridden per component and switched off under reduced
   motion without touching this file.
   -------------------------------------------------------------------------- */
export function useTilt<T extends HTMLElement>(strength = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--ry", `${(cx * strength).toFixed(3)}deg`);
      el.style.setProperty("--rx", `${(-cy * strength).toFixed(3)}deg`);
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return ref;
}
