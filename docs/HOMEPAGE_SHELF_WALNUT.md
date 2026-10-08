# Homepage shelf: dark walnut redesign

Instructions for Claude Code. Owner: Jay Harwani. Prepared October 8, 2026.

- **Scope.** The homepage (`/`) only, meaning the 3D shelf scene and the HTML overlay on top of it.
- **Out of scope.** Case study pages, their components, their styles and shared global styles must not change. Section 0.2 enforces this.
- **Supersedes.** `HOMEPAGE_REDESIGN.md` (white mode, October 7). That direction is dropped. Delete or archive it so Claude Code never mixes the two.
- **Evidence.** Every version, API, asset and measurement in this file was checked on October 7 and 8, 2026, against Jay's local build at `localhost:4173`, the npm registry and the Poly Haven catalog. Section 17 lists the sources.

---

## 0. How to use this file

### 0.1 Setup and kickoff

1. Save this file as `docs/HOMEPAGE_SHELF_WALNUT.md` in the portfolio repo.
2. Move `docs/HOMEPAGE_REDESIGN.md`, if it exists, into `docs/archive/`.
3. Add the block in Section 0.4 to the end of `CLAUDE.md`.
4. Start Claude Code in the repo root and paste:

```text
Read CLAUDE.md and docs/HOMEPAGE_SHELF_WALNUT.md completely before doing anything.
This redesign changes the homepage shelf only. Case study pages, their components,
their styles and shared global styles must not change.

Do Phase 0 only (Section 14). Report:
1. the baseline screenshots and value readings,
2. the list of homepage files you propose for the scope allowlist,
3. the current renderer, lighting, shadow and post-processing setup, including whether
   a ToneMapping effect exists,
4. anything in the spec that conflicts with the code.
Do not change any code until I reply.
```

5. After each phase, Claude Code stops and shows:
   - what changed,
   - screenshots at 1440 x 900 and 390 x 844,
   - the phase's acceptance checks marked pass or fail,
   - the output of the scope check.

   To continue, paste:

```text
Phase N is approved. Do Phase N+1 only, following Section 14. Run
node scripts/check-home-scope.mjs main before reporting, and stop when the
acceptance checks are done.
```

### 0.2 Scope rule: case studies stay exactly as they are

Rules:

1. Only files on the homepage allowlist may change. Claude Code builds the allowlist in Phase 0 and Jay approves it. It covers:
   - the shelf scene and its components;
   - the homepage overlay and its CSS (classes prefixed `shelf-`);
   - homepage data;
   - new assets under `public/shelf/`;
   - `package.json`, its lockfile, `scripts/` and `docs/`.
2. Global CSS, shared tokens, shared layout components, the router and every case study file are off limits. A style the homepage needs goes in a homepage-scoped stylesheet under `.shelf-root`, never in a global file.
3. Shared dependencies stay frozen: `react`, `react-dom`, `react-router` or `react-router-dom`, `three` and `gsap`.
   - New packages may be added.
   - `@react-three/*` packages may move only within their current major versions (fiber 8, drei 9, postprocessing 2), which are the React 18 lines.
4. After each phase, the case study routes must look identical to the Phase 0 baseline screenshots.

The scope check script runs after every phase:

```js
// scripts/check-home-scope.mjs
// Fails when a changed file is outside the homepage allowlist,
// or when a frozen dependency changes version.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? "main";

// Phase 0 fills this with the real homepage paths. Jay approves the list.
const ALLOWLIST = [
  /^public\/shelf\//,
  /^docs\//,
  /^scripts\/check-home-scope\.mjs$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/,
];

const FROZEN = ["react", "react-dom", "react-router", "react-router-dom", "three", "gsap"];
const MAJOR_LOCKED = { "@react-three/fiber": "8", "@react-three/drei": "9", "@react-three/postprocessing": "2" };

const list = (cmd) => execSync(cmd, { encoding: "utf8" }).split("\n").filter(Boolean);
const changed = new Set([
  ...list(`git diff --name-only ${base}`),
  ...list("git ls-files --others --exclude-standard"),
]);
const outside = [...changed].filter((f) => !ALLOWLIST.some((re) => re.test(f)));

const deps = (p) => ({ ...p.dependencies, ...p.devDependencies });
const before = deps(JSON.parse(execSync(`git show ${base}:package.json`, { encoding: "utf8" })));
const after = deps(JSON.parse(readFileSync("package.json", "utf8")));
const frozenChanged = FROZEN.filter((d) => before[d] !== after[d]);
const majorChanged = Object.entries(MAJOR_LOCKED)
  .filter(([d, major]) => after[d] && !after[d].replace(/^[^\d]*/, "").startsWith(`${major}.`))
  .map(([d]) => d);

const problems = [
  ...outside.map((f) => `outside homepage scope: ${f}`),
  ...frozenChanged.map((d) => `frozen dependency changed: ${d} ${before[d]} to ${after[d]}`),
  ...majorChanged.map((d) => `major version changed: ${d} is now ${after[d]}`),
];
if (problems.length) {
  console.error(`Scope check failed:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Scope check passed: ${changed.size} changed files, all inside the homepage.`);
```

### 0.3 Assumptions in force

Jay has not answered the open questions in Section 16. Build on these defaults; each is easy to reverse.

| ID | Decision | Default | How to reverse |
|---|---|---|---|
| A1 | Wall color | Cool slate plaster, as in the reference, so the warm wood and lamp read against it | Swap `wall` in the palette for the warm umber option (Section 3.4) |
| A2 | Nameplate text | "JAY HARWANI" over "PRODUCT DESIGNER" | Edit `shelfContent.nameplate` |
| A3 | Personal object | None by default. Option: Poly Haven's `brass_diya_lantern`, a small nod to Ahmedabad | Add it in Section 8.1 |
| A4 | Figurine from the reference | Not included | Add a figure model if Jay supplies one |
| A5 | Ivy | Two trailing vines that frame the shelf; they never cross the books | Change `vines` in the set-dressing data |
| A6 | Lamp | Poly Haven `desk_lamp_arm_01`, clamped to the middle shelf, retinted to aged brass | Use `vintage_oil_lamp` for a softer, lower light |
| A7 | Drifting motes of light | On, except under reduced motion | Set `motes.enabled` to false |
| A8 | Stack | React 18.3.1, three r169, R3F 8, drei 9. Add `@react-three/postprocessing@2.19.1` and pin `postprocessing@6.39.5` if not already present | Not reversible without touching case studies, so do not change |

### 0.4 Add to `CLAUDE.md`

```markdown
## Homepage shelf redesign (docs/HOMEPAGE_SHELF_WALNUT.md)

- Scope: the homepage shelf only. Never edit case study files, global CSS, shared tokens,
  shared layout components or the router. Homepage styles live under .shelf-root.
- Run node scripts/check-home-scope.mjs main after every change set. It must pass.
- Frozen dependencies: react, react-dom, react-router, three, gsap. React Three Fiber
  packages stay on their React 18 majors (fiber 8, drei 9, postprocessing 2).
- Locked palette: use the shelf tokens in the spec. Do not add colors.
- One warm key light tells the story. Do not raise ambient light to fix a dark area;
  add a bounce or move the key instead.
- Tone mapping comes from the ToneMapping effect at the end of the EffectComposer chain,
  because the composer disables the renderer's tone mapping while it renders.
- prefers-reduced-motion: no motes, no parallax, no sway, instant state changes.
- No debug code in production. Dev tools load only behind import.meta.env.DEV.
```

---

## 1. The brief

### 1.1 Goal

Make the shelf feel like a real, lamp-lit walnut bookcase at night: natural materials, a dark brown wood finish, and one warm light. A design lead should stop and look. A recruiter should still understand in five seconds three things:

- who Jay is;
- what he does;
- that each book opens a project.

### 1.2 What stays

- The shelf concept, the four project books, and their routes.
- The HTML layer: the skip link, the header with Email and LinkedIn, and the hidden "Selected work" list.
- The case studies, untouched.
- The stack: React 18, React Three Fiber and GSAP.
- The hint "Four projects. Pick one off the shelf."

### 1.3 What changes

- Light and value structure.
- Materials.
- The palette.
- Most props.
- Camera framing.
- Book construction.
- Post-processing.
- Overlay styling.
- Tooltip copy.

### 1.4 Design principles

1. **One light tells the story.** One warm brass lamp lights the books; everything else falls off into cool shadow.
2. **Natural materials only.** Walnut, linen bookcloth, paper, stoneware, aged brass and leaves.
3. **The books are the subject.** They are the brightest, most saturated and sharpest objects in the frame. Every other object is darker, softer, or both.
4. **Fewer, better objects.** Every prop earns its place as a light source, a plant or a personal object.
5. **Calm motion.** The scene moves when the visitor moves. Only a few motes of light drift on their own.

---

## 2. Audit of the current build

Method: Chrome on desktop, viewport 1664 x 885 at device pixel ratio 1.5, on `localhost:4173`, October 7, 2026. The audit inspected the DOM, the built chunks and loaded resources, and compared screenshots with the reference image using a pixel histogram.

### 2.1 Stack and setup found

| Item | Found |
|---|---|
| React | 18.3.1 |
| 3D | three.js r169 with React Three Fiber. The scene chunk also contains post-processing code (EffectComposer, Bloom, DepthOfField, Vignette, Noise). |
| Animation | GSAP, in its own chunk |
| Scene chunk | `BookshelfScene`, 935 KB uncompressed |
| Assets | No texture, model or HDRI files load. Every surface is procedural (canvas and data textures). |
| Renderer | Tone mapping exposure 1.02. Canvas at 2473 x 1328 (full device pixel ratio). |
| HTML layer | Skip link "Skip to the work", header (`.shelf-hdr`), hidden "Back to the shelf" button, and "Selected work" section (`.shelf-index`) with all four projects and their live links |
| Fonts loaded | Geist (homepage UI), plus Geist Mono and Clash Display (used by the case studies) |

### 2.2 Why it looks wrong, most important first

1. **The values are inverted.**
   - Current build: 1% of pixels are darker than luma 60 (on a 0 to 255 scale), and mean luma is 172.
   - Reference: 85% of pixels are darker than luma 60, and mean luma is 35.

   Everything is evenly lit, so nothing reads as the subject. This one fix does more than every other change combined.
2. **The palette is pastel and chalky.** These colors come from the scene code:
   - cream wall #F3ECDE;
   - pale pine #E2C093 and #B8864A;
   - lavender #8891B4 and #7F86A8;
   - sage #9FB38F.

   Together they read as clay toys, not natural materials.
3. **Surfaces have no real texture.** The procedural grain is a set of uniform wavy lines at a scale far larger than real wood. With no normal or roughness variation, every surface looks like matte plastic.
4. **Tone mapping may be missing.** React Three Fiber's EffectComposer turns the renderer's tone mapping off while it renders (confirmed in `@react-three/postprocessing` 2.19.1). If the chain has no ToneMapping effect, highlights clip and colors flatten. Phase 0 confirms which case applies.
5. **The composition is weak.**
   - The camera sits high and wide.
   - The empty tops of the shelves fill most of the frame.
   - The four books take about 15% of the frame width.
6. **The props are generic.**
   - Stacked pastel bowls, faceted gems, lavender mugs, jars and a chess pawn fill space without saying anything about Jay.
   - The camera is the only personal object, and it is the least detailed.
7. **The books are flat boxes.**
   - No cloth texture.
   - No covers overhanging the pages.
   - No visible page block.
   - The spine type, drawn on a canvas texture, is soft at this size.
8. **The nameplate is weak.** It reads "Jay Harwani · Motion & Design". It is barely legible, and it positions Jay as a motion designer rather than a product designer.
9. **The overlay chrome is light on light.** The pale pills sit over a pale scene. They need restyling for a dark scene.

### 2.3 Content bugs

| Bug | Fix |
|---|---|
| The Friction tooltip reads "Designing intentional resistance for better user decisions." That describes Bumper, the pause before an impulse buy, not Friction, which mines app reviews. | New tooltip copy, Section 11.3 |
| The tooltip title is "01", an em dash, then "FRICTION" in capitals | New card layout, Section 11.2 |
| The canvas has no `aria-hidden`, so screen readers may meet an unlabeled canvas. The HTML list already carries the content. | Add `aria-hidden="true"` to the canvas, Section 12 |
| The Friction case study's page title contains an em dash | Out of scope (case study file). Noted for a later pass. |

---

## 3. Art direction: a walnut shelf at night, lit by one brass lamp

### 3.1 The idea

It is late evening. A desk lamp clamped to the shelf throws a warm pool of light across four cloth-bound books. Everything around them falls into a cool, quiet dark: the walnut boards, the plaster wall and a few plants. The visitor's eye goes straight to the books, because they are the only bright, saturated objects in the frame. That is the hierarchy the page needs.

### 3.2 What to take from the reference, and what to leave

| From the reference | Decision |
|---|---|
| Dark walnut boards with a satin finish and a lit front edge | Take |
| Slate plaster wall with visible texture | Take |
| One warm brass lamp as the only strong light | Take |
| Eucalyptus in a stoneware vase | Take |
| Trailing ivy | Take, but only as framing (A5) |
| Drifting motes of light | Take, few and slow |
| Cloth books with numbered spines and visible page edges | Take |
| Shallow depth of field on the books | Take, on the high tier only |
| Ivy covering half the frame | Leave. It competes with the books. |
| Toy figurine | Leave, unless Jay has a personal one (A4) |
| Tooltip with an em dash, title case and Friction described as Bumper | Leave. It is off-voice and factually wrong. |
| "Motion & design portfolio" on the nameplate | Leave. It mispositions Jay (A2). |
| The color swatch bar under the image | Leave. It belongs to the tool that rendered the image. |

### 3.3 Value targets

These are measurable. Claude Code checks them with the value meter (Section 5.4). Luma is measured on the final, post-processed frame at 1440 x 900, on a 0 to 255 scale.

**Whole frame**

- 75% to 88% of pixels are darker than luma 60. Today this is 1%; the reference is 85%.
- Mean luma is between 30 and 50. Today this is 172; the reference is 35.
- No pixel is brighter than luma 245, except the lamp bulb and the brightest motes.

**Value ladder.** The middle column is the target; the right column is the reference sample it comes from.

| Element | Target luma | Reference sample |
|---|---|---|
| Lamp bulb | 230 or more | #F7ECCB |
| Bumper spine, lit | 115 to 130 | #9E773F |
| Page edges, lit | 100 to 115 | #786D6B |
| Friction spine, lit | 90 to 105 | #825B45 |
| Headroom spine, lit | 70 to 85 | not in the reference (moss green) |
| Brass and stoneware highlights | 90 to 100 | #796140, #695F56 |
| Signal spine, lit | 55 to 65 | #353B50 |
| Lamp pool on the shelf top | 45 to 60 | #532E1A |
| Wall near the lamp | 35 to 45 | #2E261F |
| Shelf front edge | 22 to 32 | #201A15 |
| Wall far from the lamp | 12 to 20 | #0C1218 |
| Deep shadow | under 12 | #060C0F |

### 3.4 Palette

**Rendered targets versus base colors.** The ladder above describes what the final frame should look like. A material's base color (albedo) is its color before any light reaches it, and it must be brighter than its rendered target, because the scene is dark. Never paste a rendered sample in as a base color: the scene would go muddy and flat.

Base color tokens live in `shelfPalette.ts` and are locked: do not add colors.

| Token | Value | Use |
|---|---|---|
| `wall` | #1F2833 | Slate plaster base color (A1) |
| `wallWarm` | #2A211B | Warm umber alternative (A1) |
| `walnutTint` | #8C7262 | Multiplier on the walnut veneer texture. The board should average about #3A2A20 before lighting. |
| `clothFriction` | #9B4A2C | Rust bookcloth |
| `clothHeadroom` | #55663F | Moss bookcloth |
| `clothSignal` | #2D3B5E | Ink-blue bookcloth |
| `clothBumper` | #C18E3A | Ochre bookcloth |
| `paper` | #E8DDC8 | Page blocks |
| `foil` | #D3B57A | Spine type on the first three books (metallic) |
| `inkOnOchre` | #2A2118 | Spine type on the Bumper book |
| `brass` | #C2A06A | Lamp, bookend, nameplate inlay (metallic) |
| `stoneware` | #A89C8E | Vase, cup |
| `eucalyptus` | #7D8E7A | Eucalyptus leaves |
| `ivy` | #3F5A34 | Vine leaves |
| `lampWarm` | #FFB46B | Key light, about 3000 K |
| `fillCool` | #9DB2D6 | Cool fill and rim light |
| `bulb` | #FFC98A at 12 times intensity | Emissive bulb (HDR, so it blooms) |
| `mote` | #FFD7A1 at 2 times intensity | Motes (HDR, so the brightest ones bloom) |
| `fog` | #0E1218 | Fog color, matching the far wall in shadow |

Rules:

- Leaves vary by plus or minus 6% lightness per instance, never by hue.
- No other hues enter the scene. Props keep their own textures, desaturated by up to 30% when they compete with the books.

---

## 4. Materials and textures

### 4.1 Sources

Poly Haven assets are CC0. Credit is not required, but list them in `public/shelf/CREDITS.md` anyway. Download the OpenGL normal maps (`nor_gl`), which is the convention three.js expects.

| Use | Poly Haven asset | Alternatives | Maps | Resolution |
|---|---|---|---|---|
| Shelf boards | `american_walnut_veneer` | `black_walnut_veneer_02` (darker), `european_walnut_veneer_04` | diffuse, `nor_gl`, roughness | 2K |
| Wall | `grey_plaster_02` | `blue_plaster_wall`, `clay_plaster` | `nor_gl` and roughness only. The color comes from `wall`. | 1K |
| Bookcloth | `rough_linen` | `book_pattern` | `nor_gl`, roughness. Tiled, tinted per book. | 1K |
| Reflections | Procedural `Lightformer` environment (Section 5.1). Nothing to download. | HDRI `brown_photostudio_02` or `artist_workshop` at 1K | n/a | n/a |

### 4.2 Material settings (starting values)

| Material | Type | Base color | Roughness | Metalness | Extras |
|---|---|---|---|---|---|
| Walnut boards and dividers | `meshPhysicalMaterial` | Veneer texture times `walnutTint` | 1 (the map supplies the variation) | 0 | `clearcoat` 0.25, `clearcoatRoughness` 0.45, `normalScale` 0.6 |
| Wall | `meshStandardMaterial` | `wall` | 0.92 times the map | 0 | `normalScale` 0.8 |
| Bookcloth | `meshPhysicalMaterial` | Per book | 0.82 | 0 | `sheen` 0.4, `sheenRoughness` 0.55, `sheenColor` = cloth color lightened 25%, linen `normalScale` 0.35 |
| Page block | `meshStandardMaterial` | `paper` | 0.9 | 0 | Fine page-line normal map (Section 9.1) |
| Spine type | Material passed as a child of drei `<Text>` | `foil` or `inkOnOchre` | 0.34 (foil), 0.6 (ink) | 1 (foil), 0 (ink) | `envMapIntensity` 1.3 on the foil |
| Brass | `meshStandardMaterial` | `brass` | 0.32, varied 0.25 to 0.45 by a noise roughness map | 1 | None |
| Stoneware | `meshPhysicalMaterial` | `stoneware` | 0.55 | 0 | `clearcoat` 0.35, `clearcoatRoughness` 0.5 |
| Leaves | `meshStandardMaterial` | `eucalyptus` or `ivy`, per-instance variation | 0.55 | 0 | `side: DoubleSide` |
| Bulb | `meshBasicMaterial` | `bulb` (HDR) | n/a | n/a | Its HDR color flows into Bloom, then ToneMapping |
| Poly Haven props | The models' own materials | n/a | n/a | n/a | Keep them. Retint the lamp to `brass`. Only reduce texture sizes (Section 13.2). |

### 4.3 Code

```ts
// src/<shelf>/materials/useTiledMaps.ts
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type MapSet = Record<string, string>;

// useTexture caches textures by URL, so clone before changing repeat or offset per surface.
// Clones share the image, so the clone is cheap.
// useTexture returns a new keyed object on every render, so memoize on the texture
// instances themselves. The key set is fixed per call site, so the dependency list
// keeps a constant length.
export function useTiledMaps(urls: MapSet, repeat: [number, number], offset: [number, number] = [0, 0]) {
  const source = useTexture(urls) as Record<string, THREE.Texture>;
  const keys = Object.keys(urls);
  const textures = keys.map((k) => source[k]);
  const maps = useMemo(() => {
    const out: Record<string, THREE.Texture> = {};
    keys.forEach((key, i) => {
      const t = textures[i].clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(...repeat);
      t.offset.set(...offset);
      t.anisotropy = 8;
      t.colorSpace = key === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
      out[key] = t;
    });
    return out;
  }, [...textures, repeat[0], repeat[1], offset[0], offset[1]]);
  useEffect(() => () => Object.values(maps).forEach((t) => t.dispose()), [maps]);
  return maps;
}
```

```tsx
// Walnut board. Give each board its own offset so no two boards share a grain pattern.
const walnut = useTiledMaps(
  {
    map: "/shelf/tex/walnut_diff_2k.webp",
    normalMap: "/shelf/tex/walnut_nor_gl_2k.webp",
    roughnessMap: "/shelf/tex/walnut_rough_2k.webp",
  },
  [3, 0.35],
  [boardIndex * 0.37, 0],
);

<meshPhysicalMaterial
  {...walnut}
  color={shelfPalette.walnutTint}
  roughness={1}
  clearcoat={0.25}
  clearcoatRoughness={0.45}
  normalScale={[0.6, 0.6]}
/>
```

```tsx
// Bookcloth. The linen maps are shared; the color comes from the book's data.
<meshPhysicalMaterial
  {...linen}
  color={book.cloth}
  roughness={0.82}
  sheen={0.4}
  sheenRoughness={0.55}
  sheenColor={book.sheen}
  normalScale={[0.35, 0.35]}
/>
```

Rules:

- **Grain scale.** The walnut's widest figure should be about as wide as one book spine. If the grain runs across the board instead of along it, rotate the UVs; do not rotate the texture.
- **Front edge.** Bevel every shelf front edge with a radius of about 1.5% of a book's height. The key light then draws one thin highlight line along it, and that line is what makes the boards read as solid wood.
- **Board thickness.** Boards are about 12% of a book's height thick. Thin boards read as cheap.
- **Plaster scale.** Tile the plaster maps so the mottling is about half a book's height across.

---

## 5. Lighting

### 5.1 The rig

Units: since three.js r155, point and spot light intensities are physical (candela, with inverse-square falloff when `decay` is 2). The starting values below assume a book about 1 scene unit tall. If the scene uses another scale, the correct intensity changes with the square of the distance. Use the values only as a starting point and calibrate with the value meter (Section 5.4).

| Light | Type | Color | Starting intensity | Placement | Shadows | Job |
|---|---|---|---|---|---|---|
| Key | `spotLight` | `lampWarm` | 40, `decay` 2, `angle` 0.62, `penumbra` 0.85 | In the lamp head, aimed at the center of the four books | Yes, the only shadow-casting light | Tells the story |
| Shade glow | `pointLight` | #FFC98A | 1.5, `distance` 1.2, `decay` 2 | Just under the bulb | No | Warms the inside of the shade and the shelf right below it |
| Cool fill | `directionalLight` | `fillCool` | 0.3 | Upper left, in front of the shelf | No | Keeps the shadows readable and cool |
| Sky and ground | `hemisphereLight` | Sky #24324A, ground #2A1C12 | 0.15 | n/a | No | Prevents pure black |
| Rim | `rectAreaLight` | #B9C7DE | 0.8 | Above and slightly behind the top shelf's front edge, facing down | Cannot cast | A thin cool line on the board edges and leaf tops |
| Reflections | drei `Environment` with two `Lightformer`s | Warm and cool | `environmentIntensity` 0.25 | Warm form on the lamp side, cool form on the fill side | n/a | Gives the brass, glaze and clearcoat something to reflect. The background stays off. |
| Fog | `fogExp2` | `fog` | Density 0.035 per unit, calibrated | n/a | n/a | The far wall falls away |

**The rule for dark areas.** If an area is too dark, do not raise the ambient or hemisphere light, because that flattens the whole frame. Move or widen the key light, or add a small warm bounce near the area.

### 5.2 Code

```tsx
// src/<shelf>/ShelfLights.tsx
import { useMemo } from "react";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { shelfPalette } from "./shelfPalette";

RectAreaLightUniformsLib.init(); // required once before a RectAreaLight lights standard materials

type V3 = [number, number, number];

// Positions are scene-specific. Derive them from the lamp model and the book group;
// the literal values below are placeholders to replace.
export function ShelfLights({ lampHead, bulb, booksCenter, highTier }: {
  lampHead: V3; bulb: V3; booksCenter: V3; highTier: boolean;
}) {
  const keyTarget = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <hemisphereLight args={["#24324A", "#2A1C12", 0.15]} />
      <directionalLight position={[-6, 5, 6]} color={shelfPalette.fillCool} intensity={0.3} />
      <primitive object={keyTarget} position={booksCenter} />
      <spotLight
        position={lampHead}
        target={keyTarget}
        color={shelfPalette.lampWarm}
        intensity={40}
        decay={2}
        angle={0.62}
        penumbra={0.85}
        castShadow
        shadow-mapSize={highTier ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-camera-near={0.1}
        shadow-camera-far={12}
      />
      <pointLight position={bulb} color="#FFC98A" intensity={1.5} distance={1.2} decay={2} />
      <rectAreaLight
        position={[0, 3.2, -0.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={8}
        height={0.5}
        color="#B9C7DE"
        intensity={0.8}
      />
      <Environment resolution={128} environmentIntensity={0.25}>
        <Lightformer form="rect" color={shelfPalette.lampWarm} intensity={2} position={[3, 2, 2]} scale={[2, 1, 1]} />
        <Lightformer form="rect" color={shelfPalette.fillCool} intensity={0.6} position={[-4, 3, 3]} scale={[4, 2, 1]} />
      </Environment>
    </>
  );
}
```

### 5.3 Shadows

- **One shadow map.** Only the key light casts shadows.
  - **Casters:** books, lamp, vase, camera, plants and props.
  - **Receivers:** shelves, wall and books.
- **High tier.** Use drei `<SoftShadows size={18} samples={12} focus={0.5} />`, mounted once at the top of the scene. It rewrites the shadow shader chunks, so choose the tier at load and never toggle it while the page is running.
- **Other tiers.** Set `gl.shadowMap.type = THREE.PCFSoftShadowMap` in `onCreated`.
- **Contact shadows.** N8AO adds the dark contact line where books meet the shelf and the wall (Section 6). Never fake it with a texture.

### 5.4 Calibration with the value meter (development only)

```tsx
// src/<shelf>/dev/ValueMeter.tsx  (loaded only behind import.meta.env.DEV)
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export type Reading = { dark: number; mean: number; clipped: number };

export default function ValueMeter({ onReading }: { onReading: (r: Reading) => void }) {
  const gl = useThree((s) => s.gl);
  const frame = useRef(0);
  // Priority 2 runs after the EffectComposer (priority 1), so this reads the final frame.
  // Mount it only while a composer is mounted: a positive-priority useFrame turns off
  // React Three Fiber's own render call.
  useFrame(() => {
    frame.current += 1;
    if (frame.current % 60 !== 0) return;
    const ctx = gl.getContext();
    const w = ctx.drawingBufferWidth;
    const h = ctx.drawingBufferHeight;
    const px = new Uint8Array(w * h * 4);
    ctx.readPixels(0, 0, w, h, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
    let dark = 0;
    let clipped = 0;
    let sum = 0;
    let n = 0;
    for (let i = 0; i < px.length; i += 4 * 61) {
      const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
      sum += l;
      n += 1;
      if (l < 60) dark += 1;
      if (l > 245) clipped += 1;
    }
    onReading({ dark: dark / n, mean: sum / n, clipped: clipped / n });
  }, 2);
  return null;
}
```

Wiring the meter:

- Load it with `const ValueMeter = import.meta.env.DEV ? lazy(() => import("./dev/ValueMeter")) : null;`.
- Render it inside the Canvas within `<Suspense>`.
- Show its reading in a small development-only badge.

Pass when:

- `dark` is between 0.75 and 0.88;
- `mean` is between 30 and 50;
- `clipped` is 0.002 or less.

The meter reads the whole buffer once a second. That is fine in development, and it never ships. While tuning, an optional `lil-gui` dev dependency (also gated on `import.meta.env.DEV`) can drive light intensities live. Commit the final values as constants in `shelfLighting.ts`.

---

## 6. Post-processing

### 6.1 Tone mapping lives in the effect chain

`@react-three/postprocessing` 2.19.1 sets `gl.toneMapping` to `NoToneMapping` while its EffectComposer renders, and restores it afterwards. With the composer active, the renderer's own tone mapping therefore never runs.

- The look must come from `<ToneMapping mode={ToneMappingMode.AGX} />`, placed after Bloom and before the display-space effects.
- `ToneMappingMode.AGX` exists in `postprocessing` 6.39.5 but not in 6.32.1, so pin `postprocessing@6.39.5`. Its peer range (three 0.168 to 0.186) includes r169.
- Also set `toneMapping: THREE.AgXToneMapping` on the Canvas `gl` prop. That way any frame rendered without the composer, such as the poster capture or a debug view, still matches. React Three Fiber 8.18 sets ACES once when it creates the renderer, then applies the `gl` prop, so this setting wins.

### 6.2 Chain and tiers

| Order | Effect | Settings | High | Medium | Low |
|---|---|---|---|---|---|
| 1 | `N8AO` | `aoRadius` 0.5 (about half a book height), `distanceFalloff` 1, `intensity` 2.4, `color` #140C07 | `quality` "medium" | `halfRes`, `quality` "low" | Off |
| 2 | `DepthOfField` | `target` = the center of the books, `focalLength` 0.02, `bokehScale` 3 | On | Off | Off |
| 3 | `Bloom` | `mipmapBlur`, `luminanceThreshold` 1, `luminanceSmoothing` 0.2, `intensity` 0.55 | On | On | On |
| 4 | `ToneMapping` | `mode` AGX | On | On | On |
| 5 | `Vignette` | `offset` 0.28, `darkness` 0.62 | On | On | On |
| 6 | `Noise` | `premultiply`, `blendFunction` SOFT_LIGHT, `opacity` 0.18 | On | On | Off |
| 7 | Anti-aliasing | Composer `multisampling` 4 on high; `SMAA` on the other tiers | MSAA | SMAA | SMAA |

Two notes on the chain:

- **Bloom threshold.** The threshold of 1 works because the composer renders in half float. Only the HDR bulb and the brightest motes exceed 1, so the wall and books never glow.
- **Anti-aliasing.** Set `antialias: false` on the Canvas `gl`, because the composer handles anti-aliasing.

```tsx
// src/<shelf>/ShelfPost.tsx
// One component per tier. Avoid conditional children inside EffectComposer.
import { Bloom, DepthOfField, EffectComposer, N8AO, Noise, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

type V3 = [number, number, number];

export function ShelfPostHigh({ focus }: { focus: V3 }) {
  return (
    <EffectComposer multisampling={4}>
      <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.4} color="#140C07" quality="medium" />
      <DepthOfField target={focus} focalLength={0.02} bokehScale={3} />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.55} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.28} darkness={0.62} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
    </EffectComposer>
  );
}

export function ShelfPostMedium() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.4} color="#140C07" quality="low" halfRes />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.55} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.28} darkness={0.62} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
      <SMAA />
    </EffectComposer>
  );
}

export function ShelfPostLow() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.5} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.28} darkness={0.62} />
      <SMAA />
    </EffectComposer>
  );
}
```

### 6.3 Choosing and adapting the tier

**Initial tier,** decided once at load:

- **Low** when `(pointer: coarse)` matches and the viewport is under 768 px wide, or when `navigator.hardwareConcurrency` is 4 or less.
- **High** otherwise.

**Adaptation.** Wrap the scene in drei `<PerformanceMonitor flipflops={3}>`:

- `onDecline` lowers the device pixel ratio first: 1.5, then 1.25, then 1.0. After that it steps the post tier down once: high to medium, or medium to low.
- `onIncline` only raises the device pixel ratio back up. It never raises the post tier during a visit, because switching tiers recompiles shaders and causes a visible hitch.
- `onFallback` sets the low tier and keeps it.

The soft-shadow choice (Section 5.3) follows the initial tier only.

---

## 7. Camera and composition

### 7.1 Desktop framing (1024 px and up)

The frame decides whether the scene reads as a still life or as clutter. These are the targets for the desktop camera preset.

**Camera**

- Vertical field of view of 30 degrees, about a 45 mm lens. This is tighter than now.
- Camera height at the tops of the books, tilted down 6 to 8 degrees.
- Yawed 15 to 20 degrees off the books' facing direction, so both the spines and a sliver of one cover side show, as in the reference.

**Placement in the frame**

| Element | Target |
|---|---|
| Center of the books | 36% to 40% from the left, 46% to 52% from the top |
| Width of the four books | 24% to 30% of the frame (today about 15%) |
| Lamp head | Upper right third, aimed back across the books |
| Nameplate | On the middle shelf's front edge, lower right third, fully legible, with capital letters at least 14 px tall |
| Top shelf | Only its underside and front edge, in the top 12% to 18% of the frame, with its objects cropped |
| Lower shelf | Bottom 15% to 20% of the frame, mostly in shadow |
| Foliage | Enters from the top left corner and the right edge, and never overlaps the books or the nameplate |
| Overlay safe zones | Top 72 px for the header and bottom 80 px for the hint carry no important scene detail |

**Orientation.** Mirroring the scene to match the reference is optional. Keep the current orientation if that saves work. The placements in the table matter more than which way the shelf recedes.

```text
+--------------------------------------------------------------------------+
| Jay Harwani                                         [Email] [LinkedIn]   |
| Product designer who writes the front end                                |
|  vine \       top shelf underside, objects cropped ...............       |
|        \                                                                 |
|         +--+--+--+--+|               ( lamp head )                       |
|  vine   |01|02|03|04||  vase           \  warm pool of light             |
|         |  |  |  |  ||  eucalyptus      \                                |
|  =======+==+==+==+==++=========== walnut shelf top ======== camera ===   |
|  ============ front edge highlight ==================  [ NAMEPLATE ]     |
|                                                                          |
|  ..... lower shelf in shadow: other books, pencils, potted plant .....   |
|                    ( Four projects. Pick one off the shelf. )            |
+--------------------------------------------------------------------------+
```

### 7.2 Tablet and mobile framing

| Width | Camera | Books | Changes |
|---|---|---|---|
| 768 to 1023 px | Field of view 32 degrees, yaw about 10 degrees | 34% to 40% of the frame width | One vine |
| Under 768 px (portrait) | Field of view 36 degrees, yaw 0 to 6 degrees, nearly straight on | Centered at 50% across and 46% down, spanning 64% to 72% of the width | Lamp head partly cropped at the top right, lower-shelf props hidden (the shelf stays), one vine, tooltip becomes a bottom sheet (Section 11.2) |

### 7.3 Camera motion

- **Pointer parallax,** fine pointers only: the camera yaws up to 1.2 degrees and pitches up to 0.8 degrees, easing toward the pointer with a lerp of 0.06 per frame. It is off on touch devices and under reduced motion.
- **No idle motion.** The camera never drifts, orbits or "breathes" on its own.
- **No user orbit.** Visitors cannot orbit or zoom. The frame is art directed.

---

## 8. Set dressing

### 8.1 Props

Every model comes from Poly Haven (CC0). Optimize each one before use (Section 13.2).

| Object | Source | Where | Why |
|---|---|---|---|
| Desk lamp | `desk_lamp_arm_01`, a clamp-mounted articulated lamp, retinted to `brass` | Clamped to the middle shelf to the right of the books, head over them | The key light source |
| Vintage camera | `Camera_01`, a rangefinder with a leather strap | Middle shelf, beyond the lamp base, turned about 25 degrees toward the viewer | Personal object. It catches a brass highlight. |
| Stoneware vase with eucalyptus | `ceramic_vase_02` or `ceramic_vase_03` (choose by silhouette), with the existing procedural sprigs restyled | Middle shelf, between the books and the lamp | Plant and color relief |
| Bookend | Procedural L-shape in walnut or brass | Against the last book | Explains why the books stand upright |
| Nameplate | Procedural walnut block with brass inlay text (Section 11.3) | Middle shelf, front edge | Identity |
| Notepads and pencils | `office_notepads`, `stationery_supplies` | Top shelf, right, cropped by the frame | Studio context |
| Other books | `decorative_book_set_01` or `book_encyclopedia_set_01`, desaturated about 30% | Lower shelf | Depth and realism without competing |
| Cup | One cup from `tea_set_01`, or the existing mug restyled in `stoneware` | Top shelf | Quiet filler |
| Potted plant | `potted_plant_02` (terracotta pot, variegated heart-shaped leaves), simplified | Lower shelf, right, partly in shadow | Plant |
| Trailing vines | Procedural (Section 8.3) | Hanging from the top shelf, left and right | Framing |
| Optional personal object | `brass_diya_lantern` (A3) | Top shelf | Story |

### 8.2 Remove, and keep the shelves sparse

**Remove:**

- the stacked pastel bowls;
- the faceted gems (icosahedrons);
- the lavender mugs;
- the glass jar;
- the chess pawn;
- the white vase with a single sprig (the stoneware vase replaces it);
- duplicate pencil cups.

**Limits:**

- The middle shelf holds at most 6 objects besides the books. The top and lower shelves hold at most 4 each.
- At least 35% of each shelf top stays empty. Empty walnut in a pool of light is part of the look.

### 8.3 Foliage

Reuse the existing sprig and instanced-leaf code, and change its look.

**Eucalyptus**

- Round leaves in `eucalyptus` with per-instance lightness variation of plus or minus 6%, roughness 0.55.
- Leaves angled so a few catch the lamp.

**Vines**

- Two Catmull-Rom curves hanging from the top shelf's front edge.
- 10 to 16 heart-shaped leaves on each, in `ivy`, scaled 0.7 to 1.2, facing outward with a random roll of plus or minus 25 degrees.

**Rules for all leaves**

- Leaves are double-sided and cast and receive shadows.
- Sway is a rotation of each stem group of plus or minus 0.6 degrees on a 6 to 9 second sine wave, with a different phase per stem. It is off under reduced motion.

### 8.4 Motes of light

```tsx
// Inside the scene. MOTE is an HDR color so the brightest motes catch the bloom.
const MOTE = new THREE.Color(shelfPalette.mote).multiplyScalar(2);

<Sparkles
  count={highTier ? 36 : 14}
  scale={motesArea}       // a box between the camera and the books, mostly inside the lamp cone
  position={motesCenter}
  size={2.2}
  speed={0.18}
  opacity={0.7}
  noise={0.6}
  color={MOTE}
/>
```

Rules:

- Tune `size` so each mote reads as 2 to 4 px at 1440 x 900.
- Motes never pass in front of the spine type.
- None render under reduced motion.

---

## 9. Books

The books are the content. They get the most care.

### 9.1 Construction

All sizes are relative to H, the height of the tallest book.

| Part | Spec |
|---|---|
| Heights | 1.00, 0.95, 0.98 and 0.92 H, in shelf order |
| Spine widths | Between 0.22 and 0.30 H, all different |
| Case | drei `RoundedBox`, radius 0.02 H, smoothness 4 |
| Boards | 0.012 H thick, overhanging the page block by 0.02 H at the top, bottom and fore-edge |
| Page block | Inset box in `paper`, with a fine page-line normal map: a 256 px `DataTexture` of horizontal lines, generated in code, on the top and fore-edge only |
| Headband | Optional cream strip, 0.01 H, at the top of the spine |
| Arrangement | Upright, touching, with the bookend against the last book. The first book's page edges catch the lamp. |

### 9.2 Spine typography

**Typeface.** Clash Display Medium, the face the case study headlines already use, so each book carries the type of the page it opens.

- **Title.** Uppercase, tracking plus 0.08 em, running top to bottom (the usual direction for English-language spines). Cap height about 55% of the spine width, and never under 11 px on screen at 1440 x 900.
- **Number.** "01" to "04" at the top of the spine, upright, at 55% of the title size. The numbers are volume numbers on a shelf, so they belong.

**Color.**

| Books | Type finish |
|---|---|
| Friction, Headroom, Signal | `foil` (metallic) |
| Bumper | `inkOnOchre`, because foil reads weakly on ochre |

**Font file.** drei `<Text>` uses troika, which reads TTF, OTF and WOFF, but not WOFF2.

- Self-host `ClashDisplay-Medium.woff` in `public/shelf/fonts/`, from Fontshare's download, and keep its license file next to it.
- Pass `characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"` so the glyphs are ready before the first frame.

```tsx
<Text
  font="/shelf/fonts/ClashDisplay-Medium.woff"
  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  fontSize={spineTitleSize}
  letterSpacing={0.08}
  rotation={[0, 0, -Math.PI / 2]}
  position={spineTitlePosition}
  anchorX="center"
  anchorY="middle"
>
  {book.title.toUpperCase()}
  <meshStandardMaterial color={shelfPalette.foil} metalness={1} roughness={0.34} envMapIntensity={1.3} />
</Text>
```

The material passed as a child replaces the default text material; drei renders non-text children inside the troika mesh. Set the text 0.0005 H above the spine surface so it never z-fights.

### 9.3 Book data (`src/<shelf>/shelfContent.ts`)

| Number | Title | Cloth | Type | Route | Tooltip line | Exit color |
|---|---|---|---|---|---|---|
| 01 | Friction | `clothFriction` | `foil` | `/friction` | Section 11.3 | Measured in Phase 0 |
| 02 | Headroom | `clothHeadroom` | `foil` | `/headroom` | Section 11.3 | Measured in Phase 0 |
| 03 | Signal | `clothSignal` | `foil` | `/signal` | Section 11.3 | Measured in Phase 0 |
| 04 | Bumper | `clothBumper` | `inkOnOchre` | `/bumper` | Section 11.3 | Measured in Phase 0 |

**Exit color** is the computed body background of that case study. Phase 0 reads it from the live page and does not edit it. It makes the hand-off into the case study seamless (Section 10.3).

---

## 10. Interactions and motion

### 10.1 States

GSAP already ships with the homepage, so use it for book motion. Animate only the book group's position and rotation, and kill every tween on unmount.

| State | Trigger | Book | Overlay | Timing |
|---|---|---|---|---|
| Idle | none | Upright in its slot | Hint visible | n/a |
| Hover | Fine pointer over a book | Slides out 22% of its depth along its own forward axis, lifts 2% of its height, turns 4 degrees toward the camera | Card appears after a 120 ms dwell | 450 ms, `power3.out` |
| Hover end | Pointer leaves | Returns to its slot | Card fades out | Book 350 ms, `power2.inOut`. Card 150 ms. |
| Focus | Tab to the book's item in `.shelf-index` | Same as hover | Card, plus the visible list item with its focus ring (Section 12.2) | Same as hover |
| Open | Click, Enter, or a second tap | Slides out 60% and turns to face the camera | Full-screen fade to the case study's exit color | Book 400 ms. Fade starts at 250 ms and lasts 350 ms. Navigate at 600 ms. |
| First tap (touch) | Tap a book | Hover state | Bottom sheet: title, line, "Open case study" button, live link | 300 ms |
| Dismiss (touch) | Tap outside, or Escape | Returns | Sheet closes | 250 ms |
| Return | Back navigation from a case study | The last opened book rests 6% out until the next hover | None | None |

### 10.2 Rules

- Only one book is out at a time.
- **Hit area.** A book's hit area is its bounding box plus 4% padding, because spines are thin.
- **Hover timing.** Ignore hover changes while a book is opening.
- **Cursor.** Pointer over books, default elsewhere. No custom cursor.
- **No collisions.** The pull-out follows the book's local forward axis, so it never passes through a neighbor.

### 10.3 Opening a case study

1. Play the book's open motion.
2. At 250 ms, fade a fixed full-screen DOM overlay (`.shelf-exit`) from transparent to the case study's exit color over 350 ms.
3. At 600 ms, call `navigate(route)`. The case study renders exactly as it does today; nothing on that page changes.

Exceptions:

- Under reduced motion, navigate immediately.
- Intercept only a plain primary click (`event.button === 0` with no modifier keys) or Enter. Middle-click, Cmd-click and Ctrl-click on a list link open a new tab normally.

### 10.4 Reduced motion

| Feature | Default | Reduced motion |
|---|---|---|
| Book hover and focus | 450 ms slide | Instant state change |
| Open | 600 ms sequence | Immediate navigation |
| Motes | Drifting | None |
| Vine sway | On | Off |
| Pointer parallax | On (fine pointer) | Off |
| Canvas fade-in over the poster | 400 ms | Instant |

---

## 11. Overlay UI and copy

### 11.1 Tokens and styles

All overlay styles stay under `.shelf-root` (the homepage root element) and the existing `shelf-` classes. Do not touch `body`, global tokens or shared stylesheets.

The overlay keeps Geist, the face it already uses, so the homepage chrome still matches the rest of the site.

```css
.shelf-root {
  --shelf-ink: #f2eadf;
  --shelf-ink-2: #c9bba8;
  --shelf-glass: rgb(24 18 13 / 0.55);
  --shelf-glass-line: rgb(255 236 214 / 0.14);
  --shelf-card: rgb(246 239 228 / 0.9);
  --shelf-card-ink: #241c15;
  --shelf-card-ink-2: #5b4c3e;
  --shelf-focus: #f0b867;
  --shelf-focus-on-card: #241c15;
  background: #0e1218;
  color: var(--shelf-ink);
}

.shelf-brand { color: var(--shelf-ink); font: 650 18px/1.2 Geist, system-ui, sans-serif; }
.shelf-role { display: block; margin-top: 2px; color: var(--shelf-ink-2); font: 400 13px/1.4 Geist, system-ui, sans-serif; }

.shelf-links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--shelf-glass-line);
  border-radius: 999px;
  background: var(--shelf-glass);
  color: var(--shelf-ink);
  backdrop-filter: blur(14px) saturate(1.2);
}
.shelf-links a:hover { background: rgb(40 30 22 / 0.7); }
@media (pointer: coarse) { .shelf-links a { min-height: 44px; } }

.shelf-root :focus-visible { outline: 2px solid var(--shelf-focus); outline-offset: 3px; }
.shelf-card :focus-visible { outline-color: var(--shelf-focus-on-card); }

.shelf-card {
  max-width: 34ch;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--shelf-card);
  color: var(--shelf-card-ink);
  backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.4), 0 12px 32px -8px rgb(0 0 0 / 0.5);
}
.shelf-card-title { font: 600 16px/1.3 Geist, system-ui, sans-serif; }
.shelf-card-line { margin-top: 4px; color: var(--shelf-card-ink-2); font: 400 14px/1.45 Geist, system-ui, sans-serif; }

.shelf-exit { position: fixed; inset: 0; z-index: 100; pointer-events: none; opacity: 0; }

@media (prefers-reduced-transparency: reduce) {
  .shelf-links a { background: #1c150f; backdrop-filter: none; }
  .shelf-card { background: #f6efe4; backdrop-filter: none; }
}
```

**Contrast**, computed for glass over both the darkest and the lamp-lit parts of the scene:

| Pair | Ratio | Required | Result |
|---|---|---|---|
| `--shelf-ink` on chrome glass (dark or lit area) | 15.72 / 13.83 | 4.5 | Pass |
| `--shelf-ink-2` on chrome glass (dark or lit area) | 9.96 / 8.76 | 4.5 | Pass |
| `--shelf-card-ink` on the card | 11.95 or more | 4.5 | Pass |
| `--shelf-card-ink-2` on the card | 5.87 or more | 4.5 | Pass |
| `--shelf-focus` ring on the scene (dark or lit area) | 10.60 / 7.67 | 3 | Pass |
| `--shelf-focus` ring on the card | 1.27 | 3 | Fail. Inside the card the ring uses `--shelf-focus-on-card` (11.95). |

### 11.2 Layout

**Header**

- Left: "Jay Harwani", with a new role line under it.
- Right: the Email and LinkedIn pills, as today.

**Hint.** The pill stays bottom center and takes the dark glass style.

**Card (desktop).**

- Placement: beside the hovered book's projected bounding box, 16 px away, on the side with more room. It never covers the book and stays inside a 16 px viewport margin.
- Content: the project name, then one line.
- No number, no em dash and no action button. The shelf hint already says what to do.
- Position it when the hover starts and on resize, not every frame.

**Bottom sheet (touch).**

- Content: the name, the line, an "Open case study" button and the project's live link, using its existing label.
- Behavior: it slides up 300 ms and dismisses on Escape, an outside tap, or a downward swipe.

### 11.3 Copy deck

| Element | Copy |
|---|---|
| Header role line (new) | Product designer who writes the front end |
| Hint | Four projects. Pick one off the shelf. (unchanged) |
| Nameplate (A2) | JAY HARWANI, with PRODUCT DESIGNER on a second line |
| Friction card | Friction. Reads ten thousand app reviews a week and returns the 25 problems people keep running into. |
| Headroom card | Headroom. A money app that shows what is safe to spend before payday. |
| Signal card | Signal. `[VERIFY: A live map of tech, design and AI events around DC, Maryland and Virginia.]` |
| Bumper card | Bumper. `[VERIFY: A Chrome extension that asks one question before an impulse buy.]` |
| Touch sheet button | Open case study |
| Live link labels | Unchanged: "Open site", "Open app", "Open map", "Chrome Web Store" |

- **Sources.** The Friction and Headroom lines restate each case study's own intro. Jay confirms the two `[VERIFY]` lines.
- **Card layout.** The card title is the name alone; the period in the table separates title from line, and the card shows them on two lines.
- **Voice.** Plain English, sentence case, no em dashes or en dashes, no hype words. The nameplate is the one place where capitals are right, because it is an engraved object.

---

## 12. Loading, fallbacks and accessibility

### 12.1 Loading sequence

1. **Poster first.** The HTML paints at once: the header, the hint and a poster image of the finished scene behind the canvas. The poster uses `public/shelf/poster-1440.avif` and `poster-800.avif` with fixed dimensions and `object-fit: cover`. Set `fetchpriority="high"` in lowercase, because React 18 does not recognize the camelCase `fetchPriority` prop. The poster is the LCP element.
2. **Scene loads.** The scene chunk and its assets load through Suspense. No spinner.
3. **Handover.** When the assets are ready and two frames have rendered, the canvas fades in over the poster (opacity 0 to 1, 400 ms). Then the poster is removed.
4. **Failure.** If WebGL is unavailable, the context is lost or an asset fails, keep the poster and show the project list (Section 12.2) as a visible list on dark glass. Every project stays one click away.

**Making the poster.** After Phase 5:

1. Capture the finished scene with the overlay hidden, behind a development-only flag.
2. Take two captures at device pixel ratio 2: 1440 x 900, and 800 x 1000 with the mobile framing.
3. Export them as AVIF at 150 KB and 90 KB or less.
4. Capture again whenever the scene changes.

### 12.2 Accessibility

- **The canvas.** Add `aria-hidden="true"` to the canvas. The HTML list `.shelf-index` carries every project, link and description.
- **Keyboard order.** Skip link, name, Email, LinkedIn, then the four project items. Focusing an item pulls its book out and shows the card. Enter opens the item and Escape puts the book back.
- **Visible focus (WCAG 2.4.7).** When focus is inside `.shelf-index`, the list becomes visible as a compact panel at the bottom left of the viewport (`:focus-within`), so the focused link is visible. "Skip to the work" moves focus into this list.
- **The card.** It is always `aria-hidden="true"`. Pointer users see it; keyboard and screen reader users get the same text from the list.
- **Targets.** Pills and buttons are at least 40 px tall, or 44 px on coarse pointers.
- **Motion and transparency.** Follow the reduced motion contract (Section 10.4) and the reduced transparency styles (Section 11.1).
- **Contrast.** Section 11.1.

---

## 13. Performance budget and asset pipeline

### 13.1 Budgets

| Metric | Desktop, high tier | Mobile, low tier | How to measure |
|---|---|---|---|
| LCP (the poster) | 1.2 s or less | 2.0 s or less on Fast 4G | Lighthouse, Chrome DevTools MCP |
| 3D payload (models, textures, font) | 3.0 MB or less | 1.6 MB or less | Network panel |
| GPU texture memory | 120 MB or less | 60 MB or less | Count maps by size; `renderer.info` in development |
| Triangles | 350k or less | 150k or less | `renderer.info.render.triangles` |
| Draw calls | 120 or less | 80 or less | `renderer.info.render.calls` |
| Frame time | 16.7 ms or less at 1440 x 900, device pixel ratio 1.5, on Jay's laptop | 33 ms or less with 4x CPU throttling and a mobile viewport | Chrome DevTools MCP `performance_start_trace` and `emulate` |
| Layout shift | 0 (the poster has fixed dimensions) | 0 | Lighthouse |
| Console output | None | None | `list_console_messages` |

**Texture memory.** WebP decodes to uncompressed RGBA on the GPU. A 2K map with mipmaps costs about 22 MB, a 1K map about 5.6 MB and a 512 px map about 1.4 MB. Allowed sizes:

- **2K:** the walnut maps only.
- **1K:** the plaster, the linen and the larger props.
- **512 px:** small props.

Use KTX2 (Section 13.2) if the mobile tier exceeds its memory budget.

### 13.2 Asset pipeline

1. **Download from Poly Haven.**
   - Models as glTF with 1K textures.
   - Surface textures as JPG: walnut at 2K, the others at 1K.
2. **Optimize each model** with gltf-transform 4.5.1. The flags below were checked against its help output.

```bash
npx @gltf-transform/cli@4.5.1 optimize Camera_01.gltf public/shelf/models/camera.glb \
  --compress meshopt --texture-compress webp --texture-size 512 \
  --simplify true --simplify-ratio 0.3 --simplify-error 0.001
```

| Asset | Poly Haven polycount | Texture size | `--simplify-ratio` | Aim for |
|---|---|---|---|---|
| `Camera_01` | 26,987 | 512 | 0.3 | about 8k triangles |
| `desk_lamp_arm_01` | 25,710 | 512 | 0.35 | about 9k triangles |
| `potted_plant_02` | 69,806 | 1024 | 0.2 | about 14k triangles |
| `ceramic_vase_02` or `_03` | check | 1024 | 0.5 | under 5k triangles |
| `office_notepads`, `stationery_supplies` | check | 512 | 0.4 | under 6k triangles each |
| `decorative_book_set_01` | check | 512 | 0.4 | under 6k triangles |

3. **Check each result** in a glTF viewer: silhouette intact, no holes, textures correct. If a model breaks, raise the ratio.
4. **Convert surface textures** to WebP:
   - Color and roughness maps at quality 82.
   - Normal maps at quality 92 or lossless, so the grain does not band.
   - Name files `walnut_diff_2k.webp`, `walnut_nor_gl_2k.webp` and so on, under `public/shelf/tex/`.
5. **Loading.** drei's `useGLTF` decodes meshopt by default, and three's GLTFLoader reads WebP textures. Preload the hero assets with `useGLTF.preload` once the poster has painted.
6. **Optional KTX2.** `--texture-compress ktx2` cuts GPU memory several times over. It needs KTX-Software installed locally, and the Basis transcoder files copied into `public/` so no third-party request is made. Use it if the mobile tier exceeds 60 MB.

---

## 14. Build plan

**Every phase ends the same way:**

- Run `node scripts/check-home-scope.mjs main`.
- Take screenshots at 1440 x 900 and 390 x 844.
- Report each acceptance check as pass or fail, with evidence.
- Stop and wait for Jay.

### Phase 0. Baseline and scope (no code changes)

**Tasks**

1. Create the branch `shelf-walnut`.
2. Take screenshots of the homepage at 1440 x 900 and 390 x 844. Then screenshot every case study route (`/friction`, `/headroom`, `/signal`, `/bumper` and any others) at both sizes, at the top of the page and one screen down. Save them all to `docs/baseline/`.
3. Read each case study's computed body background color. These are the exit colors (Section 9.3).
4. Take a value reading of the current homepage: dark share, mean luma and clipped share.
5. Report the current setup:
   - renderer settings (tone mapping, exposure, shadow type, device pixel ratio);
   - every light, with its intensity and position;
   - the full EffectComposer chain, including whether a ToneMapping effect exists;
   - materials per object;
   - triangle and draw-call counts;
   - the files that make up the homepage.
6. Add `scripts/check-home-scope.mjs` (Section 0.2) and fill its allowlist with the homepage files. Jay approves the list.

**Acceptance**

- The baseline files exist.
- Jay has approved the allowlist.
- The report is complete.
- The scope check passes.
- Nothing on screen has changed.

### Phase 1. Light and value (no new assets)

**Tasks**

1. Move the wall, wood and prop colors to the base tokens (Section 3.4), keeping the current procedural materials for now.
2. Replace the current lights with the rig in Section 5.
3. Put `ToneMapping` (AGX) at the end of the chain (Section 6.1). Pin `postprocessing@6.39.5` if needed.
4. Add fog.
5. Add the development-only value meter (Section 5.4).

**Acceptance**

- At 1440 x 900, dark share is 0.75 to 0.88, mean luma is 30 to 50, and the clipped share is 0.002 or less.
- The books are the brightest, most saturated objects in the frame.
- There is no visible banding on the dark wall.
- The scene runs at 60 fps on Jay's laptop.
- The scope check passes.

### Phase 2. Materials

**Tasks**

1. Download and convert the textures (Sections 4.1 and 13.2).
2. Build the walnut boards, plaster wall, bookcloth, paper, brass, stoneware and leaf materials (Section 4.2).
3. Bevel and thicken the shelf boards (Section 4.3).

**Acceptance**

- At 100% zoom the shelf reads as dark walnut: grain is visible and no tiling repeat shows.
- The value targets still pass.
- Texture memory is within budget.
- The scope check passes.

### Phase 3. Books

**Tasks**

1. Build the new book construction (Section 9.1).
2. Add the Clash Display spines with foil and ink (Section 9.2) and the book data (Section 9.3).
3. Add the bookend.
4. Load the card copy (Section 11.3).

**Acceptance**

- Spine type is crisp at both sizes, and the smallest spine text is at least 11 px tall.
- The books sit flush with each other and the shelf, with no z-fighting.
- Hover and click still work.
- The scope check passes.

### Phase 4. Set dressing

**Tasks**

1. Remove the generic props (Section 8.2).
2. Optimize, add and place the Poly Haven props (Sections 8.1 and 13.2).
3. Restyle the foliage and add the two vines (Section 8.3).
4. Build the nameplate.

**Acceptance**

- Prop counts and empty space are within the limits in Section 8.2.
- Nothing overlaps the books or the nameplate from the camera's view.
- Triangles and draw calls are within budget.
- The scope check passes.

### Phase 5. Camera, post-processing and motes

**Tasks**

1. Add the desktop, tablet and mobile camera presets (Section 7).
2. Build the post-processing chain for each tier (Section 6.2).
3. Add the motes (Section 8.4).
4. Add tier selection and `PerformanceMonitor` (Section 6.3).

**Acceptance**

- **Composition:** the books span 24% to 30% of the width on desktop and 64% to 72% on mobile, and the nameplate is legible.
- **Values:** the targets still pass after post-processing.
- **Frame time:** within budget, including the mobile tier at 4x CPU throttling.
- The scope check passes.

### Phase 6. Interactions and overlay

**Tasks**

1. Build every state in Section 10.1, with GSAP.
2. Build the touch bottom sheet.
3. Map keyboard focus to the books, and make the list visible on focus (Section 12.2).
4. Restyle the overlay and add the role line and the card (Section 11).
5. Add the exit fade (Section 10.3).

**Acceptance**

- Every state works with a mouse, a keyboard and touch.
- The reduced motion contract holds.
- The contrast table passes.
- Opening each project lands on its case study with no flash of the wrong color.
- The scope check passes.

### Phase 7. Loading, fallbacks, QA and ship

**Tasks**

1. Make the poster images and the canvas fade-in (Section 12.1).
2. Build the no-WebGL and context-loss fallback.
3. Measure the budgets (Section 13.1) on the production build (`npm run build` and `npm run preview`).
4. **Regression.** Screenshot every case study again and compare with Phase 0. They must be identical.
5. Run Impeccable's `audit` on the overlay and Emil Kowalski's `review-animations` on the book motion.

**Acceptance**

- The budgets are met.
- The case study screenshots are identical to Phase 0.
- There is no console output.
- The scope check passes.
- Jay approves the final screenshots.

### Phase 8 (optional, after shipping). Baked lighting

This is the last step toward the reference's realism.

- Rebuild the static set (boards, wall, static props) in Blender and bake its lighting with Cycles.
- Apply the bakes as `lightMap` and `aoMap` on the static materials.
- Keep the real-time key light for the books only.

Do this only after Phase 7 has shipped. It changes the workflow, not the design.

**Acceptance**

- Soft shadows and bounce light improve visibly in a side-by-side comparison.
- The payload stays within budget.

---

## 15. Skills and tools

The install commands were checked on October 7, 2026.

| Tool | Use here | Install |
|---|---|---|
| Official GSAP skills | Book motion and cleanup | `npx skills add https://github.com/greensock/gsap-skills` |
| Emil Kowalski's skills | `review-animations` and `improve-animations` on the book states | `npx skills@latest add emilkowalski/skills` |
| Impeccable | `audit` and `critique` on the overlay | `npx impeccable install`, then `/impeccable init` |
| Chrome DevTools MCP | Screenshots, `performance_start_trace`, `emulate` (CPU throttling, mobile viewports), `lighthouse_audit`, `list_console_messages` | `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` |

When a skill disagrees with this file, this file wins. Skills commonly suggest:

- adding a smooth-scroll library;
- adding a custom cursor;
- upgrading to React 19;
- changing global styles.

All four are out of scope here.

---

## 16. Open questions for Jay

Each question shows the default in force until Jay answers.

| # | Question | Default |
|---|---|---|
| Q1 | Nameplate text | "JAY HARWANI" over "PRODUCT DESIGNER" (A2) |
| Q2 | Add one personal object, such as the brass diya lantern? | None (A3) |
| Q3 | Wall: cool slate or warm umber? | Cool slate (A1) |
| Q4 | Are the Signal and Bumper card lines accurate? | Marked `[VERIFY]` |
| Q5 | Include a figurine like the reference? | No (A4) |
| Q6 | Mirror the shelf so the lamp sits on the right, as in the reference? | Optional. Keep the current orientation if that is less work. |
| Q7 | Add a resume link to the header? | No change |

---

## 17. Sources (checked October 7 and 8, 2026)

**Jay's build (`localhost:4173`)**

- React 18.3.1 and three.js r169 (`window.__THREE__`).
- The `BookshelfScene` chunk (935 KB uncompressed) and the palette and exposure values in it.
- The DOM structure of the HTML layer, and the fonts loaded.
- The screenshots, hover state and Friction case study.

**Reference image (Jay's upload)**

- Luminance histogram: 85% of pixels under luma 60, mean luma 35.
- Per-material color samples at the shadow, mid and lit percentiles.

**npm registry**

- `@react-three/fiber` 8.18.0, `@react-three/drei` 9.122.0 and `@react-three/postprocessing` 2.19.1 are the newest releases supporting React 18. The current majors (9, 10 and 3) require React 19.
- `postprocessing` 6.39.5 includes `ToneMappingMode.AGX` and declares a peer range of three 0.168 to 0.186. Version 6.32.1 has no AGX mode.
- `@react-three/postprocessing` 2.19.1 `EffectComposer` source: it sets `gl.toneMapping` to `NoToneMapping` while rendering.
- `@react-three/fiber` 8.18.0 source: it sets ACES Filmic once on creation, then applies the Canvas `gl` prop with `applyProps`.
- drei 9.122.0 exports `Sparkles`, `SoftShadows`, `Environment` (with `environmentIntensity`), `Lightformer`, `Text`, `PerformanceMonitor` (with `onFallback`), `useGLTF` and `useKTX2`.
- `troika-three-text` README: TTF, OTF and WOFF are supported; WOFF2 is not.
- `@gltf-transform/cli` 4.5.1 `optimize --help`: compression, texture and simplification flags, and their defaults.

**Poly Haven**

- License page: all assets CC0, with no credit required. https://polyhaven.com/license
- Asset catalog API (https://api.polyhaven.com): category listings for models, textures and HDRIs.
- Asset details for `desk_lamp_arm_01`, `Camera_01` and `potted_plant_02`.
