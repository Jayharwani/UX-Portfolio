
  # UX Portfolio Landing Page

  This is a code bundle for UX Portfolio Landing Page. The original project is available at https://www.figma.com/design/QE0lUXzAYmwlKxySA9P1Pf/UX-Portfolio-Landing-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
---

## The hero

**Anatomy — the page's own parts, pulled apart into depth.**

Every earlier attempt imported a look from somewhere else and set the
portfolio behind it: a particle constellation, a liquid-metal shader field, a
chrome blob. Each was fine and none of them belonged to this site. This one is
built out of what the page is already made of — hairline frames, rules, and
the four project accents. The frames are the same frames the work section puts
its live previews in, three hundred pixels further down, so the hero is not
decorating the site, it is the site's own anatomy laid out in space. For a
design engineer that is also the argument: an interface taken apart and put
back together is the job.

**What makes it 2026 rather than 2019**, from the research rather than from
taste ([Envato](https://elements.envato.com/learn/web-design-trends),
[Index.dev](https://www.index.dev/blog/web-design-trends),
[studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check)):

- **Kinetic typography.** Geist is loaded variable (`wght 400..600`), so the
  name arrives light and wide and settles into weight and tracking as the
  frames land. One gesture with the scene, and it stays real selectable text
  the whole way through — a `font-variation-settings` transition, not a
  library.
- **Broken grids.** Frames sit on a deliberately asymmetric lattice with real
  jitter and overlap, not a centred array.
- **Depth with a purpose.** The assembly *is* the message — scattered to
  aligned — rather than depth for its own sake.
- And the caveat the reality-check pieces all landed on: use WebGL only where
  the craft is the point. On a portfolio for someone who builds interfaces, it
  is.

**The entrance is one uniform.** Every vertex carries both where it starts
(scattered, far back) and where it belongs; the vertex shader mixes between
them by `uAssemble`. The whole composition resolves from one number ramping 0
to 1 — no per-frame CPU work, no tweening thirty objects, and the pieces
cannot arrive out of sync.

**Everything is lines.** One `BufferGeometry`, one draw call, one material. A
site whose entire visual language is hairlines should have a hero made of
hairlines, and the cheapest thing to render happens to be the most honest one.

**Where it lives.**

| | |
|---|---|
| `src/components/home/Hero.tsx` | already wired into the homepage — nothing to import |
| `src/components/home/scene/Anatomy.tsx` | the scene, the shaders, and every constant |
| `hero.html` | standalone reference. **Generated** — see below |
| `scripts/build-hero-html.mjs` | regenerates `hero.html` from the component |

`hero.html` uses ES modules, so serve it rather than opening the file:
`npm run dev` then `http://localhost:3000/hero.html`.

After tuning the component, run `node scripts/build-hero-html.mjs`. It lifts
both shaders, the geometry builder and all twenty-seven constants out of the
component — stripping the TypeScript with esbuild, which already ships inside
Vite — and throws if any placeholder is left unfilled, so the reference cannot
drift from what ships.

**The three constants to tune first**, at the top of `Anatomy.tsx`:

1. **`C.COUNT`** — how many frames. Density is the whole mood; twenty reads as
   a composition and thirty-four reads as noise.
2. **`ACCENTS`** — the four project colours, the only colour in the section.
   Keep them the same four the work section uses.
3. **`C.BLOOM`** — past about 0.4 it stops reading as light and starts reading
   as a mistake.

`C.CLEAR_BAND` is the corridor the name sits in: large frames are pushed out
of that band rather than dimmed inside it. Emptying the space beats scrimming
over it.

**Performance.** One draw call. Full pixel ratio on desktop (capped at 2),
0.8× and fourteen frames on phones. The loop parks when the hero scrolls out
of view, and unmount disposes the geometry, material, every pass and the
renderer, with `forceContextLoss()` so an SPA route change actually frees the
GPU context.
