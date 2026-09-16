
  # UX Portfolio Landing Page

  This is a code bundle for UX Portfolio Landing Page. The original project is available at https://www.figma.com/design/QE0lUXzAYmwlKxySA9P1Pf/UX-Portfolio-Landing-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
---

## The hero

**Concept A — a liquid-metal shader field.** Picked over the single-hero-object
and scroll-flight options for one reason each: a PBR object lives or dies on the
quality of its environment map, which means shipping an HDRI and a second
network request before you know whether it looks good; and a scroll-driven
flight would fight the pinned work section directly below it for the same
gesture. The shader field is the only one of the three whose entire cost is
pixels, which makes it both the most distinctive and the most predictable.

**What it is.** One fullscreen fragment shader on a quad. Layered simplex noise,
domain-warped twice (Quílez), lit with a Blinn specular lobe and a fresnel rim
off a normal derived from the warp vector, coloured through a cosine palette
driven by *multiplied* height so the iridescence bands the way thin films do.
Then `EffectComposer`: bloom → a custom finishing pass (radial chromatic
aberration, animated grain, vignette) → ACES tone mapping.

**Where it lives.**

| | |
|---|---|
| `src/components/home/Hero.tsx` | already wired into the homepage — nothing to import |
| `src/components/home/scene/LiquidField.tsx` | the scene, the shaders, and every constant |
| `hero.html` | standalone reference. **Generated** — see below |
| `scripts/build-hero-html.mjs` | regenerates `hero.html` from the component |

`hero.html` uses ES modules, so serve it rather than opening the file:
`npm run dev` then `http://localhost:3000/hero.html`.

After tuning the component, run `node scripts/build-hero-html.mjs` so the
standalone stays in sync. It extracts the GLSL and all twenty constants from
the component, so the two cannot drift.

**The three constants to tune first**, all at the top of `LiquidField.tsx`:

1. **`C.SPEED`** — how fast the surface evolves. The biggest taste knob there
   is. Slower always reads more expensive.
2. **`PALETTE`** — the cosine-palette coefficients `a` (colour centre) and `b`
   (amplitude). This *is* the art direction. Halving `b` was most of what
   turned the first pass from a demo into a grade.
3. **`C.BLOOM`** — bloom strength. Past about 0.5 it stops reading as light and
   starts reading as a mistake.

If it ever looks busy rather than premium, the fix is `C.SCALE` and `C.BANDS`
down, not more effects: large slow forms in mostly deep navy, with iridescence
only where a fold catches the light.

**Performance.** The field is smooth and the type is real HTML, so the canvas
renders at 0.7× resolution (0.55× on phones) and nothing that needs to be sharp
is scaled at all. Phones also drop to three noise octaves from four, which is a
compile-time `#define` because a GLSL loop bound has to be constant. The loop
parks when the hero scrolls out of view, and unmount disposes every geometry,
material, pass, render target and the renderer, with `forceContextLoss()` so an
SPA route change actually frees the GPU context.
