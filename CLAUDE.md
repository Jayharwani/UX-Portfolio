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
- No animation libraries. No GSAP, Framer Motion, Lenis, Three.js, Lottie.
  Everything is CSS transitions, CSS keyframes, `requestAnimationFrame`, and
  one 2D canvas. This is deliberate, not an oversight.
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
6. **Locked palette.** Use the tokens in SPEC.md. Do not add colours.
7. **Accessibility.** Visible focus rings, real `<a>` elements for links, no
   text under 10.5px, no interactive element under 24×24px.

## Working style

- Build one section at a time and check it against `reference/index.html`.
- Extract shared logic into `src/lib/` and `src/hooks/`. Do not inline the
  canvas engine into a component.
- Keep components under ~150 lines. If one grows past that, split it.
- Clean up every `requestAnimationFrame`, `IntersectionObserver`, and event
  listener in the `useEffect` return. Leaks here cause the page to slow down
  after route changes.
