# Homepage redesign, white mode (v5)

Instructions for Claude Code. Owner: Jay Harwani. Prepared October 7, 2026.

- Status: ready for Phase 0.
- Scope: the homepage at https://jayharwani.com first. Case study pages move onto the shared tokens in Phase 8.
- Supersedes: the homepage sections of the v4 `SPEC.md` and the stack and visual rules in the v4 `CLAUDE.md` (dark cinematic build).
- Every version number, size and contrast ratio in this file was checked on October 7, 2026. Section 21 lists the sources.

---

## 0. How to use this file

### 0.1 Setup and kickoff

1. Save this file as `docs/HOMEPAGE_REDESIGN.md` in the portfolio repo.
2. Move the v4 `SPEC.md`, `BUILD.md` and `reference/` into `docs/archive/v4/`. Keep them for reference. Do not delete history.
3. Replace `CLAUDE.md` with the text in Section 17.
4. Install the skills and the MCP server in Section 15.
5. Start Claude Code in the repo root and paste this prompt:

```text
Read CLAUDE.md and docs/HOMEPAGE_REDESIGN.md completely before doing anything.
Then do Phase 0 only (Section 16). Report: the baseline numbers, the router setup
you found (createBrowserRouter with RouterProvider, or BrowserRouter), every file
you plan to change in Phase 1, and anything in the spec that conflicts with the
codebase. Do not write or change code until I reply.
```

6. After every phase, Claude Code stops and shows: what changed, screenshots at 390, 768 and 1440 px wide, and the phase's acceptance checks marked pass or fail. Use this prompt to continue:

```text
Phase N is approved. Do Phase N+1 only, following Section 16. Stop when its
acceptance checks are done and report them as pass or fail with evidence.
```

### 0.2 Rules of precedence

- This file wins over everything in `docs/archive/v4/` for the homepage.
- If this file and the codebase disagree on a fact (a route, a URL, a project detail), stop and ask Jay.
- Never invent facts, metrics, dates, quotes, testimonials or logos. Missing facts are written as `[FILL: what is needed]`. Facts that exist but need Jay's confirmation are written as `[VERIFY: draft text]`. Both block the production build (Section 9.4).
- Where an installed skill disagrees with this file, this file wins (Section 15.3).

### 0.3 Assumptions in force

Jay has not answered the open questions yet. Build on these assumptions and keep each one easy to reverse.

| ID | Decision | Assumption used | How to reverse |
|---|---|---|---|
| A1 | Animation engine | GSAP 3.15 (core and ScrollTrigger only) is allowed for the showcase, loaded after first paint. The hero uses CSS only. Scroll stays native. | Use Path B (Section 8.4). Nothing else changes. |
| A2 | Signature moment | The pinned Spec to Ship showcase (Section 6.3). | Use the stacked layout (Section 6.3.5) at every width. |
| A3 | Hero meaning | "Designs it." is the outline. "Then ships it." fills with ink. This inverts v4 on purpose. | Swap the two line classes. |
| A4 | Projects | Showcase: Friction, Headroom, Signal, Bumper. "More work" index: Intent, Welspun GCC dashboards, UMBC Cards Lab dashboard. ChronoWeave was removed from the site in 84ce7fa and stays removed. Private work gets a written summary only. | Edit `src/content/home.ts`. |
| A5 | Positioning | "Product designer who writes the front end." GitHub link hidden by a content flag. | Change the copy and set `showGitHub: true`. |
| A6 | Resume | Public PDF at `/resume.pdf`, with no phone number or street address. | Remove the resume entry in `home.ts`. |
| A7 | Photo | About shows a portrait when `public/about/portrait.avif` exists. The layout works without it. | Delete the file. |
| A8 | Metrics | Every outcome number is `[FILL]` until Jay supplies it. | Fill `home.ts`. |
| A9 | Freshness | The "Now" section is updated monthly and hides itself when its newest entry is older than 45 days. Live numbers only where a public data endpoint exists. | Set `nowEnabled: false`. |
| A10 | Typography | Geist and Geist Mono only, self-hosted and subset to Latin. | Change the display face token. Nothing else changes. |
| A11 | Deadline | Unknown. Phases 0 to 6 produce a complete homepage that can ship on its own. | Stop after Phase 6 if time is short. |

---

## 1. The brief

### 1.1 Goal

In five seconds, a design recruiter, a design lead or a founder should know three things:

1. Who Jay is.
2. That he designs products and builds them himself.
3. Where to click for proof.

In sixty seconds they should have seen at least one live product working and opened one case study. The page must be clean enough to forward to a hiring manager with no explanation.

### 1.2 Audiences

| Audience | Time they give | What they judge | What the page must do |
|---|---|---|---|
| Recruiter or talent partner | 10 to 30 seconds, often on a phone | Role fit, seniority signals, contact, resume | Name and role in the first frame. Resume and email one tap away. |
| Design lead or hiring manager | 1 to 5 minutes | Craft, judgment, how problems became decisions | Precise type and motion, honest case studies, real outcomes |
| Founder | 30 seconds to a few minutes | Can he ship a v1 alone, with taste | Live products, range from research to code |
| AI screening tools | Seconds | Facts they can parse | Text in the HTML, structured data, an llms.txt file |

Figma's 2026 hiring research supports this balance. A majority of hiring managers rank visual polish among the five most important designer skills, and most regions report rising demand for AI tool fluency (Section 21).

### 1.3 The five-second contract

On first paint, at 390 x 844 and 1440 x 900, with no animation required:

1. The name "Jay Harwani" is visible (header and subline).
2. The role is visible: product designer who writes the front end.
3. The thesis is visible: "Designs it. Then ships it."
4. The start of the work is visible: the top edge of the first project frame on desktop, and the first project's name on mobile, where the stacked layout puts the name above the frame.
5. Two actions are visible: "See the work" and "Email me".

### 1.4 What changes from v4

| Area | v4 (dark, live today) | v5 (white) |
|---|---|---|
| Mood | Cinematic, 3D starfield | Ink on paper, editorial precision |
| Where boldness lives | The background canvas | One scroll moment: the Spec to Ship showcase |
| Hero | Thin outline headline, 16-layer extrusion, multi-second title sequence | Outline "Designs it.", ink-filled "Then ships it.", 1.4 s intro once per session |
| Work | Index list with a hover preview panel | Pinned showcase on desktop, stacked cards with a Spec / Shipped toggle on mobile, plus a compact index |
| Navigation | Side rail of section markers | Header with name, Work, About, Resume, Contact |
| Color | Near-black, four glowing accents | White paper, ink, one spec blue. Other color comes only from the work. |
| Fonts | Eight families declared | Geist and Geist Mono only |
| Removed | Canvas field, side rail, letter-roll links, magnetic hover, title sequence, glow effects | |

---

## 2. Audit of the current homepage

Method: Chrome on desktop at 1664 x 941 CSS px (device pixel ratio 1.5) on October 7, 2026, with DOM and style inspection in the console, plus a comparison with `/headroom`.

Stack found: React 18.3.1, React Router 7.13.2, Vite, plain CSS, hosted on Cloudflare. No animation libraries and one 2D canvas. Homepage JavaScript across the `main`, `react` and `HomeV2` chunks is about 203 KB uncompressed. The CSS already has 21 `prefers-reduced-motion` rules. These are good foundations.

| # | Finding | Evidence | Severity | Fix in |
|---|---|---|---|---|
| 1 | Identity sits low in the hierarchy | Name and role appear only in one 16.5 px line at 52% opacity. There is no header. | Critical | 6.1, 6.2 |
| 2 | Proof sits below the fold | The first project is about two screens down. The byline appears after about 3 s. | Critical | 6.2, 6.3 |
| 3 | The H1 reads as 21 copies | Assistive tech gets "Then ships it." twice, then "Designs it." 19 times. No layer is hidden. | Critical (WCAG 1.3.1) | 6.2, 10 |
| 4 | Contact link names are built from split letters | Link text reads "EmailEEmmaaiill..."; only some duplicate letters are `aria-hidden`. | Major (WCAG 2.5.3, 4.1.2) | 6.7 |
| 5 | Text below a readable size | Rail labels are 9 px; meta text is 10 to 11 px, under the 10.5 px floor in the v4 CLAUDE.md. | Major | 4.2 |
| 6 | Weak sharing | No `og:image`. `twitter:card` is `summary`. The served HTML has no body content. Every route shares one set of meta tags. Unknown URLs return HTTP 200. | Major | 12 |
| 7 | Inconsistent system | Eight font families declared. Two third-party font stylesheets. Nine width breakpoints (700, 760, 768, 900, 980, 1000, 1100, 1240, 1440). Dark homepage, light case studies. | Major | 4, Phase 8 |
| 8 | Counters render zero first | Page text reads "$0" and "0 this week" before the animation runs. Scrapers and screen readers can read the zeros. | Minor | 6.3.6 |
| 9 | Hidden actions | "Case study" and "Open app" appear only on hover, so touch users never see them. | Minor | 6.3 |
| 10 | Template signals | Tracked all-caps labels, 01 to 04 numbering on items that are not a sequence, middle-dot meta strings, tiny monospace labels, "2026" repeated on every row | Minor | 3.4, 9.1 |

Keep:

- The thesis line.
- The live coded previews. They are the strongest asset on the page.
- The Ahmedabad to Baltimore story.
- The performance discipline.
- The plain voice of the byline.

---

## 3. Concept: Spec to Ship

### 3.1 The idea

Every piece of work on the page appears first as a spec, then ships.

- The spec is drawn in thin blue lines with real measurements.
- Shipping is a left-to-right reveal that turns the spec into ink. For projects, it also turns the spec into the live product with its own color.

The page acts out Jay's claim instead of stating it. The idea also continues his earlier nib-and-ink hero direction, which reads naturally on white paper.

### 3.2 Principles

1. **The work carries the color.** The shell is ink on white paper. The only saturated colors are the spec blue and each project's own accent inside its frame.
2. **One bold moment.** The showcase is the only scroll-driven set piece. The hero intro is a short overture. Every other section is static or responds only to a direct action.
3. **Spec is a layer, not a style.** Blue spec marks appear in four places only:
   - the hero intro;
   - the showcase's spec phase;
   - on hover over the headline;
   - in Spec mode.

   At rest the page is calm.
4. **Motion answers the reader.** Scroll drives the showcase, hover reveals the spec, and clicks get instant feedback. Nothing loops forever except live data inside a preview that is on screen.
5. **Everything is real.** Measurements are read from computed styles, numbers come from content files or live endpoints, and nothing is mocked.
6. **Fast first.** The page is complete and readable on the first frame. Motion is progressive enhancement.

### 3.3 Motion grammar (applies everywhere)

- Shipping moves left to right: the hero ink fill, the showcase reveal, the progress fill and link underlines all follow it.
- Spec is blue. Shipped is ink plus product color.
- The container stays still and the content changes. Frames never fly around the page.
- Entering eases out. Leaving is faster and eases in. Moving between two visible states eases in and out.

### 3.4 Review against generic defaults

A first pass produced several default ideas. The table records why each was rejected.

| First instinct | Why it is a default | Decision |
|---|---|---|
| Cream paper, serif display, one italic accent word | One of the most common looks in generated designs right now | True white paper and one grotesk. Whole lines carry meaning (outline versus ink). |
| Dot grid behind everything | Design-tool imitation seen on many portfolios | The grid appears only in spec states and Spec mode. |
| Bento grid of project cards | SaaS card kit that makes every project look equal | One pinned showcase plus a typographic index |
| Tracked all-caps labels, "01 / 02 / 03", middle-dot meta | Template chrome | Sentence case. Labels only where they carry information. |
| Fake design-tool UI with named cursors | Literal and cute rather than precise | Engineering-drawing vocabulary: guides, dimension lines, values |
| Smooth-scroll library, custom cursor, magnetic buttons | Habits from 2021 to 2024 award sites | Native scroll, system cursor, no magnetism |
| Fade-and-slide-up on every section | Reads as generated | Static sections. Motion only in the hero, the showcase and direct feedback. |

---

## 4. Design tokens

All values live in `src/styles/tokens.css` (Section 4.6). Components reference tokens, never raw values. The palette is locked: do not add colors.

### 4.1 Color

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | #FFFFFF | Page background | n/a |
| `--paper-2` | #F4F5F7 | Hover rows, code chips, spec-state wells inside frames | n/a |
| `--line` | #E3E5E8 | Hairline dividers | decorative |
| `--line-strong` | #D0D4D9 | Button borders, wireframe outlines | decorative |
| `--ink` | #000000 | Display type and primary button fill only | 21.0:1 on white |
| `--ink-1` | #1C1F24 | Body text | 16.5:1 on white |
| `--ink-2` | #565D67 | Secondary text | 6.65:1 on white, 6.10:1 on paper-2 |
| `--ink-3` | #6B7280 | Meta text, on white only | 4.83:1 on white. Fails on paper-2 (4.43:1), so use ink-2 there. |
| `--spec` | #1D5FE0 | Spec text, spec chip fill (white text on it), focus ring | 5.58:1 on white; white on spec is 5.58:1 |
| `--spec-line` | #3D7BFF | Guides, selection boxes, dimension lines. Graphics only, never text. | 3.84:1 on white (passes 3:1 for graphics) |
| `--live` | #16A34A | Availability dot only (graphic) | 3.30:1 on white |

Rules:

- **Ink use.** Body text is `--ink-1`. `--ink` (pure black) is reserved for display type and primary fills, where it reads as printed ink. This is deliberate. It is not a default near-black.
- **Where color appears.** No gradients, glass, glow or tinted overlays. Color appears in only three ways: spec blue, the live dot, and project accents inside frames.
- **Project accents.** Each project's accent comes from its own case study tokens. Headroom is #0A7A52, verified on `/headroom` at 5.36:1 on white. Claude Code reads the other accents from each case study's CSS and records them in `home.ts`. An accent used for text must reach 4.5:1 on white. An accent used for graphics must reach 3:1.
- **Light only.** Set `color-scheme: light` on `:root` and add `<meta name="theme-color" content="#FFFFFF">`. v5 has no dark theme.

### 4.2 Typography

Font files come from the `geist` npm package, version 1.7.2, released under the SIL Open Font License 1.1. Subset them to Latin and self-host them in `public/fonts/`:

| File | Role | Size after Latin subset (measured) |
|---|---|---|
| `Geist-SemiBold.woff2` (static) | Hero and section display. Any text that uses `text-stroke`. | about 12 KB |
| `Geist-Variable.woff2` | All other text, weights 400 to 600 | about 17 KB |
| `GeistMono-Medium.woff2` (static) | Spec layer and Spec mode only | about 9 KB |

**Why a static file for the hero.** The outline state uses `-webkit-text-stroke`, which strokes every contour. A static instance avoids the internal overlap lines that variable fonts can show under a stroke. Check at 400% zoom that no lines appear inside "t", "f" or "s".

Subset script (save as `scripts/fonts.sh` and run once; commit the outputs):

```bash
#!/usr/bin/env bash
set -euo pipefail
SRC=node_modules/geist/dist/fonts
OUT=public/fonts
U="U+0020-007E,U+00A0,U+00A9,U+00AE,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2122,U+2190-2193,U+2197"
F="kern,liga,calt,tnum,case"
mkdir -p "$OUT"
pyftsubset "$SRC/geist-sans/Geist-SemiBold.woff2"  --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file="$OUT/Geist-SemiBold-latin.woff2"
pyftsubset "$SRC/geist-sans/Geist-Variable.woff2"  --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file="$OUT/Geist-Variable-latin.woff2"
pyftsubset "$SRC/geist-mono/GeistMono-Medium.woff2" --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file="$OUT/GeistMono-Medium-latin.woff2"
```

(`pyftsubset` comes from `pip install fonttools brotli`. Add `geist` as a dev dependency.)

Type scale:

| Token | Size | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `--t-hero` | clamp(44px, 14.5vw, 168px) | 0.92 | 600, static file | -0.045em | H1 only |
| `--t-display` | clamp(32px, 4.4vw, 64px) | 1.02 | 600 | -0.03em | Section titles (h2) |
| `--t-title` | clamp(30px, 3.4vw, 48px) | 1.04 | 600 | -0.025em | Project names in the showcase (h3) |
| `--t-name` | 24px | 1.2 | 600 | -0.015em | Names in the More work index |
| `--t-lead` | clamp(18px, 1.45vw, 21px) | 1.45 | 400 | -0.011em | Hero subline, project problem line |
| `--t-body` | 16px, 17px from 640px | 1.6 | 400 | -0.006em | Paragraphs |
| `--t-small` | 15px | 1.5 | 400 (500 for nav and buttons) | 0 | Secondary text, nav, buttons |
| `--t-meta` | 13px | 1.4 | 500 | 0 | Meta rows, tabular numbers |
| `--t-spec` | 12px, Geist Mono | 1.3 | 500 | 0 | Spec chips and annotations only |

Rules:

- **Minimum size.** No text anywhere is smaller than 12 px. This raises the v4 floor of 10.5 px.
- **Case.** Sentence case everywhere. No all-caps labels and no letter-spaced labels above headings.
- **Line length.** Body text runs at most 64ch. The lead line runs at most 40ch.
- **Numbers.** Numbers that change or align use `font-variant-numeric: tabular-nums`.
- **Monospace.** Geist Mono appears only in the spec layer and Spec mode. Never use it for general labels.
- **Why the hero sizes are safe.** The sizes come from measured glyph widths, shaped with HarfBuzz at weight 600:
  - "Then ships it." is 6.298 em wide before tracking, and about 5.67 em after -0.045em of tracking.
  - At 14.5vw the line therefore fits inside the page margins down to a 320 px viewport.
  - Each hero line also sets `white-space: nowrap`, so a fallback font cannot wrap it and shift the layout.
- **Why the hero line height is safe.** The "g" descender reaches -0.162 em and the capitals reach 0.710 em. A line height of 0.92 therefore leaves about 0.05 em of air between the two lines (8 px at 168 px).
- **Geist metrics for the spec guides.**

  | Metric | Value |
  |---|---|
  | Units per em | 1000 |
  | Ascent | 1.005 em |
  | Descent | 0.295 em |
  | Cap height | 0.710 em |
  | x-height | 0.534 em |

### 4.3 Layout

- **Grid.** 12 columns. Max content width 1320 px. Gutter 16 px, or 24 px from 768 px. Page margin is `clamp(20px, 5vw, 72px)`.
- **Breakpoints.** Only four are allowed: 640, 768, 1024 and 1280 px. Write mobile-first `min-width` queries and delete the nine old values.
- **Spacing scale.** Tokens `--s-1` to `--s-14` map to 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 and 160 px.
- **Section rhythm.** Use `--section-gap: clamp(96px, 12vw, 160px)` between major sections.
- **Alignment.** Everything is left aligned to the grid. Only the 404 page centers its content.
- **Header and full-height sections.** The header is 56 px tall, or 64 px from 768 px. Full-height sections use `svh` units. Set `scroll-padding-top: calc(var(--header-h) + 16px)` on `html` so anchors and focused elements are never hidden under the header.

### 4.4 Shape and elevation

| Token | Value | Use |
|---|---|---|
| `--r-1` | 6px | Chips, inputs |
| `--r-2` | 10px | Buttons, segmented control |
| `--r-3` | 16px | Browser frames |
| `--r-device` | 40px | Phone frames |
| `--shadow-frame` | See Section 4.6 | Live frames only |
| `--shadow-pop` | See Section 4.6 | Toast, Spec mode inspector |

Rules:

- **Elevation.** Only live frames have elevation. Everything else is flat with hairlines, so the eye goes to the work.
- **Radius.** Radius grows with object size. Never put one radius on everything.
- **z-index scale.** Content 0, frame 1, spec layer 2, header 50, toast 60, Spec mode overlay 70, skip link 100.

### 4.5 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--d-1` | 120ms | Press, color change |
| `--d-2` | 200ms | Hover, small fades |
| `--d-3` | 320ms | Moving indicators, segmented control thumb |
| `--d-4` | 520ms | Content swaps, spec-to-shipped on mobile |
| `--d-hero` | 1400ms | Total budget of the hero intro |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Anything entering or settling |
| `--ease-in` | cubic-bezier(0.32, 0, 0.67, 0) | Anything leaving (always with shorter durations) |
| `--ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Moving between two visible states, the ink fill |
| `--spring-standard` | `linear()` curve, run for 320ms | Spatial movement: nav indicator, toggle thumb |
| `--spring-expressive` | `linear()` curve, run for 440ms | The one settle in the showcase, when a shipped frame lands |

The spring curves are sampled from the Material 3 Expressive spring parameters:

| Spring | Stiffness | Damping ratio | Overshoot | Settles in |
|---|---|---|---|---|
| Standard spatial | 700 | 0.9 | about 0.15% | about 320 ms |
| Expressive spatial | 380 | 0.8 | about 1.5% | about 440 ms |

A spring's shape depends only on its damping ratio; stiffness sets its duration. M3 Expressive also separates spatial springs, which may overshoot, from effect springs for color and opacity, which never do. Follow the same split here: opacity and color always use `--ease-out` or `--ease-in-out`, never a spring.

### 4.6 `src/styles/tokens.css`

```css
/* v5 tokens. Locked palette: do not add colors. */

@font-face {
  font-family: "Geist Display";
  src: url("/fonts/Geist-SemiBold-latin.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Geist";
  src: url("/fonts/Geist-Variable-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Geist Mono Spec";
  src: url("/fonts/GeistMono-Medium-latin.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
/* Metric-matched fallback. Values computed from Geist Regular against an
   Arial-metric font. Verify CLS <= 0.02 on a throttled load (Section 11.3). */
@font-face {
  font-family: "Geist Fallback";
  src: local("Arial"), local("Helvetica"), local("Liberation Sans");
  size-adjust: 102.4%;
  ascent-override: 98.1%;
  descent-override: 28.8%;
  line-gap-override: 0%;
}

@property --ink-fill { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
@property --reveal  { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --enter   { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --exit    { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --draw    { syntax: "<number>"; inherits: true; initial-value: 0; }

:root {
  color-scheme: light;

  /* Color */
  --paper: #ffffff;
  --paper-2: #f4f5f7;
  --line: #e3e5e8;
  --line-strong: #d0d4d9;
  --ink: #000000;
  --ink-1: #1c1f24;
  --ink-2: #565d67;
  --ink-3: #6b7280;
  --spec: #1d5fe0;
  --spec-line: #3d7bff;
  --live: #16a34a;

  /* Type */
  --font-display: "Geist Display", "Geist", "Geist Fallback", system-ui, sans-serif;
  --font-text: "Geist", "Geist Fallback", system-ui, sans-serif;
  --font-spec: "Geist Mono Spec", ui-monospace, "SFMono-Regular", Menlo, monospace;

  --t-hero: clamp(44px, 14.5vw, 168px);
  --t-display: clamp(32px, 4.4vw, 64px);
  --t-title: clamp(30px, 3.4vw, 48px);
  --t-name: 24px;
  --t-lead: clamp(18px, 1.45vw, 21px);
  --t-body: 16px;
  --t-small: 15px;
  --t-meta: 13px;
  --t-spec: 12px;

  --track-hero: -0.045em;
  --track-display: -0.03em;
  --track-title: -0.025em;
  --track-lead: -0.011em;
  --track-body: -0.006em;

  /* Layout */
  --max: 1320px;
  --margin: clamp(20px, 5vw, 72px);
  --gutter: 16px;
  --header-h: 56px;
  --section-gap: clamp(96px, 12vw, 160px);
  --segment: 85svh; /* showcase scroll distance per project */

  --s-1: 4px;   --s-2: 8px;   --s-3: 12px;  --s-4: 16px;  --s-5: 20px;
  --s-6: 24px;  --s-7: 32px;  --s-8: 40px;  --s-9: 48px;  --s-10: 64px;
  --s-11: 80px; --s-12: 96px; --s-13: 128px; --s-14: 160px;

  /* Shape and elevation */
  --r-1: 6px;
  --r-2: 10px;
  --r-3: 16px;
  --r-device: 40px;
  --shadow-frame:
    0 0 0 1px rgb(16 24 40 / 0.06),
    0 1px 2px rgb(16 24 40 / 0.04),
    0 12px 32px -8px rgb(16 24 40 / 0.12),
    0 32px 72px -24px rgb(16 24 40 / 0.14);
  --shadow-pop:
    0 0 0 1px rgb(16 24 40 / 0.08),
    0 6px 16px -4px rgb(16 24 40 / 0.16);

  /* Motion */
  --d-1: 120ms;
  --d-2: 200ms;
  --d-3: 320ms;
  --d-4: 520ms;
  --d-hero: 1400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.32, 0, 0.67, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --spring-standard: linear(0, 0.049, 0.161, 0.295, 0.43, 0.553, 0.659, 0.746, 0.815,
    0.868, 0.909, 0.938, 0.96, 0.975, 0.985, 0.992, 0.996, 0.999, 1, 1.001, 1.001,
    1.002, 1.001, 1.001, 1);
  --spring-standard-d: 320ms;
  --spring-expressive: linear(0, 0.052, 0.17, 0.316, 0.463, 0.597, 0.712, 0.804,
    0.875, 0.927, 0.963, 0.987, 1.002, 1.011, 1.014, 1.015, 1.014, 1.012, 1.01,
    1.008, 1.006, 1.004, 1.003, 1.002, 1);
  --spring-expressive-d: 440ms;

  /* Layers */
  --z-frame: 1;
  --z-spec: 2;
  --z-header: 50;
  --z-toast: 60;
  --z-specmode: 70;
  --z-skip: 100;
}

@media (min-width: 640px) {
  :root { --t-body: 17px; }
}
@media (min-width: 768px) {
  :root { --gutter: 24px; --header-h: 64px; }
}
```

---

## 5. Page structure

### 5.1 Section order

| Order | Section | Anchor | Job | Desktop height |
|---|---|---|---|---|
| 0 | Skip link | | Jump to main content | |
| 1 | Header | | Identity and navigation at every scroll position | 64 px, sticky |
| 2 | Hero | `#top` | Thesis, who, actions, status | `min(88svh, 980px)` |
| 3 | Selected work (showcase) | `#work` | Proof: four live products | 100svh plus 4 x 85svh |
| 4 | More work | `#more-work` | Range, including professional work | content |
| 5 | About | `#about` | The person, the route, the facts | content |
| 6 | Now | `#now` | Freshness and a reason to return | content (hidden when stale) |
| 7 | Contact | `#contact` | Conversion | content |
| 8 | Footer | | Last updated, Spec mode | content |

### 5.2 Desktop wireframes (1440 x 900)

Hero, first frame:

```text
+------------------------------------------------------------------------------+
| Jay Harwani                                 Work   About   Resume   Contact  |
|                                                                              |
|  Designs it.        outline (the spec), blue guides during the intro         |
|  Then ships it.     ink (the shipped line)                                   |
|                                                                              |
|  I'm Jay Harwani, a product designer who writes the front end.               |
|  Every project below is live, so you can use the work instead of             |
|  reading about it.                                                           |
|                                                                              |
|  [ See the work ]   [ Email me ]                                             |
|                                                                              |
|  o Open to product design roles      Baltimore, open to relocation           |
|                          +---------------------------------------------+     |
+--------------------------|---------------------------------------------|-----+
                           first frame peeks here (top edge of the showcase)
```

Showcase stage, pinned:

```text
+------------------------------------------------------------------------------+
| Jay Harwani                                 Work   About   Resume   Contact  |
|  Selected work                                                               |
|                          +---------------------------------------------+     |
|  Headroom                |  . . . . . . . . . . . . . . . . . . . . .  |     |
|                          |  .          +------------+              .  |     |
|  Your bank balance is    |  .  chip -> |  spec:     |  <- chip     .  |     |
|  not what you can        |  .          |  wireframe |              .  |     |
|  spend.                  |  .          |  then live |              .  |     |
|                          |  .          +------------+              .  |     |
|  Design and front end    |  . . . . . . . . . . . . . . . . . . . . .  |     |
|  React PWA, local-first  +---------------------------------------------+     |
|  2026                                                                        |
|  [FILL: outcome]                                                             |
|  [ Read case study ]  Open the app                                           |
|                                                                              |
|  Friction   Headroom   Signal   Bumper      (progress fills left to right)   |
+------------------------------------------------------------------------------+
```

### 5.3 Mobile wireframes (390 x 844)

```text
+------------------------------------+    +------------------------------------+
| Jay Harwani   Work  Resume Contact |    | Headroom                           |
|                                    |    | Your bank balance is not what you  |
| Designs it.                        |    | can spend.                         |
| Then ships it.                     |    | +--------------------------------+ |
|                                    |    | |                                | |
| I'm Jay Harwani, a product         |    | |   frame: spec, then shipped    | |
| designer who writes the front end. |    | |                                | |
| Every project below is live, so    |    | +--------------------------------+ |
| you can use the work instead of    |    | [  Spec  |  Shipped  ]             |
| reading about it.                  |    | Design and front end               |
|                                    |    | React PWA, local-first. 2026       |
| [ See the work ] [ Email me ]      |    | [FILL: outcome]                    |
| o Open to product design roles     |    | [ Read case study ]  Open the app  |
| Baltimore, open to relocation      |    |                                    |
| +--------------------------------+ |    | Signal                             |
+------------------------------------+    +------------------------------------+
```

---

## 6. Component specs

Each spec follows the same order: purpose, layout, states, responsive behavior, edge cases and accessibility. Motion timings are consolidated in Section 7.

### 6.1 Site header

Purpose: identity and navigation at every scroll position.

Layout: full width, height `--header-h`, sticky at the top. The inner row is limited to `--max` with `--margin` on both sides. The name sits on the left and the nav on the right.

Content:

- "Jay Harwani" links to `/`. On the homepage it scrolls to the top.
- The nav links are:
  - Work (`#work`)
  - About (`#about`)
  - Resume (`/resume.pdf`, opens in a new tab)
  - Contact (`#contact`)

| Element | State | Behavior |
|---|---|---|
| Header | At the top (scrollY 8 px or less) | Transparent, no border |
| Header | Scrolled | Background `rgb(255 255 255 / 0.85)` with `backdrop-filter: saturate(1.4) blur(12px)` and a 1 px `--line` bottom border. Fade in over `--d-2` with `--ease-out`. |
| Header | `prefers-reduced-transparency: reduce` | Solid `--paper` background |
| Nav link | Default | `--t-small` at weight 500, `--ink-2` |
| Nav link | Hover (fine pointer) | `--ink-1`. A 1 px underline grows left to right over `--d-2`. |
| Nav link | Current section | `--ink-1`, `aria-current="true"`. A 2 px `--ink` indicator sits under the link and moves between links (translateX and scaleX only) with `--spring-standard` over `--spring-standard-d`. |
| Nav link | Focus-visible | 2 px `--spec` outline, offset 2 px, radius `--r-1` |

Find the current section with one IntersectionObserver over the section elements, using `rootMargin: "-45% 0px -50% 0px"`.

| Width | Behavior |
|---|---|
| Below 380 px | Name, Resume, Contact. Work is hidden because the hero's "See the work" covers it. |
| 380 to 767 px | Name, Work, Resume, Contact |
| 768 px and up | Name, Work, About, Resume, Contact |

Accessibility:

- Use a `<header>` landmark and `<nav aria-label="Primary">`.
- The Resume link includes visually hidden text "(PDF, opens in a new tab)".
- The skip link comes before the header in the DOM.

### 6.2 Hero and spec layer

Purpose: deliver the five-second contract (Section 1.3) and the one-time overture.

**Layout**

- `min-height: min(88svh, 980px)`, so the first showcase frame peeks below it.
- Padding-top is `clamp(48px, 12svh, 128px)`. The sticky header already takes its own height in the flow, so do not add it again.
- The hero is a flex column. The status row sits at the bottom with `margin-top: auto`.
- The H1 spans the full content width, left aligned.
- The subline uses `--t-lead` in `--ink-1`, at most 40ch wide, with a `--s-8` top margin.
- Actions row (`--s-7` top margin):
  - Primary button "See the work", linking to `#work`.
  - Secondary button "Email me", a `mailto:` link.
- Status row in `--t-small`:
  - An 8 px `--live` dot followed by "Open to product design roles".
  - "Baltimore, open to relocation" in `--ink-2`.
  - The two items are separated by space, never by a middle dot. Below 640 px they stack.

**Markup.** The accessible name must read exactly "Designs it. Then ships it." Keep the literal space between the spans:

```html
<h1 class="hero-title">
  <span class="hero-line hero-line--design"><span class="hero-ink">Designs it.</span></span>
  <span class="hero-line hero-line--ship"><span class="hero-ink">Then ships it.</span></span>
</h1>
<div class="spec-layer" aria-hidden="true"><!-- guides, selection box, chips --></div>
```

**Styles**

```css
.hero-line {
  display: block;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--t-hero);
  line-height: 0.92;
  letter-spacing: var(--track-hero);
  -webkit-text-stroke: max(1px, 0.012em) var(--ink);
}
.hero-line--design { color: transparent; }          /* the spec: outline only */
.hero-line--ship   { color: var(--ink); }           /* final state: solid ink */

/* Intro only (class added by JS on first visit, removed when done) */
.hero.is-intro .hero-line--ship {
  color: transparent;
  background-image: linear-gradient(90deg, var(--ink) var(--ink-fill), transparent calc(var(--ink-fill) + 0.6%));
  -webkit-background-clip: text;
  background-clip: text;
  animation: ink-fill 760ms var(--ease-in-out) 520ms both;
}
@keyframes ink-fill { from { --ink-fill: 0%; } to { --ink-fill: 100%; } }

@media (forced-colors: active) {
  .hero-line { color: CanvasText; -webkit-text-stroke: 0; background: none; }
}
```

Both lines keep the same stroke in their final state. When the intro ends, swapping the fill gradient for `color: var(--ink)` therefore causes no visible change.

**Spec layer measurement** (runs only when the intro or hover reveal needs it):

1. Wait for `document.fonts.load('600 1em "Geist Display"')`. If the font is not ready within 300 ms, skip the intro and show the final state. Never hold back text.
2. Measure the inline `.hero-ink` span of line 1 with `getBoundingClientRect()`, and read `fs` (font size in px) from its computed style.
3. The inline box height should equal 1.3 x `fs` (ascent 1.005 plus descent 0.295).
   - If it differs by more than 2 px, draw only the selection box and skip the guides.
   - Otherwise compute:
     - `baseline = rect.bottom - 0.295 * fs`
     - `capLine = baseline - 0.710 * fs`
     - `xLine = baseline - 0.534 * fs`
4. Guides: three 1 px `--spec-line` horizontal lines (baseline at full opacity, cap and x-height at 60%) spanning the content width from margin to margin.
5. Selection box: a 1 px `--spec-line` rectangle from 8 px left of line 1 to 8 px right of it, and from 10 px above `capLine` to `baseline + 0.162 * fs + 8 px`. Four 7 px square handles sit at the corners, white fill with a 1 px `--spec-line` border.
6. Chips: white `--t-spec` text on a `--spec` fill, padding 2 px 6 px, radius `--r-1`.
   - Chip A sits above the box at its left edge: `Geist SemiBold {round(fs)}/{round(lineHeightPx)}`.
   - A dimension line runs along the top of the box with 6 px end ticks, centered label `W {round(rect.width)}`.
   - Chip B sits to the right of line 1, centered on the x-height line: `Tracking {letterSpacing / fs as a percentage, one decimal}`.
   - Every value is read from computed styles, so the spec is true at any viewport.
   - Below 640 px, show only chip A and the guides.
7. While the layer is visible, recompute on resize, debounced to 150 ms.

| Element | State | Behavior |
|---|---|---|
| Hero | First visit in the session, motion allowed | Intro runs once (Section 7.2). Store `sessionStorage["v5-hero-intro"] = "1"` inside try/catch. If storage is unavailable, run the intro. |
| Hero | Later visit in the same session, or back navigation | Final state immediately |
| Hero | Reduced motion | Final state. The spec layer never shows during load. |
| Hero | Any key, wheel, touch or pointer down during the intro | Jump to the final state within one frame |
| Line 1 | Hover with a fine pointer, after the intro | The line 1 spec layer fades in (`--d-2`, `--ease-out`) and fades out (`--d-1`, `--ease-in`) |
| Fonts | Not loaded within 300 ms | Skip the intro and show the final state |

| Width | Behavior |
|---|---|
| Below 640 px | Hero type follows the clamp. Subline 18 px. Buttons stay side by side if both fit at 44 px tall, otherwise stack. Status stacks. Chip A only. |
| 640 to 1023 px | Status on one line. All guides, chips A and B. |
| 1024 px and up | Full layout, all chips |

**Edge cases**

| Viewport | Behavior |
|---|---|
| Very tall (over 1100 px) | The `min(88svh, 980px)` rule stops runaway whitespace. |
| Landscape phones under 500 px tall | `min-height: auto`. |
| 400% zoom on a 1280 px window (320 CSS px) | The clamp keeps both lines inside the margins. |

**LCP guard.** Nothing in the hero starts at opacity 0 except the spec layer, so the largest text paints on the first frame.

### 6.3 Selected work: the Spec to Ship showcase

Purpose: proof. Each of the four flagship products appears as a spec, then ships into its live, working preview.

#### 6.3.1 Markup

```html
<section id="work" class="showcase" aria-labelledby="work-title" style="--n: 4">
  <a class="skip-inline" href="#more-work">Skip past selected work</a>
  <div class="stage">
    <h2 id="work-title" class="stage-label">Selected work</h2>
    <div class="stage-copy">
      <article class="project-copy" data-index="0" aria-labelledby="p-friction">...</article>
      <!-- one article per project -->
    </div>
    <div class="stage-frame">
      <a class="frame-link" data-index="0" href="/friction" tabindex="-1" aria-hidden="true">
        <!-- LiveFrame with .layer-spec and .layer-live -->
      </a>
      <!-- one frame per project, stacked in place -->
    </div>
    <nav class="progress" aria-label="Selected work progress">
      <!-- one button per project -->
    </nav>
  </div>
</section>
```

#### 6.3.2 Desktop layout (1024 px and up, motion allowed)

- Section height is set in CSS, inside the pinned media query only (Section 8.2): `.showcase { height: calc(100svh + var(--n) * var(--segment)); }`. In the stacked layout the height is automatic. Motion engines read this height but never set it.
- Stage: `position: sticky; top: 0; height: 100svh;` on the 12-column grid, with padding `calc(var(--header-h) + var(--s-8)) var(--margin) var(--s-9)`.
- Column placement:
  - Copy: columns 1 to 5.
  - Frame: columns 6 to 12.
  - Progress nav: columns 1 to 5, in the bottom row.
- Frame box: `width: 100%; aspect-ratio: 16 / 11; max-height: calc(100svh - var(--header-h) - 176px); align-self: center;`.
  - Browser frames fill the box.
  - Phone frames are centered at 100% of the box height with `aspect-ratio: 9 / 19.5`.
- All four copy blocks and all four frames share one grid cell each, stacked in place. The motion engine writes `--enter`, `--exit`, `--draw` and `--reveal` on each project's copy and frame elements (Section 8.2).
- The stage label "Selected work" is an h2 styled at `--t-small` in `--ink-2`, top left of the stage.

#### 6.3.3 Project copy block

| Element | Style | Content rule |
|---|---|---|
| Name (h3) | `--t-title`, `--ink` | Product name |
| Problem | `--t-lead`, `--ink-1`, at most 28ch | One sentence, at most 12 words |
| Meta | `--t-meta`, `--ink-3` | Three short lines: role, stack, year. Visually hidden labels "Role", "Stack", "Year". |
| Outcome | `--t-small`, `--ink-1` | One sentence with a real number, or `[FILL]` |
| Actions | Primary button plus external link | "Read case study" goes to `/{slug}`. The live link uses the label in Section 9.2 and opens in a new tab. |

Actions are always visible. Nothing is revealed only on hover.

#### 6.3.4 Live frames and previews

- **Frame kinds.**
  - `browser`: radius `--r-3`, with a 36 px chrome bar. The bar holds three 8 px circles in `--line-strong` and a URL pill that shows the real domain in `--t-meta` `--ink-3`.
  - `phone`: radius `--r-device`, with a 10 px light bezel in `--paper-2` and a 1 px `--line` ring. No notch.
- **Elevation and background.** `--shadow-frame` on `--paper`.
- **Two layers in every frame:**
  - `.layer-spec` is a wireframe of the same screen. Blocks are `--paper-2` with 1 px dashed `--line-strong` outlines, text lines are 6 px tall `--line` bars, and a dot grid (1 px dots every 16 px, `--spec-line` at 25% opacity) shows in the spec state only. The annotations come from Section 6.3.6.
  - `.layer-live` is the real component in its real colors. Port the four existing preview components and restyle them in each product's own light UI.
- **Match the case study.** Each preview's shipped screen must match the first screen of its case study hero (same screen, same numbers). The route morph in Section 7.5 then reads as one continuous object.
- **Previews are visual only.** Mark them `aria-hidden="true"` and `inert`, with no focusable children. The frame link duplicates the case study button for pointer users, so it carries `tabindex="-1"` and `aria-hidden="true"`. Middle-click and open-in-new-tab still work because it is a real `<a>`.

| Project | Frame | Case study | Live product | Shipped screen | Logic note shown in the spec state |
|---|---|---|---|---|---|
| Friction | browser | `/friction` | https://jayharwani.github.io/friction/ | Weekly scan card: reviews read, top complaint bars | `[VERIFY: Reads public App Store and Google Play reviews every week and groups the complaints that repeat.]` |
| Headroom | phone | `/headroom` | https://headroom-opal.vercel.app/ | Home screen with safe to spend and upcoming bills, matching the `/headroom` hero ($1,730) | Safe to spend is your balance minus the bills due before payday. |
| Signal | browser | `/signal` | https://jayharwani.github.io/dmv-map/ | This week's DMV events | `[FILL: how events are collected and how often they update]` |
| Bumper | browser | `/bumper` | https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp | Checkout page with the prompt "Wait. Do you need this, or do you want it?" and the buttons "Sleep on it" and "Buy anyway" | Asks one question at checkout before an impulse buy. |

#### 6.3.5 Stacked layout (below 1024 px, and at every width under reduced motion)

- No sticky stage and no scroll scrubbing.
- Each project is one article in this order: name, problem, frame, Spec / Shipped segmented control, meta, outcome, actions.
- Layout by width:
  - 768 to 1023 px: copy takes 5 columns on the left and the frame takes 7 on the right.
  - Below 768 px: one column.
- Projects are separated by `--s-13`.
- Default state:
  - **Motion allowed.** The frame starts in Spec. The first time it is 50% visible, it ships automatically once: `--reveal` goes from 0 to 1 over `--d-4` with `--ease-in-out`.
  - **Reduced motion.** The frame starts in Shipped, and toggling swaps states with an opacity change of `--d-1` at most.
- The segmented control (Section 6.8) switches state at any time by setting `data-state="spec"` or `data-state="shipped"` on the frame link (CSS in Section 8.2). The progress nav is hidden in this layout.

#### 6.3.6 Spec annotations, counters and live data

- **Measured annotations.** These come from `data-spec` attributes on elements inside `.layer-live`. Spec mode (Section 6.9) uses the same mechanism. The spec layer reads the live element's computed style and draws a dimension line and chip over the matching wireframe block. Allowed values:

  | Attribute | Chip label |
  |---|---|
  | `data-spec="type"` | "Geist 64/64" (family, size and line height) |
  | `data-spec="padding"` | "Padding 24" |
  | `data-spec="gap"` | "Gap 12" |
  | `data-spec="target"` | "Target 44" (the smaller of width and height) |

- **Logic note.** Each project adds one note from `specNote` in content.
- **Limits.** A frame shows at most four annotations: three measured and one logic note. Chips never overlap. If two would collide, drop the measured chip that belongs to the smaller element.
- **Counters.** The DOM always holds the final value. The visual count-up runs on a duplicate `aria-hidden` element:
  - It starts at 60% of the final value, never at zero.
  - It runs over 700 ms with `--ease-out`, once per page view.
  - It runs only when the frame is shipped and on screen.
  - It never runs under reduced motion.
- **Live data.** This applies only when a project has a public JSON endpoint:
  - Fetch once when the frame comes near the viewport, with a 2 s timeout.
  - On failure, keep the static value from content and add "as of {month year}" to the outcome line.
  - Never show a spinner inside a frame.

#### 6.3.7 Progress nav (desktop pinned layout only)

- Four buttons with the project names, `--t-small` at weight 500.
- **Track and fill.** Each name has a 2 px `--line` track under it. The `--ink` fill scales left to right with that project's local progress (transform `scaleX`). Completed projects show a full track and upcoming projects an empty one.
- **States.** The active name is `--ink-1` with `aria-current="true"`; the others are `--ink-3`.
- **Click.** A click scrolls to that project's shipped dwell, at `sectionTop + (index + 0.84) * segmentPx`. The scroll is smooth, or instant under reduced motion.

#### 6.3.8 Showcase states

| Element | State | Behavior |
|---|---|---|
| Project copy | Inactive | Opacity 0 and clipped by its line masks. It stays in the DOM and the accessibility tree. |
| Project copy | Active | Visible |
| Focusable element inside an inactive article | Focus | Scroll that project to its shipped dwell first, so the focus ring is never hidden (WCAG 2.4.11) |
| Frame | Spec | Wireframe, dot grid, annotations |
| Frame | Shipping | Live layer revealed left to right with `clip-path`. A 1 px `--spec-line` scanline rides the reveal edge, and each annotation fades as the scanline passes its x position. |
| Frame | Shipped | Live preview running, but only while on screen and while the tab is visible |
| Frame | Hover (fine pointer, shipped) | Shadow deepens to `--shadow-frame` plus `0 40px 80px -24px rgb(16 24 40 / 0.18)` over `--d-2` with `--ease-out`. Cursor is a pointer. |
| Live preview | Off screen or tab hidden | All timers and animations paused |

### 6.4 More work

Layout:

- An h2 "More work" in `--t-display`, followed by rows separated by `--line` hairlines.
- From 768 px, each row is a grid:
  - name: columns 1 to 4, `--t-name`
  - description: columns 5 to 9, `--t-small` `--ink-2`
  - kind: columns 10 and 11, `--t-meta` `--ink-3`
  - year: column 12, `--t-meta` `--ink-3`, tabular, right aligned
- Below 768 px each row stacks: name, description, then a "kind, year" line.

| Name | Description (at most 70 characters) | Kind | Link | Year |
|---|---|---|---|---|
| Intent | One productivity app, built in React Native and in Kotlin. | `[FILL: case study, repository or private]` | `[FILL]` | `[FILL]` |
| Welspun GCC dashboards | Enterprise dashboards for `[FILL: team or function]`. | Private work | none | `[FILL]` |
| UMBC Cards Lab | A surveillance dashboard for military robot operators. | `[FILL]` | `[FILL]` | `[FILL]` |

States:

- **Rows with a link.** The whole row is one `<a>`.
  - On hover, the row gets a `--paper-2` background inset by 12 px on each side with radius `--r-2`, over `--d-2`.
  - The name's underline grows left to right.
  - Focus-visible draws the ring around the whole row.
- **Rows without a link.** No hover state. Private rows end the description with "Walkthrough on request." in `--ink-3`.
- **Long text.** Never truncate with ellipses. Write shorter copy.

### 6.5 About and the route

**Layout**

- From 1024 px: portrait in columns 1 to 4 (`aspect-ratio: 4 / 5`, radius `--r-3`, `object-fit: cover`, `alt="Jay Harwani"`, AVIF at 80 KB or less, with width and height attributes). Text in columns 6 to 12.
- With no portrait file, the text takes columns 1 to 8.

**Content order**

1. h2 "From Ahmedabad to Baltimore." in `--t-display`.
2. The route arc.
3. The bio, `--t-body`, two short paragraphs, at most 64ch.
4. A facts list (`<dl>`, two columns from 640 px; `dt` in `--t-meta` `--ink-3`, `dd` in `--t-small` `--ink-1`):

| Term | Value |
|---|---|
| Design | Product, interaction, systems |
| Build | React, TypeScript, React Native |
| Research | MS in Human-Centered Computing, UMBC |
| Based | Baltimore, open to relocation |

**Route arc**

- SVG `viewBox="0 0 760 200"`, path `M 40 160 C 220 40, 540 40, 720 160`, with `pathLength="1"`.
- Stroke: `--ink-3`, 1.25 px, `vector-effect: non-scaling-stroke`.
- End dots: 3.5 px radius, `--ink`. Labels "Ahmedabad" (left) and "Baltimore" (right) sit below the dots in `--t-small`.
- Distance label "12,382 km" at the apex in `--t-meta` `--ink-2`, tabular. This is the verified great-circle distance from v4.
- **Animation.** Runs once, when the arc is 40% visible:
  - The path draws as `stroke-dashoffset` goes from 1 to 0 over 1200 ms with `--ease-in-out`.
  - A 6 px `--spec-line` dot rides the path using `getPointAtLength`.
  - An `aria-hidden` counter ticks to 12,382 in sync. The DOM text always holds the final value.
- **Reduced motion.** The arc is drawn from the start.

### 6.6 Now

**Layout**

- h2 "Now", with "Updated {relative time}" on the same baseline. The relative time uses `Intl.RelativeTimeFormat` and is set in `--t-meta` `--ink-3`.
- 3 to 5 entries:
  - date: columns 1 and 2, `--t-meta` `--ink-3`, tabular
  - text: columns 3 to 9, `--t-body`
  - an optional link

**Rules**

- **Source and order.** Content comes from `src/content/now.ts`, newest first.
- **When it hides.** The section does not render when the newest entry is older than 45 days, or when `nowEnabled` is false.
- **No filler.** No "coming soon" text and no empty state. Stale content hurts more than no content.

### 6.7 Contact and footer

**Contact**

- h2 "Tell me what you're building." in `--t-display`.
- An optional line `[VERIFY: I usually reply within a day.]`. Keep it only if it is true.
- **Email row.** The address is a `mailto:` link at `--t-title` size in `--ink`, with `text-underline-offset: 0.18em`. Next to it is a secondary "Copy" button with an icon.
- **Links row.**
  - LinkedIn, Resume, and GitHub when `showGitHub` is true.
  - Each external link has an arrow icon and visually hidden "(opens in a new tab)".
  - Link text is plain words. Never split it into letters.
- **Status line.** The same status line as the hero.

| Action | Result |
|---|---|
| Click "Copy" with the clipboard available | Write the address. The button label becomes "Copied" with a check icon for 1.6 s. A polite live region announces "Email address copied". |
| Click "Copy" with the clipboard blocked | Select the address text and show "Press Cmd+C or Ctrl+C to copy" for 3 s |
| Click the address | Opens the mail app |

**Footer**

- A hairline top border, then one row:
  - Left: "Jay Harwani, 2026".
  - Right: "Last updated {Month Year}", set from the build date.
  - Far right: a "Spec mode" button with a `kbd` hint "S" (Phase 10).
- Below 768 px the items stack.

### 6.8 Shared UI

**Buttons**

| Variant | Default | Hover (fine pointer) | Active | Focus-visible |
|---|---|---|---|---|
| Primary | `--ink` fill, white text, 44 px tall, 0 18 px padding, `--r-2`, `--t-small` at 500 | Background `--ink-1` over `--d-1` | `scale(0.98)` over `--d-1` | 2 px `--spec` outline, offset 2 px |
| Secondary | `--paper` fill, 1 px `--line-strong` border, `--ink-1` text | Background `--paper-2` | `scale(0.98)` | Same as primary |

**Links**

- **External link.** Text, a 12 px arrow-up-right icon (inline SVG, 1.5 stroke, `aria-hidden`) and visually hidden "(opens in a new tab)". On hover, the icon moves 2 px up and right over `--d-2` with `--ease-out`.
- **Text link.** A 1 px `--line-strong` underline with a 0.2em offset.
  - On hover, an `--ink-1` underline grows from the left over `--d-2` with `--ease-out`.
  - On leave, it shrinks toward the right over `--d-1` with `--ease-in`.

**Segmented control (Spec / Shipped)**

- **Track.** Two buttons in a `--paper-2` track with `--r-2` radius and 3 px padding. The track is 36 px tall, or 44 px on coarse pointers.
- **Thumb.** The thumb is `--paper` with `--shadow-pop`. It slides with `--spring-standard` over `--spring-standard-d`.
- **Semantics.** `role="group"` and `aria-label="Preview state"`. Each button has `aria-pressed`, and the arrow keys move between the two.
- **Size.** Each button is at least 44 px wide.

**Skip link**

- "Skip to content" is the first focusable element on the page.
- It appears at the top left on focus, with `--shadow-pop`.

### 6.9 Spec mode (optional, Phase 10)

Purpose: show the system behind the page. It is a detail people share, and it rewards a second visit.

- **Trigger.**
  - Press "S". The key is ignored in inputs, in contenteditable elements, and when any modifier key is held.
  - Or click the footer button.
  - Escape exits. The setting is not saved.
- **What appears.**
  - A 12-column overlay, with columns tinted `--spec-line` at 6%.
  - An 8 px baseline grid in `--spec-line` at 10%.
  - An inspector: hovering or focusing any element with `data-spec` shows a chip with its real computed values. Colors show their token names, via a lookup from hex value to token.
- **Announcements.** A polite live region says "Spec mode on" or "Spec mode off". Under reduced motion the overlays appear without fades.
- **Performance.** The overlay is one fixed element drawn with CSS gradients. The inspector reads computed styles only on `pointerover` or `focusin`. Nothing runs per frame.

---

## 7. Motion system

### 7.1 Choreography map

Only these moments move. Everything else is static.

| Moment | Trigger | Purpose | Spec |
|---|---|---|---|
| Hero intro | First load in a session | Act out the thesis once | 7.2 |
| Hero spec on hover | Pointer over line 1 | Show the spec on request | 6.2 |
| Showcase | Scroll position | The signature moment | 7.3 |
| Mobile ship | First time a frame is 50% visible, or the toggle | The same idea without scrubbing | 6.3.5 |
| Route arc | About enters the viewport, once | Tell the journey | 6.5 |
| Route morph | Click into a case study | Continuity between pages | 7.5 |
| Feedback | Hover, press, copy, toggle | Confirm that input was received | 7.4 |

### 7.2 Hero intro timeline

| Time (ms) | Element | Change | Duration (ms) | Easing |
|---|---|---|---|---|
| 0 | Whole hero | First paint. Both lines as outlines; subline, actions and status fully visible. | 0 | none |
| 80 | Line 1 guides (cap, x-height, baseline) | `scaleX` 0 to 1 from the left | 420 | `--ease-out` |
| 200 | Selection box and handles | Opacity 0 to 1, scale 0.985 to 1 | 240 | `--ease-out` |
| 300 | Spec chips (up to 3) | Opacity 0 to 1, 40 ms apart | 200 | `--ease-out` |
| 520 | Line 2, "Then ships it." | `--ink-fill` 0% to 100%, left to right. A 1 px `--spec-line` scanline rides the fill edge. | 760 | `--ease-in-out` |
| 1280 | Whole spec layer | Guides `scaleX` 1 to 0 toward the right; box and chips fade | 120 | `--ease-in` |
| 1400 | Hero | Remove `.is-intro`. Line 2 is now solid ink, with no visible change. | 0 | none |

Rules:

- **Frequency.** The intro runs once per browser session and never on back navigation.
- **Reduced motion.** The intro is skipped entirely.
- **Interruption.** Any input jumps the intro to its final state.
- **Budget.** The total stays within `--d-hero` (1400 ms).
- **What CSS owns.** The ink fill is pure CSS (Section 6.2).
- **What JS does.** It adds and removes `.is-intro`, places the spec layer, and fires the guide and chip animations with the Web Animations API. The hero never waits for GSAP.

### 7.3 Showcase scroll map (desktop pinned layout)

Each project owns one unit of the timeline, written as local progress `p` from 0 to 1. Total scroll distance is 4 x `--segment` (85svh).

| p | Copy | Frame | Spec layer | Progress nav |
|---|---|---|---|---|
| 0.00 to 0.12 | The previous project's lines leave upward inside their masks (`--exit` 0 to 1). This project's lines enter from below (`--enter` 0 to 1). | The previous frame fades (opacity 1 to 0, scale 1 to 0.985). This frame fades in, showing its spec layer. | Dot grid fades in | The active name switches at p = 0.06 |
| 0.12 to 0.22 | Still | Still | Annotations draw: dimension lines `scaleX` 0 to 1 from the left, then the chips fade in | Fill grows |
| 0.22 to 0.40 | Still. Dwell: read the problem. | Still | Still | Fill grows |
| 0.40 to 0.68 | The outcome line fades in between 0.60 and 0.68 | `--reveal` 0 to 1. The live layer is revealed left to right; the scanline sits at its edge. | Each annotation fades as the scanline passes it. The dot grid fades out. | Fill grows |
| 0.68 | One-shot: counters and the preview's own animation play once | Content settles from scale 0.995 to 1 with `--spring-expressive`. Time-based, not scrubbed. | Gone | |
| 0.68 to 1.00 | Still. Dwell: act. | Shipped and running | Gone | Fill completes |

Rules:

- **Start and end.** Project 1 is already in its spec state when the stage first pins, so it has no enter phase. After the last project's dwell, the stage releases and scrolls away normally.
- **Actions.** They stay visible for the whole time a project is active.
- **Scrolling up.** Every scrubbed value reverses. One-shot animations never replay in reverse.

### 7.4 Micro-interactions

| Element | Trigger | Change | Duration | Easing |
|---|---|---|---|---|
| Button | Press | `scale(0.98)` | `--d-1` | `--ease-out` |
| Button | Hover | Background color | `--d-1` | `--ease-out` |
| Text link | Hover in, hover out | Underline grows from the left, shrinks to the right | `--d-2`, `--d-1` | `--ease-out`, `--ease-in` |
| External link icon | Hover | Moves 2 px up and right | `--d-2` | `--ease-out` |
| Nav indicator | Current section changes | `translateX` and `scaleX` to the new link | `--spring-standard-d` | `--spring-standard` |
| Header background | Scroll past 8 px | Opacity 0 to 1 | `--d-2` | `--ease-out` |
| Segmented control thumb | Toggle | `translateX` | `--spring-standard-d` | `--spring-standard` |
| Mobile spec to shipped | Toggle or first view | `--reveal` 0 to 1, or 1 to 0 | `--d-4` | `--ease-in-out` |
| Copy button | Success | Copy icon crossfades to a check; the label swaps | `--d-2` | `--ease-out` |
| Frame shadow | Hover | Shadow deepens | `--d-2` | `--ease-out` |
| Hero line 1 spec | Hover in, hover out | Spec layer fades | `--d-2`, `--d-1` | `--ease-out`, `--ease-in` |
| Spec mode overlay | Toggle | Opacity | `--d-2` | `--ease-out` |

Rules:

- **When hover applies.** Hover effects apply only under `(hover: hover) and (pointer: fine)`.
- **What may animate.** Only `transform`, `opacity`, `clip-path` and `background-color`, plus the registered custom properties that feed them. Never animate width, height, top, left, margin or padding.
- **`will-change`.** Set it only while an animation is running, then remove it.

### 7.5 Route transitions (View Transitions)

Goal: when a project frame or its "Read case study" button is clicked, the frame morphs into the case study's hero frame.

**Option 1 (default, works on React 18.3.1 today)**

- Use React Router's `<Link to="/headroom" viewTransition>`. In React Router 7.13, this prop and `useViewTransitionState` are documented for data mode and framework mode only. If Phase 0 finds `<BrowserRouter>`, take one of two paths:
  - Migrate to `createBrowserRouter` with `<RouterProvider>`.
  - Or call `document.startViewTransition` around `navigate()` yourself.
- Give the clicked frame and the case study hero frame the same name, `view-transition-name: frame-{slug}`.
  - Names must be unique on a page. Apply the name only to the transitioning frame, using `useViewTransitionState(to)` or a class set at click time.
  - Each case study page sets the matching name on its own hero frame.

**Option 2 (later, as its own tested upgrade)**

- Upgrade to React 19.3, where `<ViewTransition>` became stable on September 9, 2026.
- Wrap both frames in `<ViewTransition name={"frame-" + slug} share="frame-morph">`.
- React 19 removes deprecated APIs, so ship this as a separate pull request with a full QA pass.

```css
::view-transition-group(*) {
  animation-duration: 420ms;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

**Fallback.** Browsers without `document.startViewTransition` navigate normally. The back button may not animate. That is acceptable, but it must never break or flash.

### 7.6 Reduced motion contract

| Feature | Motion allowed | Reduced motion |
|---|---|---|
| Hero intro | Runs once per session | Final state, no spec layer |
| Hero hover spec | Fades in and out | Not shown |
| Showcase | Pinned and scrubbed (1024 px and up) | Stacked layout, Shipped by default, instant toggle |
| Mobile ship | Automatic, once, at 50% visible | Shipped by default |
| Counters | 700 ms count-up | Final value only |
| Route arc | Draws once | Already drawn |
| View Transitions | 420 ms morph | None |
| Anchor scrolling | `scroll-behavior: smooth` | `auto` |
| Hover feedback | As specified | Color and opacity only, at most `--d-1` |
| Spec mode | Fades | Instant |

Implement this with `@media (prefers-reduced-motion: reduce)` in CSS and a `usePrefersReducedMotion()` hook for decisions made in JS. The hook listens for changes.

### 7.7 Banned motion

- Smooth-scroll libraries or any transform-based scroll wrapper (Lenis, Locomotive Scroll, ScrollSmoother).
- Custom cursors, cursor followers, magnetic buttons or links.
- Loaders, splash screens and letterbox title sequences.
- Fade-and-slide-up when a section enters the viewport.
- Parallax on text, tilt on cards, infinite marquees.
- Animated blur filters on large areas.
- Any timed animation that starts without user input, apart from the hero intro and the one-shot ship moments.
- Bounce or elastic easing beyond the roughly 1.5% overshoot of `--spring-expressive`.
- Autoplaying video.

---

## 8. Scroll engineering

### 8.1 Native scroll

The page scrolls natively. Never add a smooth-scroll library or a transform-based scroll wrapper. Native scroll keeps:

- `position: sticky` reliable, which the showcase depends on;
- trackpad and touch momentum native;
- keyboard scrolling, find-in-page and assistive tech working correctly;
- input free of added lag.

This keeps the v4 rule. `scroll-behavior: smooth` is allowed only for in-page anchor jumps, and only when reduced motion is off.

### 8.2 Architecture: engines write numbers, CSS owns the look

The scroll engine writes four unitless custom properties per project, plus one per progress button. Nothing else.

| Property | Written on | Range | Meaning |
|---|---|---|---|
| `--enter` | `copies[i]` and `frames[i]` | 0 to 1 | The project enters (copy lines rise, frame fades in) |
| `--exit` | `copies[i]` and `frames[i]` | 0 to 1 | The project leaves (copy lines rise out, frame fades out) |
| `--draw` | `frames[i]` | 0 to 1 | Annotations are drawn |
| `--reveal` | `frames[i]` | 0 to 1 | The live layer is revealed left to right |
| `--fill` | `fills[i]` | 0 to 1 | Progress nav fill |

CSS turns the numbers into transforms and clip-paths. Because CSS is the source of truth, Path A and Path B are interchangeable and produce identical visuals.

```css
/* Pinned layout only. Outside this query the stacked layout ignores --enter and --exit. */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .showcase { height: calc(100svh + var(--n) * var(--segment)); }
  .project-copy,
  .frame-link { opacity: calc(min(1, var(--enter) * 4) - var(--exit)); }
  .frame-link { transform: scale(calc(1 - var(--exit) * 0.015)); }
  /* Project 1 is visible before the motion module loads. */
  .project-copy[data-index="0"],
  .frame-link[data-index="0"] { --enter: 1; }
  .project-copy .mask { overflow: clip; }
  .project-copy .mask > span {
    display: block;
    transform: translateY(calc((1 - var(--enter)) * 100% - var(--exit) * 100%));
  }
  .progress .fill { transform: scaleX(var(--fill)); transform-origin: left center; }
}

/* Both layouts. The stacked layout sets --draw and --reveal from component state. */
.frame { container-type: inline-size; }
.frame .layer-live { clip-path: inset(0 calc((1 - var(--reveal)) * 100%) 0 0); }
.frame .scanline {
  transform: translateX(calc(var(--reveal) * 100cqw));
  opacity: calc(var(--reveal) * (1 - var(--reveal)) * 4);
}
/* --x is each annotation's left edge as a fraction of the frame width, set once by JS.
   An annotation stays visible until the scanline passes it, then fades over 10% of the width. */
.frame .annotation {
  opacity: calc(var(--draw) * clamp(0, 1 - (var(--reveal) - var(--x)) * 10, 1));
}

/* Stacked layout states (below 1024px, or with reduced motion at any width).
   The pinned layout never sets data-state: there the engine owns --draw and --reveal. */
.frame-link[data-state="spec"]    { --draw: 1; --reveal: 0; }
.frame-link[data-state="shipped"] { --draw: 1; --reveal: 1; }
@media (prefers-reduced-motion: no-preference) {
  .frame-link[data-state] { transition: --reveal var(--d-4) var(--ease-in-out); }
}
```

### 8.3 Path A (default under A1): GSAP ScrollTrigger scrubbing a sticky stage

- **What loads.** GSAP core and ScrollTrigger only, from a module that is imported dynamically when the showcase comes within 1.5 viewports. Measured for gsap 3.15.0: core about 28 KB gzip, ScrollTrigger about 18 KB gzip. It never sits on the critical path.
- **Pinning.** Use CSS `position: sticky`. Do not use the ScrollTrigger `pin` option, and do not use ScrollSmoother.
- **Timeline.** One timeline, where each project is one unit of duration. Use `scrub: 0.5` and `invalidateOnRefresh: true`.
- **Media conditions.** Wrap everything in `gsap.matchMedia()` with `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`. GSAP then creates and reverts the timeline automatically when conditions change.

```ts
// src/components/home/showcase/showcaseMotion.ts  (Path A, loaded on demand)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Els = { section: HTMLElement; copies: HTMLElement[]; frames: HTMLElement[]; fills: HTMLElement[] };

export function mountShowcaseMotion({ section, copies, frames, fills }: Els, onShip: (i: number) => void) {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const shipped = new Set<number>();
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    gsap.set([copies[0], frames[0]], { "--enter": 1 });

    copies.forEach((copy, i) => {
      if (i > 0) {
        tl.fromTo([copies[i - 1], frames[i - 1]], { "--exit": 0 }, { "--exit": 1, duration: 0.12 }, i);
        tl.fromTo([copy, frames[i]], { "--enter": 0 }, { "--enter": 1, duration: 0.12 }, i);
      }
      tl.fromTo(frames[i], { "--draw": 0 }, { "--draw": 1, duration: 0.1 }, i + 0.12);
      tl.fromTo(frames[i], { "--reveal": 0 }, { "--reveal": 1, duration: 0.28 }, i + 0.4);
      tl.fromTo(fills[i], { "--fill": 0 }, { "--fill": 1, duration: 1 }, i);
      tl.call(() => {
        if (!shipped.has(i)) { shipped.add(i); onShip(i); }
      }, [], i + 0.68);
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      animation: tl,
      invalidateOnRefresh: true,
    });
  });
  return () => mm.revert();
}
```

```tsx
// In Showcase.tsx: load the motion module only when the section is near.
useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;
  let destroy: (() => void) | undefined;
  let cancelled = false;
  const io = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    const { mountShowcaseMotion } = await import("./showcaseMotion");
    if (!cancelled) destroy = mountShowcaseMotion(collectEls(section), playShip);
  }, { rootMargin: "150% 0px" });
  io.observe(section);
  return () => { cancelled = true; io.disconnect(); destroy?.(); };
}, []);
```

`collectEls` queries `.project-copy`, `.frame-link` and `.progress .fill` inside the section. `playShip(i)` starts project `i`'s counters and preview animation, once.

### 8.4 Path B (if A1 is reversed): the same CSS driven by a small native engine

```ts
// src/components/home/showcase/showcaseMotionNative.ts  (Path B)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

type Els = { section: HTMLElement; copies: HTMLElement[]; frames: HTMLElement[]; fills: HTMLElement[] };
const PROPS = ["--enter", "--exit", "--draw", "--reveal", "--fill"];

export function mountShowcaseMotionNative({ section, copies, frames, fills }: Els, onShip: (i: number) => void) {
  const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const shipped = new Set<number>();
  let raf = 0;
  let shown = 0;
  let visible = false;

  const goal = () => {
    const r = section.getBoundingClientRect();                       // read first
    return clamp01(-r.top / (r.height - window.innerHeight)) * copies.length;
  };
  const write = (t: number) => {                                    // then write
    copies.forEach((copy, i) => {
      const p = t - i;
      for (const el of [copy, frames[i]]) {
        el.style.setProperty("--enter", String(i === 0 ? 1 : seg(p, 0, 0.12)));
        el.style.setProperty("--exit", String(seg(p, 1, 1.12)));
      }
      frames[i].style.setProperty("--draw", String(seg(p, 0.12, 0.22)));
      frames[i].style.setProperty("--reveal", String(seg(p, 0.4, 0.68)));
      fills[i].style.setProperty("--fill", String(seg(p, 0, 1)));
      if (p >= 0.68 && !shipped.has(i)) { shipped.add(i); onShip(i); }
    });
  };
  const tick = () => {
    const g = goal();
    shown += (g - shown) * 0.18;
    if (Math.abs(g - shown) < 0.0005) shown = g;
    write(shown);
    raf = visible && shown !== g ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (visible && mq.matches && !raf) raf = requestAnimationFrame(tick); };
  const clear = () => [...copies, ...frames, ...fills].forEach((el) => PROPS.forEach((p) => el.style.removeProperty(p)));
  const onMq = () => (mq.matches ? kick() : clear());

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
  io.observe(section);
  window.addEventListener("scroll", kick, { passive: true }); // the single permitted scroll listener: it only schedules a frame
  window.addEventListener("resize", kick);
  mq.addEventListener("change", onMq);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener("scroll", kick);
    window.removeEventListener("resize", kick);
    mq.removeEventListener("change", onMq);
    clear();
  };
}
```

### 8.5 Shared rules for both paths

- **Layout ownership.** Section height is set in CSS only. Engines never set sizes.
- **Frame loop.** Read layout once per frame, then write. Never read layout after writing in the same frame.
- **Media changes.** When the media query stops matching, remove the inline custom properties so the stacked layout's own state takes over. GSAP's `matchMedia` revert does this for Path A, and `clear()` does it for Path B.
- **Pausing.** Previews pause when off screen (IntersectionObserver) and when `document.hidden` is true.
- **Focus.** If focus lands inside an inactive project, scroll to its shipped dwell first (Section 6.3.8).
- **Progress nav.** It scrolls to `sectionTop + (index + 0.84) * segmentPx`.
- **Viewport units.** Use `svh`, not `vh`, so mobile browser bars never resize the stage.
- **Path A refresh.** Call `ScrollTrigger.refresh()` once after `document.fonts.ready`.
- **Cleanup.** Every IntersectionObserver, listener, animation frame and GSAP context is cleaned up in the effect's return function.

### 8.6 Scroll restoration

Returning from a case study must restore the exact scroll position, so the showcase shows the project the visitor left from.

- **Data mode.** Render `<ScrollRestoration />` once in the root layout.
- **Engines.** Both engines compute state from the current position on mount, so the restored position renders the right project. Write the first state synchronously on mount (Path B) or right after the trigger is created (Path A), so the wrong project never flashes.
- **Test.** Check back and forward navigation in Chrome and Safari at 1440 px.

---

## 9. Content and copy

All copy lives in `src/content/`. Components only render it, so Jay can edit text without touching layout.

### 9.1 Voice rules

- **Tone.** Plain, direct English. Honest rather than impressive.
- **Punctuation.** No em dashes or en dashes in any copy. The content check enforces this (Section 9.4).
- **Banned words.** No filler or hype: passionate, innovative, seamless, cutting-edge, leverage, world-class, delightful, revolutionize, unlock, elevate.
- **Case.** Sentence case everywhere, including buttons and headings.
- **One job per element.** Buttons say what happens: "Read case study", "Open the app", "Email me", "Copy". An action keeps the same name everywhere it appears.
- **Numbers.** Use a number only when it is real. Add a date where it could go stale ("as of October 2026").
- **Person.** First person ("I") in the hero subline, About and Contact.

### 9.2 Copy deck

These are drafts; Jay edits them in `src/content/home.ts`. Anything marked `[VERIFY]` or `[FILL]` blocks the production build until he resolves it.

**Head**

| Field | Copy |
|---|---|
| Title | Jay Harwani, product designer who writes the front end |
| Description | I design products and build them in React and TypeScript. Four are live. MS in Human-Centered Computing, UMBC. Open to product design roles. |

**Header**

- "Jay Harwani"
- Nav links: "Work", "About", "Resume", "Contact"

**Hero**

| Element | Copy |
|---|---|
| H1 | Designs it. Then ships it. |
| Subline (default, option A) | I'm Jay Harwani, a product designer who writes the front end. Every project below is live, so you can use the work instead of reading about it. |
| Subline option B | I'm Jay Harwani. I design products, then build them in React and TypeScript. Four are live right now. |
| Subline option C | Product designer in Baltimore. I take products from research to shipped code, and every project below is live. |
| Actions | "See the work", "Email me" |
| Status | "Open to product design roles", "Baltimore, open to relocation" |

**Showcase**

The section label is "Selected work". The order in the content array is the order on the page: Friction, Headroom, Signal, Bumper (the current order).

| Project | Problem (at most 12 words) | Role | Stack | Year | Outcome | Live link label |
|---|---|---|---|---|---|---|
| Friction | App stores bury the complaints that keep coming back. | Design and build | Astro | 2026 | `[FILL: one real result with a number]` | Open Friction |
| Headroom | Your bank balance is not what you can spend. | Design and build | React PWA, local-first | 2026 | `[FILL]` | Open the app |
| Signal | DMV tech and design events, live on one map. | Design and build | MapLibre | 2026 | `[FILL]` | Open the map |
| Bumper | A pause before the impulse buy. | Design and build | Chrome extension | 2026 | `[FILL]` | Install from the Chrome Web Store |

**More work.** As written in Section 6.4.

**About**

| Element | Copy |
|---|---|
| h2 | From Ahmedabad to Baltimore. |
| Paragraph 1 | `[VERIFY: I'm a product designer with about three years of professional experience and an MS in Human-Centered Computing from UMBC. I work from research to shipped code.]` |
| Paragraph 2 | `[VERIFY: I care more about judgment than output. I look for the real problem, design the smallest version that solves it, and build it myself in React and TypeScript, using AI tools like Claude Code and Cursor to move faster. I'm looking for a product design or design engineering role on a team building something people need.]` |

**Now.** `[FILL: three to five dated entries]`

**Contact**

| Element | Copy |
|---|---|
| h2 | Tell me what you're building. |
| Optional line | `[VERIFY: I usually reply within a day.]` |
| Buttons and links | "Copy", "LinkedIn", "Resume" |

**Footer.** "Jay Harwani, 2026", "Last updated {Month Year}", "Spec mode".

**404 page.** "This page does not exist." and the link "Go to the homepage".

**Announcements.** "Email address copied", "Spec mode on", "Spec mode off".

### 9.3 Content model

```ts
// src/content/home.ts
export type FrameKind = "browser" | "phone";

export interface FlagshipProject {
  slug: "friction" | "headroom" | "signal" | "bumper";
  name: string;
  problem: string;            // at most 12 words
  role: string;
  stack: string;
  year: number;
  outcome: string;            // a real result with a number, or a FILL marker until known
  caseStudyHref: `/${string}`;
  liveHref: string;           // absolute URL
  liveLabel: string;
  accent: string;             // from the project's own case study tokens
  frame: FrameKind;
  specNote: string;           // shown in the spec state; must be true
  liveDataUrl?: string;       // optional public JSON endpoint
}

export interface IndexItem {
  name: string;
  description: string;        // at most 70 characters
  kind: string;               // "Case study", "Live", "Repository" or "Private work"
  href?: string;
  year: number | string;
}

export const site = {
  name: "Jay Harwani",
  email: "harwanijay9498@gmail.com",
  linkedin: "https://www.linkedin.com/in/jay-harwani",
  resumeHref: "/resume.pdf",
  showGitHub: false,
  githubHref: "",             // set together with showGitHub
  status: "Open to product design roles",
  location: "Baltimore, open to relocation",
  nowEnabled: true,
} as const;

// Array order is page order: friction, headroom, signal, bumper.
export const flagship: FlagshipProject[] = [
  /* friction (see Section 9.2), */
  {
    slug: "headroom",
    name: "Headroom",
    problem: "Your bank balance is not what you can spend.",
    role: "Design and build",
    stack: "React PWA, local-first",
    year: 2026,
    outcome: "[FILL: one real result with a number]",
    caseStudyHref: "/headroom",
    liveHref: "https://headroom-opal.vercel.app/",
    liveLabel: "Open the app",
    accent: "#0A7A52",
    frame: "phone",
    specNote: "Safe to spend is your balance minus the bills due before payday.",
  },
  /* signal, bumper */
];
```

### 9.4 Content checks (runs before every production build)

```js
// scripts/check-content.mjs
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const targets = ["src/content", "public/llms.txt"];
const DASHES = /[–—]/; // en dash, em dash
const problems = [];

const scan = (path) => {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path)) scan(join(path, f));
    return;
  }
  readFileSync(path, "utf8").split("\n").forEach((line, i) => {
    const where = `${path}:${i + 1}`;
    if (line.includes("[FILL")) problems.push(`${where} unfilled: ${line.trim()}`);
    if (line.includes("[VERIFY")) problems.push(`${where} unverified: ${line.trim()}`);
    if (DASHES.test(line)) problems.push(`${where} dash character: ${line.trim()}`);
  });
};

targets.forEach(scan);
if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n${problems.join("\n")}`);
  process.exit(1);
}
```

- Add `"prebuild": "node scripts/check-content.mjs"` to `package.json`. Build scripts may print to the console; the no-console rule applies to shipped code.
- In development, render any string that starts with `[FILL` or `[VERIFY` inside `<mark class="todo">` with a dashed 1 px `--spec` outline, so every gap is visible on the page.

---

## 10. Accessibility

Standard: WCAG 2.2 AA. This version adds 2.4.11 (focus not obscured) and 2.5.8 (target size, minimum).

### 10.1 Requirements

- **Landmarks.**
  - A skip link, `<header>`, `<nav aria-label="Primary">`, `<main id="content">` and `<footer>`.
  - Each section uses `aria-labelledby` to point at its heading.
- **Headings.**
  - One h1, in the hero.
  - h2 for Selected work, More work, About ("From Ahmedabad to Baltimore."), Now and Contact.
  - h3 for each flagship project name.
- **H1 name.** The H1's accessible name is exactly "Designs it. Then ships it." Verify it in the Chrome DevTools Accessibility pane. The spec layer is `aria-hidden="true"`.
- **Link and button names.** Names are plain words, never split into letters. External links include visually hidden "(opens in a new tab)".
- **Live previews.** They are `aria-hidden` and `inert`. Every fact they show also appears as text in the project copy.
- **Counters.** The DOM always holds the final value (Section 6.3.6).
- **Focus.**
  - Every interactive element shows a visible 2 px `--spec` outline with a 2 px offset.
  - Never use `outline: none` without a replacement.
  - The sticky header never covers focus, because of `scroll-padding-top`.
  - Inactive showcase content scrolls into view when it receives focus.
- **Targets.** At least 24 x 24 px everywhere. Primary actions are 44 px tall, and 44 x 44 px on coarse pointers.
- **Text.**
  - Minimum 12 px; body text 16 to 17 px.
  - Content reflows without horizontal scroll at 320 CSS px and at 400% zoom (1.4.10).
  - Text-spacing overrides do not break the layout (1.4.12).
- **Contrast.** See Section 10.4.
- **Motion.** Follow Section 7.6. Any input interrupts the intro. Nothing flashes more than three times per second.
- **Forced colors.** The hero lines stay readable (Section 6.2). Focus indicators use `outline`, which survives forced colors, not only `box-shadow`.
- **Language and images.** `<html lang="en">`. The portrait's alt text is "Jay Harwani". Decorative SVGs are `aria-hidden`.

### 10.2 Keyboard map

| Key | Where | Action |
|---|---|---|
| Tab, Shift+Tab | Everywhere | Skip link, header, hero actions, each project's case study and live links, progress nav, More work rows, About links, Now links, Contact, footer |
| Enter, Space | Buttons and links | Activate |
| Left, Right | Segmented control | Switch between Spec and Shipped |
| S | Anywhere except inputs, with no modifier key held | Toggle Spec mode (Phase 10) |
| Escape | Spec mode | Exit |

### 10.3 Screen reader announcements

There is one polite live region per page.

| Event | Announcement |
|---|---|
| Email copied | "Email address copied" |
| Spec mode toggled | "Spec mode on" or "Spec mode off" |
| Segmented control | Conveyed by `aria-pressed`; no extra announcement |

### 10.4 Contrast checks (computed for this palette)

| Pair | Ratio | Required | Result |
|---|---|---|---|
| ink-1 on paper | 16.52:1 | 4.5:1 | Pass |
| ink-2 on paper | 6.65:1 | 4.5:1 | Pass |
| ink-2 on paper-2 | 6.10:1 | 4.5:1 | Pass |
| ink-3 on paper | 4.83:1 | 4.5:1 | Pass |
| ink-3 on paper-2 | 4.43:1 | 4.5:1 | Fail: never use this pair |
| White on spec (chips) | 5.58:1 | 4.5:1 | Pass |
| spec text on paper | 5.58:1 | 4.5:1 | Pass |
| spec-line graphics on paper | 3.84:1 | 3:1 | Pass |
| live dot on paper | 3.30:1 | 3:1 | Pass |
| Headroom accent on paper | 5.36:1 | 4.5:1 | Pass |
| White on ink (primary button) | 21.0:1 | 4.5:1 | Pass |

---

## 11. Performance

### 11.1 Budgets

| Metric | Budget | How to measure |
|---|---|---|
| LCP, lab, mobile | 2.0 s or less | Lighthouse mobile, median of 3 runs |
| LCP, lab, desktop | 1.0 s or less | Lighthouse desktop, median of 3 runs |
| CLS | 0.02 or less in the lab; 0.05 or less at field p75 | Lighthouse; field data when available |
| INP | 150 ms or less at field p75 | Field data. In the lab, no long task over 50 ms during interactions. |
| TBT, lab, mobile | 100 ms or less | Lighthouse mobile |
| Homepage initial JavaScript | 85 KB gzip or less | Vite build output |
| Deferred motion chunk | 50 KB gzip or less (core 28 KB plus ScrollTrigger 18 KB, measured) | Vite build output |
| Homepage fonts | 3 files, 45 KB total or less | Network panel |
| Third-party requests before LCP | 0 | Network panel |
| Showcase scroll | No run of 3 or more dropped frames at 4x CPU slowdown | Chrome DevTools Performance panel or a Chrome DevTools MCP trace |
| Lighthouse scores | Performance 95 or more on desktop and 90 or more on mobile; Accessibility, Best practices and SEO at 100 | Lighthouse |

### 11.2 Loading strategy

1. Remove the Google Fonts and Fontshare stylesheets and every unused `@font-face`: Clash Display, Switzer, DM Sans, Inter, Instrument Serif and Playfair Display.
2. Preload only the display font (Section 12.1).
3. The hero has no JavaScript animation dependency. Its intro uses CSS and the Web Animations API only.
4. The motion chunk loads after first paint, through an IntersectionObserver with a 150% root margin.
5. The first flagship frame mounts immediately because it peeks above the fold. The other three mount when they come within one viewport.
6. Preview timers and animations pause off screen and while the tab is hidden.
7. Portrait image rules:
   - AVIF, 80 KB or less;
   - explicit width and height;
   - `loading="lazy"` and `decoding="async"`.
8. Delete the v4 canvas field and its animation loop entirely.
9. Keep the Cloudflare analytics beacon deferred so it never blocks rendering.

### 11.3 Font fallback

- **The values.** The fallback face in Section 4.6 uses `size-adjust: 102.4%`, `ascent-override: 98.1%` and `descent-override: 28.8%`.
  - `size-adjust` comes from the width ratio of a sample sentence: 61.27 em in Geist Regular against 59.85 em in an Arial-metric font.
  - The two overrides are Geist's vertical metrics divided by that size adjustment.
- **Why the hero cannot shift.** Hero lines use `white-space: nowrap`, so a font swap cannot change their line count.
- **Verify.** Load with the cache disabled on Fast 4G. CLS must be 0.02 or less, with no visible text jump in the hero.

---

## 12. Sharing, SEO and AI screeners

Why this matters: Jay's main channel is cold outreach. Every link pasted into an email, a LinkedIn message or Slack must preview with a large, clean image and the right title for that page.

### 12.1 Homepage head tags (`index.html`)

```html
<title>Jay Harwani, product designer who writes the front end</title>
<meta name="description" content="I design products and build them in React and TypeScript. Four are live. MS in Human-Centered Computing, UMBC. Open to product design roles.">
<link rel="canonical" href="https://jayharwani.com/">
<meta name="theme-color" content="#FFFFFF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jay Harwani">
<meta property="og:title" content="Jay Harwani, product designer who writes the front end">
<meta property="og:description" content="I design products and build them in React and TypeScript. Four are live.">
<meta property="og:url" content="https://jayharwani.com/">
<meta property="og:image" content="https://jayharwani.com/og/home.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Designs it. Then ships it. Jay Harwani, product designer.">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/fonts/Geist-SemiBold-latin.woff2" as="font" type="font/woff2" crossorigin>
```

### 12.2 Share images

- **Format.** 1200 x 630 PNG, 300 KB or less, with a 60 px safe area on every side.
- **Home image.**
  - White paper.
  - "Designs it." in outline and "Then ships it." in ink, at about 120 px.
  - A 1 px spec-blue baseline guide under line 1.
  - "Jay Harwani, product designer" at 32 px, bottom left.
- **Project images.** Each project gets `/og/{slug}.png`: its shipped frame on white, with the project name and problem line.
- **How to make them.** Either screenshot a hidden route (for example `/og-preview/{slug}`) with a Playwright script at build time, or design them in Figma and export. Do not use AI-generated imagery.

### 12.3 Per-route HTML and meta

Today the site is a single-page app: every route returns the same HTML, so a `/headroom` link previews as the homepage. Phase 9 fixes this with one of two options:

- **Option A (preferred).** Prerender every route to static HTML at build time. React Router 7 framework mode supports pre-rendering with server rendering turned off; confirm the current docs before migrating. This also gives crawlers and AI screeners real text without JavaScript.
- **Option B (smaller).** Keep the single-page app and inject each route's title, description and `og` tags at the edge, using a Cloudflare Worker or Pages Function with HTMLRewriter.

Acceptance:

- `curl -s https://jayharwani.com/headroom | grep og:image` returns the Headroom image URL.
- LinkedIn Post Inspector shows the large image for `/` and for each case study.

### 12.4 Real 404 pages

Unknown URLs return HTTP 200 today. They must return HTTP 404 with a designed page: "This page does not exist." and a link home.

- On Cloudflare, prerendered routes plus a `404.html` achieve this, or the static-assets setting that serves a 404 page instead of the single-page-app fallback.
- Phase 0 confirms which Cloudflare product hosts the site.

Acceptance: `curl -sI https://jayharwani.com/does-not-exist` returns `404`.

### 12.5 Structured data (JSON-LD in `index.html`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jayharwani.com/#jay",
      "name": "Jay Harwani",
      "url": "https://jayharwani.com/",
      "jobTitle": "Product Designer",
      "email": "mailto:harwanijay9498@gmail.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Baltimore", "addressRegion": "MD", "addressCountry": "US" },
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "University of Maryland, Baltimore County" },
      "knowsAbout": ["Product design", "Interaction design", "Design systems", "React", "TypeScript", "React Native"],
      "sameAs": ["https://www.linkedin.com/in/jay-harwani"]
    },
    {
      "@type": "WebSite",
      "@id": "https://jayharwani.com/#site",
      "url": "https://jayharwani.com/",
      "name": "Jay Harwani",
      "author": { "@id": "https://jayharwani.com/#jay" }
    },
    {
      "@type": "ItemList",
      "name": "Selected work",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Friction", "url": "https://jayharwani.com/friction" },
        { "@type": "ListItem", "position": 2, "name": "Headroom", "url": "https://jayharwani.com/headroom" },
        { "@type": "ListItem", "position": 3, "name": "Signal", "url": "https://jayharwani.com/signal" },
        { "@type": "ListItem", "position": 4, "name": "Bumper", "url": "https://jayharwani.com/bumper" }
      ]
    }
  ]
}
</script>
```

### 12.6 `public/llms.txt`

```text
# Jay Harwani

> Product designer who writes the front end. Designs products and ships them in React and TypeScript. MS in Human-Centered Computing, UMBC. Based in Baltimore, open to relocation. Open to product design and design engineering roles.

## Selected work

- [Friction](https://jayharwani.com/friction): [VERIFY: one sentence on what Friction does]. Live: https://jayharwani.github.io/friction/
- [Headroom](https://jayharwani.com/headroom): a local-first money app that shows what is safe to spend before payday. Live: https://headroom-opal.vercel.app/
- [Signal](https://jayharwani.com/signal): a live map of DMV tech and design events. Live: https://jayharwani.github.io/dmv-map/
- [Bumper](https://jayharwani.com/bumper): a Chrome extension that adds a pause at checkout before an impulse buy.

## Contact

- Email: harwanijay9498@gmail.com
- LinkedIn: https://www.linkedin.com/in/jay-harwani
- Resume: https://jayharwani.com/resume.pdf
```

### 12.7 Sitemap and robots

- `public/sitemap.xml` lists `/`, `/friction`, `/headroom`, `/signal`, `/bumper` and `/about`. There is no `/chronoweave`.
- `public/robots.txt` allows everything and points to the sitemap.

---

## 13. Measurement

### 13.1 Events

`src/lib/analytics.ts` exports `track(name, props)`.

- It does nothing until a provider is configured.
- Cloudflare Web Analytics, already on the site, covers page views.
- Custom events need a privacy-friendly provider that supports them. Choose one in Phase 9 (open question Q12).
- It never logs to the console.

| Event | Props | Fires when |
|---|---|---|
| `hero_cta` | `target`: `work` or `email` | A hero action is clicked |
| `project_shipped_view` | `slug` | A project reaches its shipped state on screen |
| `case_study_open` | `slug`, `source`: `showcase`, `index` or `frame` | A case study link is clicked |
| `live_open` | `slug` | A live product link is clicked |
| `email_copy` | none | Copy succeeds |
| `email_click` | none | The `mailto:` link is clicked |
| `resume_open` | none | The resume link is clicked |
| `spec_mode` | `on` or `off` | Spec mode is toggled |

### 13.2 Five-second test (before launch)

1. **Who.** Recruit five people: two designers, one recruiter if possible, and two engineers or founders.
2. **Devices.** Three test on a laptop and two on a phone.
3. **Procedure.** Show the homepage for five seconds, hide it, then ask:
   1. Who is this, and what does he do?
   2. Name one project you noticed.
   3. What would you click first?
4. **Pass criteria.**
   - At least 4 of 5 describe a designer who also builds.
   - At least 3 of 5 name a project.
   - Nobody is unsure how to contact him.
5. **If it fails.** Fix the hero copy and hierarchy before anything else.

### 13.3 Decision rules after launch

Review these after two weeks of outreach.

- If one project gets most of the case study opens, move it to the first position in the showcase.
- If few visitors reach project 1's shipped state, shorten `--segment` from 85svh to 70svh.
- If many visitors open case studies but few make contact, add a contact block to the end of every case study (Phase 8).

---

## 14. Stack and versions (checked October 7, 2026)

| Package | In the site today | Latest on npm | Decision |
|---|---|---|---|
| `react`, `react-dom` | 18.3.1 | 19.3.0 | Stay on 18.3.1 for v5. Upgrading to 19.3 for `<ViewTransition>` is optional and goes in its own pull request (Section 7.5). |
| `react-router` | 7.13.2 | 8.4.0 | Stay on 7.x and do not upgrade to 8 during this redesign. Use the `viewTransition` prop, which needs data mode or framework mode. |
| `gsap` | not installed | 3.15.0 | Add under A1, for the showcase only: core and ScrollTrigger, in a lazy chunk. |
| `@gsap/react` | not installed | 2.1.2 | Not needed. Motion mounts imperatively inside the lazy module and cleans up with `gsap.matchMedia().revert()`. |
| `geist` | Google Fonts CDN | 1.7.2 | Add as a dev dependency to source the font files, then self-host the Latin subsets. |
| `vite` | check in Phase 0 | 8.3.3 | No change required for this redesign. |
| Not allowed | | | lenis, framer-motion or motion, three, lottie, tailwind, styled-components, any UI kit |

Two GSAP plugins are not needed. SplitText (3.7 KB gzip) is unnecessary because the hero lines are authored by hand. DrawSVG (2.2 KB gzip) is unnecessary because the route arc uses `pathLength`.

Also verified:

- **CSS scroll-driven animations.** `animation-timeline` works in Chrome and Edge (since 2023) and in Safari 26 (since September 2025). Firefox still lacks it. Do not use it on the critical path. Any use must sit inside `@supports (animation-timeline: view())` with a complete static fallback.
- **GSAP licensing.** GSAP is entirely free, including the formerly paid plugins, since Webflow's acquisition.

---

## 15. Skills, plugins and MCP servers

### 15.1 Install

Each command was checked against the repository's README on October 7, 2026. Star counts are GitHub counts on that date.

| Tool | What it adds here | Install | Stars |
|---|---|---|---|
| Anthropic frontend-design skill (`anthropics/skills`) | Baseline rules against generic, templated UI | In Claude Code: `/plugin marketplace add anthropics/skills`, then `/plugin install example-skills@anthropic-agent-skills` | about 180k |
| Emil Kowalski's skills (`emilkowalski/skills`) | Motion craft: `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities` | `npx skills@latest add emilkowalski/skills` | about 44k |
| Official GSAP skills (`greensock/gsap-skills`) | Correct GSAP and ScrollTrigger usage and React cleanup. Path A only. | `npx skills add https://github.com/greensock/gsap-skills`, or `/plugin marketplace add greensock/gsap-skills` | about 16k |
| Vercel agent skills (`vercel-labs/agent-skills`) | A `web-design-guidelines` review, plus `react-view-transitions` for the React 19.3 option | `npx skills add vercel-labs/agent-skills` | about 32k |
| Impeccable (`pbakaus/impeccable`) | Review commands `audit`, `critique` and `polish`, backed by 59 deterministic detector rules | `npx impeccable install`, then `/impeccable init` | about 78k |
| Chrome DevTools MCP (`ChromeDevTools/chrome-devtools-mcp`) | Checks the budgets in Section 11 (tools listed below this table) | `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` | about 53k |

The Chrome DevTools MCP tools used here:

- `lighthouse_audit`
- `performance_start_trace` and `performance_analyze_insight`
- `emulate`, with `cpuThrottlingRate` 4, Fast 4G and mobile viewports
- `take_screenshot` at each breakpoint
- `list_console_messages`

Optional:

- **Figma MCP.** It is already connected to Jay's Claude account. Use it to sketch hero or spec-layer variants in Figma before coding.
- **Organization plugin catalog.** `frontend-design` is available but not enabled yet. `design-dev-bridge` connects Figma and code in both directions.

### 15.2 When to use each

| Phase | Use |
|---|---|
| 0 | Chrome DevTools MCP: baseline Lighthouse audits, traces and screenshots |
| 1 and 2 | frontend-design while setting tokens and the hero; Impeccable `critique` on the static hero |
| 3 and 5 | Emil `animate` while building, GSAP skills for Path A, then Emil `review-animations` |
| 4 and 6 | Impeccable `audit` (accessibility, responsive behavior) and Vercel `web-design-guidelines` |
| 7 | Vercel `react-view-transitions`, only if the React 19.3 option is chosen |
| 11 | Impeccable `audit` and `polish`, Emil `improve-animations`, and Chrome DevTools MCP traces against Section 11.1 |

### 15.3 Conflicts and precedence

Claude Code's skills documentation warns that multiple skills can conflict. When they do, this file wins:

- **Pure black.** Impeccable advises against it. This spec uses `--ink: #000000` deliberately, for display type and primary fills only.
- **Libraries.** Skills may suggest Motion (Framer Motion), Lenis, ScrollSmoother or the ScrollTrigger `pin` option. All of them are banned here (Sections 7.7 and 8.1).
- **React canary.** The Vercel `react-view-transitions` skill says `<ViewTransition>` requires React canary. That advice predates React 19.3, where the component is stable. Never install canary.
- **New tokens.** Skills may propose new colors, fonts or radius values. The palette and type are locked (Section 4).
- **Copy.** Any skill that rewrites copy must follow the voice rules (Section 9.1).

### 15.4 Deliberately not installed

- **`nextlevelbuilder/ui-ux-pro-max-skill` (about 134k stars) and `Leonxlnx/taste-skill` (about 93k).** These are broad style catalogs. They help when choosing a style. Once the style is locked they get in the way, because they pull toward their own presets.
- **21st.dev Magic MCP.** It generates generic components, and this page needs custom ones.
- **Smooth-scroll or animation libraries.** Skip any skill that installs one by default.

---

## 16. Build plan

Every phase ends the same way. Claude Code stops, reports each acceptance check as pass or fail, and attaches screenshots at 390, 768 and 1440 px.

### Phase 0. Baseline (no code changes)

**Tasks**

1. Create the branch `v5-white`.
2. Run Lighthouse on mobile and desktop, three runs each, and save the JSON to `docs/baseline/`.
3. Take screenshots of the current homepage at 390, 768 and 1440 px and save them to `docs/baseline/`.
4. Report these findings:
   - The router mode: data mode, or `<BrowserRouter>`.
   - Which Cloudflare product serves the site (Pages or Workers static assets), and its single-page-app fallback setting.
   - The CSS entry files.
   - The v4 code to delete: canvas field, side rail, title sequence, letter-roll links and magnetic hover.
   - The four preview components to port.

**Acceptance**

- The baseline files exist.
- The report lists every file Phase 1 will touch.

### Phase 1. Foundations

**Tasks**

1. Add three style files:
   - `tokens.css`, from Section 4.6.
   - `base.css`: reset, typography, focus styles, `.visually-hidden` and the skip link.
   - `motion.css`: keyframes and reduced motion rules.
2. Run `scripts/fonts.sh`. Self-host the three subsets. Remove the third-party font stylesheets and every unused `@font-face` rule.
3. Add `src/content/home.ts` and `src/content/now.ts` with all drafts and their `[FILL]` and `[VERIFY]` markers.
4. Add `scripts/check-content.mjs` as the `prebuild` script.
5. Add the homepage head tags (Section 12.1) and a first version of `/og/home.png`.
6. Remove the v4 canvas field and the side rail from the homepage.

**Acceptance**

- Only three font files load, all from the site's own origin.
- `npm run build` fails while markers remain, and lists every one.
- The dev server shows each marker as a dashed highlight.
- No dark styles remain on the homepage.

### Phase 2. Header and static hero

**Tasks**

1. Build the skip link.
2. Build the site header (Section 6.1).
3. Build the hero in its final state, with no motion (Section 6.2).

**Acceptance**

- The five-second contract (Section 1.3) passes on first paint at 390 x 844 and 1440 x 900.
- The H1's accessible name is exactly "Designs it. Then ships it."
- CLS is 0.02 or less.
- The LCP element is the H1 or the subline.

### Phase 3. Hero motion

**Tasks**

1. Build the spec layer, with all values measured at runtime.
2. Add the ink fill.
3. Add the session flag, so the intro runs once per session.
4. Interrupt the intro on any input.
5. Add the hover reveal on line 1.
6. Handle reduced motion and forced colors.

**Acceptance**

- A Performance trace matches the timings in Section 7.2 to within 50 ms.
- LCP stays within 50 ms of its Phase 2 value.
- No contour lines appear inside glyphs at 400% zoom.
- With reduced motion, the hero shows its final state and no spec layer.
- The intro never runs twice in one session.

### Phase 4. Showcase, static

**Tasks**

1. Build `LiveFrame` in its browser and phone versions.
2. Port the four previews. Restyle each in its product's light UI, with a spec layer and a shipped layer.
3. Add `data-spec` attributes to the live elements.
4. Build the project copy and the progress nav markup.
5. Build the stacked layout with the segmented control.

Each shipped preview must match the first screen of its case study.

**Acceptance**

- All four projects render both states at 390, 768 and 1440 px.
- The segmented control works by keyboard.
- Counters show their final values in the DOM.
- The contrast checks pass.

### Phase 5. Showcase motion

**Tasks**

1. Build the engine: Path A, or Path B if A1 is reversed.
2. Implement the scroll map (Section 7.3) and the one-shot ship moments.
3. Add focus management, the skip link and preview pausing.

**Acceptance**

- No run of three or more dropped frames at 4x CPU slowdown.
- Scrolling back up reverses cleanly.
- Tabbing through every project keeps the focus ring visible.
- The motion chunk is 50 KB gzip or less, and loads after LCP.
- Zero console output.

### Phase 6. More work, About, Now, Contact, footer

**Tasks.** Build the sections in Sections 6.4 to 6.7.

**Acceptance**

- The index rows and their links are correct.
- The route arc draws once and lands on 12,382 km.
- Now hides when its newest entry is dated 46 days ago.
- Copy works and is announced, and the clipboard-failure path works.
- The footer date is correct.

**MVP line:** after Phase 6 the homepage can ship on its own.

### Phase 7. View Transitions and scroll restoration

**Tasks.** Add the route morph (Section 7.5) and scroll restoration (Section 8.6).

**Acceptance**

- The frame morphs into the case study hero in Chrome and Safari.
- Firefox navigates without errors.
- Back navigation restores the exact scroll position and project.
- Reduced motion disables the morph.

### Phase 8. Case studies on the shared tokens

**Tasks**

1. Use the shared header and footer.
2. Use Geist only; remove Clash Display.
3. Apply the paper and ink tokens. Each project keeps its own accent for in-page moments.
4. Remove em dashes from the case study copy.
5. Add a contact block to the end of each case study.

**Acceptance**

- Every case study passes the contrast table.
- No case study loads third-party fonts.
- Jay reviews before-and-after screenshots.

### Phase 9. Sharing, SEO, AI screeners, analytics

**Tasks**

1. Make a share image for each route.
2. Add per-route HTML and meta (Section 12.3).
3. Return real 404s (Section 12.4).
4. Add the JSON-LD, `llms.txt`, sitemap and robots files.
5. Wire `track()` to the chosen analytics provider.

**Acceptance**

- The `curl` checks in Sections 12.3 and 12.4 pass.
- LinkedIn Post Inspector shows large images.
- Google's Rich Results Test reads the Person entity.

### Phase 10. Spec mode (optional)

**Tasks.** Build Spec mode (Section 6.9).

**Acceptance**

- S toggles Spec mode and Escape exits.
- The key is ignored in inputs and when a modifier key is held.
- The values shown match computed styles.
- On and off are announced.

### Phase 11. QA and launch

1. Run the full QA matrix (Section 18).
2. Run Impeccable `audit` and `critique`, and Emil `review-animations`.
3. Run the five-second test (Section 13.2).
4. Deploy.
5. Watch Core Web Vitals for two weeks.

---

## 17. `CLAUDE.md` (replace the v4 file with this)

```markdown
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
```

---

## 18. QA matrix and definition of done

**Browsers and devices**

- Chrome and Edge (latest) on macOS and Windows.
- Safari 26 on macOS.
- Safari on a current iPhone.
- Chrome on a mid-range Android phone.
- Firefox (latest) on desktop.

**Widths:** 320, 360, 390, 768, 1024, 1280, 1440 and 1920 px.

**Modes to test**

- Reduced motion on.
- Forced colors (Windows).
- 200% and 400% zoom.
- Keyboard only.
- VoiceOver on macOS and iOS, across the hero, showcase and contact.
- Fast 4G with a 4x CPU slowdown.
- OS dark mode on. The page must stay light and readable, including form controls and scrollbars.

**Definition of done**

- Every acceptance check in Phases 0 to 7 passes, and in Phases 8 to 10 when they are in scope.
- The budgets in Section 11.1 are met on the deployed site, not only locally.
- Zero console output and zero failed requests on the homepage.
- `npm run build` passes the content check with no markers left.
- The five-second test passes.
- Jay has reviewed the final screenshots at 390 and 1440 px.

---

## 19. Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| The pinned showcase feels slow | Medium | 85svh per project, a skip link and progress-nav jumps. Shorten to 70svh if the data says so (Section 13.3). |
| Spec annotations look busy | Medium | At most four per frame. They retract as the scanline passes, and none remain in the shipped state. |
| View Transitions and scroll effects interact badly | Medium | Put transitions behind a flag. Test scrolling at 390, 768 and 1440 px with transitions on and off. Navigation must still work if they fail. |
| Low-end Android drops frames | Medium | Pinned layout only from 1024 px. Previews pause off screen. No blur filters; transforms and clip-path only. |
| Content gaps delay launch | High | Markers block only production builds. Jay fills `home.ts` in one sitting using Section 20. |
| Text-stroke artifacts in some browsers | Low | A static font for stroked text, a forced-colors fallback, and checks at 400% zoom in Safari and Chrome. |
| React 19 upgrade side effects | Low, optional path | A separate pull request with its own QA pass. Stay on 18.3 by default. |

---

## 20. Open questions for Jay

Each row shows the assumption in force until Jay answers.

| # | Question | Assumption in force |
|---|---|---|
| Q1 | Allow GSAP (lazy, showcase only), or stay library-free? | A1: allow GSAP |
| Q2 | Is the pinned Spec to Ship showcase the right signature moment? | A2: yes |
| Q3 | Invert v4, so "Designs it." is the outline and "Then ships it." is ink? | A3: yes |
| Q4 | Which projects lead? Should Intent, Welspun and UMBC Cards Lab appear in the index? Answered for ChronoWeave: it stays removed. | A4 |
| Q5 | Product designer, design engineer, or both? Show a GitHub link? | A5: product designer who writes the front end, GitHub hidden |
| Q6 | Public resume PDF without a phone number? Which version? | A6 |
| Q7 | Portrait photo in About? | A7: only if provided |
| Q8 | Real outcome numbers for each project | A8: `[FILL]` |
| Q9 | Monthly "Now" updates? Can Friction or Signal publish a small public JSON file for live numbers? | A9 |
| Q10 | Keep Geist, or try a more distinctive display face? | A10: Geist |
| Q11 | When must v5 be live? | A11: Phases 0 to 6 first |
| Q12 | Which analytics provider for custom events, if any? | None until chosen |
| Q13 | Years and kinds for Intent, Welspun and UMBC Cards Lab | `[FILL]` |
| Q14 | Friction's one-line description, and how Signal collects its events | `[VERIFY]` and `[FILL]` |
| Q15 | Is "I usually reply within a day." true? | `[VERIFY]` |

---

## 21. Sources (checked October 7, 2026)

**Platform and libraries**

- React 19.3 release, with `<ViewTransition>` stable: https://react.dev/blog/2026/09/09/react-19-3
- React Router 7.13.2 type definitions (npm package): `viewTransition` and `useViewTransitionState` are documented for data mode and framework mode.
- GSAP is 100% free, including the formerly paid plugins: https://webflow.com/blog/gsap-becomes-free
- CSS scroll-driven animations support: https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026 and https://www.drweb.de/css-scroll-animationen-ohne-javascript/
- Package versions: the npm registry (react 19.3.0, react-router 8.4.0, gsap 3.15.0, @gsap/react 2.1.2, geist 1.7.2, vite 8.3.3).

**Design and hiring**

- Figma hiring research (visual polish, AI fluency): https://www.figma.com/blog/why-demand-for-designers-is-on-the-rise/
- Material 3 Expressive spring parameters, as published in token implementations: https://pub.dev/packages/material_design/versions/1.6.0 and https://pub.dev/documentation/motor/latest/

**Claude Code, skills and tools**

- Claude Code skills documentation: https://docs.claude.com/en/docs/claude-code/skills
- Skill and tool repositories:
  - https://github.com/anthropics/skills
  - https://github.com/emilkowalski/skills
  - https://github.com/greensock/gsap-skills
  - https://github.com/vercel-labs/agent-skills
  - https://github.com/pbakaus/impeccable
  - https://github.com/ChromeDevTools/chrome-devtools-mcp (tool reference in `docs/tool-reference.md`)

**Measured for this document**

- GSAP 3.15.0 file sizes (gzip -9 of the published minified files).
- Geist glyph widths, shaped with HarfBuzz.
- Geist vertical metrics and Latin subset sizes.
- The fallback size adjustment.
- All contrast ratios.
- The live-site audit in Section 2.

---

## 22. Phase 0 addendum: findings against the repository (October 7, 2026)

Recorded by Claude Code during Phase 0. Section 0.2 says the codebase wins on
facts and that disagreements stop for Jay. These are the disagreements.

### 22.1 Resolved: ChronoWeave stays deleted

`chore: remove ChronoWeave` (commit 84ce7fa, on `main`, deployed) removed the
project, its route, its eleven files, its sitemap entry and its accent token.
This file still lists it in Section 6.4 (More work), Section 9.3, Section 12.6
(`llms.txt`) and Section 12.7 (sitemap), and assumption A4 names it.

Jay's answer, October 7: it stays gone. Those sections are corrected above,
`src/content/home.ts` has no ChronoWeave entry, and the sitemap already did
not list one.

### 22.2 Resolved: the showcase driver is `--draw`, the colour keeps `--spec`

Section 4.1 defines `--spec: #1D5FE0`, a color. Section 4.6 registers
`@property --spec { syntax: "<number>"; initial-value: 0 }` for the showcase
driver, then sets `--spec: #1d5fe0` in `:root`.

A registered custom property rejects a value that does not match its syntax,
so `--spec` computed to `0` everywhere. Measured in Chrome against the exact
token block: `--spec` resolved to the string `"0"` and `color: var(--spec)` to
`rgb(0, 0, 0)`, while the unregistered `--spec-line` resolved correctly to
`rgb(61, 123, 255)`. Every focus ring, spec chip and spec-blue text would have
rendered black.

Jay's answer, October 7: rename the driver. It is `--draw` throughout Sections
4.6, 6.3.2, 8.2, 8.3 and 8.4 above, and in `src/styles/tokens.css`. `--spec`
is the colour and nothing else. `--draw` also reads better beside `--reveal`:
one draws the annotations, the other reveals the live layer.

### 22.3 Facts corrected against the repository

- **GSAP is already installed** at `^3.15.0` and is already split into its own
  Vite chunk. Section 14 says "not installed". Nothing needs adding for A1.
- **`motion` is also installed and imported in 24 files**, all of them case
  studies or retired code. The homepage itself is library-free. The ban in
  Section 14 and in the new CLAUDE.md therefore reads as homepage-only until
  Phase 8 retires those imports.
- **Vite is 6.3.5**, not unknown. Section 14 asked Phase 0 to check.
- **`three`, `@react-three/fiber`, `matter-js`, `lucide-react`,
  `@phosphor-icons/react` and `tailwindcss` are installed too.** Tailwind is
  active in the build through `@tailwindcss/vite` and `src/index.css`, not merely
  present.
- **Audit finding 4 is wrong.** Every letter span in the contact links already
  carries `aria-hidden="true"`. The measured accessible names are
  "Emailharwanijay9498@gmail.com" and "LinkedInin/jay-harwani": two words run
  together with no separator, which is a legibility problem, not the WCAG 2.5.3
  label-in-name failure the audit describes.
- **Audit finding 5 understates the problem.** The homepage stylesheets declare
  8px, 8.5px, 9px, 10px, 10.5px, 11px and 11.5px text.
- **Audit finding 3 is exactly right.** The H1 contains 21 SVG `<text>` nodes and
  its accessible name is "Then ships it." twice followed by "Designs it."
  nineteen times.

### 22.4 The 404 behaviour has three causes, not one

Section 12.4 asks for a real 404. Three things currently prevent it:

1. `vite.config.ts` copies `index.html` to `build/404.html` after every build.
2. The Cloudflare Pages project serves unknown paths with HTTP 200 and the SPA
   shell, which is a dashboard setting and not in the repository.
3. `src/App.tsx` has `<Route path="*" element={<Navigate to="/" replace />} />`,
   added when ChronoWeave was removed so that indexed path would not render a
   blank page.

All three are reversed together in Phase 9, and the catch-all route becomes the
designed 404 page from Section 9.2.

### 22.5 The four previews are not components

Section 6.3.4 says to "port the four existing preview components". They are not
components. `src/data/mockups.ts` holds four HTML strings, generated from
`reference/index.html` by `scripts/extract-mockups.py`, injected with
`dangerouslySetInnerHTML`, and animated by CSS keyframes in the generated
`src/styles/v2-ported.css`. Phase 4 is therefore a rewrite into real React
components, not a port, and both generators retire with v4.

---

## 23. Phase 1 record (October 7, 2026)

What the foundation measured once it was in place.

### 23.1 Budgets

| Metric | Before | After | Budget |
|---|---|---|---|
| Homepage JS | 69.4 KB gzip | **62.1 KB gzip** | 85 |
| Homepage CSS | 26.9 KB gzip | **12.2 KB gzip** | not budgeted |
| Font files | 2 requests, 51 KB, third party | **3 files, 40 KB, same origin** | 3 files, 45 KB |
| Third-party requests | 5 (Google Fonts, Fontshare, Cloudflare) | **0** | 0 |
| Smallest text on the page | 8 px | **12 px** | 12 px floor |
| SVG `<text>` nodes in the H1 | 21 | **0** | |

The subsets measured 12, 18 and 10 KB against the 12, 17 and 9 the brief
predicted. "Then ships it." renders 680 px wide at 120 px in the share image,
which is 5.67 em: the figure Section 4.2 derived from HarfBuzz, confirmed by a
second route.

### 23.2 Decisions taken inside Phase 1

- **A `Geist Mono` alias.** All five case studies set `font-family: "Geist Mono"`
  in their own `.mono` rule, and that name used to resolve through the Google
  stylesheet this phase removes. `tokens.css` declares a fourth `@font-face`
  under that name pointing at the same subset file, so no case study loses its
  monospace and no fourth file is fetched.
- **Clash Display was already dead.** Line 64 of `case.css` is a comment about
  having removed it, not a rule. Every live route used exactly two faces, Geist
  and Geist Mono, so dropping both third-party stylesheets cost nothing. The
  six unused families went with them.
- **Project accents are derived, not chosen.** Three of the four were tuned for
  a dark ground and read 1.64:1 to 2.41:1 on paper. Each is darkened at
  constant OKLCH hue, holding as much chroma as the gamut allows, until it
  clears 4.5:1. Running the same operation on Headroom's dark mint returns hue
  163 at 4.51:1 against the hand-sampled #0A7A52 at hue 162 and 5.36:1, so the
  method reproduces a human's choice. `src/content/home.ts` carries the
  working. Friction lands at hue 181 and Signal at 199, close enough to be
  worth a look in Phase 4.
- **`src/index.css` is now four imports.** Its other 2,216 lines were the v3
  homepage's stylesheet and moved to `legacy-v3.css`, imported by
  `HomePage.tsx` alone. `styles/globals.css`, a stock shadcn theme no live
  route uses, left the entry with it; its bare `.dark` block was the collision
  that once rendered Headroom's section number at 1.1:1. One rule was load
  bearing and is carried into `base.css`: `body { overflow-x: clip }`.
- **The homepage is a content skeleton.** `HomeV5.tsx` renders every section
  from `src/content/home.ts` as semantic markup on the tokens, and nothing
  else. Phases 2 to 6 replace each stand-in. The v4 sections it supersedes are
  not deleted yet: `v2/Work.tsx` is what Phase 4 ports from and `v2/RouteMap.tsx`
  and `v2/Contact.tsx` are what Phase 6 does, so they stay orphaned until the
  phase that replaces them.

### 23.3 Open, not fixed in this phase

- **`/favicon.ico` 404s** on every route. It did before this phase too, so it
  is not a regression, but the definition of done asks for zero failed
  requests. It needs a mark, which is Jay's call rather than mine.
- **The display font preload reaches every route.** `index.html` is shared by
  all of them in a single-page app, and three of the four case studies do not
  use Geist Display, so they fetch 12 KB they discard. It buys the homepage's
  LCP, which is the budget that matters most, and Phase 9's per-route HTML
  removes the waste structurally.
- **`/about` is still a v3 page.** Its headings asked for Clash Display and now
  fall through to a system sans. It is not in the v5 section list, nothing on
  the new homepage links to it, and Phase 8 owns it.
- **Tailwind is still in the build.** 19 files use its utilities, `App.tsx` and
  `v2/Work.tsx` among them. Phase 8.

---

## 24. Phase 2 record (October 7, 2026)

The header and the hero in its resting state. No motion: Phase 3 adds the
intro and the spec layer.

### 24.1 Acceptance, measured on the preview build

| Check | Result |
|---|---|
| Five-second contract at 390 and 1440 | **Pass**, all five items in the first frame |
| H1 accessible name | **Pass**, exactly "Designs it. Then ships it." |
| CLS | **Pass**, 0.0002 mobile and 0.0001 desktop against a budget of 0.02 |
| LCP element | **Pass**, `<p class="hero-sub">` |

Lighthouse on the preview build, median of three: performance 98 mobile and
100 desktop, accessibility **100** (was 93), SEO 100, best practices 96. TBT
15 to 29 ms. LCP 1.99 s mobile under Lighthouse's own throttling, which is a
local number and not comparable to the 3.60 s the live v4 page measured.

The two accessibility failures in the Phase 0 baseline, colour contrast and
heading order, are both gone.

### 24.2 Measurements worth keeping

- **The type maths holds.** At 1440 the hero sets at 168 px and the inline box
  measures 219 px against the 1.3 em (218 px) the metrics predict, within the
  2 px tolerance the Phase 3 spec layer tests for before it draws its guides.
  Line 1's descender bottom and line 2's cap top are **8 px apart, 0.048 em**,
  which is what §4.2 derived.
- **"Then ships it." measures 952 px at 168 px**, inside a 1320 px content
  width; 321 px at 390 px wide inside 350 px; 263 px at 320 px inside 280 px.
  No horizontal scroll at 320, 390, 768 or 1440.
- **The static face was the right call.** At 1:1 there are no internal contour
  lines inside the stroked glyphs. The notches visible in a downscaled capture
  are the downscaling.
- **Forced colours hold.** Both lines fall back to `CanvasText` with the stroke
  off, so the outline line does not disappear. Verified under emulated
  `forced-colors: active`.

### 24.3 Decisions taken inside Phase 2

- **No scroll listener.** The header's frosted state comes from an 8 px
  sentinel pinned at the document origin and watched by an
  IntersectionObserver, not from reading scrollY. The one scroll listener the
  rules allow stays reserved for the showcase engine.
- **The nav indicator is one 1 px bar.** It is scaled to the active link's
  measured width and moved with translateX, so it never touches layout.
  Measured again after `fonts.ready` and on resize.
- **`:focus`, not `:focus-visible`, on the skip link.** Chrome does not grant
  focus-visible to a link focused without a keyboard interaction, and a skip
  link cannot afford that heuristic. Verified with a real Tab press through
  the DevTools Protocol: one Tab reveals it, two reach the brand.
- **The skip link's shadow is only applied on focus.** Parked, the box sits
  8 px above the viewport but `--shadow-pop` reaches 18 px past its bottom
  edge, so the blur hung over the top left corner of every first paint.

### 24.4 Open

- **`/favicon.ico` still 404s**, and it is now the only thing keeping best
  practices off 100. Fixing it means choosing a mark, which is Jay's call. The
  smallest options are a real icon, or `<link rel="icon" href="data:,">` to
  stop the request without one.
- **The skeleton's links carry a scaffold rule.** The placeholder anchors in
  `#work`, `#more-work` and `#contact` measured 21 px tall, under the 24 px
  minimum. A labelled block at the foot of `home.css` gives them the floor and
  is deleted by the phase that designs the last of those sections.

---

## 25. Phase 3 record (October 7, 2026)

The hero intro, the measured spec layer, and the ink fill.

### 25.1 Acceptance

| Check | Result |
|---|---|
| Trace matches §7.2 within 50 ms | **Pass**, every mark at **0 ms** drift |
| LCP within 50 ms of Phase 2 | **Pass**, -8 ms mobile and +5 ms desktop |
| No contour lines inside glyphs at 400% | **Pass**, checked at deviceScaleFactor 4 |
| Reduced motion: final state, no spec layer | **Pass** |
| The intro never runs twice in one session | **Pass**, over three loads in one tab |

The schedule, read back off the live `Animation` objects:

| Mark | §7.2 | Measured |
|---|---|---|
| Guides, scaleX from the left | 80 ms, 420 ms | 80 ms, 420 ms |
| Selection box and handles | 200 ms, 240 ms | 200 ms, 240 ms |
| Chip A | 300 ms, 200 ms | 300 ms, 200 ms |
| Dimension line and its W label | 340 ms, 200 ms | 340 ms, 200 ms |
| Chip B | 380 ms, 200 ms | 380 ms, 200 ms |
| Line 2, ink fill, and the scanline on it | 520 ms, 760 ms | 520 ms, 760 ms |
| The layer retracts | 1280 ms, 120 ms | 1280 ms, 120 ms |

Also measured: a real keydown, wheel and pointerdown each take the hero to its
final state; the hover reveal measures lazily and opens over `--d-2`; under
emulated forced colours the layer is not rendered at all; Lighthouse holds at
98 mobile and 100 desktop, accessibility 100, CLS 0.0002.

### 25.2 Three bugs the measurements found

- **Every measured mark ran 48 ms behind the ink fill.** The spec layer anchors
  itself to the CSS animation's `startTime` so the scanline can ride the fill
  edge, but a CSS animation has no `startTime` until it has been committed, and
  reading it too early fell through to `timeline.currentTime`. Awaiting
  `animation.ready` first took the drift to zero.
- **The layer faded in as a whole on top of its own choreography.** The
  `transition` that opens it on hover also fired when the intro set
  `data-spec`, putting a second 120 ms fade over marks that were already
  animating one at a time. It is suppressed in intro mode.
- **The exits were filling backwards.** They are created after the entrances,
  so `fill: both` let each one win the animation cascade and pin its element to
  its pre-exit value from t0. The scanline sat at the left edge of line 2 from
  first paint. Exits now fill forwards only.

### 25.3 Deviation from §6.2, and why

§6.2 step 1 says to skip the intro entirely if the display font is not ready
within 300 ms. Here the race gates the **spec layer** instead, and the ink fill
always runs.

The fill is a CSS animation on text that is already painted, so it holds back
nothing and needs no font to be correct: the line is `nowrap`, so a swap cannot
reflow it. What genuinely needs the font is the measurement, because guides
drawn against a fallback's metrics are confidently wrong. Skipping the whole
intro on a slow font would instead mean line 2 snapping from outline to solid
ink at 300 ms, which is a worse thing to watch than the thing the rule exists
to prevent.

### 25.4 Two notes for later phases

- **`document.getAnimations()` is the trace.** Sleeping between
  `Page.captureScreenshot` calls cannot verify a 1400 ms timeline, because a
  capture costs more than a frame and the wall clock runs past the end of the
  animation. Pausing every animation and setting `currentTime` photographs an
  exact moment. `scratchpad/intro.mjs` does this, and holds the teardown open
  by blocking the one 1400 ms timer.
- **`sessionStorage` is per origin, and `about:blank` has an opaque one.**
  Clearing it there does not clear it for the site, so a harness that navigates
  away and back gets one intro and then a run of identical "finished page"
  frames. Clear it on the page, then reload.
