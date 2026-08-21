# TOKENS.md

Extracted from the live stylesheets, not authored fresh. This is the palette the
hero redesign is allowed to work inside. Per the spec's §0.1: lightness and
opacity steps may be derived from these hues; **no new hue may be introduced**,
including brand colours arriving with components lifted from other projects.

Source of truth: `src/index.css` `:root`.

---

## 1. The live palette

sRGB hex is what ships. OKLCH is given because the elevation and opacity steps
below are derived in that space.

| Token | Hex | L% | C | H° | Role |
|---|---|---|---|---|---|
| `--bg` | `#0A0E16` | 16.4 | 0.018 | 264 | page ground |
| `--bg-2` | `#0D1220` | 18.5 | 0.030 | 268 | alternate section ground |
| `--surface` | `#111725` | 20.6 | 0.030 | 266 | raised panel |
| `--surface-2` | `#161D2E` | 23.3 | 0.035 | 267 | hover / lifted panel |
| `--border` | `#232C3D` | 29.3 | 0.034 | 263 | hairline |
| `--border-strong` | `#2E3950` | 34.5 | 0.043 | 265 | emphasised edge |
| `--text` | `#E8ECF3` | 94.2 | 0.010 | 262 | primary |
| `--text-2` | `#99A4B6` | 71.6 | 0.029 | 260 | secondary |
| `--text-3` | `#7D89A0` | 62.8 | 0.038 | 264 | muted / metadata |
| `--accent` | `#5B8CFF` | 66.2 | **0.179** | 265 | the only saturated value |

### The finding that matters

**Every token in this system sits between hue 260° and 268°.** This is a
single-hue palette, near 264°, varied only by lightness and chroma. Nothing in
it is accidental, and it is why the site reads as coherent despite the number of
surfaces in play.

Two consequences for this redesign:

1. **The accent is the only thing carrying chroma.** At C 0.179 it is roughly
   four times more saturated than the next value (`--border-strong`, 0.043).
   That ratio is what makes it legible as an accent at all, and it is why §6.4's
   scarcity rule matters: spend it in three places and it reads as intent;
   spread it and the palette collapses to one blue mush.
2. **Any imported colour will look foreign immediately.** Headroom's emerald and
   Signal's green sit nowhere near 264°. Restyling them into these tokens is not
   a compromise, it is the design-system argument the spec wants made.

---

## 2. Elevation — §6.1

The spec asks for three surfaces at base, +3.5% and +6% lightness. **These
already exist.** No new tokens required:

| Spec name | Existing token | Actual ΔL from `--bg` |
|---|---|---|
| `surface-0` | `--bg` `#0A0E16` | — |
| `surface-1` | `--surface` `#111725` | +4.2% |
| `surface-2` | `--surface-2` `#161D2E` | +6.9% |

Close enough to the requested ladder that inventing new values would add
duplicates for no visual gain. The elevation system is not missing from this
palette; it is present and simply has not been used *as* elevation.

### Derived steps (allowed: same hue, lightness/opacity only)

For the card top-edge highlight and borders in §6.2, expressed as opacity on
`--text` rather than new hex values, so they hold on any of the three surfaces:

```css
--edge-top:     rgb(232 236 243 / 0.10);  /* 1px inset top border */
--edge:         rgb(232 236 243 / 0.08);  /* card border at rest   */
--edge-hover:   rgb(232 236 243 / 0.16);  /* card border on hover  */
--rule:         rgb(232 236 243 / 0.08);  /* the fold rule         */
--outline-grip: rgb(232 236 243 / 0.20);  /* drag-handle affordance */
```

---

## 3. Contrast — measured, not assumed

WCAG 2.1 ratios against all three surfaces. AA body text needs 4.5, large text
and UI needs 3.0.

| | on `--bg` | on `--surface` | on `--surface-2` |
|---|---|---|---|
| `--text` | 16.30 | 15.11 | 14.19 |
| `--text-2` | 7.67 | 7.11 | 6.68 |
| `--text-3` | 5.48 | 5.08 | **4.77** |
| `--accent` | 6.11 | 5.66 | 5.31 |

Every pair passes AA at body size, including the muted metadata token on the
lightest surface, which is the tightest case at 4.77.

### One hard rule for the accent button

| Foreground on `#5B8CFF` | Ratio | Verdict |
|---|---|---|
| `#0A0E16` (ink) | **6.11** | passes |
| `#FFFFFF` | **3.16** | **fails AA for text** |

The primary CTA currently uses ink on accent and must keep doing so. White text
on this accent is a failure, and it is the obvious thing to reach for.

---

## 4. Radius — currently unsystematic (F7)

Twelve distinct radius values are in use across the homepage:

`999 · 26 · 21 · 20 · 14 · 12 · 10 · 8 · 6 · 5 · 3 · 2`

The spec's §8 scale, to be applied everywhere including the sandbox cards:

```
sm  6px    chips, small controls
md  10px   inputs, inner controls
lg  14px   cards, panels
xl  20px   large surfaces
999        pills only — buttons and status chips
```

Everything currently at 2, 3, 5, 8, 12, 21 or 26 collapses into the nearest step.

---

## 5. Type

Three faces, one job each (§7.1). Loaded already; no additions needed.

| Face | Stack | Job | Never |
|---|---|---|---|
| Clash Display | `--font-display` | `h1`, case-study titles | body, labels, buttons |
| General Sans | `--font-body` | subhead, body, buttons, nav, product names, control labels | long code, status |
| Geist Mono | `--font-mono` | version tag, status, metadata, section labels | prose, subheads |

`--font-serif-it` (Instrument Serif) exists in the tokens and is used by the
Signal case study. It has no role in the hero.

---

## 6. Dead tokens — do not extend

`src/styles/globals.css` carries a large legacy `:root` block: the full shadcn
default set (`--popover`, `--chart-1..5`, `--sidebar-*`) plus a "Professional
Portfolio Color System" built on **teal `#0f766e` and sky `#0ea5e9`**.

None of it is used by the current dark slate site. It is left over from an
earlier iteration. It is listed here so nobody mistakes it for the palette and
starts building against a hue the site abandoned.

Removing it is worthwhile but is not part of this redesign; it touches every
route and deserves its own change.
