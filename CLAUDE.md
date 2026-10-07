# CLAUDE.md

Project rules for Claude Code. Read this and docs/HOMEPAGE_REDESIGN.md before touching anything.

## What this is

Jay Harwani's portfolio (jayharwani.com). v5 is a white, ink-on-paper design. The homepage
concept is "Spec to Ship": each project appears as a spec, then ships into a live product.
docs/HOMEPAGE_REDESIGN.md is the source of truth for the redesign.

## Stack

- React 18.3, TypeScript and Vite, with React Router 7. Hosted on Cloudflare.
- Plain CSS with custom properties. Tokens live in src/styles/tokens.css.
  Do not introduce Tailwind, styled-components, CSS-in-JS or a UI kit.
- Animation uses CSS, the Web Animations API and requestAnimationFrame.
  GSAP core and ScrollTrigger are allowed only inside the lazy showcase motion module.
  Not allowed: Framer Motion or Motion, Lenis or any smooth-scroll wrapper, ScrollSmoother,
  the ScrollTrigger pin option, Three.js, Lottie.
- Fonts: Geist and Geist Mono only, as self-hosted Latin subsets in public/fonts.

## Hard rules

1. Performance. Animate only transform, opacity, clip-path, background-color and the
   registered custom properties that feed them. Budgets are in Section 11 of the redesign doc.
2. No debug code in production: no console output, no commented-out blocks, no TODOs.
3. Reveals use IntersectionObserver. At most one scroll listener, and it only schedules a frame.
4. Native scroll stays native. Pinning uses position: sticky.
5. prefers-reduced-motion is not optional. Follow the reduced motion contract (Section 7.6).
6. Locked palette and type. Use tokens only. Do not add colors, fonts or radius values.
7. Accessibility is WCAG 2.2 AA: visible focus rings, real links and buttons, no text under
   12px, targets at least 24 by 24px, and one H1 whose name matches its visible text.
8. Content lives in src/content. Never invent facts or numbers. Use [FILL: ...] or
   [VERIFY: ...]. The prebuild content check must pass before any production build.
9. Copy rules: plain English, sentence case, no em dashes or en dashes, no all-caps labels,
   no numbering unless the content is a real sequence, no middle-dot meta strings.
10. One bold moment per page. No fade-and-slide-up on sections. No custom cursors.

## Working style

- Work one phase at a time (Section 16). Stop after each phase and report its acceptance
  checks as pass or fail, with screenshots at 390, 768 and 1440px.
- Shared logic goes in src/lib and src/hooks. Keep components under about 150 lines.
- Clean up every animation frame, observer, listener and GSAP context in effect cleanups.
- If the spec and the codebase disagree on a fact, stop and ask.

## Where v4 went

The dark cinematic build is archived, not deleted:

- docs/archive/v4/SPEC.md, docs/archive/v4/BUILD.md
- docs/archive/v4/reference/index.html, the v4 visual source of truth.
  scripts/extract-mockups.py and scripts/port-reference-css.py read it from
  that path and generate src/data/mockups.ts and src/styles/v2-ported.css.
  Those two generated files belong to v4 and are retired with it.
