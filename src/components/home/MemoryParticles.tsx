import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ──────────────────────────────────────────────────────────────────────────
   Memory particles — the hero signature.

   The headline assembles out of thousands of drifting particles, then
   crossfades into the real (crisp, selectable) DOM text. Every few seconds
   the word "forgets." dissolves back into particles — a memory slipping —
   hangs in the air, and re-forms. The cursor (or a finger) scatters any
   particles it passes through; they spring home.

   Engineering notes:
   · Particle targets are sampled from an offscreen canvas that mirrors the
     REAL text runs (positions measured from the live spans after
     document.fonts.ready), so canvas and DOM text align to the pixel.
   · Rendering is Canvas2D fillRect batched by color bucket — no WebGL
     dependency on the homepage chunk. Count adapts to viewport area.
   · The physics loop runs on gsap.ticker and pauses when the hero is
     offscreen or the tab is hidden.
   · prefers-reduced-motion: the component renders nothing; the Hero keeps
     its plain reveal.
   ────────────────────────────────────────────────────────────────────────── */

interface Run {
  text: string;
  font: string;
  letterSpacing: string; // canvas fillText ignores CSS letter-spacing unless set
  color: string;
  x: number; // canvas-space left
  y: number; // canvas-space top of the em box
  size: number;
  isWord: boolean; // the "forgets." run — gets the dissolve loop + accent
}

interface P {
  tx: number; // home (text) position
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sx: number; // scatter origin for the intro
  sy: number;
  t0: number; // intro stagger offset 0..0.62
  drift: number; // per-particle drift phase for the dissolve
  size: number;
  bucket: number; // color bucket index
  word: boolean;
  /* ambient survivors: after assembly they drift to the hero's flanks and
     stay alive — the memories that didn't make it into the words */
  ambient: boolean;
  ax: number;
  ay: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function MemoryParticles({
  heroRef,
  h1Ref,
  wordRef,
  onAssembled,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  h1Ref: React.RefObject<HTMLHeadingElement | null>;
  wordRef: React.RefObject<HTMLElement | null>;
  onAssembled: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assembledCb = useRef(onAssembled);
  assembledCb.current = onAssembled;

  useEffect(() => {
    const hero = heroRef.current;
    const h1 = h1Ref.current;
    const wordEl = wordRef.current;
    const canvas = canvasRef.current;
    if (!hero || !h1 || !wordEl || !canvas) return;

    let disposed = false;
    let cleanupFns: (() => void)[] = [];

    /* failsafe: whatever happens (throttled ticker, background-tab load,
       font API weirdness), the real headline may never stay invisible.
       4.5s after the page is first VISIBLE, force the crossfade. */
    let failsafe = 0;
    const armFailsafe = () => {
      if (failsafe || document.visibilityState !== "visible") return;
      failsafe = window.setTimeout(() => assembledCb.current(), 4500);
    };
    armFailsafe();
    document.addEventListener("visibilitychange", armFailsafe);
    cleanupFns.push(() => {
      document.removeEventListener("visibilitychange", armFailsafe);
      window.clearTimeout(failsafe);
    });

    const setup = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* sample with fallback metrics */
      }
      if (disposed) return;

      const heroRect = hero.getBoundingClientRect();
      /* Budget the effect to the machine it landed on. Phones and low-core
         laptops were running the same particle count and the same 2x canvas
         as a desktop, which is what made the hero stutter on other people's
         devices. Half the pixels and roughly a third of the particles there —
         the effect still reads, the frame budget survives. */
      const cores = (navigator as any).hardwareConcurrency || 4;
      const memGB = (navigator as any).deviceMemory ?? 8;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      /* `cores <= 4` was too narrow a definition of "slow". Plenty of the
         laptops this felt bad on report 8 threads while running integrated
         graphics, so they took the full desktop budget. Treat <= 6 threads or
         <= 4 GB as low power too. */
      const lowPower = coarse || cores <= 6 || memGB <= 4 || window.innerWidth < 900;
      const dpr = Math.min(lowPower ? 1.5 : 2, window.devicePixelRatio || 1);
      canvas.width = Math.round(heroRect.width * dpr);
      canvas.height = Math.round(heroRect.height * dpr);
      canvas.style.width = `${heroRect.width}px`;
      canvas.style.height = `${heroRect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      /* ── collect the text runs from the live DOM ── */
      const runs: Run[] = [];
      const lineSpans = h1.querySelectorAll<HTMLElement>("[data-line]");
      lineSpans.forEach((line) => {
        const cs = getComputedStyle(line);
        const size = parseFloat(cs.fontSize);
        // walk direct text vs the em word
        line.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = (node.textContent || "").trimEnd();
            if (!text.trim()) return;
            const range = document.createRange();
            range.selectNodeContents(node);
            const r = range.getBoundingClientRect();
            runs.push({
              text,
              font: `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`,
              letterSpacing: cs.letterSpacing,
              color: "#E8ECF3",
              x: r.left - heroRect.left,
              y: r.top - heroRect.top,
              size,
              isWord: false,
            });
          } else if (node instanceof HTMLElement) {
            const ecs = getComputedStyle(node);
            const esize = parseFloat(ecs.fontSize);
            const r = node.getBoundingClientRect();
            runs.push({
              text: node.textContent || "",
              font: `${ecs.fontStyle} ${ecs.fontWeight} ${esize}px ${ecs.fontFamily}`,
              letterSpacing: ecs.letterSpacing,
              color: "#9FBBFF",
              x: r.left - heroRect.left,
              y: r.top - heroRect.top,
              size: esize,
              isWord: node === wordEl || node.contains(wordEl),
            });
          }
        });
      });
      if (!runs.length) {
        assembledCb.current();
        return;
      }

      /* ── sample the runs into particle targets ── */
      const off = document.createElement("canvas");
      off.width = Math.round(heroRect.width);
      off.height = Math.round(heroRect.height);
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      const drawRuns = (only?: "word" | "rest") => {
        octx.clearRect(0, 0, off.width, off.height);
        for (const run of runs) {
          if (only === "word" && !run.isWord) continue;
          if (only === "rest" && run.isWord) continue;
          octx.font = run.font;
          try {
            (octx as any).letterSpacing = run.letterSpacing === "normal" ? "0px" : run.letterSpacing;
          } catch {
            /* older engines: minor width drift, acceptable */
          }
          octx.textBaseline = "top";
          octx.fillStyle = "#fff";
          octx.fillText(run.text, run.x, run.y);
        }
      };

      /* adaptive density: aim ~7k desktop, ~3k phones */
      const area = heroRect.width * heroRect.height;
      /* sampling stride: bigger stride = fewer particles. Each particle costs
         spring math + a fillRect every frame, so this is the single biggest
         lever on hero smoothness. */
      const step = lowPower ? 6 : area > 700_000 ? 3 : 4;

      const sample = (only: "word" | "rest"): { x: number; y: number }[] => {
        drawRuns(only);
        const img = octx.getImageData(0, 0, off.width, off.height).data;
        const pts: { x: number; y: number }[] = [];
        for (let y = 0; y < off.height; y += step) {
          for (let x = 0; x < off.width; x += step) {
            if (img[(y * off.width + x) * 4 + 3] > 140) {
              pts.push({ x: x + (Math.random() - 0.5) * step, y: y + (Math.random() - 0.5) * step });
            }
          }
        }
        return pts;
      };

      const restPtsRaw = sample("rest");
      const wordPtsRaw = sample("word");

      /* Hard ceiling on the particle count.
         The stride above adapts to hero size but has no upper bound, so a wide
         desktop hero was producing on the order of 7,000 particles — and every
         one of them costs a globalAlpha assignment plus a fillRect on every
         frame of the intro. That is the hero stuttering on exactly the machines
         this was reported on. Cap the total and thin evenly across the sampled
         points, which keeps the glyph shapes intact (an even stride reads as
         "sparser text", where truncating the tail would lop off whole letters).
         Word particles carry the recurring dissolve loop, so they hold a larger
         share of the budget than the one-shot intro scatter. */
      const MAX_PARTS = lowPower ? 1800 : 4200;
      const thin = <T,>(arr: T[], keep: number): T[] => {
        if (arr.length <= keep || keep <= 0) return arr;
        const out: T[] = [];
        const stride = arr.length / keep;
        for (let i = 0; i < keep; i++) out.push(arr[Math.floor(i * stride)]);
        return out;
      };
      const wordKeep = Math.min(wordPtsRaw.length, Math.round(MAX_PARTS * 0.42));
      const restPts = thin(restPtsRaw, MAX_PARTS - wordKeep);
      const wordPts = thin(wordPtsRaw, wordKeep);

      /* color buckets keep fillStyle switches cheap */
      const BUCKETS = ["#E8ECF3", "#C7CFDD", "#AAB6CB", "#9FBBFF", "#7FA4FF", "#5B8CFF"];
      const mk = (pt: { x: number; y: number }, word: boolean): P => {
        const ang = Math.random() * Math.PI * 2;
        const dist = 220 + Math.random() * Math.max(heroRect.width, 640) * 0.55;
        return {
          tx: pt.x,
          ty: pt.y,
          x: pt.x + Math.cos(ang) * dist,
          y: pt.y + Math.sin(ang) * dist,
          vx: 0,
          vy: 0,
          sx: 0,
          sy: 0,
          t0: Math.random() * 0.62,
          drift: Math.random() * Math.PI * 2,
          size: Math.random() < 0.82 ? 1.6 : 2.4,
          bucket: word ? 3 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 3),
          word,
          ambient: false,
          ax: 0,
          ay: 0,
        };
      };
      const parts: P[] = [...restPts.map((p) => mk(p, false)), ...wordPts.map((p) => mk(p, true))];
      parts.forEach((p) => {
        p.sx = p.x;
        p.sy = p.y;
      });

      /* ambient survivors (every breakpoint): a sparse constellation stays
         alive after the headline lands, living anywhere EXCEPT over the
         copy — desktop gets the flanks, mobile the strips above and below */
      {
        const copyEl = h1.parentElement; // the centered copy column (h1 + sub + CTA)
        const cr = copyEl ? copyEl.getBoundingClientRect() : null;
        const pad = 26;
        const zone = cr
          ? {
              l: cr.left - heroRect.left - pad,
              r: cr.right - heroRect.left + pad,
              t: cr.top - heroRect.top - pad,
              b: cr.bottom - heroRect.top + pad,
            }
          : null;
        const inCopy = (x: number, y: number) => !!zone && x > zone.l && x < zone.r && y > zone.t && y < zone.b;

        const rest = parts.filter((p) => !p.word);
        const want = Math.min(heroRect.width >= 900 ? 220 : 90, Math.floor(rest.length / 8));
        const stride = Math.max(1, Math.floor(rest.length / Math.max(1, want)));
        for (let i = 0; i < rest.length; i += stride) {
          const p = rest[i];
          // rejection-sample a home outside the copy block
          for (let tries = 0; tries < 12; tries++) {
            const x = heroRect.width * (0.03 + Math.random() * 0.94);
            const y = heroRect.height * (0.06 + Math.random() * 0.85);
            if (!inCopy(x, y)) {
              p.ambient = true;
              p.ax = x;
              p.ay = y;
              break;
            }
          }
        }
      }
      // render order sorted by bucket so fillStyle changes ~6 times/frame
      parts.sort((a, b) => a.bucket - b.bucket);

      /* ── animation state ── */
      const state = {
        intro: 0, // 0 scattered → 1 assembled
        dissolve: 0, // word only: 0 home → 1 dispersed
        restAlpha: 1, // non-word particles fade out after the crossfade
        wordAlpha: 0, // word particles visible only during the dissolve loop
        ambientAlpha: 0, // the flank constellation fades in after assembly
        masterAlpha: 0, // everything emerges from darkness, no pop-in
        running: true,
        time: 0,
      };
      const pointer = { x: -9999, y: -9999, active: false };

      /* PERF: this read hero.getBoundingClientRect() on every pointermove,
         which forces a synchronous layout for each of the 60–120 move events a
         second a mouse produces — on the hero, the first thing anyone touches.
         The hero's offset only changes when the page scrolls or resizes, so
         cache it and refresh on those two events instead. */
      let heroLeft = 0;
      let heroTop = 0;
      const readHeroOffset = () => {
        const r = hero.getBoundingClientRect();
        heroLeft = r.left;
        heroTop = r.top;
      };
      readHeroOffset();
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX - heroLeft;
        pointer.y = e.clientY - heroTop;
        pointer.active = true;
      };
      const onLeave = () => {
        pointer.active = false;
        pointer.x = -9999;
        pointer.y = -9999;
      };
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", readHeroOffset, { passive: true });
      window.addEventListener("resize", readHeroOffset);
      cleanupFns.push(() => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", readHeroOffset);
        window.removeEventListener("resize", readHeroOffset);
      });

      /* ── the frame ── */
      const REPULSE = 72;
      const frame = () => {
        if (!state.running) return;
        state.time += gsap.ticker.deltaRatio(60) / 60;
        const t = state.time;
        ctx.clearRect(0, 0, heroRect.width, heroRect.height);

        let lastBucket = -1;
        for (const p of parts) {
          const alpha = p.word
            ? state.intro < 1
              ? 1
              : state.wordAlpha
            : state.intro < 1
            ? 1
            : p.ambient
            ? state.ambientAlpha
            : state.restAlpha;
          if (alpha <= 0.01) continue;

          /* home position: a slow ambient drift while scattered, then the
             convergence takes over; dissolve sends the word particles
             wandering upward like smoke */
          const ip = easeOutExpo(Math.max(0, Math.min(1, (state.intro - p.t0) / (1 - p.t0 + 0.0001))));
          const pre = 1 - ip; // cinematic pre-drift, fades as convergence wins
          let hx =
            p.sx + (p.tx - p.sx) * ip + (Math.sin(t * 0.5 + p.drift) * 16 + Math.sin(t * 0.23 + p.drift * 2.1) * 10) * pre;
          let hy =
            p.sy + (p.ty - p.sy) * ip + (Math.cos(t * 0.42 + p.drift * 1.6) * 14 + Math.sin(t * 0.31 + p.drift) * 8) * pre;
          if (p.ambient && state.intro >= 1 && state.ambientAlpha > 0.01) {
            /* the survivors: slow orbital wander in the flanks */
            hx = p.ax + Math.sin(t * 0.32 + p.drift) * 18 + Math.sin(t * 0.13 + p.drift * 2.4) * 10;
            hy = p.ay + Math.cos(t * 0.27 + p.drift * 1.7) * 16 + Math.cos(t * 0.11 + p.drift) * 9;
          }
          if (p.word && state.dissolve > 0) {
            const d = state.dissolve;
            const wander = Math.sin(t * 1.7 + p.drift) * 26 + Math.sin(t * 0.9 + p.drift * 2.3) * 18;
            hx = p.tx + wander * d + (p.drift - Math.PI) * 14 * d;
            hy = p.ty - d * (46 + ((p.drift * 37) % 40)) + Math.cos(t * 1.3 + p.drift) * 12 * d;
          }

          /* spring toward home + cursor repulsion */
          p.vx += (hx - p.x) * 0.085;
          p.vy += (hy - p.y) * 0.085;
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dd = dx * dx + dy * dy;
            if (dd < REPULSE * REPULSE && dd > 0.01) {
              const f = (1 - Math.sqrt(dd) / REPULSE) * 3.4;
              p.vx += (dx / Math.sqrt(dd)) * f;
              p.vy += (dy / Math.sqrt(dd)) * f;
            }
          }
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;

          if (p.bucket !== lastBucket) {
            ctx.fillStyle = BUCKETS[p.bucket];
            lastBucket = p.bucket;
          }
          const fade = (p.word && state.dissolve > 0 ? alpha * (1 - state.dissolve * 0.55) : alpha) * state.masterAlpha;
          ctx.globalAlpha = fade;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;
      };
      gsap.ticker.add(frame);
      cleanupFns.push(() => gsap.ticker.remove(frame));

      /* pause offscreen / hidden tab */
      const io = new IntersectionObserver(([e]) => {
        state.running = e.isIntersecting && !document.hidden;
      });
      io.observe(hero);
      const onVis = () => {
        state.running = !document.hidden;
      };
      document.addEventListener("visibilitychange", onVis);
      cleanupFns.push(() => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
      });

      /* ── choreography (cinematic: emerge → drift → converge → land) ── */
      const tl = gsap.timeline();
      tl.to(state, { masterAlpha: 1, duration: 0.9, ease: "power1.inOut" }, 0) // emerge from black
        .to(state, { intro: 1, duration: 3.3, ease: "none" }, 0.15) // per-particle easing handles the feel
        .add(() => {
          assembledCb.current(); // real text fades in over the particles
        }, "-=0.4")
        .to(state, { restAlpha: 0, duration: 0.9, ease: "power2.out" }, "-=0.1")
        .to(state, { ambientAlpha: 0.55, duration: 1.8, ease: "power1.inOut" }, "-=0.4");


      /* the forgetting loop — runs after assembly, forever, silently */
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 5.4, delay: 4.2, paused: true });
      loop
        .add(() => {
          state.wordAlpha = 1;
          gsap.set(wordEl, { opacity: 0 }); // canvas takes over the word
        })
        .to(state, { dissolve: 1, duration: 1.9, ease: "power2.in" })
        .to(state, { dissolve: 0, duration: 2.0, ease: "expo.inOut" }, "+=1.1")
        .add(() => {
          state.wordAlpha = 0;
          gsap.to(wordEl, { opacity: 1, duration: 0.25, ease: "power1.out" }); // DOM word returns
        });
      tl.add(() => loop.play());
      cleanupFns.push(() => {
        tl.kill();
        loop.kill();
        gsap.set(wordEl, { opacity: 1 });
      });
    };

    setup();

    /* resize: re-run the whole setup (debounced) — targets depend on layout */
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        cleanupFns.forEach((f) => f());
        cleanupFns = [];
        setup();
      }, 280);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      cleanupFns.forEach((f) => f());
    };
  }, [heroRef, h1Ref, wordRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}
    />
  );
}
