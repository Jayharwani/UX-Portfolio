# CASES.md — the case study redesign

Brief for the four case studies. Written 2026-09-17, after reading the four
pages as they shipped, `PRODUCT.md`, `CLAUDE.md`, and current practice.

---

## 0. What was wrong

Measured, not asserted:

| Page | Headline face | Ground | Height |
|---|---|---|---|
| Headroom | Syne | white | 8,432px |
| Signal | Instrument Serif | near-black green | 4,116px |
| ChronoWeave | Syne | navy | 6,633px |
| Bumper | Syne | dark | 12,044px |

Four case studies, three headline faces, two grounds, and none of them the
homepage's. A visitor clicking from the work index lands somewhere that does
not look like the site they came from — and the work index is now the
strongest thing on the site, so the drop is the first impression that counts.

Three further faults, all structural rather than cosmetic:

1. **Every page ends on the same plea.** *"Ready to turn your 'We need a
   designer' into 'We hired the right one.'"* — `PRODUCT.md` rejects exactly
   this ("Generic SaaS landing… one big CTA", and a page that pleads "gets read
   as available rather than desirable"). It also dead-ends the reader at the
   bottom of the funnel's best moment: they just finished the evidence.
2. **Bumper has two `<h1>`s.** The second is `Sony WH-1000XM5`, product chrome
   inside a mockup. A screen reader meets it as a page heading.
3. **`body` is white on all four.** The dark ones paint over it with an inner
   wrapper, so a slow paint flashes white before the page lands.

## 1. What is not changing

**The writing.** The copy is the case studies' actual value and it is good —
specific, dry, evidence-adjacent, exactly what `PRODUCT.md` describes. Every
sentence carries over verbatim. This is a redesign of presentation, not a
rewrite of argument.

## 2. The system

One ground, one type system, shared with the homepage: `--void #05070C`,
`--paper #EEF1F5`, Geist and Geist Mono. The case studies become chapters of
the same book rather than four visiting designers' portfolios.

## 3. Identity

Colour is already assigned — the homepage work index gives each project an
accent and pushes it into the canvas on hover. The case studies inherit it, so
the colour that lit the row is the colour that lights the page it opens:

| | Accent | |
|---|---|---|
| Headroom | mint `#5FD8A4` | |
| Signal | cyan `#5FD3D8` | |
| ChronoWeave | violet `#8B7BE8` | |
| Bumper | gold `#E9C58B` | |

**But colour is the weakest kind of identity.** Each page also gets one
structural signature — a mechanism that *is* the case study's argument, made
physical:

- **Headroom — the runway.** The product's whole claim is "one number, not
  categories." A scroll-driven strip runs the balance down as real bills land
  on it and settles on the safe-to-spend figure. The number is the product.
- **Signal — the gap.** The differentiator is Baltimore coverage; the
  incumbent skews DC and NoVA. The map draws as you scroll and the Baltimore
  half fills in last, so the reader watches the gap close rather than reading
  a sentence claiming it does.
- **ChronoWeave — elastic time.** Time blindness is subjective time coming
  loose from clock time. A ruler whose ticks compress and stretch against an
  even scroll lets the reader feel the distortion the product treats.
- **Bumper — the pause.** The product inserts friction before a purchase. The
  page inserts one before its own conclusion: a sticky scene that holds while
  the reader keeps scrolling. Deadpan, and the product's thesis applied to the
  person evaluating it.

Each signature is doing a job. That is the test, and it comes straight from
`PRODUCT.md`'s third anti-reference: *"Loud and gimmicky. Effects competing
with content; motion that shows off."* The user asked for 3D and scroll
effects; the product doc says motion must not preen. Both are satisfiable only
by effects that carry an argument, which is also what the homepage already
does — the route counter is the distance, the work preview is the product.

## 4. Motion and 3D

**3D is CSS only.** `perspective`, `preserve-3d`, `translateZ`, and a tilt that
reads the pointer. No WebGL, no Three.js. Current trend writing pushes
interactive 3D hard while burying the cost; the honest version of the trend for
a portfolio that must load fast is that CSS transforms are nearly free and
WebGL is not. `CLAUDE.md` bans the libraries anyway.

**Scroll effects run off one driver per page.** A single passive `scroll`
listener and one rAF write a `--p` progress value (0..1) onto each registered
scene; the CSS does the rest. Reveals are `IntersectionObserver`, each with a
timer behind it, because this codebase has shipped four separate bugs where
content never arrived after an observer stayed silent.

**Native scroll-driven CSS is deliberately not the foundation.**
`animation-timeline: view()` is the genuinely current technique and it is
roughly 83% supported — not Baseline, because Firefox stable still has it
behind `layout.css.scroll-driven-animations.enabled` as of Firefox 152. A
portfolio cannot serve a sixth of its readers a dead page, and founders open
links in whatever is already running. The JS driver is universal and exact.

**`prefers-reduced-motion` collapses every one of these to its end state.**

## 5. The ending

The shared plea is replaced by a handoff: the next case study, named, with its
own accent, as a full-width row that behaves like the homepage work index. The
reader who just finished the evidence is offered more evidence. The employment
signal stays in the footer, where `PRODUCT.md` says it belongs.

## 6. Order of work

1. Foundation — `src/styles/case.css`, `src/components/case/*`
2. Headroom, end to end, verified in a browser
3. Signal, ChronoWeave, Bumper
4. Full pass: 320 / 768 / 1280 / 1920, keyboard, reduced motion, console

---

## 7. The bolder pass (2026-09-18)

Run through `/impeccable bolder`. The skill's brand reference names a
saturated aesthetic lane in its reflex-reject list:

> **Editorial-typographic.** Small mono labels, ruled separators,
> monochromatic restraint, lowercase track-spaced metadata.

That was a description of the first pass, line for line. `PRODUCT.md` has its
own word for the result and it is not "minimal": anti-reference 4, *"corporate
and quiet, so restrained it says nothing."* Its prescription is exact, and
none of it is effects: **information density, asymmetry, typographic command.**

Two absolute bans were also being broken:

- **The hero-metric template.** `Metrics` was big-number / small-label /
  supporting-stats in a bordered grid, four times across the four pages.
- **Identical card grids.** `cw-channels`, `cw-edges` and `bp-insights` were
  the same card repeated at the same size.

### What changed

| | Before | After |
|---|---|---|
| Headline | 6.1rem max | 9.5rem max, second line outlined |
| Scale jump, h1 to body | ~2.7x | ~4.8x |
| Hero shape | single centred column | 70/30, statement against a spec sheet |
| Chapter opening | mono number, hairline rule | sticky outlined numeral at headline scale |
| Chapter separation | a rule between every one | the numeral does it |
| Outcomes | bordered metric cards | numerals at 4.6rem, no box |
| Pull quote | rule down the left edge | typographic, at heading scale |
| Card grids (3) | equal repeated cards | a two-track reading index |
| Screenshots | equal auto-fit grid | one lead at 1.45x, supports dropped out of line |
| Signature scenes | inside the reading column | full bleed, escaping the track |
| Corner radius | 14–16px everywhere | 2–4px |
| Buttons | pills | squared |

The outlined numerals and the outlined second headline line are the same
device the homepage uses on "Then ships it.", so the case studies now rhyme
with the page they open from rather than merely sharing its palette.
