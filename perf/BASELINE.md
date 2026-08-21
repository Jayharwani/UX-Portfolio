# Hero performance — bisect

**Status:** harness built, awaiting measurement.

The previous five passes each fixed something real and the jank survived all of
them, because every fix was applied speculatively. This is the correction: one
subsystem disabled at a time, one number recorded per run, and the largest
delta wins.

---

## Why this list and not particle count

The symptom is **desktop-only**. So the cause has to be something that differs
between desktop and mobile in this build. There are five such things, and they
are not equally sized:

| Variable | Mobile | Desktop (full tier) | Ratio |
|---|---|---|---|
| Lenis smooth scroll | not running | running, own rAF loop | ∞ |
| matter-js blocks | not running | running, own rAF loop | ∞ |
| Canvas backing store | ~0.6 M px | 6–14 M px | 10–20× |
| DPR cap | 1.5 | 2.0 | 1.8× |
| Particle count | 650 | 1,384 | 2.1× |

Particle count is the **smallest** difference on that list and it is the one
that has been tuned three times. The first three rows are where the money is.

---

## How to run it

Production build, real desktop display, **no CPU throttling** — this is a
desktop-only bug and throttling will mislead you.

```bash
npm run build && npx vite preview
```

For each row: load the URL, DevTools → Performance → record **10 s of
continuous scroll from hero to footer**, then read p95 frame time from the
frames track. Do the same for a second pass covering **page load through intro
completion**.

`?full=1` pins the full tier so the device watchdog cannot quietly downgrade
mid-recording and corrupt the comparison. Keep it on every row.

| Run | URL | p95 scroll | p95 intro | Δ vs baseline |
|---|---|---|---|---|
| baseline | `/?full=1` | | | — |
| no Lenis | `/?full=1&perf=noLenis` | | | |
| no matter-js | `/?full=1&perf=noMatter` | | | |
| no particles | `/?full=1&perf=noParticles` | | | |
| no dioramas | `/?full=1&perf=noDiorama` | | | |
| no scroll transforms | `/?full=1&perf=noMotion` | | | |
| no headline blur | `/?full=1&perf=noBlur` | | | |
| Lenis + matter off | `/?full=1&perf=noLenis,noMatter` | | | |

Flags compose with commas. The console prints the active set on load, so a
recording can never be mislabelled.

---

## Also record

```
Canvas backing store (DevTools → Layers)   ____ × ____ = ____ M px
Total composited layer memory              ____ MB
Longest single main-thread task            ____ ms
Forced synchronous layouts (purple warns)  ____
Time in GPU track vs main thread           ____ / ____
```

## The one distinction that decides everything

- **Main thread saturated, GPU idle** → it is scheduling and layout. Four
  uncoordinated rAF drivers (gsap.ticker, Lenis, matter-js, Framer Motion)
  contending for one frame. Fix by collapsing them onto `gsap.ticker` with
  `lenis.raf` driven from it and `autoRaf: false`.
- **GPU track saturated, main thread has gaps** → it is fill rate. Budget the
  canvas by absolute backing-store pixels rather than DPR, because a DPR cap
  ignores viewport size entirely — a 2560 px-wide hero at DPR 2 is not
  comparable to a 390 px-wide one at the same cap.

Do not start fixing until this split is known.

---

## Verified before measuring

Some commonly-cited culprits are already clean here, so don't spend time on
them:

| Checked | Result |
|---|---|
| `ctx.shadowBlur` / `ctx.filter` in render loop | 0 occurrences |
| `Matter.Runner.run()` | not used — already `Engine.update` in rAF |
| `willReadFrequently` on the sampling context | already set |
| `whileInView` missing `once: true` | 0 of 42 |
| `layout` / `layoutId` props near the hero | none |
| Per-particle `arc()` / `createRadialGradient()` | none — particles are 1.6–2.4 px `fillRect` |

That last row matters for what comes next: a pre-rendered sprite atlas is the
standard advice for particle canvases, but it assumes per-particle gradients.
Swapping a 2 px `fillRect` for a `drawImage` would likely be *slower*, not
faster. Confirm with a measurement before reaching for it.

Confirmed present and worth suspecting:

- Animated `filter: blur(12px → 0)` **and** animated `textShadow` on the `<h1>`,
  firing at exactly the moment the intro is reported to stutter → `?perf=noBlur`
- Four independent rAF drivers on desktop → `?perf=noLenis`, `?perf=noMatter`
- Backing store scales with display size, uncapped in absolute terms

---

## Delete this harness

`src/lib/perfFlags.ts` and its call sites are temporary. Remove them once the
culprit is identified and fixed.
