# CLAUDE.md

Project instructions for Claude Code. Read this before touching anything.

## What this is

Jay Harwani's portfolio homepage (jayharwani.com). The homepage is a room of
oak shelving seen from close up on a diagonal, built entirely in WebGL: four
books on the middle board are the four case studies, hovering one steps it
forward and names it in a callout, and clicking one pulls it clear, turns it
to face the reader and swings its cover open before the route changes.

**Everything in it is geometry, and that is the load-bearing decision.** An
earlier pass stood real books in front of a photograph of a room. It worked,
and it was the wrong shape: a photograph cannot move, so every prop was frozen
at one camera angle, and the painted books had to be erased out of the plate
with a Laplace solve before the real ones could stand where they had been.
Nothing here is retouched, so the camera can go anywhere.

The look is a **miniature**, not a photograph. Everything is matte and
round-cornered, and the depth of field is what sells the scale — a lens that
close to a real shelf keeps all of it sharp, so blur is what tells the eye the
shelf is small. Keep roughness high and metalness at zero on anything that is
not literally metal; one glossy prop and the whole thing reads as a render of
furniture.

Shelves run off both edges of the frame on purpose. A shelf that ends inside
the shot reads as a prop on a table.

`reference/index.html` is the previous dark, cinematic homepage. It is kept as
history, not as the source of truth, and nothing on `/` is built from it.

## Stack

- React + TypeScript + Vite
- Plain CSS (CSS custom properties). **Do not introduce Tailwind, styled-components,
  CSS-in-JS, or a UI kit.**
- **The homepage runs three.js, @react-three/fiber, drei, GSAP and
  @react-three/postprocessing.** This replaces an earlier "the homepage stays
  library-free" rule, which two successive briefs overrode on purpose: a
  hinged, raycast, camera-moved book in a lit room is not reachable from CSS
  keyframes and a 2D canvas. The cost is paid honestly rather than hidden —
  the scene is a `lazy()` chunk (~250 kB gzip) fetched only on a wide viewport
  that reports WebGL, the first paint is an 84 kB shell and no image at all,
  and phones never download three.js. Keep it that way: no eager import of
  `BookshelfScene`.
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
   Cap canvas DPR at 2. Target 60fps on a 2019 laptop.

   In the room, the number that matters is **draw calls**, and the budget is
   about 250. Headless Chrome cannot measure frame rate here — `about:blank`
   alone sits at 33ms — so measure draw calls instead; they are the same on
   every machine. Anything repeated more than a few times gets its transforms
   baked into one merged geometry: modelling every eucalyptus leaf as its own
   mesh cost 412 calls a frame, and merging them per plant cost nothing
   visible and gave back 168.

   `lite` mode (four cores or fewer, or reduced motion) drops the shadow map
   and the post chain. Keep new work behind that flag if it costs a pass.
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
6. **The homepage palette lives with the room, not in SPEC.md.** Every colour
   on `/` — the oak, the plaster, the clay and sage props, the four book
   cloths — is in `PALETTE` in `src/components/shelf/shelf.ts`, and the HTML
   over the top is in `src/styles/shelf.css`. SPEC.md's locked tokens still
   govern everything that is not the homepage. Do not mix the two: a SPEC.md
   token in this room reads at the wrong temperature against the oak.
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

## Homepage shelf redesign (docs/HOMEPAGE_SHELF_WALNUT.md)

- Scope: the homepage shelf only. Never edit case study files, global CSS, shared tokens,
  shared layout components or the router. Homepage styles live under .shelf-root.
- Run node scripts/check-home-scope.mjs after every change set. It must pass. The base
  defaults to `shelf`, not `main`: main is still the pre-shelf site, so diffing against it
  reports the whole shelf build and tells you nothing. Pass `main` once shelf is merged.
- Frozen dependencies: react, react-dom, react-router, three, gsap. React Three Fiber
  packages stay on their React 18 majors (fiber 8, drei 9, postprocessing 2).
- Locked palette: use the shelf tokens in the spec. Do not add colors.
- One warm key light tells the story. Do not raise ambient light to fix a dark area;
  add a bounce or move the key instead.
- Tone mapping comes from the ToneMapping effect at the end of the EffectComposer chain,
  because the composer disables the renderer's tone mapping while it renders.
- prefers-reduced-motion: no motes, no parallax, no sway, instant state changes.
- No debug code in production. Dev tools load only behind import.meta.env.DEV.
