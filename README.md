
  # UX Portfolio Landing Page

  This is a code bundle for UX Portfolio Landing Page. The original project is available at https://www.figma.com/design/QE0lUXzAYmwlKxySA9P1Pf/UX-Portfolio-Landing-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
---

## The hero

**Concept B — one object, real materials, studio light.** Picked over the
shader field and the scroll-flight for one reason each: a fullscreen shader is
a *picture*, and a picture has no silhouette, which means it can never be a
composition; and a scroll-driven flight would fight the pinned work section
directly below it for the same gesture. An object under studio light is the
only one of the three that gets compared to a product render rather than to a
wallpaper.

**What it is.** A sphere displaced by fbm in a vertex shader injected into
`MeshPhysicalMaterial` through `onBeforeCompile`, so the custom geometry gets
the whole PBR pipeline instead of a hand-rolled material that reimplements
lighting badly. The normal is **recomputed** from two displaced tangent
neighbours — displacing positions and keeping the sphere's normals gives a
lumpy shape lit like a ball, every highlight in the wrong place.

The material does real work: `iridescence` is the material's own thin-film
term with an IOR and a physical thickness range, so the hue shift follows the
viewing angle the way anodised titanium does. Lighting is image-based from
`RoomEnvironment` pre-filtered through `PMREMGenerator` — genuine soft-box
streaks in the reflections, built at startup, zero network requests, no HDRI
to ship. Then `EffectComposer`: bloom → a custom finishing pass (radial
chromatic aberration, animated grain, vignette) → ACES tone mapping.

**Where it lives.**

| | |
|---|---|
| `src/components/home/Hero.tsx` | already wired into the homepage — nothing to import |
| `src/components/home/scene/MetalForm.tsx` | the scene, the shaders, and every constant |
| `hero.html` | standalone reference. **Generated** — see below |
| `scripts/build-hero-html.mjs` | regenerates `hero.html` from the component |

`hero.html` uses ES modules, so serve it rather than opening the file:
`npm run dev` then `http://localhost:3000/hero.html`.

After tuning the component, run `node scripts/build-hero-html.mjs`. It
extracts both GLSL chunks and all thirty-one constants from the component and
throws if any placeholder is left unfilled, so the reference cannot drift from
what ships.

**The three constants to tune first**, all at the top of `MetalForm.tsx`:

1. **`C.ROUGHNESS`** — how polished. 0.12 is wet mercury, 0.35 is brushed.
2. **`MATERIAL.color`** plus `envMapIntensity` and the two light intensities.
   At `metalness: 1` the colour is not a diffuse tint, it is what the
   reflections are made of. These four numbers came down together to take the
   first pass from a blown-out white blob to a dark object with bright edges.
3. **`C.BLOOM`** — past about 0.5 it stops reading as light and starts reading
   as a mistake.

If the form ever crowds the type, `C.LIFT_F` moves it up the frame and
`C.FILL` / `C.FILL_PORTRAIT` decide how much of the frame it occupies. The
camera distance is derived from those, not fixed, so the framing is correct at
every aspect — a fixed distance frames against the *vertical* field of view
and showed a form 163% of the frame width on a 390px phone.

**Performance.** Full pixel ratio on desktop (capped at 2), 0.72× on phones,
where the icosahedron also drops from subdivision 6 to 4. The loop parks when
the hero scrolls out of view, and unmount disposes every geometry, material,
pass, render target and the renderer, with `forceContextLoss()` so an SPA
route change actually frees the GPU context.
