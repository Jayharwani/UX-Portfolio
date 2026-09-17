# Build plan

Work top to bottom. Each step has an acceptance check — do not move on until it
passes. Compare against `reference/index.html` at every step.

## 0 · Setup
- [ ] `npm create vite@latest . -- --template react-ts` (or use the existing app)
- [ ] Copy `src/lib/field.ts` and `src/data/projects.ts` into place as-is
- [ ] Add the Geist + Geist Mono link tag to `index.html`
- [ ] Port the tokens and base styles from the reference into `src/index.css`
- **Check:** page renders on `--void` with Geist applied, no FOUT flash

## 1 · Canvas field
- [ ] `<Field />` mounts a full-viewport fixed canvas at z-index 0
- [ ] Call `createField(canvas)` in `useEffect`; call its `destroy()` on cleanup
- [ ] Wire `setAccent([r,g,b])` so other components can re-tint the lights
- **Check:** lattice rotates with the mouse; scrolling dollies the camera;
  fast scroll streaks the points; `document.hidden` stops the loop (confirm in
  the Performance panel); reduced motion paints one static frame

## 2 · Title sequence
- [ ] `<TitleSequence />` renders two bars and the hairline, removes itself
      after 2.7s
- [ ] Runs once per page load, not per route change
- **Check:** timings match SPEC §4; reduced motion skips it entirely

## 3 · Hero
- [ ] Two-line masked headline, byline, hemline
- [ ] Exit transform driven by the smoothed scroll value from the field
- **Check:** headline fully gone by one viewport of scroll; no layout shift

## 4 · Rail
- [ ] Four markers, IntersectionObserver per section at threshold 0.35
- [ ] Sets `--accent` and calls `setAccent()` on section change
- **Check:** hidden below 900px and under reduced motion; keyboard reachable

## 5 · Route
- [ ] SVG arc + dot grid + two pins + counter
- [ ] One rAF loop drives dash offset, light position, and counter together
- [ ] Light uses `backdrop-filter: brightness(2.6)` over the grid
- **Check:** counter lands on 12,382 exactly as the light reaches Baltimore;
  fires once, on entry, never on re-scroll

## 6 · Work
- [ ] Index rows + sticky preview above 1000px, stacked mockups below
- [ ] Hover activates: accent swap, glow bar, dim siblings, magnetic indent
- [ ] Mockup animations **replay** on each activation (re-inject markup)
- [ ] Links to `/headroom`, `/signal`, `/chronoweave`, `/bumper`
- **Check:** ChronoWeave's clock actually counts down; Headroom counts to 412;
  no animation left running when a panel is hidden

## 7 · Contact
- [ ] Letter-split roll on hover, dual arrows, mono address reveal, underline wipe
- [ ] Magnetic pull on both links
- [ ] Credits block. No GitHub.
- **Check:** splitting runs once, not on every render; screen readers read the
  word once (the duplicate is `aria-hidden`)

## 8 · Pass
- [ ] Test at 320 / 375 / 768 / 1280 / 1920
- [ ] No horizontal scroll at any width (`overflow-x: clip` on html and body)
- [ ] Tab through the whole page; focus ring visible on every stop
- [ ] Lighthouse: performance ≥ 90, accessibility ≥ 95
- [ ] Reduced motion: page is fully readable and static
- [ ] Zero console output
