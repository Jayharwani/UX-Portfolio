# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything.

## What this is

Jay Harwani's portfolio homepage (jayharwani.com). A single dark, cinematic
page: a letterbox title sequence, a live 3D canvas background, a migration
route graphic, a work index with animated project previews, and a contact
section.

There are **four projects**, in this order: Healthy Switch, Friction,
Headroom, Bumper. Signal was removed in November 2026 and is not coming back:
there is no `/signal` route, no chapter, no shape and no hero card. Its blue
stayed, for the reason under "Locked palette" below. Healthy Switch is the
only one whose case study is
not a route on this site — it is published with the prototype it describes,
so its chapter opens an absolute URL in a new tab. `isOffsite()` in
`src/data/issues.ts` decides that from the href, not from a flag.

`reference/index.html` is a **working, self-contained implementation** of the
finished design. It is the visual source of truth. When the spec and the
reference disagree, the reference wins. Open it in a browser before you start.

## Where the films live, and why not here

The hero's sixty-second film exists as two cuts — `jay-60.mp4` (1920x1080)
and `jay-60-tall.mp4` (1080x1920, a separate edit for phones held upright) —
and **neither is in this repository**. They are served from
`https://jayharwani.github.io/media/`, which is the `Jayharwani/media` repo
published through GitHub Pages.

**This host cannot serve byte ranges.** Cloudflare Workers static assets
answer a `Range` request with `200` and the whole file, and there is no
`Accept-Ranges` header. A video player needs ranges to seek, so on the site's
own host, dragging the scrubber forward past whatever had buffered never
resolved — measured at every speed from unthrottled down to 3 Mbps — and even
a ten second nudge cost twelve seconds on 4G. Backward seeks into
already-downloaded video were fine. GitHub Pages returns `206 Partial
Content`, so seeking works there.

The posters and the hover preview stay in `public/`: they are tens of
kilobytes, nothing seeks them, and a local poster is on screen while the film
is still opening a connection to the other origin.

**Anything large enough that somebody will scrub it does not belong in
`public/`.** The 25 MiB per-asset cap is the second reason; a file over it
fails the deploy outright.

## Stack

- React + TypeScript + Vite
- Plain CSS (CSS custom properties). **Do not introduce Tailwind, styled-components,
  CSS-in-JS, or a UI kit.**
- **The homepage (Resolve) runs GSAP, Lenis and three.** This replaces an
  earlier "the homepage stays library-free" rule, and the replacement is
  deliberate: one point field that deforms with scroll, sprung rather than
  tweened, is not reachable from CSS keyframes and a 2D canvas. The cost is
  paid in the open: `three` is a separate 113 kB gzip chunk, GSAP is 49 kB,
  and the homepage's own chunk is about 16 kB gzip.
- **Still banned on the homepage:** scroll-jacking,
  ScrollSmoother, and any transform-based smooth-scroll wrapper. Lenis animates
  the real window scroll position and adds no wrapper, which is why `position:
  sticky` and ScrollTrigger pinning still work. The ban was about wrappers.
- **Case studies use `motion` and `lucide-react`**, lazily, through their own
  route chunks. They never reach the homepage bundle. Do not import `motion`
  from homepage code; the homepage animates with GSAP.
- **Dependencies are the eight in `package.json` and no more**, without asking:
  gsap, lenis, lucide-react, motion, react, react-dom, react-router, three.
  `matter-js`, `@react-three/fiber` and `@phosphor-icons/react` were removed
  when the last importer went; do not reintroduce them.
- **Tailwind IS used, by the case studies.** An earlier version of this file
  said it was "installed but unused in `src/`", and that was simply wrong:
  the case studies carry 521 className attributes, 28 of them `flex`. Removing
  it breaks them. The Print Run homepage uses plain CSS only.
- Only external dependency allowed: Geist + Geist Mono from Google Fonts.

## Hard rules

1. **Performance.** Animate only `transform`, `opacity`, `filter`, and canvas.
   Never animate `width`, `height`, `top`, or `left` in a loop.
   Cap canvas DPR at 2. Pause the render loop on `document.hidden`.
   Target 60fps on a 2019 laptop.
2. **No debug code in production.** No `console.log`, no commented-out blocks,
   no `TODO` left in shipped files.
3. **Scroll observation uses IntersectionObserver**, never a `scroll` event
   listener for reveals. Lenis owns scroll on the homepage: the field reads
   `lenis.animatedScroll` through `createField(canvas, { external: true })`
   rather than keeping its own listener and its own lerp. Two smoothing curves
   on one page makes the stars lag the type by a different amount at every
   scroll speed, which reads as the canvas being detached from the page.
4. **Native scroll stays native.** Do not add a transform-based smooth-scroll
   wrapper — it breaks the `position: sticky` preview panel in the work section.
   Smoothness comes from lerping the scroll *value*, not from moving the page.
5. **`prefers-reduced-motion` is not optional.** Every animated element needs a
   collapsed state. The title sequence is skipped entirely under reduced motion.
6. **Locked palette on the homepage.** Seven tokens: `--void`, `--paper` and the
   four project accents and one blue, plus opacity and `color-mix`
   steps of those. No new hue. Colour literals live in exactly two files, `src/styles/resolve.css`
   (the tokens block on `.v2.rs`) and `src/styles/tokens.ts` (the mirror the
   canvas reads); a hex value anywhere else on the homepage is a bug, because
   a second hand-typed copy is a drift waiting to happen. A `#000` inside a
   `mask-image` is a stencil, not a colour, and does not count.

   **The accents are named for projects, not for colours**, and they are four
   hues spaced around the wheel at one perceptual lightness and chroma
   (OKLCH 80% / 0.10): `--accent-friction` `#F7A792` (35°),
   `--accent-bumper` `#E0B771` (80°), `--accent-headroom` `#8ED09C` (150°),
   `--accent-healthy` `#DDA8E4` (323°).
   This replaced `--teal`/`--mint`/`--cyan`/`--gold`, which were accurate names
   and the problem: three of those four sat within about thirty degrees of each
   other, so four deliberate keys read as one colour drifting. Naming them for
   the projects also stops the name going stale when a hue moves.

   **`--link` `#8CC3FC` (250°) is the one colour that is not an accent, and it
   must not become one.** It colours the LinkedIn contact card. The two contact
   cards are the only place on the page allowed to colour themselves rather
   than take the chapter's key, because both are on screen at once, and that
   card has always been this blue. It was Signal's key; when Signal went the
   colour had kept a job and the name had not, so it was renamed for the job
   and moved out of the `Accent` union, which is what stops a chapter ever
   lighting itself with it. `scripts/check-tokens.mjs` checks its two copies
   agree, the same as it does for the accents.

   **A new accent goes in the widest gap, and the gap is measured, not
   eyeballed.** Healthy Switch's own story is red to green and both ends were
   already taken — green is Headroom, the warm end is Friction — so the hue
   could not come from the subject. When it was chosen the other four sat at
   35, 80, 150 and 250, which left one gap of 145° and nothing else wider than
   100°; 323° is its midpoint and was 73° clear of its nearest neighbour. The
   red-to-green arc is carried by the shape instead: the switch is unlit until
   it is thrown. With 250° no longer an accent the widest gap is now the 173°
   between Headroom and Healthy Switch, and a fifth project belongs at 236°.

   All four carry at least 10.3:1 against `--void` (Healthy Switch is the
   lowest at 10.36:1), which is why the floor in this file used to read 10.4.

   Only one of them is ever live. `--chapter-accent` is registered with
   `@property` so it interpolates, the active chapter writes it on the page
   root, and `--accent` is an alias of it, so the chapter number, the buttons,
   the focus ring, the selection, the glow and the canvas all cross-fade
   together. A chapter must not colour itself from its own `data-accent`; the
   contact cards are the one exception, because both are on screen at once.

   Text on void has a floor: `--ink-3` is paper at 55%, which measures 5.66:1.
   Paper at 45% measures 4.07:1 and fails AA, which is what the old 9px and
   10px mono labels were using. Never put paper text on an accent fill. Accent
   fills take `--void` text: all four measure at least 10.4:1 against void.
7. **A case study is themed by its own product, not by the template.**
   `CaseShell` takes `theme="light" | "dark"` and a named accent. Headroom is
   light because the app is a warm off-white with a deep emerald; its accent
   `#0A7A52` is sampled from the running product, not chosen. When adding a
   theme, re-point the existing tokens rather than writing new rules per
   component, and re-run the contrast audit — ink on paper needs more alpha
   than paper on ink to reach the same ratio.
8. **Accessibility.** Visible focus rings, real `<a>` elements for links, no
   text under 10.5px, no interactive element under 24×24px.

## The field

**A shape's arrival and its performance are two different numbers.**
`morph(from, to, p, time, phase)` takes both: `p` blends the two forms and is
deliberately finished three quarters of the way through a chapter's leg, so
the object is settled while its sentence is on screen. `phase` is the reader's
own position in the chapter and runs the whole leg. A sub-move timed against
`p` plays out underneath the arrival and is never seen — which is exactly what
happened to Healthy Switch's fries, and is why the two were split.

The original four shapes were written when these were one number, so each of
them opens with `authored(p)`, which puts them back on the old scale. Their
sub-moves still happen at the scroll position they always did; only Healthy
Switch is authored against the full window. Do not remove that call without
re-timing all four.

## Working style

- Build one section at a time and check it against `reference/index.html`.
- Extract shared logic into `src/lib/` and `src/hooks/`. Do not inline the
  canvas engine into a component.
- Keep components under ~150 lines. If one grows past that, split it.
- Clean up every `requestAnimationFrame`, `IntersectionObserver`, and event
  listener in the `useEffect` return. Leaks here cause the page to slow down
  after route changes.
