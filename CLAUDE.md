# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything.

## What this is

Jay Harwani's portfolio homepage (jayharwani.com). The homepage is a lit
bookshelf in a daylit room: four books are the four case studies, hovering one
raises it and names it, and clicking one pulls it off the shelf, turns it to
face the reader and swings its cover open before the route changes.

It is a **hybrid**, and that is the load-bearing decision. The room, the vase,
the brass lamp, the camera, the mug and the nameplate are a photograph
(`public/shelf/room.webp`). Only the books are geometry. The eucalyptus alone
is several hundred individually lit leaves and the wall carries dappled shadow
from a window that is not in frame; none of that is reachable with primitives
at 60fps, and the books are the only things that have to move, hinge, or be
clicked. Anything added to this scene belongs in the plate unless it is
interactive.

`reference/index.html` is the previous dark, cinematic homepage. It is kept as
history, not as the source of truth, and nothing on `/` is built from it any
more. The bookshelf's own reference plate lives in `public/shelf/`.

## Stack

- React + TypeScript + Vite
- Plain CSS (CSS custom properties). **Do not introduce Tailwind, styled-components,
  CSS-in-JS, or a UI kit.**
- **The homepage runs three.js, @react-three/fiber, drei and GSAP.** This
  replaces an earlier "the homepage stays library-free" rule, which the
  bookshelf brief overrode on purpose: a hinged, raycast, camera-moved book
  cannot be had from CSS keyframes and a 2D canvas. The cost is paid honestly
  rather than hidden — the scene is a `lazy()` chunk (~219 kB gzip) that is
  only fetched on a wide viewport that reports WebGL, so the first paint is
  the 83 kB shell plus the 97 kB plate and phones never download three.js at
  all. Keep it that way: no eager import of `BookshelfScene`.
- **Still banned on the homepage:** Lenis, scroll-jacking, and any
  transform-based smooth-scroll wrapper. Those were never about bundle size.
- **Case studies may use what is already in `package.json`** — GSAP (with
  ScrollTrigger, Flip, SplitText, Observer) and matter-js — and must import
  them dynamically so they never reach the homepage bundle. The earlier rule
  banned these outright while `gsap`, `three`, `@react-three/fiber`, `motion`
  and `matter-js` all sat in dependencies and `motion` was imported in
  eighteen files, so it described an intention rather than the repo.
- **Do not add new animation or UI dependencies** without asking. Tailwind is
  installed but unused in `src/`; leave it that way. No component kits.
- Only external dependency allowed: Geist + Geist Mono from Google Fonts.

## Hard rules

1. **Performance.** Animate only `transform`, `opacity`, `filter`, and canvas.
   Never animate `width`, `height`, `top`, or `left` in a loop.
   Cap canvas DPR at 2. Pause the render loop on `document.hidden`.
   Target 60fps on a 2019 laptop.
2. **No debug code in production.** No `console.log`, no commented-out blocks,
   no `TODO` left in shipped files.
3. **Scroll observation uses IntersectionObserver**, never a `scroll` event
   listener for reveals. One `scroll` listener is permitted, for the smoothed
   scroll value that drives the canvas camera.
4. **Native scroll stays native.** Do not add a transform-based smooth-scroll
   wrapper — it breaks the `position: sticky` preview panel in the work section.
   Smoothness comes from lerping the scroll *value*, not from moving the page.
5. **`prefers-reduced-motion` is not optional.** Every animated element needs a
   collapsed state. The title sequence is skipped entirely under reduced motion.
6. **The homepage palette is sampled from the plate, not from SPEC.md.**
   Every colour on `/` — the warm paper whites, the `#2a2520` ink, the four
   book cloths and foils — is eyedropped from `public/shelf/room.webp` so the
   geometry and the photograph agree. They live in `src/styles/shelf.css` and
   `src/components/shelf/shelf.ts`. SPEC.md's locked tokens still govern
   everything that is not the bookshelf. Do not mix the two: a SPEC.md token
   on the shelf will read as the wrong temperature against the photograph.
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
