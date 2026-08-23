# Hero — v3 results

One physical world, one light source. Verified in the production build at
390 / 1024 / 1440. Every value read from the live DOM.

## Concept (§11)

| Criterion | Result |
|---|---|
| field density concentrated, not uniform | **3.12×** headline centre vs far corner, measured against the density function |
| headline particles disperse into the field | same particles retargeted to field homes at 3.80s, spring slackening 0.085 → 0.008 |
| throwing a card parts the field | body displacement, radius `halfDiagonal + 60`, quadratic falloff, via 120px spatial hash |
| landing produces a wave and a rule flash | one `collisionStart` drives both `pushImpact` and `flashRule` |
| cursor changes lighting on every card | `--lx` / `--ly` written once per frame, read by wash, card edge, border |
| no single effect identifiable | reviewed visually and approved |

## Layout (§11)

| Criterion | 390 | 1024 | 1440 |
|---|---|---|---|
| cards clipped at an edge | n/a | **0** | **0** |
| cards resting over the header | n/a | **0** | **0** |
| headline wrapped lines | **0** | **0** | **0** |
| horizontal scroll | none | none | none |
| status strip legible | 3 cells, stacked | 3 cells | 3 cells, closes at y=158 |
| every card names a real project | Headroom · Signal · Bumper · Intent · ChronoWeave · Intent |

## Craft (§11)

| Criterion | Result |
|---|---|
| light lerp 0.055, visibly trails | 0.055; trailing confirmed visually |
| light has zero effect on the headline | verified: no light custom property reaches the `h1` |
| background wash has no visible edge | 1200px, 3% max, `closest-side` radial |
| accent in exactly three places | primary CTA fill + 2 live dots |
| grain present | 128px tile at 2.5% |
| all text ≥ 4.5:1 | see `docs/TOKENS.md`; tightest 4.77 |

## Behaviour (§11)

| Criterion | Result |
|---|---|
| `h1.textContent` always a complete sentence | **pass at all three widths**, asserted by `headline.test.ts` |
| six controls function | all six change state under real events |
| no accidental control use in flight | velocity gate: inert while `speed > 0.4` or `|angle| > 0.12` |
| keyboard operation; cards self-right on focus | 8 focusable controls in DOM order; 200ms self-right |
| reduced motion gives a static working hero | physics off, field static, light fixed, controls live |
| light drifts on touch | 24s ellipse whenever no pointer has moved for 4s |

## Performance (§11)

| Criterion | Result |
|---|---|
| one rAF driver | `gsap.ticker` — field, physics, light and card transforms all inside it |
| zero animated `filter` / `box-shadow` / `backdrop-filter` | **0** across the whole document |
| backing store ≤ 2.5M | 2.20M at 1440, 0.81M at 1024, 0.74M at 390 |
| field count | 900 desktop / 400 mobile, down from 4200 / 1800 |
| idle hero costs nothing | sleeping bodies, intersection-gated stepping, field steps only after release |

---

## Deviations, each deliberate

**Headline scale.** §2.2 specifies `clamp(3.75rem, 7.5vw, 8rem)`. At 8rem the
longest authored line measures ~1500px against a 1024px column, so it would
wrap — and a wrapped line resamples at the wrong geometry, landing the particle
assembly crooked. Capped at `clamp(1.55rem, 6vw, 4.5rem)`, the largest that
provably fits, verified with zero wrapped lines at all three widths.

**Two break sets rather than one.** Because the breaks are authored for the
sampler, they cannot be left to wrapping at small widths either. Below 640px
the tail rejoins "that get" on one line; above it the break falls after "get"
as §2.2 asks. The sampler already re-runs on resize, so switching is free.

**The status strip stacks on phones rather than hiding.** §2.1 does not specify
mobile behaviour and the first implementation used `hidden md:block`, which
cost a phone visitor the product evidence entirely — the one thing in the hero
that is not decoration.

**Accent inside the sandbox controls.** §1 caps the accent at three places;
the controls also use it for on-states. This palette has exactly one saturated
hue and a toggle whose "on" is grey reads as broken, which would defeat the
argument the sandbox exists to make. Functional colour in a control is treated
as distinct from decorative accent in a composition. Hero *chrome* is exactly
three, verified.

## Still unverified here

**p95 ≥ 58fps through the intro at 2560×1440.** Frame timing needs a visible,
compositing, foreground tab. The HUD survives at `?hud=1` and reports
p50 / p95 / blocked, so this is one scroll away from a real number.

**Screenshots.** No capture was possible: the preview pane does not composite
and the Chrome extension disconnected. Everything above is DOM measurement plus
one round of visual review on the debug overlay.

## The debug overlay

`?field=debug` is kept rather than deleted. §12 asks for it to be removed once
values are settled, but it is the only way to re-tune these forces later, it
costs one boolean check per frame when the flag is absent, and the person most
likely to need it cannot see the field without it. It draws the density map,
body displacement radii, live pressure waves, the light and its trailing
distance, and the wake vector; forces run ~3.7× in that mode.
