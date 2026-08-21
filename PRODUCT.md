# PRODUCT.md

Design context for Jay Harwani's portfolio. Written from a direct interview,
not inferred from a prompt.

## Register

**brand.** This is a portfolio: the design is not in service of a product, it
*is* the product. The interface is the primary evidence being submitted.

## Users

**Primary: YC and early-stage startup founders.** Evaluating whether one person
can cover design and front-end without a team. They read fast, they have seen
every portfolio template, and they are unimpressed by adjectives.

**Secondary: hiring managers at product companies.** The footer carries the
employment signal (open to full-time, no sponsorship required) so the hero does
not have to. Keep it that way; a hero that pleads gets read as available rather
than desirable.

## Product purpose

Prove **craft and taste** in the first five seconds, and prove it by
demonstration rather than assertion. The user's stated instruction: *"goes quiet
and lets typography and detail carry it."*

The site's own argument, already made in its copy, is that this person does not
stop at Figma: shipped PWAs, a live map, real front-end. The hero's job is not
to repeat that claim in words. It is to be an artifact that could only have been
made by someone who can do it.

## Brand personality

- **Precise.** Specific numbers, real names, exact claims. No "passionate about".
- **Dry.** The humour is deadpan and structural, never a joke pointing at itself.
  ("Because the ultimate user experience is closing the laptop.")
- **Evidence-first.** Every claim is adjacent to the thing that backs it.
- **Unhurried.** Confidence reads as not needing to shout.

## Anti-references

The user rejected **all four** offered failure modes, which is the sharpest
constraint in this document. The design must avoid, simultaneously:

1. **Generic SaaS landing.** Centred headline, gradient blob, feature cards, one
   big CTA. The default shape of every startup page.
2. **Looks AI-generated.** Templated, safe, no point of view. The user has
   rejected two previous attempts in this exact language.
3. **Loud and gimmicky.** Effects competing with content; motion that shows off.
4. **Corporate and quiet.** So restrained it says nothing.

Rejecting both 3 and 4 removes the usual escape hatches. The remaining target is
narrow and correct: **specific, not decorated.** Interest comes from
information density, asymmetry and typographic command, never from effects.

## Strategic design principles

1. **The hero must inform, not only assert.** After the intro resolves it
   currently says a slogan and nothing else. A founder should leave it knowing
   what this person does, what they have shipped, and where they are.
2. **Asymmetry over centring.** Centred-everything is the shape of anti-ref 1.
3. **No dead space without intent.** ~300px of nothing between the CTA and the
   tool blocks currently reads as unfinished rather than airy.
4. **Motion is budgeted, not free.** The site has been through several rounds of
   performance work; measured p50 is 16.7ms with zero long-task blocking. New
   motion must be transform/opacity only and must not reintroduce load.
5. **The tool blocks are evidence, not decoration.** They currently float
   detached at the bottom edge. They are one of the few genuinely earned things
   on the page and should be composed into the hero, not exiled from it.

## Accessibility

WCAG AA contrast minimum on all text. Every effect collapses under
`prefers-reduced-motion`. The tool blocks are already `aria-hidden` decoration
with a labelled container; keep that.
