# Hero redesign — results

Verified against §13 of the spec, in the production build (`vite preview`), at
390 / 1024 / 1440. Every value below was read from the live DOM rather than
inferred.

## Comprehension

| Criterion | Result |
|---|---|
| `<h1>` textContent is a complete sentence | **pass** at all three widths |
| asserted by test | `src/components/home/headline.test.ts` |
| three products nameable | HEADROOM · SIGNAL · CARDS LAB |
| "Live" in the rail, not a paragraph | 2 live rows; zero mono body prose |

## The sandbox

| Criterion | Result |
|---|---|
| six real semantic controls | 6 cards, all functional under real events |
| slider recalculates | `$1,730 → $1,000` on input |
| chip cycles | Open → Tight → Conflict |
| switch | `aria-checked` false ↔ true, `role="switch"` on a `<button>` |
| radiogroup | click **and** ArrowRight both move selection |
| stepper | 30m → 35m, digit rolls from travel direction |
| checkbox | toggles, `stroke-dashoffset` 16 → 0 over 240ms |
| keyboard reachable | 8 focusable controls, DOM order |
| focus ring on the card | computed `outline-width: 2px` |
| zero instructional copy | label and tooltip deleted; regex over hero text finds none |
| nothing thrown off screen | static walls on all four sides |
| one design system | portfolio tokens only; no imported brand hue |

## Composition

| Criterion | Result |
|---|---|
| both thirds occupied ≥1280 | copy ends 697, rail runs 839 → 1361 at 1440 |
| no card over headline or CTAs | 0 overlaps, measured |
| grid | 12-col at `xl`; rail stacks below at 1024 and 390 |

## Craft

| Criterion | Result |
|---|---|
| one typeface per job | Clash Display h1 · General Sans subhead/body · mono meta |
| zero monospace body prose | 0 |
| accent in exactly three places | primary CTA fill + 2 live dots |
| grain present | 128px tile at 2.5% |
| every text pair ≥ 4.5:1 | see `docs/TOKENS.md`; tightest 4.77 |

## Performance

| Criterion | Result |
|---|---|
| animated box-shadow / filter / backdrop-filter | **0** across the whole document |
| canvas backing store | 1.28 M px at 1440, budget 2.2 M |
| one rAF driver | `gsap.ticker`; sandbox added to it, Lenis removed earlier |
| six sleeping bodies | `enableSleeping`, 3/2/1 iterations, gated on intersection |

---

## Two bugs the verification caught

Worth recording, because both would have shipped and neither is visible without
measuring.

**The headline wrapped at 1024.** The copy column is a flex column with
`align-items: flex-start`, which makes children shrink-to-fit. The `<h1>` sized
itself to its first line (515px) and then forced the second line, which needs
628px, to wrap inside that width. It looked like a type-scale problem and was
actually a flex-sizing one. This matters more than a normal wrap because the
particle sampler measures each `[data-line]` as a single run: a wrapped line
resamples at the wrong geometry and the assembly lands crooked. Fixed by
stretching the h1 to its column.

**The card drop and the headline never overlapped.** §4.7 is explicit that the
two systems must interleave, and the sandbox was mounting at 250ms — on the
floor and settled long before the headline resolved at ~2.9s. Two features
loading in parallel, which is exactly what the section exists to prevent. The
drop now begins at 2.6s, so it is underway when the crossfade happens.

Related: `assembledCb` fired at `-=0.4`, handing over to crisp text *before* the
particles finished converging. The one moment the whole system exists to
produce was being spent rather than shown. Now `+=0.45`, so the letterforms
land, hold for a beat, and then hand over.

## Not verified here

**Screenshots.** §13 asks for before/after captures at three widths. The
preview pane does not composite frames and the Chrome extension disconnected
mid-task, so no image could be produced. Everything above is DOM measurement.
The things that genuinely need eyes: whether the particle assembly reads well
against a ranged-left headline, whether the cards settle at pleasing rest
positions, and whether the impact flash lands.

**p95 ≥ 58fps through the intro.** Frame timing needs a visible, compositing,
foreground tab. The HUD from the earlier bisect (`?hud=1`) still exists and
still reports p50/p95/blocked, so this is one scroll away from being measured
on a real machine.

**One accent tension, resolved deliberately rather than silently.** §6.4 caps
the accent at three places; the sandbox controls also use it for their
on-states. This palette has exactly one saturated hue, and a toggle whose "on"
state is grey reads as broken, which would defeat the argument §4 exists to
make. Functional colour inside a control is treated as distinct from decorative
accent in a composition. The hero *chrome* is exactly three, verified.
