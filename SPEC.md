# Design specification

## 1. Concept

The page is shot, not laid out. It opens like a title sequence, the viewer
travels through a 3D space as they scroll, and each project surfaces as a live
working artefact rather than a screenshot. Restraint everywhere except the
background, which is the only place that is allowed to be spectacular.

Positioning line: *Designs it. Then ships it.* The second half is outlined
rather than filled, so the headline visually separates design from build.

## 2. Tokens

```css
--void:   #05070C;   /* page + canvas base            */
--paper:  #EEF1F5;   /* text, cool white              */
--gold:   #E9C58B;   /* accent 1 · route, Bumper      */
--cyan:   #5FD3D8;   /* accent 2 · Signal             */
--violet: #8B7BE8;   /* accent 3 · ChronoWeave        */
--mint:   #5FD8A4;   /* accent 4 · Headroom, "open"   */
--accent: var(--mint);  /* live, swapped at runtime   */

--ease-out: cubic-bezier(.16, 1, .3, 1);   /* everything entering */
--gut: clamp(22px, 5vw, 64px);             /* page gutter         */
```

`--accent` is set on `document.documentElement` at runtime — by the hovered
project in the work list, and by the active section elsewhere. Everything that
glows reads from it, so the whole page re-tints together.

## 3. Type

Geist only. Geist Mono for labels, data, and annotations.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Display (h1) | `clamp(3.1rem, 11.5vw, 10.5rem)` | 200 | -.055em | .84 |
| Contact headline | `clamp(2.9rem, 10vw, 8.4rem)` | 200 | -.05em | .88 |
| Contact links | `clamp(2.2rem, 6.6vw, 5.2rem)` | 200 | -.045em | 1 |
| Project title | `clamp(1.7rem, 4.6vw, 3.2rem)` | 200 | -.04em | 1 |
| Body / byline | `clamp(14px, 1.4vw, 16.5px)` | 400 | -.01em | 1.6 |
| Eyebrow | 10.5px mono | 400 | .12em | — |

No italics on headings. No accenting a single word in a different colour.

## 4. Motion language

- Durations: micro 120ms, short 220–300ms, long 550–800ms, orchestral 1.4–2.6s.
- Easing: `--ease-out` for anything entering or settling. Nothing overshoots.
- One orchestrated moment per screen. No fade-and-slide on every element.
- Stagger caps at 500ms total.

### Title sequence (page load, once)
```
0.10s  hairline scales from centre, gold→cyan gradient
0.80s  hairline fades; two half-height bars slide off top and bottom (1.5s)
1.50s  headline line 1 masks up through blur(12px)
1.67s  headline line 2
2.15s  byline fades up
2.40s  hemline (availability + scroll cue) fades up
2.60s  right-hand rail fades in
2.70s  bar/slit elements removed from the DOM
```
Skipped entirely under `prefers-reduced-motion`.

## 5. Background — the 3D field

One `<canvas>` fixed at `z-index: 0`, full viewport, `position: fixed`.
Hand-rolled 3D: rotation matrices, perspective divide, depth fog. No library.
Ready-made engine in `src/lib/field.ts`.

- **Lattice**: 13 × 6 × 13 points, 155 unit spacing. Every 19th point is an
  accent colour and renders as a glowing disc; the rest are 1–3px squares.
- **Perspective**: `scale = F / z`, `F = max(W, H) * 0.62`.
- **Fog**: `alpha = fog² × 0.58` where `fog = 1 - (z - 300) / 1900`.
- **Camera rotation**: mouse position maps to ±0.55 rad on Y, ±0.35 rad on X,
  lerped at 0.045 per frame.
- **Camera dolly**: the smoothed scroll value × 0.55. Depth wraps modulo the
  lattice span so the field is infinite.
- **Warp**: scroll velocity (the per-frame delta of the smoothed value) stretches
  every point into a streak along its depth axis. Multiplier 3.2, clamped ±90.
  This is the signature effect — it must respond to real input, never a timer.
- **Horizon floor**: lines parallel to X at `y = +300` below the lattice,
  receding to the vanishing point, alpha `fog² × 0.08`.
- **Volumetric lights**: three large radial gradients drawn in `lighter`
  composite mode beneath the lattice. Light 1 takes `--accent`; lights 2 and 3
  are fixed cyan and violet. They drift on sine paths and shift with the mouse.
- **Assemble**: on load, points start 3.4× spread and converge over ~1.8s.

Overlaid on top: an animated SVG-noise grain layer at 12% opacity in `overlay`
blend, and a vignette weighted toward the lower left.

## 6. Smoothed scroll

```ts
prev = smooth;
smooth = lerp(smooth, window.scrollY, 0.075);
velocity = smooth - prev;
```
`smooth` drives the camera dolly and the hero exit. `velocity` drives the warp.
The page itself scrolls natively. Never transform a scroll wrapper.

## 7. Sections

### Hero
Two-line headline, one byline, and a line pinned to the bottom edge holding
availability (left, pulsing mint dot) and a scroll cue (right, trickling line).
Nothing else. On scroll it exits rather than scrolling away: drifts at 0.2× the
page, scales to 0.94, fades to 0.15, blurs to 7px over one viewport height.

### The Route
Left: a 760×420 stage. A dotted grid, a cubic bezier arc from Ahmedabad to
Baltimore, two pins with expanding halos, and a distance counter.
On entry, one 2.4s exponential ease-out drives three things at once — the arc's
`stroke-dashoffset`, a light travelling along the path via `getPointAtLength`,
and the counter ticking to **12,382 km** (verified great-circle distance; the
old 10,957 figure was wrong).

The travelling light carries `backdrop-filter: brightness(2.6)` so the dot grid
genuinely brightens beneath it and falls dark behind. This is the effect that
makes the section; do not replace it with a drawn glow.

Right: the degree line and eight tool marks that stagger in and tilt in 3D on
hover.

### Work
A typographic index, not a card grid. Hovering a row:
- indents the row toward the cursor (magnetic, 18–28px)
- draws an accent hairline with glow across the full width
- dims every other title to 0.3
- reveals a "Case study" label in the accent colour
- cross-fades that project's live mockup into a sticky panel on the right and
  replays its animation
- eases `--accent` and the canvas lights to that project's colour

Four projects, each with a hand-built animated mockup (see `src/data/projects.ts`):

| Project | Accent | Mockup |
|---|---|---|
| Headroom | mint | Amount counts to $412, five day-columns fill, today ringed |
| Signal | cyan | Six event pins drop with halos, tooltip resolves, counter to 14 |
| ChronoWeave | violet | Ring draws, digits tick down live from 24:00, wave pulses |
| Bumper | gold | Cart loads, interstitial pops from blur, cursor presses the button |

Below 1000px the sticky panel is dropped and each mockup stacks under its own
row, triggered by IntersectionObserver.

### Contact
Headline *Let's build something.* masks up on entry.
Two large links, Email and LinkedIn. On hover each word rolls over letter by
letter — every character has a duplicate stacked below it, top rolls up, accent
copy rolls in, staggered 26ms. An arrow exits up-right while a second enters
from below-left inside a clipped box. The address fades up in mono beneath.
An accent bar wipes across the underline from the left over 800ms.
Both links pull toward the cursor.

Then a film-credit block: role left, value right, mono at 10.5px.
**No GitHub link anywhere.** Jay is a designer; it is deliberate.

### Rail
Fixed right edge, desktop only. Four markers tracking the active section. The
active marker extends its line to 32px and takes the current accent. Hovering
reveals the section name. Also functions as navigation.

## 8. Content

Copy lives in `src/data/`. Do not invent metrics, testimonials, or client logos.
Case study routes: `/headroom`, `/signal`, `/chronoweave`, `/bumper`.
Email: harwanijay9498@gmail.com · LinkedIn: in/jay-harwani
