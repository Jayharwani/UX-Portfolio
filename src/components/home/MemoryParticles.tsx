import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getPerfTier } from "./perfTier";

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
  /* second-state target; word particles only */
  bx: number;
  by: number;
  /* per-particle window into the morph, so A disperses while B converges */
  mp: number;
  ax: number;
  ay: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function MemoryParticles({
  stateB,
  heroRef,
  h1Ref,
  wordRef,
  onAssembled,
}: {
  /** The alternate headline tail. The em morphs between whatever the DOM holds
   *  and this, sampled once at setup. Omit it and the morph is skipped. */
  stateB?: string;
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
    /* holds the dissolve timeline so the visibility observer can pause it */
    const loopRef: { current: gsap.core.Timeline | null } = { current: null };

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

      const t0 = performance.now();
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
      /* Honour the shared device tier as well as the local heuristics. Without
         this, a machine the frame-time watchdog downgraded — the eight-thread
         laptop on weak integrated graphics, exactly the case the tier exists
         for — would still take the full desktop particle budget here. */
      const lowPower =
        getPerfTier() === "lite" || coarse || cores <= 6 || memGB <= 4 || window.innerWidth < 900;
      /* Budget the BACKING STORE, not the DPR.
         Capping devicePixelRatio is the standard advice and it is incomplete,
         because it ignores viewport size entirely. The same 1.5x cap produces
         0.66M pixels on a phone and 3.62M on a 1664px desktop window — measured,
         not estimated — and roughly 14M on a 27" display at DPR 2. That is a
         20x spread from a number that looks bounded.

         The bisect settled it: ?perf=noLenis moved p95 from 33.0ms to 33.7ms
         (nothing), while ?perf=noParticles moved it to 17.1ms. The canvas is
         the cost, and with the simulation at ~1,384 particles of spring maths
         the cost is fill rate, not CPU. So bound the absolute pixel count and
         let the compositor upscale; the number then stays flat across every
         display instead of scaling with it. */
      const cssW = Math.max(1, heroRect.width);
      const cssH = Math.max(1, heroRect.height);
      const MAX_BACKING_PX = lowPower ? 1_200_000 : 2_200_000;
      const deviceDpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
      const fit = Math.sqrt(MAX_BACKING_PX / (cssW * cssH));
      /* Floor at 1.0: the usual advice floors lower on the grounds that
         particles are soft radial blobs that upscale invisibly. These are
         1.6-2.4px hard-edged fillRects, so going sub-native would be visible.
         Trading a little of the saving for not degrading the thing on screen. */
      const dpr = Math.max(1, Math.min(deviceDpr, fit));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
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
      /* The sampling canvas runs at half scale. Its only job is to tell us
         WHERE the glyph pixels are, and half resolution locates them just as
         well — but getImageData copies a quarter of the bytes and the scan
         below walks a quarter of the pixels. Two full-size getImageData calls
         (one for the text, one for the word) on a wide hero was several
         megabytes of synchronous copying during page load, which is a
         meaningful part of why the intro hitched on arrival. */
      const SS = 0.5;
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.round(heroRect.width * SS));
      off.height = Math.max(1, Math.round(heroRect.height * SS));
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      const drawRuns = (only?: "word" | "rest") => {
        octx.setTransform(1, 0, 0, 1, 0, 0);
        octx.clearRect(0, 0, off.width, off.height);
        octx.scale(SS, SS); // draw in hero coordinates onto the half-scale sheet
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
      /* stride in SAMPLE-SHEET pixels; halved with the sheet so the effective
         density in hero pixels is unchanged from before */
      const step = Math.max(1, Math.round((lowPower ? 6 : area > 700_000 ? 3 : 4) * SS));

      const sample = (only: "word" | "rest"): { x: number; y: number }[] => {
        drawRuns(only);
        const img = octx.getImageData(0, 0, off.width, off.height).data;
        const pts: { x: number; y: number }[] = [];
        const jitter = step / SS;
        for (let y = 0; y < off.height; y += step) {
          for (let x = 0; x < off.width; x += step) {
            if (img[(y * off.width + x) * 4 + 3] > 140) {
              /* back into hero coordinates */
              pts.push({
                x: x / SS + (Math.random() - 0.5) * jitter,
                y: y / SS + (Math.random() - 0.5) * jitter,
              });
            }
          }
        }
        return pts;
      };

      const restPtsRaw = sample("rest");
      const wordPtsRaw = sample("word");

      /* ── the second headline state ──────────────────────────────────────
         Sample the SAME em element a second time with the other tail in it.
         Swapping the text changes the run's width, so the run has to be
         re-measured rather than reused: the tail is right-of-centre in a
         left-ranged headline, and a stale width would land every B particle
         off by the delta.

         One layout flush, once, at setup. The DOM is restored immediately, so
         nothing outside this block ever observes state B in the document. */
      const wordRunIndex = runs.findIndex((r) => r.isWord);
      let wordPtsBRaw: { x: number; y: number }[] = [];
      if (wordRunIndex >= 0 && stateB) {
        const wr = runs[wordRunIndex];
        const originalText = wordEl.textContent ?? "";
        wordEl.textContent = stateB;
        void wordEl.offsetWidth; // force the reflow before measuring
        const rb = wordEl.getBoundingClientRect();
        const savedText = wr.text;
        const savedX = wr.x;
        const savedY = wr.y;
        wr.text = stateB;
        wr.x = rb.left - heroRect.left;
        wr.y = rb.top - heroRect.top;
        wordPtsBRaw = sample("word");
        wr.text = savedText;
        wr.x = savedX;
        wr.y = savedY;
        wordEl.textContent = originalText;
      }

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
      /* Down from 4200/1800. With the state-change batching above, the cost is
         now dominated by the per-particle spring maths and one fillRect each,
         and 2400 still reads as dense type — the real headline crossfades in
         over the top of it anyway, so the particles never have to carry the
         legibility. This is the last big lever on the intro and it was still
         set too high. */
      const MAX_PARTS = lowPower ? 1100 : 2400;
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
          bx: pt.x,
          by: pt.y,
          mp: Math.random() * 0.4,
          ax: 0,
          ay: 0,
        };
      };
      /* Word particles carry a target in BOTH states. The two phrases sample to
         different counts ("out of the way." is longer than "shipped."), so B
         targets are assigned by cycling rather than by index. Cycling keeps
         every particle addressed in both states — no particle is left without
         a home and needing to be faded out — at the cost of the shorter phrase
         being slightly denser, which reads as emphasis rather than as error. */
      const wordPtsB = wordPtsBRaw.length ? thin(wordPtsBRaw, wordKeep) : [];
      const parts: P[] = [
        ...restPts.map((p) => mk(p, false)),
        ...wordPts.map((p, i) => {
          const q = mk(p, true);
          if (wordPtsB.length) {
            const b = wordPtsB[i % wordPtsB.length];
            q.bx = b.x;
            q.by = b.y;
          }
          return q;
        }),
      ];
      const canMorph = wordPtsB.length > 0;

      /* Setup runs synchronously on the main thread during page load, so its
         cost is felt directly as the intro "hitching" on arrival. Surfaced in
         dev so it can be checked rather than guessed at. */
      if (import.meta.env.DEV) {
        (window as unknown as Record<string, unknown>).__heroStats = {
          particles: parts.length,
          setupMs: +(performance.now() - t0).toFixed(1),
          sampleSheet: `${off.width}x${off.height}`,
          canvas: `${canvas.width}x${canvas.height}`,
          lowPower,
        };
      }
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
      /* Render order: category first, then colour bucket. The frame loop only
         writes globalAlpha when the category changes and fillStyle when the
         bucket changes, so grouping here is what turns thousands of canvas
         state changes per frame into about a dozen. */
      const catOf = (p: P) => (p.word ? 2 : p.ambient ? 1 : 0);
      parts.sort((a, b) => catOf(a) - catOf(b) || a.bucket - b.bucket);

      /* ── animation state ── */
      const state = {
        intro: 0, // 0 scattered → 1 assembled
        /* 0 = state A, 1 = state B. Word particles interpolate between their
           two sampled targets along a bowed path, each on its own staggered
           window, so the phrase never slides as a block. */
        morph: 0,
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
      let tickParity = 0;
      const frame = () => {
        if (!state.running) return;

        /* Full rate for the intro, half rate once it has resolved.

           The intro is choreographed and has to be smooth. What follows it is a
           sparse constellation of slowly drifting blobs, and nobody perceives
           30fps on those — but the clearRect underneath them is the FULL
           surface every frame regardless of how few particles remain, which is
           the single most expensive operation in this loop. Skipping alternate
           ticks in the settled state halves it.

           This is where the scroll cost lives, incidentally: scrolling past the
           hero happens long after the intro, so the settled state is the one
           being paid for during the reported jank, not the cinematic one. */
        if (state.intro >= 1 && state.dissolve <= 0.01 && (tickParity ^= 1)) return;

        state.time += gsap.ticker.deltaRatio(60) / 60;
        const t = state.time;
        ctx.clearRect(0, 0, heroRect.width, heroRect.height);

        /* PERF: alpha only ever takes three values in a given frame — one for
           word particles, one for ambient survivors, one for the rest — but it
           used to be recomputed and written to ctx.globalAlpha once PER
           PARTICLE. That is up to 4,200 canvas state changes a frame, and it
           defeated the fillStyle bucketing directly below it, since every
           particle reconfigured the rasterizer anyway.

           Compute the three up front, and because `parts` is sorted by
           (category, bucket) at setup, only touch globalAlpha/fillStyle when
           crossing a group boundary — roughly a dozen state changes a frame
           instead of thousands. Pixel-for-pixel identical output. */
        const introing = state.intro < 1;
        const aWord = introing ? 1 : state.wordAlpha;
        const aAmbient = introing ? 1 : state.ambientAlpha;
        const aRest = introing ? 1 : state.restAlpha;
        const dissolveMul = state.dissolve > 0 ? 1 - state.dissolve * 0.55 : 1;

        let lastBucket = -1;
        let lastCat = -1;
        for (const p of parts) {
          const cat = p.word ? 2 : p.ambient ? 1 : 0;
          const alpha = cat === 2 ? aWord : cat === 1 ? aAmbient : aRest;
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
          if (p.word && state.morph > 0) {
            /* A → B along a bowed path, on a per-particle window.

               Each particle owns [mp, mp + 0.6] out of the 0..1 morph. Because
               mp is spread across 0..0.4, particles that have already left
               state A are still in flight while later ones have not started,
               which is what produces the required overlap: peak dispersion of A
               happens after convergence of B has begun. A straight lerp across
               all particles at once would read as the phrase sliding sideways.

               The perpendicular bow peaks mid-window and returns to zero, so
               every particle arrives exactly on its B target with no drift. */
            const local = Math.max(0, Math.min(1, (state.morph - p.mp) / 0.6));
            const e = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
            const dx = p.bx - p.tx;
            const dy = p.by - p.ty;
            const bow = Math.sin(local * Math.PI); // 0 → 1 → 0
            const len = Math.hypot(dx, dy) || 1;
            /* perpendicular to the travel, signed per particle so the cloud
               splits rather than arcing as one body */
            const px = (-dy / len) * bow * (18 + ((p.drift * 23) % 26)) * (p.drift > Math.PI ? 1 : -1);
            const py = (dx / len) * bow * (12 + ((p.drift * 17) % 18)) * (p.drift > Math.PI ? 1 : -1);
            hx = p.tx + dx * e + px + Math.sin(t * 1.7 + p.drift) * 5 * bow;
            hy = p.ty + dy * e + py + Math.cos(t * 1.3 + p.drift) * 5 * bow;
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

          if (cat !== lastCat) {
            ctx.globalAlpha = (cat === 2 ? alpha * dissolveMul : alpha) * state.masterAlpha;
            lastCat = cat;
            lastBucket = -1; // force a fillStyle write at the start of each group
          }
          if (p.bucket !== lastBucket) {
            ctx.fillStyle = BUCKETS[p.bucket];
            lastBucket = p.bucket;
          }
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;
      };
      gsap.ticker.add(frame);
      cleanupFns.push(() => gsap.ticker.remove(frame));

      /* Pause offscreen / hidden tab.
         `state.running` stops the canvas work, but the dissolve timeline below
         is repeat:-1 and kept ticking regardless — which held gsap.ticker open
         for the life of the page even once the hero was long gone. Pause the
         timeline itself here too, so scrolling away actually costs nothing. */
      const setRunning = (on: boolean) => {
        state.running = on;
        const t = loopRef.current;
        if (!t) return;
        if (on) t.resume();
        else t.pause();
      };
      const io = new IntersectionObserver(([e]) => {
        setRunning(e.isIntersecting && !document.hidden);
      });
      io.observe(hero);
      const onVis = () => {
        setRunning(!document.hidden);
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


      /* the forgetting loop — runs after assembly, forever, silently.
         loopRef lets the visibility observer above pause it when the hero
         leaves the screen; without that it ticked for the life of the page. */
      /* ── the morph loop ─────────────────────────────────────────────────
         The old loop dissolved the tail and rebuilt the same words, which
         spent a third of its cycle showing an unfinished sentence for no
         gain. This travels between two complete sentences instead.

         The DOM text is swapped at the midpoint, while the real em is faded
         out and the particles are carrying the phrase. So the document holds
         exactly one of the two sentences at all times and never a fragment —
         which is what makes the textContent assertion in the test possible.

         Skipped entirely when there is no second state to travel to. */
      if (canMorph) {
        const tailA = wordEl.textContent ?? "";
        const tailB = stateB as string;
        let atB = false;

        const loop = gsap.timeline({
          repeat: -1,
          /* §3.3: static and readable the overwhelming majority of the time.
             At 8s + 1.2s of travel the headline is still for ~87% of its
             cycle, which is the difference between a detail and a distraction. */
          repeatDelay: 8,
          delay: 4.2,
          paused: true,
        });
        loopRef.current = loop;
        loop
          .add(() => {
            state.wordAlpha = 1;
            gsap.set(wordEl, { opacity: 0 }); // canvas takes the phrase
          })
          /* §3.2: ≤1.4s. Longer and it stops reading as a change of mind and
             starts reading as a loading state. */
          .to(state, { morph: 1, duration: 1.2, ease: "power2.inOut" })
          .add(() => {
            /* atomic swap at the far end, still invisible */
            atB = !atB;
            wordEl.textContent = atB ? tailB : tailA;
            /* the particles' A and B targets swap roles with the DOM, so the
               next run travels back the other way rather than teleporting */
            for (const p of parts) {
              if (!p.word) continue;
              const sx2 = p.tx;
              const sy2 = p.ty;
              p.tx = p.bx;
              p.ty = p.by;
              p.bx = sx2;
              p.by = sy2;
            }
            state.morph = 0;
            state.wordAlpha = 0;
            gsap.to(wordEl, { opacity: 1, duration: 0.28, ease: "power1.out" });
          });
        tl.add(() => loop.play());
        cleanupFns.push(() => {
          loop.kill();
          /* §3.6: leave the DOM on a complete sentence, never mid-travel */
          wordEl.textContent = atB ? tailB : tailA;
          state.morph = 0;
        });
      }
      cleanupFns.push(() => {
        tl.kill();
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
