# Hero redesign: "Designs it. Then ships it."

Instructions for Claude Code. Site: jayharwani.com (React + Vite, GSAP with ScrollTrigger, Lenis, a three.js particle field). Owner: Jay Harwani.

This file describes three things to build. They work as one story:

1. **The new hero visual.** A live product card replaces the particle sphere. It shows Jay's four shipped products, with a code lens that shows the code behind the pixels, design-tool marks, and floating 3D shapes.
2. **The first-visit intro.** It plays when someone opens a link to the portfolio. The everyday mess the products fix is pulled together into the card. It takes 3.4 seconds and can be skipped at any moment.
3. **The scroll hand-off.** As the visitor scrolls, the lens grows until the whole card is code, the code becomes particles, and the field's own morph carries them into case study 01 (Healthy Switch).

The idea behind all three: *something messy becomes one clear thing, and every pixel of it is real code.* That is the hero's byline ("Each one takes something messy and gives back one clear thing.") and its headline, made visible.

---

## 0. How to use this file

1. Read the whole file first. Then open the three images in `reference/`. They are the visual source of truth for the look.
2. Do **Phase 0 (audit)** in section 19 before writing any code. Section 3 lists what was verified on the live site on 27 October 2026, including the minified bundle. Confirm each item against the source and report any difference before building.
3. Build in the phases of section 19. After each phase, run the site and take screenshots at the sizes in section 20. Compare them with the reference images.
4. `data/hero-cards.ts` holds all card content (copy, numbers, code text, overlay targets) and a small syntax tokenizer. Import it. Do not retype the content into components.
5. `reference/mockup/hero-mockup.html` is a static 1920 × 1080 mockup. Open it with `?state=final`. The other states are `messy`, `assemble`, `designed`, `next`, `full`, `burst`, `stream` and `chapter`. Use it for colours, type, spacing and code styling. Do not port its hard-coded positions or its canvas tricks.
6. When sources disagree:
   - this file wins for layout, behaviour and colour;
   - `data/hero-cards.ts` wins for copy and code text;
   - the mockup and the reference images win for anything visual that neither states.

   The images were made before the palette was locked. Their selection blue, marker red, error red and string green are replaced by palette colours (section 5.1).
7. Keep the repo's code style, file structure and naming. Work inside the existing home page module and its particle field. Add new files only where the repo's structure suggests.

---

## 1. Ground rules

### 1.1 Keep exactly as it is

- **Hero copy:**
  - eyebrow "Product designer who writes the front end";
  - headline "Designs it." / "Then ships it.";
  - byline "Four shipped, one concept. Each one takes something messy and gives back one clear thing.";
  - the reel button and "Learn about me in 60 seconds";
  - the scroll cue.
- **The headline's look and its scroll-linked ink.** Line 2, "Then ships it.", is an outline that fills with ink as the hero scrolls:
  - GSAP ScrollTrigger tweens `--ink` from 100% to 0% between `top top` and `40% top`, with scrub 0.6.
  - The hand-off is timed around it. Do not re-implement it.
- **The hero's other scroll tweens:**
  - `.rs-hero-copy` moves to `y: -24, opacity: 0` between `55% top` and `bottom top`;
  - the cue fades out over the first 80px.
- **The skip link** `a.rs-skip` ("Skip to the work").
- **Everything below the hero:**
  - chapters, panels, title animations and the rail;
  - the field's formations and the morphs between chapters. Jay likes these, and the hand-off reuses them.
  - Chapter Light (`.rs-atmos`), grain, Lenis, fonts and the footer.
- **The case study pages:** `/friction`, `/headroom`, `/signal`, `/bumper` and the Healthy Switch case study.

### 1.2 Hard rules

- **Locked palette** (5.1). No new hues. New tones may only be:
  - alpha steps of `--paper`;
  - the dark card surfaces listed in 5.1.
- **Performance budget** (section 18):
  - no second WebGL context;
  - no new runtime library. GSAP, ScrollTrigger, SplitText, Lenis and three.js r169 are already in the bundle.
- **Zero debug code in production:** no `console.*`, no test UI, no leftover mockup code.
- **Accessible and reduced-motion safe** (section 17).
- **Motion uses the site's spring tokens** wherever a token fits (5.3).
- **Naming:**
  - prefix every new class with `hc-` or `hero-`, and every new custom property with `--hc-`;
  - the site already uses `--ink` (the ink clip amount), `--accent`, `--k0` and `--k1`. Do not reuse those names.

---

## 2. Package contents

```
hero-redesign/
  HERO_REDESIGN_SPEC.md              this file
  data/
    hero-cards.ts                    card content for all four products, plus the code tokenizer
  assets/shapes/                     five 3D token shapes, transparent, square with 24px padding
    clover-mint.webp      (320px)    clover-mint@2x.webp      (640px)    + .png fallbacks
    cookie-lilac.webp                cookie-lilac@2x.webp
    sunny-amber.webp                 sunny-amber@2x.webp
    pill-coral.webp                  pill-coral@2x.webp
    flower-sky.webp                  flower-sky@2x.webp
  reference/
    01-hero-at-rest.png              the resting hero (3840 x 2160)
    02-intro-and-interactions.png    intro beats and interactions storyboard
    03-scroll-handoff.png            scroll hand-off storyboard
    mockup/hero-mockup.html          static reference mockup (open with ?state=...)
    mockup/shape-generator.html      the three.js recipe that rendered the shapes
    mockup/fonts/                    fonts used by the mockup, including the Instrument Serif italic subset
```

Where to put things:

- `assets/shapes/*` → `public/hero/shapes/`. Total weight is about 120 KB at 2x WebP.
- `data/hero-cards.ts` → next to the home page module, for example `src/<home>/hero/heroCards.ts`.
- `reference/` → `docs/hero-redesign/reference/`. It is not shipped.

---

## 3. What exists today (verified on the live site at 1664 × 941, DPR 1.5)

### 3.1 Stack

- React and Vite. The home page is its own chunk, `HomeResolve-*.js`. It holds the hero, the chapters, the particle field, the scroll driver and the project data.
- Separate vendor chunks:
  - `gsap`: GSAP with ScrollTrigger and SplitText registered;
  - `lenis`: the `html` element has the class `lenis`;
  - `three`: three.js r169, so `window.__THREE__ === "169"`.

### 3.2 Layers (children of `div.v2.rs`, in DOM order)

| Element | Role |
|---|---|
| `div.rs-atmos` | Chapter Light. Fixed, z 1. One layer per key (`.atm-k[data-k]`): `hero`, `healthy`, `friction`, `headroom`, `signal`, `bumper`, `end`. The active one has `.on`. Today's hero key: `#EEF1F5` at 7% (core) and 3% (mid), centred at 64vw / 50vh, 74vw × 118vh. |
| `canvas.rs-field` | The particle field. Fixed, z 2, WebGL2 through three.js. Desktop mask: `linear-gradient(90deg, transparent 0%, #000 11%, #000 89%, transparent 100%)`. Stacked mask: `linear-gradient(#000 0 40%, transparent 70%)`. |
| `div.rs-grain` | Grain. Fixed, z 4, opacity 0.035. |
| `a.rs-skip` | "Skip to the work", links to `#work`. |
| `nav.rs-rail` | Progress rail. Fixed, z 6, `right: 0`, 96px wide, vertically centred (y 311 to 630 at 1664 × 941). |
| `main` | z 5. Children: `section#top.rs-hero.rs-shell` and `section#work.rs-track`. |
| `footer.rs-foot` | Contact: "Available now", "Let's build something." |

`.v2.rs` attributes:

- `data-zone`: `hero`, `work` or `end`;
- `data-side`: `left` or `right`;
- `data-choreographed`;
- inline `--chapter-accent` (`#EEF1F5` in the hero) and the motion tokens.

Chapters are `#work article.rs-chapter.rs-stop[data-accent]`, with `data-accent` set to `healthy`, `friction`, `headroom`, `signal` or `bumper`. The active chapter has `data-on`. Each chapter's text sits in a sticky `.rs-panel`. The contact block `.rs-reach` is also an `.rs-stop`.

### 3.3 Hero DOM

```
section#top.rs-hero.rs-shell
  div.rs-hero-copy
    p.mono.rs-eyebrow                       Geist Mono 12.5px
    h1.rs-display                           Geist 800, var(--t-display)
      span.rs-line > span                   "Designs it."
      span.rs-line > span.rs-outline        "Then ships it."  (1.5px stroke, transparent fill)
                     > span.rs-ink          ink copy, clip-path: inset(0 var(--ink, 100%) 0 0)
    p.rs-byline
    div.rs-reel-row > button.rs-reel        video.rs-reel-peek, span.rs-reel-play, svg.rs-reel-dial
                    + span.rs-reel-say      "Learn about me in 60 seconds" (opacity 0 until hover)
  p.mono.rs-cue > span.rs-cue-line          "Scroll"
```

Relevant CSS:

- `.rs-hero`: `min-height: 100svh`, flex column, `justify-content: center`.
- `.rs-line`: `overflow: clip`, which is what the line rise animates inside.
- `.rs-display span`: `display: block`, so the `.rs-outline` box is as wide as the column, wider than its text.
- **Stacked hero** (under the query in 3.6):
  - `justify-content: flex-end` and `padding-bottom: var(--s-7)`;
  - a background gradient that darkens from 34% to 52% of the hero, so the text at the bottom reads over the field at the top.

### 3.4 Tokens on `.v2.rs`

| Group | Tokens |
|---|---|
| Colour | `--void #05070C`, `--paper #EEF1F5`, `--ink-1: var(--paper)`, `--ink-2: rgb(238 241 245 / .62)`, `--ink-3: rgb(238 241 245 / .55)`, `--ink-deco: rgb(238 241 245 / .14)` |
| Accents | `--accent-healthy #DDA8E4`, `--accent-friction #F7A792`, `--accent-headroom #8ED09C`, `--accent-signal #8CC3FC`, `--accent-bumper #E0B771` |
| Type | `--t-display: clamp(56px, 7.2vw, 112px)` (stacked: `clamp(2.9rem, 12.6vw, 4.4rem)`), `--t-title: clamp(44px, 5vw, 80px)`, `--t-body: clamp(15px, 1.15vw, 17.5px)`, `--t-label: 12.5px` |
| Space | `--s-1` 4px, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32, `--s-7` 48, `--s-8` 64, `--s-9` 96, `--s-10` 128 |
| Layout | `--shell: 1320px`, `--gut: clamp(22px, 5vw, 64px)`, `--rail: 96px` from 900px wide (0 below) |
| Shape | `--r: 2px`, `--r-press: 10px` |
| Easing aliases | `--e-fast` (spatial-fast), `--e-move` (spatial-default), `--e-slow` (spatial-slow), `--e-hover` (effects-fast), `--e-fade` (effects-default), `--ease-out: cubic-bezier(.23,1,.32,1)`, `--d-short: .24s`, `--d-long: .56s` |

### 3.5 Motion system

The springs are Material 3 Expressive values. A table of stiffness and damping ratio is turned into tokens at runtime:

- CSS `linear()` easings `--spring-*` and durations `--dur-*`, written on `.v2.rs`, but only when the browser supports `linear()`;
- a JS helper that returns `{ duration, ease }` for GSAP from the same table. The current hero intro uses it.

The spring step is the standard unit-mass form: `v += (-k(x - target) - 2ζ√k · v) · dt; x += v · dt`, sampled at 1/120 s.

| Token | Stiffness | Damping ratio | Duration |
|---|---|---|---|
| `spatial-fast` | 800 | 0.6 | 400ms |
| `spatial-default` | 380 | 0.8 | 550ms |
| `spatial-slow` | 200 | 0.8 | 742ms |
| `effects-fast` | 3800 | 1 | 308ms |
| `effects-default` | 1600 | 1 | 417ms |
| `effects-slow` | 800 | 1 | 550ms |
| `formation` | 120 | 0.82 | 967ms |

### 3.6 Current hero behaviour

**Intro.** It plays on the first load of the session only, and never under reduced motion. The flag is `sessionStorage['rs-intro-played']`, set when the intro starts. It is a GSAP timeline:

| Time | Element | Animation |
|---|---|---|
| 0.15s | `.rs-line > *` | from `yPercent: 115` (spatial-default, stagger 0.08) |
| 0.5s | eyebrow, byline, reel row | from `opacity: 0, y: 8` (effects-default, stagger 0.08) |
| 1.4s | scroll cue | from `opacity: 0, y: 10`, 0.7s, `power2.out` |

The cue entrance lives with the scroll tweens. It is not session-gated, so it plays on every load.

**Field settle.** It runs on every load, except under reduced motion: `field.scatter(4.2)`, then turbulence from 1 to 0 over 3.4s (`power2.out`), settling into the `drift` sphere.

**Scroll:** the ink, copy fade and cue fade listed in 1.1.

**Reduced motion:** `--ink: 0%`, so line 2 is fully inked.

**Layout test** used by both the CSS and the field:

- desktop when `innerWidth >= 1024 && innerWidth / innerHeight > 1.25`;
- stacked otherwise. The CSS query is `(max-width: 1023.98px), (max-aspect-ratio: 5/4)`.

### 3.7 The particle field

**Basics.** three.js r169 on WebGL2. 5184 particles on a 96 × 54 grid. Each point is shaded as a lit sphere, and the device pixel ratio is capped.

**Instance API:**

| Method | Signature |
|---|---|
| `morph` | `morph(from, to, progress, time = 0, toProgress = progress)` |
| Frame and pointer | `tick`, `setPointer`, `setPointerPx` |
| Look | `setOpacity`, `setTurbulence`, `setAccent`, `setVelocity` |
| Placement | `setOffset(x, y = 0)`, `setFit`, `setCamera(x, y, z)` |
| Text avoidance | `setSafe(left, top, right, bottom)` |
| Effects | `scatter(strength = 3.4)` |
| Lifecycle | `resize`, `destroy` |

**Shader:**

- attributes: `aLit` (accent amount), `aSize`, `aSeed`, `aBlend`, `aVel`;
- uniforms: `uPaper`, `uAccent`, `uAccentPrev`, `uVoid`, `uLight`, `uSafe`, `uPointer`, `uPointerOn`, `uOpacity`, `uFocus`, `uFogNear`, `uFogDensity`, `uTime`, `uScale`, `uRes`.

**Formation registry** (one generator per name):

- `drift`, which is today's hero sphere;
- `healthy`, `friction`, `headroom`, `signal`, `bumper`, `reach`;
- `rest`, `sent`, `network`.

Scroll sequence: `["drift", "healthy", "friction", "headroom", "signal", "bumper", "reach"]`.

**Travel order per formation.** It sets the stagger order when a morph goes into that formation:

| Formation | Order |
|---|---|
| `drift` | down |
| `healthy` | across |
| `friction` | down |
| `headroom` | around |
| `signal` | along |
| `bumper` | across |
| `reach` | around |

The orders mean:

- `along`: by particle index;
- `around`: by angle;
- `across`: by x;
- `down`: by y.

Formations rebuilt every frame: `drift`, `reach`, `signal`.

**Palette object:** `void #05070C`, `paper #EEF1F5` and the five accents.

**Fit and offset:**

- desktop: `setFit(1)` plus a horizontal offset per stop;
- stacked: `setFit(min(.78, aspect / .74))` plus a vertical offset of 0.6, which lifts formations into the visible top area.

**Scroll driver:**

- It measures every `.rs-stop`. A stop's target is the scroll position at which its centre sits at the viewport centre.
- **Before the first stop:** the segment runs from `stop0 − innerHeight` to `stop0`, and morphs `drift` into `healthy`.
- **Between stops:** it morphs stop i into stop i+1.
- Every morph completes at 74% of its segment: `progress = ease(raw / 0.74)`.
- It lerps a per-formation camera and a per-stop offset.
- Every 0.12s it calls `setSafe` with the box of the active text block (the hero copy, the active panel, or the contact row), so particles stay off the text.
- It skips work when the scroll has not changed and no animated formation is involved.

### 3.8 Measurements at 1664 × 941

- **Viewport:** client width 1654 (the scrollbar is 10px). The shell runs from x 167 to 1487, and the text starts at x 231.
- **Headline:** 112px, line height 100.8px, letter spacing −5.82px (−0.052em). Line 1's text runs from x 231 to 757 and line 2's from 231 to 890. Measure the text node: the `.rs-outline` box is wider.
- **Vertical positions:** eyebrow y 261, byline y 538 (441px wide), reel button y 624 (56px), cue y 836.
- **Rail:** x 1558 to 1654, y 311 to 630.
- **Chapter 01:** top 941, height 1647. Its stop target is scroll 1294.
- **Hand-off timing:**
  - the `drift` → `healthy` morph runs from scroll 353 to 1294 and is complete at 1049;
  - the ink completes at scroll 376 (40% of the hero).

### 3.9 Content source

The home page code has the project list (`key, no, title, tag, year, href, accent, live, hook, panels`). `data/hero-cards.ts` was written from it. Facts the cards use:

| Product | Tag | Fact used |
|---|---|---|
| Headroom | "Local-first finance · React" | "Can I spend this, right now?" One number, not categories. It subtracts what is coming. |
| Friction | "Review mining · Astro" | Ten thousand reviews a week. Bands of ten thousand, then three thousand, then one hundred and fifty. |
| Signal | "Live event map · MapLibre" | Tech, design and AI events across DC, Northern Virginia and Baltimore. A layer shows which ones you can actually make. Republished every few hours. |
| Bumper | "Behavioural · Extension" | One question before checkout, scaled to the amount. No blocking, and no guilt. $279 reads as 45% closer to Tokyo. |
| Healthy Switch | "Concept, unaffiliated · React" | Chapter 01, where the hand-off lands. It is not on the card: the card shows the four shipped products, and Healthy Switch is the concept. |

---

## 4. The story, beat by beat

1. **Lands.** The page is dark. A line of light draws across where the card will be. Particles burst out of it with the everyday mess Jay's products fix: sticky notes, a receipt, a one-star review, an error toast. The headline rises into place.
2. **Assembles.** The mess is pulled in. The particles snap into a wireframe card, then the real interface lands on a spring.
3. **Designed.** Playful 3D shapes pop in around the card. Jay's cursor glides in and selects the button, with handles, a size label and a spacing mark.
4. **Shipped.**
   - A round lens opens on the card and shows the code under the pixels.
   - It follows the visitor's cursor, and drifts on its own when nobody moves.
   - The byline lands: "Each one takes something messy and gives back one clear thing."
5. **Four shipped.** Every 6.5 seconds, or on a tab click, the card rebuilds as the next shipped product: Headroom, Friction, Signal, Bumper.
6. **Scroll.**
   - The lens grows until the whole card is code, while "Then ships it." fills with ink.
   - The code turns into coloured particles.
   - The field's own morph carries them into case study 01, where they form its burger, leaf and toggle.
   - Scrolling back up rebuilds the card.

---

## 5. Design tokens

### 5.1 Colour (locked palette)

**Site tokens.** Use these by name.

| Role | Token |
|---|---|
| Page | `--void` #05070C |
| Primary ink | `--paper` / `--ink-1` #EEF1F5 |
| Product accents | `--accent-headroom` #8ED09C, `--accent-friction` #F7A792, `--accent-signal` #8CC3FC, `--accent-bumper` #E0B771 |
| Chapter 01 accent | `--accent-healthy` #DDA8E4 |
| Text on any accent fill (buttons, badges, size labels, notes) | `--void` |

**Card-local steps.** The card is a product screen with a denser hierarchy than the page, so it gets its own alpha steps of `--paper`. They are not new colours. Scope them to `.hero-stage`.

| Token | Value | Use |
|---|---|---|
| `--hc-ink-2` | `rgb(238 241 245 / .68)` | secondary text, the currency sign |
| `--hc-ink-3` | `rgb(238 241 245 / .42)` | mono labels, list meta, frame label |
| `--hc-ink-4` | `rgb(238 241 245 / .22)` | dashed wireframe, ghost button border |
| `--hc-line` | `rgb(238 241 245 / .07)` | list hairlines |
| `--hc-border` | `rgb(238 241 245 / .12)` | card border, tag borders |
| `--hc-surface` | `linear-gradient(180deg, #121823 0%, #0D121A 100%)` | card face (dark neutral, same family as `--void`) |
| `--hc-plate` / `--hc-edge` | `#0A0D13` / `linear-gradient(90deg, #1B222D, #0F141C)` | back plate and edge |
| `--hc-code-bg` | `#090D14` | code surface and lens disc |

**Code syntax colours.** These are already in `TOKEN_COLOR` in the data file.

| Token | Colour |
|---|---|
| keyword (`export`, `const`, `return`, `await`) | `--accent-friction` |
| tag (`<SafeToSpend`, `<a`) | `--accent-headroom` |
| attribute or object key (`period=`, `id:`) | `--accent-bumper` |
| string (`"today"`) | `--accent-healthy` |
| number (`142`, `10_000`) | `--accent-signal` |
| punctuation | `rgb(238 241 245 / .42)` |
| comment | `rgb(238 241 245 / .34)` |
| plain identifier | `rgb(238 241 245 / .82)` |

**Design overlay.**

| Part | Colour |
|---|---|
| Selection box and its name | `--accent-signal` |
| Handles | fill `--paper`, 1.6px `--accent-signal` border |
| Size label | `--accent-signal` background, `--void` text |
| Spacing marker and its label | `--accent-friction`, label text `--void` |
| Jay's cursor | `--accent-friction` fill, 1.6px `--void` stroke; name tag `--accent-friction` with `--void` text |

**Replacements for the mockup.**

| Mockup colour | Use instead | Why |
|---|---|---|
| Selection blue `#4C9DFF` | sky | palette |
| Marker red `#FF6B57`, error red, badge red | coral | palette |
| String green `#B6DB8C` | lilac | palette |
| Receipt paper `#ECEAE3` | `--paper` | palette |
| White text on light fills | `--void` | contrast |

### 5.2 Type

Use Geist (variable) and Geist Mono, which the site already loads. Load Geist Mono 400 if the site does not already load it; otherwise use 500 for code.

The card is designed at a base size of **460 × 624** and scaled as a whole (section 6). All sizes below are in base pixels.

| Element | Font | Size / line height | Tracking | Colour |
|---|---|---|---|---|
| App name | Geist 650 | 19px | -0.01em | paper |
| Range pill | Geist Mono 500 | 12.5px | 0.08em | `--hc-ink-2`, 1px border `rgb(238 241 245 / .14)`, padding 7px 12px, radius 999px |
| Card label | Geist Mono 500 | 13px | 0.16em | `--hc-ink-3` |
| Big number | Geist 800 | 138px / 1 | -0.06em | paper, tabular figures |
| Currency sign | Geist 800 | 62px, raised 58px | -0.02em | `--hc-ink-2` |
| Sub line | Geist 500 | 17px | 0 | `--hc-ink-2` |
| Module text | Geist 500, bold part 600 | 15px | 0 | `--hc-ink-2` / paper |
| List name | Geist 600 | 16px | 0 | paper |
| List meta | Geist Mono 500 | 12px | 0.06em | `--hc-ink-3` |
| List value | Geist 600 tabular | 16px | 0 | `--hc-ink-2` |
| CTA | Geist 700 | 18px | 0 | `--void` on the accent |
| Code face | Geist Mono 400 | 14px / 26.5px | 0 | syntax |
| Lens snippet | Geist Mono 400 | 15.5px / 26px | 0 | syntax |
| Frame label | Geist Mono 500 | 12.5px | 0.06em | `--hc-ink-3` |
| Lens tag | Geist Mono 500 | 12.5px | 0.1em | paper |
| Token tags | Geist Mono 500 | 12px | 0.06em | `--hc-ink-2` |
| Tabs | Geist 600 | 14.5px | 0 | `--hc-ink-3`, active paper |

**Intro sticky notes:**

- Instrument Serif italic, 27px / 1.05. The latin subset is about 22 KB and is in `reference/mockup/fonts/`.
- It is loaded only for a first-visit intro.
- The handwritten serif is a deliberate contrast to the clean Geist interface: human mess against one clear thing.
- If Jay prefers zero new fonts, use Geist 650 at 24px instead.

### 5.3 Motion

Use the site's tokens (3.5).

| Need | In CSS | In GSAP | Use it for |
|---|---|---|---|
| spatial-fast | `var(--spring-spatial-fast)` `var(--dur-spatial-fast)`, or `--e-fast` | the existing token helper | pops, handles, shapes appearing, tags, lens press |
| spatial-default | `--spring-spatial-default` / `--e-move` | helper | UI landing, lens opening, cursor glide, the code wipe |
| spatial-slow | `--spring-spatial-slow` / `--e-slow` | helper | the lens gliding home, the mess burst |
| effects-fast | `--spring-effects-fast` / `--e-hover` | helper | hover, small fades, snippet crossfades |
| effects-default | `--spring-effects-default` / `--e-fade` | helper | copy and wireframe fades |
| effects-slow | `--spring-effects-slow` | helper | light blooms, accent crossfades |
| formation | `--spring-formation` | helper | particle formations in the intro |

Two curves are not springs:

- GSAP `expo.out`, for the line of light and the number count-up;
- GSAP `power3.in`, for the mess being pulled in.

For JS physics (shape flicks), use the site's spring step with stiffness and damping ratio (appendix D), not a new physics library.

### 5.4 Depth (back to front)

1. `.rs-atmos` (z 1): the card light and a dot grid (section 15.1).
2. `canvas.rs-field` (z 2): the halo and code particles.
3. `.rs-grain` (z 4).
4. `main` (z 5). The **hero stage** is the first child of `main`, with `position: fixed`, so everything after it (the hero copy and, in the stacked layout, the hero's dark gradient) paints above it. Inside the stage, back to front:
   1. floor shadow;
   2. back shapes (cookie, pill, flower; blurred);
   3. the card;
   4. front shapes (clover, sunny) and token tags;
   5. tabs and the code toggle.
5. `nav.rs-rail` (z 6).

---

## 6. Layout

### 6.1 Modes

```js
const desktop = innerWidth >= 1024 && innerWidth / innerHeight > 1.25;   // the same test the CSS and the field use
```

| Mode | When | What changes |
|---|---|---|
| `full` | desktop and k ≥ 0.68 | everything |
| `compact` | desktop and 0.56 ≤ k < 0.68 | clover, sunny and pill only; no token tags; no frame label |
| `minimal` | desktop and k < 0.56 | k is clamped to 0.56. Card and lens only. The tabs become the four-dot pager (6.4). |
| `stacked` | not desktop, and innerHeight ≥ 560 | card at the top, text at the bottom (6.4) |
| `none` | not desktop, and innerHeight < 560 (landscape phones) | no stage. The field keeps today's `drift` sphere as the hero formation, exactly as now. |

Set the mode as `data-mode` on `.hero-stage`, and the current product as `data-product`.

### 6.2 Desktop fit (appendix A)

The text column stays exactly where it is. The stage fills the space to its right.

**Inputs:**

- `vw = document.documentElement.clientWidth`, which excludes the scrollbar;
- `headRight`: the right edge of the widest headline line's **text node** (line 2 at 1664: x 890).

**Formula:**

```
left       = headRight + 72
shellRight = (vw + min(vw, 1320)) / 2
right      = min(rail.left − 44, shellRight + 200)    // keeps the card near the text on very wide screens
avail      = right − left
k          = min(1.16, (innerHeight − 220) / 624, (avail × 0.86) / 460)
cx         = left + avail / 2
cy         = innerHeight × 0.5 − 6
```

**When to run it:**

- on load, after `document.fonts.ready`;
- on resize, debounced 120ms;
- whenever the stacked query changes.

**Expected results** (from the live CSS, with a 10px scrollbar):

| Viewport | k | Card width on screen | Mode |
|---|---|---|---|
| 2560 × 1440 | 1.16 | 534 | full |
| 1920 × 1080 | 1.16 | 534 | full |
| 1664 × 941 | 1.03 | 475 | full (card centre 1238, 464) |
| 1440 × 900 | 0.91 | 420 | full |
| 1280 × 800 | 0.85 | 389 | full |
| 1024 × 768 | 0.59 | 273 | compact |

### 6.3 Positions relative to the card (desktop)

- `W` and `H` are the card's on-screen width and height: 460k × 624k.
- Offsets run from the card's centre to the element's centre.

| Element | Offset (x, y) | Size | Layer | Notes |
|---|---|---|---|---|
| Clover (mint) | (−0.55W, −0.45H) | 0.22W | front | rotate −8° |
| Cookie (lilac) | (+0.77W, −0.49H) | 0.16W | back | blur 1.4px, rotate 10° |
| Sunny (amber) | (+0.75W, +0.38H) | 0.25W | front | rotate 6° |
| Pill (coral) | (−0.62W, +0.49H) | 0.17W | back | blur 2px, rotate −14° |
| Flower (sky) | (+0.30W, −0.63H) | 0.10W | back, far | blur 3px |
| Tag "radius · 34" | under the cookie, left-aligned with it | | front | lilac chip |
| Tag "motion · spring 0.82" | under the sunny, left-aligned with it | | front | amber chip |
| Product tabs | centred under the card; top = projected card bottom + 40px | | front | |
| Frame label | card space (150, −30) | | card plane | It tilts with the card. |
| Floor shadow | centred 28px under the projected card bottom | 0.9W × 0.144W | back | `radial-gradient(closest-side, rgb(0 0 0 / .55), transparent)` |

**Clamping:**

- Keep every shape at least 24px inside the viewport, and at least 24px from the rail's box (both x and y).
- If a shape's box would intersect the headline's text box, drop that shape. Drop the flower first, then the pill.

### 6.4 Stacked layout

Today's stacked hero puts the content at the bottom over a dark gradient, with the visual in the top part of the screen. Keep that. The card takes the sphere's place.

- **Card:**
  - height `min(0.42 × innerHeight, 420)`, width = height × 460 / 624;
  - centre at 50% of the width and 27% of `innerHeight`;
  - tilt `rotateY(-6deg) rotateX(4deg) rotateZ(-1deg)`.
- **Shapes:**
  - clover (−0.50W, −0.42H, size 0.20W);
  - sunny (+0.52W, +0.36H, size 0.22W);
  - pill (−0.54W, +0.44H, size 0.16W);
  - all clamped 12px inside the viewport;
  - no cookie, flower, token tags or frame label.
- **Tabs** become a pager of four dots, 14px under the card:
  - dots are 6px; the active one is an 18px pill in its accent;
  - swipe the card left or right to switch products.
- **Lens:** no hover lens. The lens drifts at rest. Tapping the card toggles the full code (8.6).

Check that the pager clears the top of the text block at 390 × 844, 430 × 932 and 820 × 1180. If it does not, reduce the card height factor from 0.42 to 0.38.

---

## 7. The card

### 7.1 Structure

```html
<!-- First child of <main>. Fixed. Rendered by the home page, not inside section#top. -->
<div class="hero-stage" data-mode="full" data-product="headroom">
  <div class="hc-floor" aria-hidden="true"></div>
  <div class="hc-shapes hc-shapes--back" aria-hidden="true"><!-- cookie, pill, flower --></div>
  <div class="hc-persp" aria-hidden="true">
    <div class="hc">
      <div class="hc-back"></div>
      <div class="hc-edge"></div>
      <div class="hc-face hc-ui"><!-- product UI, section 7.4 --></div>
      <div class="hc-face hc-wire"><!-- skeleton, intro only --></div>
      <div class="hc-face hc-code"><!-- full listing, card-registered, 7.5 --></div>
      <div class="hc-lens"><div class="hc-snip"><!-- lens snippet, 8.2 --></div></div>
      <div class="hc-rim"></div>
      <div class="hc-tag">REAL CODE</div>
      <div class="hc-ring"></div>
      <div class="hc-overlay"><!-- selection, marks, Jay's cursor, section 9 --></div>
      <div class="hc-frame">Headroom / Home · 460 × 624</div>
    </div>
  </div>
  <div class="hc-shapes hc-shapes--front" aria-hidden="true"><!-- clover, sunny, token tags --></div>
  <div class="hc-tabs" role="tablist" aria-label="Shipped products"><!-- 4 tabs, section 11 --></div>
  <button class="hc-code-toggle" type="button" aria-pressed="false">Show code</button>
  <p class="hc-sr" id="hc-panel" role="tabpanel" aria-live="polite"><!-- card.srLabel --></p>
</div>
```

**Pointer events:**

- `.hero-stage` has `pointer-events: none`;
- `pointer-events: auto` goes back on `.hc`, the front shapes, the tabs and the toggle.

**Visually hidden text:** use the repo's visually-hidden utility for `.hc-sr` if one exists. Otherwise add one.

### 7.2 Geometry and 3D

```css
.hero-stage { position: fixed; inset: 0; pointer-events: none; }
.hero-stage, .hero-stage * { max-width: none; }   /* the site has a global max-width: 100% on divs */
.hc-persp { position: absolute; inset: 0; perspective: 1800px; perspective-origin: 40% 48%; }
.hc {
  position: absolute; left: 0; top: 0; width: 460px; height: 624px;
  transform-style: preserve-3d; transform-origin: 50% 50%; pointer-events: auto;
  transform: translate3d(var(--hc-tx), var(--hc-ty), 0)
             rotateY(var(--hc-ry, -17deg)) rotateX(var(--hc-rx, 7deg)) rotateZ(-1.5deg) scale(var(--hc-k));
}
.hc-face { position: absolute; inset: 0; border-radius: 34px; overflow: hidden; }
.hc-ui { background: var(--hc-surface); border: 1px solid var(--hc-border); }
.hc-back { position: absolute; inset: 0; border-radius: 34px; background: var(--hc-plate); transform: translateZ(-16px);
  box-shadow: 0 60px 140px rgb(0 0 0 / .65), 0 20px 50px rgb(0 0 0 / .5); }
.hc-edge { position: absolute; inset: 0; border-radius: 34px; background: var(--hc-edge); transform: translateZ(-8px); }
```

- `--hc-tx` = cx − 230 and `--hc-ty` = cy − 312, in stage pixels.
- Do **not** put `overflow: hidden`, `clip-path`, `mask`, `filter` or `opacity` below 1 on `.hc` itself. Any of them flattens `preserve-3d`, and the back plate and edge would lose their depth. Clip each face instead.
  - During the hand-off, fade the card by fading its children, not `.hc`.
  - The back plate and edge show the card's thickness on its far side.

**Pointer tilt** (desktop, after the intro, never during the hand-off):

- `--hc-ry = −17deg + nx × 4deg` and `--hc-rx = 7deg − ny × 3deg`.
- `nx` and `ny` are the pointer position relative to the stage centre, normalised to −1 to 1.
- Smooth both with `follow` (appendix D) at speed 6. The card should feel heavy, not twitchy.
- Rebuild the projection and the homography (appendix B) when the tilt changes by more than 0.05°.

### 7.3 Surface details

- **Glare:** `.hc-ui::after` holds `linear-gradient(118deg, rgb(255 255 255 / .07) 0%, transparent 34%, transparent 70%, rgb(255 255 255 / .03) 100%)` with `border-radius: 34px`. Shift its `background-position` by `nx × 6%` with the tilt.
- **Back plate shadow:** offset it opposite to the tilt, `x = −nx × 10px`.
- **Halo:** fine field particles cling to the card's edges (12.2).
- **Floor shadow:** see 6.3.
- **Card light and dot grid:** these live in `.rs-atmos`, behind the particles (15.1).

### 7.4 Product content

All content is in `data/hero-cards.ts`. **Fields named in each card's `sample` list are sample data. Jay confirms or replaces them before shipping.** Everything else comes from the site's own copy (3.9).

**Shared layout** (base card pixels; padding 34, so content spans x 34 to 426):

| Band | y | Content |
|---|---|---|
| App bar | 30 to 66 | 36px icon (radius 11, accent gradient `linear-gradient(145deg, color-mix(in oklab, accent, white 22%), color-mix(in oklab, accent, black 18%))`, glyph stroked in `--void` at 2.4px with an inset top highlight `rgb(255 255 255 / .4)`), app name, then the range pill on the right |
| Label | 104 | mono label |
| Big number | 118 (top) | 138px; the optional prefix is the raised currency sign |
| Sub line | 272 | one line |
| Module | 316 to 372 (the funnel runs to 378) | product-specific |
| List | `listTop` to 522 | up to three rows of 46px, each with a top hairline in `--hc-line`; 10px dot, name, meta, value on the right |
| CTA | 540 to 596 | 392 × 56, radius 18, accent fill, shadow `0 14px 34px color-mix(in oklab, accent 22%, transparent)` |

**Per product:**

| | Headroom | Friction | Signal | Bumper |
|---|---|---|---|---|
| Frame label | Headroom / Home · 460 × 624 | Friction / Patterns · 460 × 624 | Signal / Tonight · 460 × 624 | Bumper / Checkout · 460 × 624 |
| Icon | gauge | funnel | map pin | shield |
| Range pill | TODAY ▾ | THIS WEEK ▾ | UPDATED 2H AGO | AT CHECKOUT |
| Label | SAFE TO SPEND TODAY | COMPLAINTS THAT REPEAT | YOU CAN MAKE TONIGHT | BEFORE YOU BUY |
| Number | $142 | 150 | 12 | $279 |
| Sub line | after rent, bills and your savings goal | out of 10,000 app reviews this week | tech, design and AI events across the DMV | reads as 45% closer to Tokyo |
| Module | "This week" and "**$310** left of $560", with a 10px bar at 55% | funnel bars at 100%, 62% and 24% (10,000 REVIEWS, 3,000, 150) | map strip with the reach layer | "Tokyo trip" and "45%", with a 10px bar at 45% |
| List | Rent · NOV 1 · −$1,250; Phone bill · NOV 3 · −$45; Savings goal · FRI · −$40 | three repeating complaints with counts | three events with time and distance | question card instead of a list |
| CTA | Can I spend this? | See the patterns | Show me what I can make | Not now (accent, 232 wide) + Buy it (ghost) |
| Overlay target | CTA, 392 × 56 | first list row, 392 × 46, size label top right | map strip, 392 × 56 | "Not now", 232 × 56 |

**Module details:**

- **Progress bar** (Headroom, Bumper): track `rgb(238 241 245 / .08)`, radius 5, 12px under the row text. Fill: `linear-gradient(90deg, color-mix(in oklab, accent, black 12%), accent)`.
- **Funnel** (Friction):
  - three bars, 16px tall with a 7px gap, radius 5;
  - fills are the accent at 35%, 60% and 100%;
  - labels are right-aligned inside each bar: Geist Mono 500, 10.5px, `--void`, padding-right 8px.
- **Map strip** (Signal):
  - 392 × 56, radius 12, background `rgb(238 241 245 / .04)`, with a dotted grid of 1px dots every 12px in `--hc-line`;
  - reachable pins: 7px sky dots with a 3px sky halo at 25%;
  - out-of-reach pins: 6px dots in `--hc-ink-4`;
  - "you": 8px paper dot with a 2px paper ring at 40%.
- **Question card** (Bumper):
  - 392 × 120 at y 392, radius 14;
  - background `color-mix(in oklab, var(--accent-bumper) 10%, transparent)`, border `color-mix(in oklab, var(--accent-bumper) 35%, transparent)`;
  - "Worth 45% of Tokyo?" in Geist 650 20px, and under it the note "ONE QUESTION, SCALED TO THE AMOUNT" in Geist Mono 500 11px, `--hc-ink-3`.
- **Bumper buttons:**
  - "Not now": 232 × 56, accent fill;
  - "Buy it": 150 × 56, transparent, 1px border in `--hc-ink-4`, paper text, Geist 600 18px;
  - gap 10px.

  Neither button is styled as the "wrong" choice. That is Bumper's principle: no blocking, and no guilt.

### 7.5 The code face (full listing)

`.hc-code` holds the product's full `listing`:

- Geist Mono 400, 14px, line height 26.5px, `white-space: pre`;
- first line at y 34, x 30;
- background `--hc-code-bg`, border `1px solid var(--hc-border)`;
- each line rendered from `tokenize(line)` as `<span>`s coloured by `TOKEN_COLOR`. Whitespace tokens are plain text.

**Order matters.** Each listing follows the order of the interface, so the code for the number sits near the number and the button's code near the button. That is what makes the full card read as an x-ray of itself.

**Stack:** each listing is written in that product's real stack:

- Headroom: React;
- Friction: Astro;
- Signal: TypeScript with MapLibre;
- Bumper: an extension content script.

If Jay can supply real excerpts from the repos, replace the samples, keeping within the limits (`LIMITS.listing`: 44 columns, 21 rows).

**Visibility:**

- `.hc-code` is hidden at rest (`opacity: 0`, never `display: none`).
- It is revealed during the hand-off (14.2) and by the code toggle (8.6).

---

## 8. The code lens

### 8.1 Look

- **Disc:** a circle of radius **124** in card space (it scales with the card), filled with `--hc-code-bg`.
- **Rim:**
  - a 3px ring with `conic-gradient(from var(--hc-rim-a), var(--hc-acc), #EEF1F5, #8CC3FC, #DDA8E4, var(--hc-acc))`;
  - built as a circle with one radial mask: `mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))`, plus `-webkit-mask`;
  - `--hc-rim-a` turns 360° every 12s, linear.
- **No outer glow.** The reference has none. A `filter` on a masked element is masked away, so if a glow is ever wanted, put the filter on a wrapper.
- **Tag:**
  - a pill attached to the rim at the lower right, centred at (lensX + 0.74r, lensY + 0.46r);
  - contents: a `</>` glyph in the accent, then "REAL CODE";
  - style: Geist Mono 12.5px, tracking 0.1em, background `rgb(9 13 20 / .92)`, border `1px solid color-mix(in oklab, var(--hc-acc) 50%, transparent)`, radius 999px, padding 7px 12px 7px 10px, gap 8px.
- **Caret:** a 2 × 18px caret in paper, blinking every 1.1s (steps). It sits at the end of the snippet's key line (`amount={142}`, `to={150}`, `reach.length`, `amount: 279`). It is a small sign that the code is alive.

### 8.2 How it works: an inspector, not a window

The lens shows the snippet for the part of the interface under its centre. The snippet travels with the lens, so it is always readable. At rest it reproduces reference 01 exactly.

**Structure:**

- `.hc-lens` is a 248 × 248 circle (`border-radius: 50%; overflow: hidden`) inside the card plane.
- It is placed with `transform: translate3d(x − 124px, y − 124px, 0) scale(s)`, where (x, y) is the lens centre in card space.
- `.hc-snip` sits inside it at (24, 24), which is 100px left of and above the lens centre:
  - Geist Mono 400, 15.5px, line height 26px, `white-space: pre`;
  - tokens coloured as in 7.5.
- The circle crops the snippet's corners, as in the mockup.

**Region:** chosen by the lens centre's y in card space, with 12px of hysteresis:

| y | Region |
|---|---|
| below 300 | `number` |
| 300 to 380 | `module` |
| 380 to 530 | `list` |
| from 530 | `cta` |

**On a region or product change,** crossfade the snippet:

- the old one fades out over 120ms;
- the new one fades in over 180ms (effects-fast) with a 4px upward slide.

**Press** scales the lens to 140/124 (spatial-fast); release returns it. The snippet grows with it, which reads as "look closer".

**Rim and tag** use the same translate and scale as the lens.

**Cost:** moving the lens only changes transforms. There is no layout, no clip-path change and no repaint of the card.

### 8.3 Mapping the pointer onto the tilted card

1. Compute the card's four projected corners with the analytic projector (appendix B). It matches Chromium's own rendering exactly.
2. Build the screen-to-card homography from those corners.
3. Map each pointer position through it to get card-space (u, v).
4. Rebuild both only when the tilt or the layout changes. There are no DOM reads per frame.

### 8.4 Behaviour

| State | What the lens does |
|---|---|
| Rest and idle (before the first move, after 2.5s without the pointer over the stage, and always on touch) | Drifts around its rest point (318, 184): `x = 318 + 34·sin(2πt/9)`, `y = 184 + 22·sin(2πt/6)`. It stays in the `number` region. |
| Follow (pointer over the card or within 40px of it) | The centre follows the mapped pointer, clamped to x 110 to 350 and y 110 to 514, with `follow` at speed 14. It feels responsive and never jumps. |
| Press | The lens scales from 124 to 140. |
| Leave | Holds for 1.5s, glides back to the rest point (spatial-slow), then resumes the drift. |
| Product switch | The lens stays where it is. The snippet crossfades to the new product's snippet for the same region (section 11). |
| Tab hidden, or hero off-screen | Paused. |

**Layering:** the design overlay is above the lens, so the lens slides under the selection box.

**Tag flip:** if the tag would stick out past the card's right edge by more than 40px, flip it to the lower left.

### 8.5 Snippet content

All 16 snippets are in `data/hero-cards.ts`. The limits are 22 columns and 8 rows (`LIMITS.snippet`). The resting snippet for Headroom is the mockup's:

```
  // one clear thing
<SafeToSpend
  period="today"
  amount={142}
  after={["rent",
    "bills", "goal"]}
/>
<WeekBar left={310} />
```

### 8.6 Full code (touch, keyboard and reduced motion)

**Control:** `.hc-code-toggle` ("Show code" / "Show design", with `aria-pressed`).

**Where it shows:**

- on touch devices (`(hover: none)`) and under reduced motion: under the tabs, or under the pager;
- for mouse users: only on keyboard focus (`:focus-visible`).

**Toggling it** (or tapping the card on touch) reveals `.hc-code`:

- `clip-path: circle(0px at X Y)` → `circle(150% at X Y)`, from the tap point (or the card centre for keyboard);
- 600ms, spatial-default;
- the lens fades out over 150ms at the same time;
- the second toggle reverses it.

**Reduced motion:** a 200ms crossfade instead of the wipe.

---

## 9. The design overlay ("Designs it")

**Elements** (in card space, positioned from `select.box`):

- **Selection box:**
  - 1.6px solid sky, 2px outside the element;
  - handles: 10 × 10 squares, paper fill, 1.6px sky border, centred on each corner.
- **Name:** above the box, left-aligned, Geist 600 13px, sky (`select.name`, for example "Button / Primary").
- **Size label:**
  - centred 10px under the box (Friction: at the box's top right);
  - Geist Mono 12px, `--void` on sky, radius 5, padding 3px 7px (`select.size`).
- **Spacing marker:**
  - a 1.5 × 14px coral line from the box's top edge up to the element above, 300px from the box's left (Bumper: 120px);
  - its label is a coral pill with "16" in Geist Mono 11.5px, `--void`.
- **Jay's cursor:**
  - a 24 × 28 arrow, coral fill, 1.6px `--void` stroke, with `drop-shadow(0 4px 8px rgb(0 0 0 / .5))`;
  - the name tag "Jay" sits 20px right and 22px below the tip: Geist 650 14px, coral, `--void` text, radius 999px, padding 4px 10px 5px;
  - it rests on the box's bottom-right handle.

**Choreography** (on the intro and on every product switch, starting when the UI has landed):

1. The cursor enters from 220px down and right of its rest point, along a gentle curve: 450ms, `cubic-bezier(.65,0,.35,1)`.
2. Click: cursor scale 0.9 → 1 over 160ms.
3. The selection appears: scale 1.04 → 1, opacity 0 → 1 (spatial-fast). The handles pop with a 40ms stagger.
4. "Resize": the bottom-right handle and the cursor move together by +12px in x over 300ms. The size label counts with them (380 × 56 → 392 × 56; Bumper 220 → 232). The marker line grows 0 → 14px and its label pops.
5. Idle: every 4 to 6s (randomised), the cursor nudges 2 to 3px and settles back. Stop this under reduced motion.

**On scroll:** the overlay fades out between a = 0 and 0.10 of the hand-off.

---

## 10. 3D token shapes ("taste")

These are five glossy shapes in the spirit of Google's Material 3 Expressive shape set (cookie, clover, sunny, pill, flower), in Jay's five project colours.

**Assets:**

- pre-rendered sprites from `public/hero/shapes/`;
- `<img>` with `srcset` (1x and 2x WebP), `decoding="async"` and `alt=""`;
- preload the 2x clover and sunny, because they are visible first.

**Why sprites, not real-time meshes.** three.js is in the bundle, but the field canvas sits below the card. Front shapes must sit above the card, so real-time meshes would need a second canvas. Keep sprites. `reference/mockup/shape-generator.html` is the recipe for re-rendering them (other angles or sizes) with the same lighting:

- extruded outlines with a bevel;
- `MeshPhysicalMaterial` with clearcoat 1, clearcoat roughness 0.14, roughness 0.3 and sheen 0.4;
- RoomEnvironment at intensity 0.5.

**Behaviour:**

- **Idle float.** Each shape bobs ±6px vertically and rotates ±3°. The periods are 5.2, 6.4, 7.1, 8.3 and 9.0s, with random phases.
- **Parallax.** Shapes shift with the pointer offset from the stage centre: front shapes by × 0.04, back shapes by × −0.02. Smooth with `follow` at speed 5.
- **Hover** (front shapes): scale 1.06, rotate +4° (spatial-fast).
- **Flick** (front shapes, desktop):
  - they can be dragged;
  - on release they keep the pointer's velocity (measured over the last three moves, capped at 2400 px/s) and spring home with the site's spring step: stiffness 120, damping ratio 0.6, fixed 1/120 s substeps (appendix E);
  - maximum displacement is 180px;
  - rotation follows horizontal velocity and is damped;
  - a shape that is dragged over the card passes *behind* it: swap the shape into the back layer as its centre crosses the card's projected edge.
- **Click** without a drag: a squash (scaleX 1.08, scaleY 0.92 → 1), spatial-fast.
- **Token tags:** "radius · 34" under the cookie and "motion · spring 0.82" under the sunny. They read as design tokens, which signals system thinking.
  - Style: Geist Mono 12px, padding 6px 10px, radius 8px, background `rgb(10 13 19 / .88)`, border `--hc-border`, a 9px chip with radius 3 on the left.
  - Both numbers are real: the card radius is 34, and 0.82 is the damping ratio of the site's `formation` spring.

---

## 11. Product switching ("Four shipped")

### 11.1 Tabs

- `role="tablist"` with four `role="tab"` buttons in this order: Headroom, Friction, Signal, Bumper.
- Each tab has an 8px colour dot and the name.
- `aria-selected` and `aria-controls="hc-panel"`, with a roving `tabindex`. Arrow keys move focus; Enter or Space selects.
- **Style:**
  - container: padding 6px, gap 6px, radius 999px, background `rgb(238 241 245 / .04)`, border `rgb(238 241 245 / .09)`;
  - tab: padding 8px 15px;
  - the active tab's pill background (`rgb(238 241 245 / .08)`) slides between tabs (spatial-default).

### 11.2 Auto-advance

- Every **6.5s**: Headroom → Friction → Signal → Bumper → Headroom.
- A 2px accent line under the active tab fills over the 6.5s, so the auto-advance is visible.
- **Pauses** while the pointer is over the stage or a tab has focus. It resumes 3s after.
- **Stops:**
  - while the document is hidden;
  - while the hero is out of view;
  - during the hand-off (a > 0);
  - under reduced motion (switching is manual there).

### 11.3 Switch transition (900ms, DOM only)

| Time | What happens |
|---|---|
| 0 to 260ms | The current UI's elements leave: opacity → 0, translateY 0 → −8px, blur 0 → 6px, 25ms stagger bottom-up, `cubic-bezier(.4,0,1,1)`. The overlay fades. The snippet starts its crossfade (8.2). |
| 120 to 670ms | Accent change (appendix J): the card light crossfades its two layers (15.1), and `--hc-acc` transitions on the stage (rim, tag border). Icon, CTA and bar colours change as their elements re-enter. |
| 220 to 900ms | The next UI's elements land: opacity 0 → 1, translateY 10 → 0, blur 4 → 0, 45ms stagger top-down, spatial-default. The big number counts up from 0 over 600ms (`expo.out`, tabular figures). |
| from 650ms | The design overlay choreography for the new target (section 9). |

Also update:

- the frame label;
- `data-product` on the stage;
- the sr-only panel text (`card.srLabel`);
- the code face (swap the listing while it is hidden);
- the `card` formation's code points (12.2). They sit under the opaque card, so nothing visible changes in the field.

---

## 12. Particle field changes

### 12.1 Summary

| Change | Details |
|---|---|
| New formation `card` | The resting hero, and the start of the hand-off (12.2). Rebuilt every frame: add it to the set with `drift`, `reach` and `signal`. Travel order `down`. |
| New intro formations | `line` (travel order `across`), `mess` (a new order `out`: by distance from the formation centre, appendix I), `wire` (`around`). |
| Scroll sequence | `card` replaces `drift` as the first entry: `["card", "healthy", "friction", "headroom", "signal", "bumper", "reach"]`. In mode `none` (6.1), keep `drift` first. Keep `drift` in the registry. |
| Colour | One new attribute `aCode` (vec3) and one uniform `uCode` (12.4). |
| Driver | A pause flag for the intro (13.7), and the hero hooks for phase A (12.5). |
| Unchanged | Particle count, every chapter formation, the morph maths, the travel orders of existing formations, `setSafe`, pointer response, and everything after chapter 01. |

### 12.2 The `card` formation

- **Budget:** 5184 particles in total: 900 halo and 4284 code.
- **Halo:**
  - points in card-local space just outside the card's rounded rectangle;
  - pick a random point on the outline, push it outward by `46 × rand²` px, and add ±3px tangent jitter;
  - `aCode = paper`;
  - the halo uses the field's normal size and brightness.
- **Code:** points sampled from a raster of the product's full listing in card space (12.3). Each carries its token colour in `aCode`.
- **Each frame:**
  1. Project all card-local points with the current card pose. Use one matrix per frame and plain arithmetic per point (appendix B `projector`), with no allocations.
  2. Convert screen pixels to world space with the camera and offset the field uses for `card`.
  3. Give `card` its own camera entry and a zero offset, so that at morph progress 0 every particle sits exactly on its glyph.
- **Phase A input** (12.5):
  - between a = 0.15 and 0.55, each halo particle slides in under the card to a plain-identifier glyph position. Each has its own delay; the ease is `smoothstep`.
  - The card is opaque and above the field, so particles disappear under its edge as they pass it.
- **Product switch:** swap the code points to the new product's cached sample. The halo stays.
- **Accent:** halo particles are paper only. The product accent shows in the card light behind the card (15.1), not in the particles.

### 12.3 Sampling the code raster

- **When:** once per product, after `document.fonts.load('400 14px "Geist Mono"')`, in `requestIdleCallback` (timeout 500ms). All four products take a few milliseconds in total. Cache the results by product key; they are in card space, so they never need resampling on resize.
- **How:**
  1. Draw the listing into an offscreen 460 × 624 canvas with the same font, size, line height and positions as `.hc-code`, each token in its colour (`TOKEN_HEX` in appendix H).
  2. Read the pixels once (`willReadFrequently`).
  3. Keep pixels with alpha above 90.
  4. Pick 4284 of them at random, with replacement if needed. Jitter each by ±0.5px.
  5. Store card-local (u, v) and the colour, multiplied by the pixel's alpha so comments and punctuation stay dim.
- **Reuse:** the field already rasterises glyphs and icons for its formations, with a 2D canvas and `willReadFrequently`. Reuse that helper if it fits.

### 12.4 Colour: `aCode` and `uCode`

```glsl
attribute vec3 aCode;   // colour of the glyph under this particle; paper for anything that is not code
uniform float uCode;    // 0 everywhere except the hero and the start of the hand-off

// at the end of the existing colour code, before lighting is applied:
base = mix(base, aCode, uCode);
```

| When | `uCode` |
|---|---|
| Formation is `card` (hero at rest, phase A) | 1 |
| Hand-off morph `card` → `healthy`, progress b | `1 − smoothstep(0, 0.6, b)` |
| Intro formations and every chapter | 0, so chapters look exactly as they do today |

- Keep the lit-sphere shading on top of the colour.
- **Fallback, if a new attribute is unwelcome:** set `aLit = 1` for keyword, tag, attribute, string and number pixels, `aLit = 0` for the rest, and put the product accent in `uAccent`. The code then reads as paper with accent highlights.
- The reference images use full syntax colours, so prefer `aCode`.

### 12.5 Scroll driver hooks

- **Morph:** before the first stop, the driver morphs `card` → `healthy` exactly as it morphed `drift` → `healthy`: same segment, same 74% completion, same easing, same camera and offset lerps. Do not change its maths.
- **Phase A:** inside the segment-0 branch, compute `a = clamp(scrollY / max(1, stop0 − innerHeight))` and pass it to the stage and the `card` formation (appendix G). At 1664 × 941, a reaches 1 at scroll 353, which is exactly where the morph begins.
- **`setSafe`:** unchanged.
- **Pause flag:** while the intro or the short settle runs, the driver calls neither `morph()` nor the hero hooks. The intro drives the field itself (13.7).

---

## 13. The intro animation (first visit)

### 13.1 When it plays

| Case | What plays |
|---|---|
| First load of `/` in a browser session, at the top, with no hash | **Full intro, 3.4s.** Reuse the existing flag `rs-intro-played`, and set it when the intro starts, as the current code does. |
| Later loads of `/` at the top in the same session | **Short settle, 1.2s:** today's field settle (`scatter(4.2)`, then turbulence 1 → 0) shortened to 1.2s and settling into `card`. The card UI fades in over 400ms and the lens opens at 0.6s. No mess and no cursor glide. |
| A hash in the URL (for example `#work` from the skip link), a restored scroll position below the hero, a back-forward cache restore (`pageshow` with `persisted`) | Nothing. Render the final state. |
| Reduced motion | Section 17. |

### 13.2 Before it starts

**No flash of content.** An inline script in `index.html`, before the app loads, sets `data-intro="pending"` on `<html>` when a full intro will play:

```js
if (!sessionStorage.getItem('rs-intro-played') && !location.hash && matchMedia('(prefers-reduced-motion: no-preference)').matches) document.documentElement.dataset.intro = 'pending';
```

CSS under `[data-intro="pending"]`:

- hides the stage's parts and the hero copy;
- sets `.rs-line > *` to `translateY(115%)`;
- starts the CSS light line immediately.

**Wait for:**

- `document.fonts.ready`;
- the 2x clover and sunny `decode()`;
- the field being ready;
- the `wire` formation being built.

Never wait longer than **900ms**. If something is late, start anyway and let it join when ready. Beat 0 is pure CSS, so the screen is never blank for more than about 100ms. If the timeline starts late, the line holds and the burst waits for the timeline.

**Measure first.** Measure everything before the timeline is created (fit, card corners, formations, fragment targets). There are no layout reads during the intro.

**Replaced on first visits.** Today's field settle (`scatter(4.2)` and the 3.4s turbulence) does not run on a first visit; the intro replaces it. The cue entrance moves into the intro timeline at 3.1s on a first visit. On other visits it stays at 1.4s.

### 13.3 Timeline (desktop)

Times are seconds from the intro start. "Helper" means the existing token helper (5.3).

| Time | Element | Change | Easing |
|---|---|---|---|
| 0.00 to 0.40 | Light line | At the card's centre height, centred on the card's x, 1.6W wide. 1.5px tall, `linear-gradient(90deg, transparent, paper, var(--hc-acc), paper, transparent)`, plus a 16px-tall bloom of the same at 20%. scaleX 0 → 1, opacity 0 → 1. | `expo.out`, 0.4s |
| 0.00 | Field | Formation `line` (every particle on the light line), field opacity 0. | |
| 0.25 to 1.05 | Field | `line` → `mess`: a burst out of the line into a loose cloud. Field opacity 0 → 1 over the first 0.2s. | spatial-slow ease, 0.8s |
| 0.30 | Skip control | Fades in (13.5). | effects-fast |
| 0.40 to 1.00 | Mess fragments (13.4) | Pop in with a 70ms stagger: scale 0.6 → 1, rotate to their angle, opacity 0 → 0.92. | spatial-fast |
| 0.45 | Headline | The existing line rise: `.rs-line > *` from `yPercent: 115`, stagger 0.08. | spatial-default |
| 0.55 to 0.95 | Scribble | A tangled 2px path in `rgb(238 241 245 / .16)` draws itself (stroke-dashoffset from full to 0). | effects-slow |
| 0.60 | Eyebrow | Fades up: opacity 0 → 1, y 8 → 0. | effects-default |
| 1.05 to 1.60 | Mess fragments | Pulled into the card centre with a 40ms stagger: translate to the centre, scale 0.2, rotate +40°, blur 0 → 6px, opacity 0. | `power3.in`, 0.55s |
| 1.05 to 1.75 | Field | `mess` → `wire`. | formation ease, 0.7s |
| 1.35 to 1.65 | Wire face | The dashed 1.5px card outline (`--hc-ink-4`) and the skeleton blocks fade in under the particles. Blocks have radius 8 and fill `rgb(238 241 245 / .09)`: app bar, label, number, sub, module, three rows, CTA. | effects-default |
| 1.65 to 2.35 | UI face | The skeleton becomes the real UI. Elements land top to bottom with a 45ms stagger: opacity 0 → 1, translateY 10 → 0, blur 4 → 0. | spatial-default |
| 1.70 to 2.00 | Card body | Surface, border, glare, edge and back plate fade in. The wire face fades out. Field: `wire` → `card` (`uCode` 0 → 1 at the same time). Most particles disappear under the card; the halo settles on the edges. | effects-default (field: formation ease, 0.3s) |
| 1.70 to 2.30 | Big number | Counts 0 → its value, tabular figures. | `expo.out`, 0.6s |
| 1.80 to 2.40 | Card light | The hero key of `.rs-atmos` blooms: opacity 0 → 1, scale 0.9 → 1 (15.1). | effects-slow |
| 2.10 to 2.60 | Shapes | Pop in, back shapes first, 70ms stagger: scale 0.4 → 1, rotate ±25° → rest, opacity 0 → 1. | spatial-fast (it overshoots, which is the point) |
| 2.30 to 2.80 | Design overlay | Section 9, steps 1 to 4. | as in section 9 |
| 2.60 to 2.90 | Frame label | Types in at 18ms per character. | linear |
| 2.70 | Byline | Fades up: opacity 0 → 1, y 8 → 0. It lands as the card resolves. | effects-default |
| 2.70 to 3.20 | Code lens | Opens at its rest point: the lens scales 0 → 1. The rim draws as a conic sweep (its mask rotates in from −90° while its opacity goes 0 → 1). | spatial-default |
| 2.80 | Reel row | Fades up. | effects-default |
| 2.85 to 3.05 | Lens tag | Pops: scale 0.8 → 1, opacity 0 → 1. | spatial-fast |
| 3.00 | Tabs, token tags | Fade up with a 60ms stagger. | effects-default |
| 3.10 | Scroll cue | The existing cue entrance: opacity 0 → 1, y 10 → 0. | `power2.out`, 0.7s |
| 3.30 | Skip control | Fades out. | effects-fast |
| 3.40 | Everything | Interactive: lens drift, tilt, shape physics and auto-advance start. The scroll driver resumes. `data-intro` is removed. | |

The end state must match reference 01 at the same viewport, apart from the palette replacements in 5.1.

### 13.4 The mess fragments

Each fragment is one of the everyday problems a product fixes:

- Offsets are from the card centre, as fractions of W and H.
- Sizes scale with k.
- Shadows are `0 22px 40px rgb(0 0 0 / .45)`.

| Fragment | Style | Offset | Angle |
|---|---|---|---|
| Sticky note "where did my money go??" (Headroom) | Amber note (`--accent-bumper`), 220px wide, padding 16px 18px 18px, radius 4, `--void` text in Instrument Serif italic 27px | (−0.52, −0.42) | −9° |
| Review "★☆☆☆☆ can't cancel my subscription" (Friction) | Dark card `#121823`, `--hc-border`, radius 12, padding 12px 16px. Stars in coral; text Geist 600 15px paper. | (+0.30, −0.52) | 4° |
| Sticky note "any design events tonight?" (Signal) | Sky note | (+0.58, +0.10) | 7° |
| Sticky note "did I really need that?" (Bumper) | Lilac note | (−0.60, +0.30) | 5° |
| Receipt | `--paper` background, Geist Mono 12px at `rgb(5 7 12 / .8)`, line height 1.7, zig-zag bottom edge (clip-path). Lines: COFFEE 6.40 / SUBSCRIPTION 12.99 / SUBSCRIPTION 12.99 / ??? 45.00 / TOTAL ???. | (+0.62, −0.28) | 7° |
| Error toast "Payment failed. Try again?" | Background `rgb(5 7 12 / .92)`, border `color-mix(in oklab, var(--accent-friction) 45%, transparent)`, coral Geist 600 16px, warning glyph | (−0.12, +0.04) | −3° |
| Badges "12" and "99+" | Coral pills, 34px tall, `--void` Geist 700 17px | (+0.12, −0.25) and (−0.42, +0.12) | 0° |

In `compact` and `minimal` modes, drop the receipt and the "99+" badge.

### 13.5 Skipping

**The control:**

- `<button class="hc-skip" type="button">Skip intro</button>`;
- Geist Mono 12px uppercase, `--hc-ink-3`, with a 14px ring that fills over the intro's length;
- bottom right, 24px from the edges (stacked: top right, 16px from the edges).

**What ends the intro:**

- any key;
- wheel or touch;
- a click anywhere except the reel button;
- the control itself.

Keyboard users who press Tab reach the existing "Skip to the work" link, and that key press already ends the intro.

**Ending:** `gsap.to(intro, { progress: 1, duration: 0.25, ease: 'power2.out' })`. This fast-forwards every tween and every field morph proxy to its end in 250ms. Then resume the driver.

### 13.6 Variants

- **Short settle:** see 13.1.
- **Stacked (2.6s):**
  - the same beats, compressed by 0.75;
  - three fragments only: the Headroom note, the review and the error toast;
  - no scribble;
  - the light line is 80% of the width.
- **Compact and minimal:** see 13.4. In `minimal` there is no shapes beat.
- **Reduced motion:** section 17.

### 13.7 Implementation

- **One GSAP timeline,** created after measuring, then played. Use the token helper for every token ease (appendix F).
- **Field morphs** in the timeline tween a proxy `{ p }` and call `field.morph(from, to, p)` in `onUpdate`. The driver's pause flag is on for the whole intro.
- **Replace** the current hero intro function (line rise, copy fade) with this one. Keep its reduced-motion and session checks.

---

## 14. The scroll hand-off (hero → case study 01)

### 14.1 Two phases

- **Phase A (new):** `a = clamp(scrollY / H)`, with `H = stop0 − innerHeight`; that is 353 at 1664 × 941. The card turns into code, then into particles.
- **Phase B (existing):** from `scrollY = H`, the field driver's own morph `card` → `healthy` runs, with progress b. It completes at 74% of the segment (scroll 1049 at 1664 × 941). The only additions are `uCode`, turbulence and the light.
- **Both are pure functions of the scroll position,** so they reverse exactly when scrolling back up. There are no time-based tweens in the hand-off.
- **One clock:** update everything from the driver's per-frame callback, so the card, the field and the light stay in step.

`seg(a, from, to) = clamp((a − from) / (to − from))`.

### 14.2 Phase A

| a | Card | Shapes | Field | Light |
|---|---|---|---|---|
| 0 to 0.10 | The overlay, frame label, tabs and toggle fade out. Tilt eases back to rest (pointer tilt off). The lens leaves follow mode and glides to its rest point. | Parallax off. | `card` | at the card |
| 0.05 to 0.15 | The snippet crossfades into the full listing. `.hc-code` becomes visible through `clip-path: circle(124px at 318px 184px)` while the lens disc fades out, so the code stays registered with the card. | | | |
| 0.10 to 0.55 | The reveal circle grows to cover the card (124 → 470, `cubic-in-out` of `seg(a, .10, .55)`). Its centre slides to the card centre (230, 312), and the rim grows with it. At a 0.40 to 0.55 the rim fades as `.hc-ring` fades in: the same conic gradient as a 3px rounded-rectangle border (radius 37, 3px outside the card). The tag text changes to "ALL OF IT IS REAL CODE" and the tag moves to the card's top edge (card space x 232, y −48). | Drift outward from the card centre, 0 → 90px, slightly up. | Halo particles slide in under the card (a 0.15 to 0.55). | |
| 0.55 to 0.75 | The card's children fade out: code face, edge and back plate (the ring at 35% of their opacity). What is left is the code drawn in particles, in syntax colours. | 90 → 200px, opacity → 0.55. | `card`, now visible | dims by 15% |
| 0.75 to 1.00 | Gone: `visibility: hidden` from a = 0.78. | 200 → 320px, opacity → 0, +3px blur. Hidden from a = 0.98. | Turbulence 0 → 0.35 (`smoothstep`): the code comes loose. | |

**The ink needs nothing new.** The existing scroll ink runs from scroll 0 to 40% of the hero height (376 at 1664 × 941), so "Then ships it." finishes inking just as phase A ends.

### 14.3 Phase B (b = the driver's morph progress)

| b | Field | Light |
|---|---|---|
| 0 to 0.4 | Turbulence 0.35 → 0. | |
| 0 to 0.6 | `uCode` 1 → 0: syntax colours become Healthy Switch's own colours. | |
| 0 to 1 | The existing morph into `healthy` (travel order `across`), unchanged. It feels exactly like the morphs between chapters. | The light hands over to the healthy key (15.1). |
| 1 | The chapter system takes over. | Chapter Light's normal switch from hero to healthy has nothing visible left to change. |

### 14.4 Pinning and paint order

- The stage is `position: fixed; inset: 0` at all times. It is the first child of `main`, so the hero copy (and the stacked hero's gradient) paints above it. It never takes part in layout, so CLS stays 0.
- From a > 0.02, the whole stage has `pointer-events: none`.
- If an ancestor ever gets a `transform`, `filter` or `contain` value that would break `position: fixed`, render the stage through a portal as a sibling just before `main`, with `z-index: 5`.

### 14.5 Edge cases

| Case | Behaviour |
|---|---|
| Fast flings, rail clicks | Everything is a function of the scroll position, so the right state renders. No catch-up animation. |
| Resize mid hand-off | Re-fit, rebuild the projection, re-render the current a and b. Code samples are in card space and stay valid. |
| Reload partway down the page | Render the state for the current scroll position. No intro and no flash of the card. |
| Product switch in progress when scrolling starts | Finish it instantly, then continue with the new product. |
| Field unavailable (no WebGL) | Phase A still runs; the card simply fades out with no particles. |
| Scrolling back up | b falls, so the morph reverses. Then a falls: the code reassembles under the card, the card fades back in, the reveal circle shrinks to the lens, and the snippet returns. The overlay, tabs and toggle return below a = 0.10. Pointer tilt, lens follow and auto-advance re-enable at a = 0. |

### 14.6 Stacked layout

The same phases. The card is at the top of the screen. The hero copy and its gradient slide up over it, as they slide over the sphere today. In this layout the field lifts formations into the top area, so the morph into `healthy` moves up and inward.

---

## 15. Chapter Light and the rest of the page

### 15.1 The card light

Chapter Light (`.rs-atmos`) is already live. The card's light is its `hero` key, so there is one light system for the whole page.

**Hero key, in the hero:**

- centred on the card centre (cx, cy), set by `left` and `top` on fit;
- colour: the current product accent;
- core 26% and mid 10% (the mockup's values; today's hero key is 7% and 3% neutral);
- size unchanged: 74vw × 118vh on desktop, 120vw × 62vh stacked.

**Accent crossfade without repainting gradients:**

- give the hero key two child layers, A and B;
- on a product switch, set the new accent on the hidden layer and crossfade opacity over 550ms (effects-slow);
- only opacity and transform ever animate.

**Dot grid:** add `.atm-grid` as one more child of `.rs-atmos`:

- 26px spacing, 1.6px dots in `--paper` at 16%;
- radial mask fading to 0 at 640k px from the card centre;
- visible only while the hero key is on;
- its opacity is scrubbed by phase A (fades out over a 0.30 to 0.75).

**Phase B hand-over.** This is a scrubbed version of Chapter Light's own travel-and-crossfade, so it is compositor-only. With `e = smoothstep(0, 1, b)` and (dx, dy) = healthy light centre (61vw, 52vh) minus the card centre:

| Key | `transform` | `opacity` |
|---|---|---|
| Hero key | `translate(dx·e, dy·e) scale(1 − 0.1e)` | `1 − e` |
| Healthy key | `translate(−dx·(1 − e), −dy·(1 − e)) scale(0.9 + 0.1e)` | `e` |

Its core and mid go from 20% and 8% to the healthy values.

**Gate:** while 0 < b < 1, Chapter Light must keep `hero` as its active key and must not run its own switch. At b = 1 the healthy key is exactly in its settled state, so the normal switch changes nothing. Scrolling back up mirrors this.

### 15.2 Everything else

The chapters, the morphs between chapters, the chapter keys and the five-colour end light stay as they are.

---

## 16. Responsive summary

| Viewport | Mode | Card | Shapes | Lens | Intro | Hand-off |
|---|---|---|---|---|---|---|
| 1280 and wider, usual heights | full | fit (k 0.85 to 1.16) | all 5 + tags | hover inspector | full 3.4s | full |
| about 1024 to 1279, or short windows | compact | k 0.56 to 0.68 | clover, sunny, pill | hover inspector | full, without receipt and badge | full |
| very short desktop windows | minimal | k 0.56 | none | hover inspector | full, no shapes beat | full |
| tablets and phones (stacked query) | stacked | `min(0.42 × innerHeight, 420)` tall, top of screen | clover, sunny, pill | idle drift; tap for full code | 2.6s variant | same phases (14.6) |
| landscape phones (stacked, height under 560) | none | none | none | none | today's field settle | today's `drift` → `healthy` |

Check every row with screenshots (section 20).

---

## 17. Accessibility and reduced motion

**Screen readers:**

- the visual stage is decorative (`aria-hidden`);
- the tab panel `#hc-panel` names the product and what it does (`card.srLabel`) and updates politely;
- the tabs are real tabs, and the code toggle is a real button with `aria-pressed`.

**Keyboard:**

- tab order: the existing skip link → reel button → product tabs → code toggle;
- focus rings: 2px paper outline with a 2px offset;
- no keyboard traps.

**Skip:** the intro is skippable at all times (13.5).

**`prefers-reduced-motion: reduce`:**

- no intro. Everything appears with a 300ms opacity fade, and the field does not scatter (as today);
- no tilt, parallax, idle float, lens drift, cursor nudges, shape physics or auto-advance. The lens rests at its rest point;
- the code toggle is visible and crossfades in 200ms;
- product switching is a 200ms crossfade;
- the hand-off has no lens growth: the card fades out over a 0 to 0.6. Leave the field morph exactly as the site already treats morphs under reduced motion. Do not add motion.

**Contrast:**

- card text meets WCAG AA on the card surface;
- text on accent fills uses `--void`;
- the token tags and the frame label are decorative.

**Never** hide the system cursor. Jay's cursor is an illustration inside the card.

---

## 18. Performance and engineering

**Budget** (mid-range laptop, Chrome):

- 60fps during the intro, at rest and during the hand-off;
- no long task over 50ms after the first 500ms;
- Lighthouse performance 90 or higher on desktop;
- CLS 0;
- LCP no worse than today by more than 300ms (the headline still starts rising by 0.45s).

**Rules:**

- **WebGL:** no new context. Shapes are images.
- **Particles:** the count stays 5184. The `card` formation costs one matrix per frame plus about 10 flops per particle. The field already uploads positions every frame for its animated formations.
- **Lens:** transforms only (8.2). The reveal circle's `clip-path` changes only during the hand-off and the code toggle.
- **Layout reads:**
  - no `getBoundingClientRect` in per-frame code;
  - measure on fit only (headline text edges, rail, card corners from the analytic projector);
  - code samples come from a canvas raster, not the DOM.
- **Pointer:** passive listeners, coalesced into one update per frame.
- **Pausing:** pause the field ticker work for the hero, the lens drift, the shape physics and auto-advance when `document.hidden` or when the hero is out of view (IntersectionObserver on `section#top`).
- **`will-change`:** only on the lens, the card and the shapes, and only while they animate. Remove it at rest.
- **Light:** the card light crossfades two layers. It never animates a gradient.
- **Images:** sprites are WebP with `srcset`, about 120 KB at 2x in total. Preload the 2x clover and sunny.
- **Fonts:** Instrument Serif italic loads only when `data-intro="pending"` is set, with `font-display: block` and a preload added by the same inline script.
- **Ship clean:** no `console.*`, no debug overlays, no mockup code.

---

## 19. Build order

Work through the phases in order. Do not start a phase until the previous one meets its "Done when".

**Phase 0: Audit**

Find and list, with file paths:

1. the hero component and its CSS;
2. the current hero intro function (session key `rs-intro-played`) and the hero scroll tweens (ink, copy fade, cue);
3. the token helper that writes `--spring-*` and `--dur-*`, and the one that returns GSAP eases;
4. the field module:
   - renderer and instance API;
   - formation registry and travel orders;
   - the set of animated formations;
   - palette, camera table and offsets;
   - the raster helper;
   - shader attributes and uniforms;
5. the scroll driver: stops, segment maths, `setSafe` and the ticker;
6. how Lenis drives ScrollTrigger and the ticker;
7. Chapter Light (`.rs-atmos`) and how it picks the active key;
8. the `data-zone` and `data-on` logic;
9. the project data list;
10. a visually-hidden utility.

*Done when:* the list is posted and every difference from section 3 is flagged.

**Phase 1: Static card**

Build the stage, the card with Headroom's UI, the code face, the lens at rest (snippet, rim, tag, caret), the overlay at rest, the frame label, the shapes at rest, the floor shadow, and the card light and dot grid in `.rs-atmos`. Implement the fit and all modes.

*Done when:* a screenshot at 1920 × 1080 matches reference 01 (apart from 5.1), and 1440 × 900 and 1664 × 941 look balanced.

**Phase 2: Interactions**

Build:

- pointer mapping;
- lens follow, idle, press and leave, with snippet regions;
- pointer tilt;
- shape float, parallax, flick and click;
- tabs with all four products, auto-advance and the switch transition;
- the code toggle.

*Done when:* section 20 "Interactions" passes.

**Phase 3: Field and hand-off**

Build:

- the `card` formation and raster sampling;
- `aCode` and `uCode`;
- the sequence change;
- the phase A hooks;
- the light hand-over and its gate.

*Done when:* scrolling down and back up matches reference 03 at a = 0, 0.3, 0.65 and 1, then at b = 0.5 and 1, with no jump when chapter 01 activates.

**Phase 4: Intro**

Build:

- the inline pending script;
- the timeline;
- the `line`, `mess` and `wire` formations and the `out` travel order;
- the fragments and the scribble;
- skip;
- the short settle and the stacked variant.

*Done when:* the intro matches reference 02 at 0.0s, 0.8s and 1.6s, ends identical to reference 01, and skipping works at any moment.

**Phase 5: Responsive, reduced motion, polish**

Build the stacked and none modes, the reduced-motion paths, and the performance pass.

*Done when:* all of section 20 passes.

---

## 20. QA checklist

**Screenshot sizes:**

- 1280 × 800, 1440 × 900, 1664 × 941, 1920 × 1080, 2560 × 1440;
- 1024 × 768;
- 1180 × 820 (tablet landscape);
- 820 × 1180 (tablet portrait, stacked);
- 430 × 932 and 390 × 844;
- 844 × 390 (landscape phone, mode `none`).

At each size, capture the resting hero, the intro at 0.8s and 1.6s, phase A at a = 0.3, 0.65 and 1, and phase B at b = 0.5.

**Look**

- [ ] The resting hero matches reference 01: card tilt, lens and snippet over the number, overlay on the CTA, shapes, tabs, frame label and light.
- [ ] The headline, byline, reel button and cue look exactly as they do on the live site today.
- [ ] Shapes never cover the headline text. Nothing touches the rail.
- [ ] Only palette colours appear (5.1), including in the overlay, code and fragments.
- [ ] On a bright display, there are no hard edges, seams or clipped glows anywhere.

**Interactions**

- [ ] The lens follows the pointer smoothly on the tilted card. The snippet changes with the region under it.
- [ ] After 2.5s without the pointer, the lens drifts around its rest point.
- [ ] Press magnifies. Leaving returns the lens to its drift.
- [ ] Tilt is subtle and heavy, and never more than about 4°.
- [ ] Shapes float and respond to parallax. They can be flicked and spring home, pass behind the card when dragged over it, and squash on click.
- [ ] Tabs switch with the 900ms transition. The number counts, the accent changes everywhere, and the overlay replays.
- [ ] Auto-advance runs every 6.5s with a visible progress line, and pauses on hover and focus.
- [ ] The code toggle works with touch and with the keyboard.

**Intro**

- [ ] It plays on the first visit and the short settle on a later visit in the same session. Nothing plays with a hash, a restored scroll position or a bfcache restore.
- [ ] Beats and timings match 13.3 within ±50ms. It ends identical to the resting hero.
- [ ] Skip works at any moment and settles within 250ms.
- [ ] No blank screen longer than about 100ms. There is no flash of the copy before the intro hides it.

**Hand-off**

- [ ] Scrolling down: the lens grows to the full card while the ink fills "Then ships it.". The card becomes coloured particle code, which comes loose and morphs into Healthy Switch, turning to its colours.
- [ ] No jump, double light or flash when chapter 01 activates.
- [ ] Scrolling up reverses everything exactly.
- [ ] Fast flings, rail clicks, resizing mid hand-off and reloading partway down all render correctly.

**Accessibility**

- [ ] Reduced motion: no intro motion, no physics or drift, a crossfade hand-off and a visible code toggle.
- [ ] Keyboard order and focus rings are correct. A screen reader announces the product preview.

**Performance**

- [ ] 60fps in the Chrome Performance panel during the intro and the hand-off.
- [ ] No long tasks over 50ms after 500ms.
- [ ] Lighthouse desktop 90 or higher. CLS 0.
- [ ] No `console.*` and no new WebGL context. Sprites total about 120 KB.

**Content**

- [ ] Every field in each card's `sample` list has been confirmed or replaced by Jay.

---

## Appendix: reference code

These are reference implementations. Adapt them to the repo's TypeScript, React and style conventions.

### A. Fit

```ts
const BASE_W = 460, BASE_H = 624, GAP = 72, SHELL = 1320;

function textRight(el: Element): number {
  // measure the text node: the .rs-outline box is wider than its text
  const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent!.trim());
  const r = document.createRange();
  r.selectNodeContents(node ?? el);
  return r.getBoundingClientRect().right;
}

export type Fit =
  | { layout: 'none' }
  | { layout: 'stacked' | 'side'; mode: 'full' | 'compact' | 'minimal' | 'stacked'; k: number; W: number; H: number; cx: number; cy: number };

export function fitStage(): Fit {
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const desktop = innerWidth >= 1024 && innerWidth / innerHeight > 1.25;
  if (!desktop) {
    if (vh < 560) return { layout: 'none' };
    const H = Math.min(vh * 0.42, 420), k = H / BASE_H;
    return { layout: 'stacked', mode: 'stacked', k, W: BASE_W * k, H, cx: vw / 2, cy: vh * 0.27 };
  }
  const l1 = document.querySelector('.rs-display .rs-line > span')!;
  const l2 = document.querySelector('.rs-display .rs-outline')!;
  const rail = document.querySelector('nav.rs-rail')?.getBoundingClientRect();
  const left = Math.max(textRight(l1), textRight(l2)) + GAP;
  const shellRight = (vw + Math.min(vw, SHELL)) / 2;
  const right = Math.min((rail && rail.width ? rail.left : vw) - 44, shellRight + 200);
  const avail = right - left;
  const raw = Math.min(1.16, (vh - 220) / BASE_H, (avail * 0.86) / BASE_W);
  const mode = raw >= 0.68 ? 'full' : raw >= 0.56 ? 'compact' : 'minimal';
  const k = Math.max(raw, 0.56);
  return { layout: 'side', mode, k, W: BASE_W * k, H: BASE_H * k, cx: left + avail / 2, cy: vh * 0.5 - 6 };
}
```

### B. Projection and the pointer homography

`projector` reproduces the CSS in 7.2 exactly: `translate3d(tx, ty, 0) rotateY(ry) rotateX(rx) rotateZ(rz) scale(k)` with the origin at the card centre, inside a parent with `perspective` and `perspective-origin`. It was checked against Chromium's rendering at 1664 × 941 with 0px error, and the homography inverts it with 0 error.

```ts
export type Pose = { tx: number; ty: number; ry: number; rx: number; rz: number; k: number; persp: number; ox: number; oy: number };
type Pt = [number, number];

/** Build once per frame (or when the pose changes); then project thousands of points with no allocations. */
export function projector(p: Pose) {
  const m = new DOMMatrix()
    .rotateAxisAngleSelf(0, 1, 0, p.ry)
    .rotateAxisAngleSelf(1, 0, 0, p.rx)
    .rotateAxisAngleSelf(0, 0, 1, p.rz)
    .scaleSelf(p.k, p.k, 1);
  const { m11, m12, m13, m21, m22, m23 } = m;   // DOMMatrix: x' = m11·x + m21·y, y' = m12·x + m22·y, z' = m13·x + m23·y
  const cx = p.tx + 230, cy = p.ty + 312;       // card centre in stage pixels
  return (u: number, v: number): Pt => {
    const x = u - 230, y = v - 312;
    const X = m11 * x + m21 * y, Y = m12 * x + m22 * y, Z = m13 * x + m23 * y;
    const f = p.persp / (p.persp - Z);          // CSS perspective: points nearer the viewer grow
    return [p.ox + (cx + X - p.ox) * f, p.oy + (cy + Y - p.oy) * f];
  };
}

/** Homography from four point pairs (src → dst). Returns 9 numbers with h33 = 1. */
export function homography(src: Pt[], dst: Pt[]): number[] {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let piv = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  return [...A.map((row, i) => row[8] / row[i]), 1];
}

export const applyH = (H: number[], x: number, y: number): Pt => {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
};

// Usage: on fit or tilt change
// const P = projector(pose);                                   // pose.ox/oy = 40% / 48% of the stage
// const corners: Pt[] = [[0, 0], [460, 0], [460, 624], [0, 624]];
// const toCard = homography(corners.map(([u, v]) => P(u, v)), corners);
// per pointer event: const [u, v] = applyH(toCard, e.clientX, e.clientY);
```

### C. Lens and reveal circle

```css
.hc-lens, .hc-rim { position: absolute; left: 0; top: 0; border-radius: 50%; pointer-events: none; will-change: transform; }
.hc-lens { width: 248px; height: 248px; overflow: hidden; background: var(--hc-code-bg); }
.hc-snip { position: absolute; left: 24px; top: 24px; white-space: pre; font: 400 15.5px/26px 'Geist Mono', ui-monospace, monospace; }
.hc-rim {
  width: 254px; height: 254px; margin: -3px 0 0 -3px;
  background: conic-gradient(from var(--hc-rim-a), var(--hc-acc), #EEF1F5, #8CC3FC, #DDA8E4, var(--hc-acc));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  animation: hc-rim-spin 12s linear infinite;
}
.hc-code { opacity: 0; clip-path: circle(var(--hc-reveal-r, 0px) at var(--hc-reveal-x, 318px) var(--hc-reveal-y, 184px)); }
```

```ts
/** Lens at card-space (x, y) with scale s (1 at rest, 140/124 pressed). Transforms only. */
export function placeLens(lens: HTMLElement, rim: HTMLElement, tag: HTMLElement, x: number, y: number, s = 1, r = 124) {
  const t = `translate3d(${x - 124}px, ${y - 124}px, 0) scale(${s})`;
  lens.style.transform = t;
  rim.style.transform = t;
  tag.style.transform = `translate3d(${x + 0.74 * r * s}px, ${y + 0.46 * r * s}px, 0) translate(-50%, -50%)`;
}

/** Snippet region by lens centre y, with 12px hysteresis. */
const BOUNDS: [Region, number][] = [['number', 300], ['module', 380], ['list', 530], ['cta', Infinity]];
export function regionAt(y: number, current: Region): Region {
  const idx = BOUNDS.findIndex(([, max]) => y < max);
  const next = BOUNDS[idx][0];
  if (next === current) return current;
  const ci = BOUNDS.findIndex(([n]) => n === current);
  const edge = idx > ci ? BOUNDS[ci][1] : BOUNDS[idx][1];
  return Math.abs(y - edge) > 12 ? next : current;
}

/** Hand-off reveal (14.2): circle radius and centre from a. */
export function revealAt(a: number) {
  const t = seg(a, 0.10, 0.55), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // cubic in-out
  return { r: 124 + (470 - 124) * e, x: 318 + (230 - 318) * e, y: 184 + (312 - 184) * e, codeOpacity: seg(a, 0.05, 0.15) };
}
export const seg = (x: number, a: number, b: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
```

### D. Springs and smoothing (the site's convention)

```ts
/** The site's spring step: stiffness k, damping ratio z, unit mass, so damping c = 2·z·√k. */
export function springStep(s: { x: number; v: number }, target: number, k: number, z: number, dt: number) {
  const c = 2 * z * Math.sqrt(k);
  s.v += (-k * (s.x - target) - c * s.v) * dt;
  s.x += s.v * dt;
}

/** Run springs at a fixed 1/120 s, as the site samples its tokens. Stable at any frame rate. */
export function stepFixed(dtFrame: number, acc: { t: number }, step: (dt: number) => void) {
  acc.t = Math.min(acc.t + dtFrame, 0.1);       // never simulate more than 100ms after a stall
  while (acc.t >= 1 / 120) { step(1 / 120); acc.t -= 1 / 120; }
}

/** Frame-rate independent, critically damped follow. Higher speed is snappier. */
export const follow = (cur: number, target: number, dt: number, speed = 14) =>
  cur + (target - cur) * (1 - Math.exp(-speed * dt));
```

### E. Shape physics (flick and spring home)

```ts
type Spring = { x: number; v: number };
type Body = { el: HTMLElement; hx: number; hy: number; px: number; py: number; x: Spring; y: Spring; r: Spring; drag: boolean;
              float: { amp: number; period: number; phase: number } };

export function stepBody(b: Body, dt: number, t: number) {
  const bob = Math.sin((t / b.float.period) * Math.PI * 2 + b.float.phase) * b.float.amp;
  const homeX = b.hx + b.px, homeY = b.hy + b.py + bob;   // px, py: parallax offset (section 10)
  if (!b.drag) {
    springStep(b.x, homeX, 120, 0.6, dt);
    springStep(b.y, homeY, 120, 0.6, dt);
    b.r.v += b.x.v * 0.04 * dt * 60;                      // spin follows horizontal speed
    springStep(b.r, 0, 60, 0.55, dt);
  }
  const dx = b.x.x - homeX, dy = b.y.x - homeY, d = Math.hypot(dx, dy);
  if (d > 180) { b.x.x = homeX + (dx / d) * 180; b.y.x = homeY + (dy / d) * 180; }
}
// Render once per frame (not per substep):
//   b.el.style.transform = `translate3d(${b.x.x}px, ${b.y.x}px, 0) rotate(${b.r.x}deg)`;
// pointerdown: drag = true, setPointerCapture. pointermove: move x/y with the pointer, keep the last three samples.
// pointerup: drag = false; x.v, y.v = measured velocity in px/s, capped at 2400.
// Layer swap: when the shape's centre crosses the card's projected edge while dragged, move it to the back layer.
```

### F. Intro timeline (GSAP)

```ts
import { gsap } from 'gsap';
// tok(name) is the site's existing helper: returns { duration, ease } for a spring token.

export function buildIntro(r: IntroRefs, field: Field, driver: { pause(on: boolean): void }) {
  const sd = tok('spatial-default'), sf = tok('spatial-fast'), ss = tok('spatial-slow');
  const ed = tok('effects-default'), ef = tok('effects-fast'), es = tok('effects-slow'), fo = tok('formation');

  const tl = gsap.timeline({
    paused: true,
    onStart: () => driver.pause(true),
    onComplete: () => { driver.pause(false); delete document.documentElement.dataset.intro; },
  });

  const morph = (from: string, to: string, at: number, duration: number, ease: gsap.EaseString | gsap.EaseFunction) => {
    const m = { p: 0 };
    tl.to(m, { p: 1, duration, ease, onUpdate: () => field.morph(from, to, m.p) }, at);
  };

  tl.call(() => { field.setOpacity(0); field.morph('line', 'mess', 0); }, [], 0)
    .fromTo(r.line, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4, ease: 'expo.out' }, 0);

  const o = { v: 0 };
  tl.to(o, { v: 1, duration: 0.2, ease: 'none', onUpdate: () => field.setOpacity(o.v) }, 0.25);
  morph('line', 'mess', 0.25, 0.8, ss.ease);
  tl.fromTo(r.fragments, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.92, rotation: (i: number) => r.angles[i], duration: sf.duration, ease: sf.ease, stagger: 0.07 }, 0.4)
    .fromTo(r.lines, { yPercent: 115 }, { yPercent: 0, duration: sd.duration, ease: sd.ease, stagger: 0.08 }, 0.45)
    .fromTo(r.eyebrow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: ed.duration, ease: ed.ease }, 0.6)
    .to(r.fragments, { x: (i: number) => r.toCentre[i][0], y: (i: number) => r.toCentre[i][1], scale: 0.2, rotation: '+=40', filter: 'blur(6px)', opacity: 0, duration: 0.55, ease: 'power3.in', stagger: 0.04 }, 1.05);
  morph('mess', 'wire', 1.05, 0.7, fo.ease);
  // ... continue row by row through section 13.3 (UI landing, card body, wire → card, count-up, light, shapes,
  //     overlay, frame label, byline, lens, reel row, tag, tabs, cue, skip control)
  return tl;
}

/** Skip: fast-forward every tween and every field proxy to its end in 250ms. */
export const skipIntro = (tl: gsap.core.Timeline) => gsap.to(tl, { progress: 1, duration: 0.25, ease: 'power2.out' });
```

### G. Hand-off hooks in the scroll driver

```ts
// Inside the driver's per-frame callback, after it has computed the segment index x and progress b
// and called field.morph(sequence[x], sequence[x + 1], b, time, raw), exactly as today:
if (!driver.paused) {
  if (x === 0) {
    const H = Math.max(1, stops[0] - innerHeight);       // where the card → healthy segment begins
    const a = clamp(scrollY / H);
    if (a !== last.a || b !== last.b) {
      hero.render(a);                                     // section 14.2: card, reveal, shapes, overlay, tabs
      cardFormation.setPhase(a);                          // halo slide-in, 0.15 to 0.55
      field.setCode(1 - smoothstep(0, 0.6, b));           // uCode, 12.4
      field.setTurbulence(b > 0 ? 0.35 * (1 - smoothstep(0, 0.4, b)) : 0.35 * smoothstep(0.75, 1, a));
      atmos.scrubHero(a, b);                              // dot grid by a, light hand-over by b (15.1)
      last.a = a; last.b = b;
    }
  } else if (last.a !== 1) {
    hero.render(1); field.setCode(0); field.setTurbulence(0); atmos.scrubHero(1, 1);
    last.a = 1; last.b = 1;
  }
}
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoothstep = (e0: number, e1: number, v: number) => { const t = clamp((v - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
```

### H. Sampling the code raster

```ts
import { tokenize, type HeroCard, type Tok } from './heroCards';

/** Canvas cannot read CSS variables, so the token colours are repeated here as values. */
const TOKEN_HEX: Record<Exclude<Tok, 'sp'>, string> = {
  kw: '#F7A792', tg: '#8ED09C', at: '#E0B771', st: '#DDA8E4', nu: '#8CC3FC',
  pu: 'rgba(238,241,245,.42)', cm: 'rgba(238,241,245,.34)', id: 'rgba(238,241,245,.82)',
};

export type CodePoint = { u: number; v: number; r: number; g: number; b: number; plain: boolean };

export function sampleListing(card: HeroCard, count: number, rand: () => number): CodePoint[] {
  const cv = new OffscreenCanvas(460, 624);
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  ctx.font = '400 14px "Geist Mono"';
  ctx.textBaseline = 'middle';                         // CSS centres the glyphs in each 26.5px line box
  const adv = ctx.measureText('0').width;              // monospace advance, identical to the DOM face
  card.listing.split('\n').forEach((line, row) => {
    let col = 0;
    for (const [t, s] of tokenize(line)) {
      if (t !== 'sp') { ctx.fillStyle = TOKEN_HEX[t]; ctx.fillText(s, 30 + col * adv, 34 + row * 26.5 + 13.25); }
      col += s.length;
    }
  });
  const { data } = ctx.getImageData(0, 0, 460, 624);   // unpremultiplied RGBA
  const ink: CodePoint[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a <= 90) continue;
    const k = a / 255, p = i / 4;
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    ink.push({ u: (p % 460) + rand() - 0.5, v: Math.floor(p / 460) + rand() - 0.5, r: r * k, g: g * k, b: b * k,
               plain: Math.abs(r - g) < 0.03 && Math.abs(g - b) < 0.03 });   // neutral pixels: identifiers, punctuation
  }
  return Array.from({ length: count }, () => ink[Math.floor(rand() * ink.length)]);
}
// Halo particles take their slide-in targets from points with plain === true, so their paper colour matches.
```

### I. Shader change and the `out` travel order

```glsl
// vertex shader: pass the code colour through
attribute vec3 aCode;
varying vec3 vCode;
// in main(): vCode = aCode;

// fragment shader
uniform float uCode;
varying vec3 vCode;
// after the existing paper / accent mix, before the lit-sphere lighting:
base = mix(base, vCode, uCode);
```

```ts
// In the morph's per-particle delay, next to the existing orders (along: index, around: angle, across: x, down: y):
case 'out': order = Math.hypot(to[k] - centreX, to[k + 1] - centreY) / maxRadius; break;   // centre first, edges last
```

### J. Registered properties and the rim spin

```css
@property --hc-acc   { syntax: '<color>'; inherits: true;  initial-value: #8ED09C; }
@property --hc-rim-a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.hero-stage { --hc-acc: var(--accent-headroom); transition: --hc-acc var(--dur-effects-slow) var(--spring-effects-slow); }
.hero-stage[data-product="friction"] { --hc-acc: var(--accent-friction); }
.hero-stage[data-product="signal"]   { --hc-acc: var(--accent-signal); }
.hero-stage[data-product="bumper"]   { --hc-acc: var(--accent-bumper); }

@keyframes hc-rim-spin { to { --hc-rim-a: 360deg; } }
@media (prefers-reduced-motion: reduce) { .hc-rim { animation: none; } }
```

`--hc-acc` only colours small elements: the rim, the tag border and the light line. Large areas (the card light) crossfade layers instead (15.1).

---

*Design intent in one line:* in three seconds a recruiter should see a real product, real design craft and real code, without reading a word, and then watch that same product turn into the work below.
