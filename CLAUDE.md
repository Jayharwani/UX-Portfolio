# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything.

## What this is

Jay Harwani's portfolio homepage (jayharwani.com). A single dark, cinematic
page: a letterbox title sequence, a live 3D canvas background, a migration
route graphic, a work index with animated project previews, and a contact
section.

`reference/index.html` is a **working, self-contained implementation** of the
finished design. It is the visual source of truth. When the spec and the
reference disagree, the reference wins. Open it in a browser before you start.

## Stack

- React + TypeScript + Vite
- Plain CSS (CSS custom properties). **Do not introduce Tailwind, styled-components,
  CSS-in-JS, or a UI kit.**
- **The homepage (Print Run) runs GSAP, Lenis and three.** This replaces an
  earlier "the homepage stays library-free" rule, and the replacement is
  deliberate. A registration intro, a pinned four-cover run and an extruded
  monogram are not reachable from CSS keyframes and a 2D canvas, and the
  earlier rule was already being contradicted by the repo rather than by this
  brief. The cost is paid in the open: `three` is a separate 132 kB gzip chunk
  behind a dynamic import that only the full tier ever requests, so phones and
  weak machines never download it, and the homepage's own chunk is 14 kB gzip.
  Keep it that way: no eager import of `src/lib/stage.ts`.
- **Still banned on the homepage:** scroll-jacking beyond the one pinned run,
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
6. **Locked palette on the homepage.** Six tokens: `--void`, `--paper` and the
   four project accents, plus opacity and `color-mix` steps of those. No new
   hue. Colour literals live in exactly two files, `src/styles/resolve.css`
   (the tokens block on `.v2.rs`) and `src/styles/tokens.ts` (the mirror the
   canvas reads); a hex value anywhere else on the homepage is a bug, because
   a second hand-typed copy is a drift waiting to happen. A `#000` inside a
   `mask-image` is a stencil, not a colour, and does not count.

   **The accents are named for projects, not for colours**, and they are four
   hues spaced around the wheel at one perceptual lightness and chroma
   (OKLCH 80% / 0.10): `--accent-friction` `#F7A792`, `--accent-headroom`
   `#8ED09C`, `--accent-signal` `#8CC3FC`, `--accent-bumper` `#E0B771`. This
   replaced `--teal`/`--mint`/`--cyan`/`--gold`, which were accurate names and
   the problem: three of those four sat within about thirty degrees of each
   other, so four deliberate keys read as one colour drifting. Naming them for
   the projects also stops the name going stale when a hue moves.

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

## Working style

- Build one section at a time and check it against `reference/index.html`.
- Extract shared logic into `src/lib/` and `src/hooks/`. Do not inline the
  canvas engine into a component.
- Keep components under ~150 lines. If one grows past that, split it.
- Clean up every `requestAnimationFrame`, `IntersectionObserver`, and event
  listener in the `useEffect` return. Leaks here cause the page to slow down
  after route changes.
