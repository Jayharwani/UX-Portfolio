import { useEffect, useRef } from "react";

/* --------------------------------------------------------------------------
   THE FUNNEL — Friction's signature, and the page's opening shot.

   Friction's claim is a ratio: ten thousand public reviews go in every week
   and about a hundred come out, and the narrowing happens in TypeScript
   before any model is allowed to look. A page can assert that in a sentence,
   or it can run the sieve in front of the reader in six seconds.

   So: 9,994 points, one per review read in the last scan, thinning through
   the screens the site publishes until 150 remain and settle into a single
   line of sediment. The headline sits on top of it the whole time and is
   never obscured — the cloud is low-contrast and the band lands below the
   reading column.

   WHAT IS A CLAIM AND WHAT IS PACING. Two numbers here are facts taken from
   the live site: 9,994 read in the last scan, and a cap of 150 on what
   reaches a model. The order of the screens is also published. The share
   each individual screen removes is NOT published, so the intermediate
   fractions below are animation timing and nothing on screen ever reports
   one as a result. That is why the readout counts no digits between its two
   ends — it lights the screens as they pass and leaves the arithmetic to the
   dots, which is the honest version of this shot.

   Canvas rather than DOM because ten thousand nodes is not a layout problem.
   DPR capped at 2, the loop stops on document.hidden, and under reduced
   motion the final frame is drawn once and never animated.
   -------------------------------------------------------------------------- */

/** reviews read in the last scan — friction's own footer */
const TOTAL = 9994;
/** the cap on what reaches a model — friction's "how it works" */
const KEPT = 150;

/** the screens, in the published order, with the timing each is given */
const STAGES = [
  { label: "age", keep: 0.6, at: 0.1 },
  { label: "length", keep: 0.33, at: 0.26 },
  { label: "crisis check", keep: 0.25, at: 0.42 },
  { label: "complaint", keep: 0.055, at: 0.58 },
  { label: "cap 150", keep: KEPT / TOTAL, at: 0.74 },
];

const DUR = 6400;
const BAND_FROM = 0.84;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (n: number) => n * n * (3 - 2 * n);

/** where each screen finishes lighting in the readout */
const lightAt = (i: number) => (i + 1 < STAGES.length ? STAGES[i + 1].at : 0.97) - 0.03;

/**
 * The surviving share at timeline position t.
 *
 * `keep` is the share left once that screen has finished, so each segment
 * runs from the previous screen's value to this one's — reading it as the
 * value at `at` instead puts a hard step at the first screen, which looks
 * like a dropped frame rather than a sieve.
 */
function keepAt(t: number) {
  let before = 1;
  for (let i = 0; i < STAGES.length; i++) {
    const s = STAGES[i];
    const end = i + 1 < STAGES.length ? STAGES[i + 1].at : 1;
    if (t < s.at) return before;
    if (t < end) {
      /* a hold at each end of the segment, so the screens read as five
         discrete passes rather than one continuous bleed */
      const k = clamp01(((t - s.at) / (end - s.at) - 0.06) / 0.62);
      return before + (s.keep - before) * smooth(k);
    }
    before = s.keep;
  }
  return before;
}

type P = {
  x: number;
  y: number;
  z: number;
  /** stable shuffled position, 0..TOTAL-1; survives while rank < keep*TOTAL */
  rank: number;
  /** -1 until culled, then the timeline position at which it was */
  dead: number;
  /** slot in the final band, for the 150 that make it */
  band: number;
};

export function Funnel() {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const box = host.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── the cloud ── */
    const order = new Int32Array(TOTAL);
    for (let i = 0; i < TOTAL; i++) order[i] = i;
    for (let i = TOTAL - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = order[i];
      order[i] = order[j];
      order[j] = t;
    }

    const ps: P[] = new Array(TOTAL);
    let band = 0;
    for (let i = 0; i < TOTAL; i++) {
      /* cube root keeps the ball uniformly filled instead of dense at the
         centre, which is what makes it read as a volume rather than a blob */
      const r = Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const rank = order[i];
      ps[i] = {
        x: r * Math.sin(ph) * Math.cos(th),
        y: r * Math.sin(ph) * Math.sin(th) * 0.74,
        z: r * Math.cos(ph),
        rank,
        dead: -1,
        band: rank < KEPT ? band++ : -1,
      };
    }

    let W = 0;
    let H = 0;
    let dpr = 1;
    const size = () => {
      const r = box.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      const keep = keepAt(t);
      const live = keep * TOTAL;
      const cx = W * 0.5;
      const cy = H * 0.46;
      /* the cloud tightens as it thins, so the narrowing is legible as shape
         and not only as density */
      const spread = Math.min(W, H * 1.5) * 0.42 * (0.26 + 0.74 * Math.sqrt(keep));
      const depth = spread * 1.15;
      const focal = 620;
      const rot = t * DUR * 0.00012;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      const toBand = smooth(clamp01((t - BAND_FROM) / (1 - BAND_FROM)));
      const bandY = H * 0.78;
      const bandPad = Math.min(W * 0.14, 120);
      const bandW = Math.max(60, W - bandPad * 2);

      /* one pass to settle who died when, then two draw passes — flipping
         fillStyle ten thousand times a frame is the only way to make this
         expensive, and grouping by state avoids it entirely */
      for (let i = 0; i < TOTAL; i++) {
        const p = ps[i];
        if (p.rank >= live) {
          if (p.dead < 0) p.dead = t;
        } else if (p.dead >= 0 && p.rank < live) {
          p.dead = -1;
        }
      }

      const paint = (dying: boolean) => {
        for (let i = 0; i < TOTAL; i++) {
          const p = ps[i];
          const isDead = p.dead >= 0;
          if (isDead !== dying) continue;

          let age = 0;
          if (isDead) {
            age = (t - p.dead) / 0.085;
            if (age >= 1) continue;
          }

          const rx = p.x * cosR - p.z * sinR;
          const rz = p.x * sinR + p.z * cosR;
          /* culled points drift outward as they go, so the sieve looks like
             something being thrown away rather than switched off */
          const push = isDead ? 1 + age * 0.55 : 1;
          const s = focal / (focal + rz * depth + depth * 0.9);

          let px = cx + rx * spread * push * s;
          let py = cy + p.y * spread * push * s;

          if (!isDead && toBand > 0 && p.band >= 0) {
            const bx = bandPad + (p.band / (KEPT - 1)) * bandW;
            const by = bandY + Math.sin(p.band * 1.87) * 7;
            px += (bx - px) * toBand;
            py += (by - py) * toBand;
          }

          if (px < -8 || px > W + 8 || py < -8 || py > H + 8) continue;

          const d = 0.62 + s * 0.95;
          const sz = isDead ? d * (1 - age) : d;
          if (sz <= 0.05) continue;
          ctx.fillRect(px, py, sz, sz);
        }
      };

      /* the mass is the cool slate the rest of the site is lit with; what
         survives warms toward the accent as the field empties */
      const warm = smooth(clamp01((t - 0.5) / 0.42));
      const r = Math.round(138 + (63 - 138) * warm);
      const g = Math.round(166 + (185 - 166) * warm);
      const b = Math.round(200 + (166 - 200) * warm);

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "rgb(138,166,200)";
      paint(true);

      ctx.globalAlpha = 0.34 + warm * 0.5;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      paint(false);
      ctx.globalAlpha = 1;
    };

    /**
     * Mark everything the sieve removed as long gone.
     *
     * A culled point fades out over the frames after its death, which works
     * while the loop is running and fails completely for a single settled
     * frame: it is recorded as having died at that instant, so it draws at
     * full size and the hero shows all 9,994 points instead of the 150 that
     * survived. That is the entire shot lost — and lost specifically for
     * readers who asked for less motion, who then get the one frame that
     * carries no information.
     */
    const settle = () => {
      for (let i = 0; i < TOTAL; i++) {
        const p = ps[i];
        if (p.rank >= KEPT) p.dead = 0;
      }
    };

    /* ── the readout ── */
    let step = -1;
    const setStep = (t: number) => {
      let n = 0;
      for (let i = 0; i < STAGES.length; i++) if (t >= lightAt(i)) n++;
      if (n === step) return;
      step = n;
      strip.current?.setAttribute("data-step", String(n));
    };

    if (reduced) {
      settle();
      draw(1);
      setStep(1);
      const ro = new ResizeObserver(() => {
        size();
        draw(1);
      });
      ro.observe(box);
      return () => ro.disconnect();
    }

    /* ── the loop ──
       Elapsed accumulates per frame rather than being read off the clock, so
       a tab hidden mid-sequence resumes where it stopped instead of jumping
       to the end. dt is clamped for the same reason. */
    let raf = 0;
    let elapsed = 0;
    let prev = 0;
    let done = false;

    const frame = (now: number) => {
      raf = 0;
      const dt = prev ? Math.min(64, now - prev) : 16;
      prev = now;
      elapsed += dt;
      const t = clamp01(elapsed / DUR);
      draw(t);
      setStep(t);
      if (t >= 1) {
        /* redraw settled, so the last points culled are gone rather than
           frozen part-way through their fade on the frame the loop stops */
        settle();
        draw(1);
        done = true;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) {
        /* cancel before dropping the handle, or the pending callback
           resurrects a second loop on resume and the sequence runs double */
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        prev = 0;
        return;
      }
      if (done || raf) return;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => {
      size();
      draw(clamp01(elapsed / DUR));
    });
    ro.observe(box);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
    };
  }, []);

  return (
    /* The canvas is decoration and is hidden; the readout is not — it carries
       the two numbers the shot exists to deliver, so it stays in the tree and
       reads in order as a sentence. */
    <div className="fr-funnel" ref={host}>
      <canvas ref={cv} aria-hidden="true" />
      <div className="fr-strip" ref={strip} data-step="0">
        <span className="fr-end mono">
          <b>9,994</b> read this scan
        </span>
        <ol className="mono">
          {STAGES.map((s) => (
            <li key={s.label}>{s.label}</li>
          ))}
        </ol>
        <span className="fr-end out mono">
          <b>150</b> to the model
        </span>
      </div>
    </div>
  );
}
