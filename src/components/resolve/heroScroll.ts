import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   WHAT THE HERO DOES WHEN YOU SCROLL IT.

   Two things, both scrubbed, both reversible.

   THE SENTENCE COMPLETES AS THE WORK ARRIVES. "Then ships it." is outlined,
   which is this page's word for the half that is not built yet, and it inks
   in from the left across the first stretch of scroll. By the time the first
   project is on screen the claim is whole. Scroll back up and it empties
   again, because a scrubbed reveal that only runs forwards is a cutscene.

   THE COPY LEAVES EARLY AND SLOWLY. Letting it scroll off at page speed put
   the headline halfway out of frame while the lattice was still gathering
   into the first shape. Drifting it up and fading it over the same stretch
   means the hero is gone before the chapter arrives rather than fighting it.

   Both are clip-path and transform, so neither touches layout. Under reduced
   motion the line is simply solid and the copy simply there.
   -------------------------------------------------------------------------- */

export function heroScroll(hero: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.querySelector<HTMLElement>(".rs-ink")?.style.setProperty("--ink", "0%");
    return () => {};
  }

  const ctx = gsap.context(() => {
    const ink = hero.querySelector<HTMLElement>(".rs-ink");
    if (ink) {
      gsap.fromTo(
        ink,
        { "--ink": "100%" },
        {
          "--ink": "0%",
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            /* the first forty per cent of the hero's own scroll */
            end: "40% top",
            scrub: 0.6,
          },
        },
      );
    }

    gsap.to(hero.querySelector(".rs-hero-copy"), {
      y: -24,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "55% top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    /* THE CUE'S WHOLE LIFE IS HERE. It arrives last, and it leaves as soon
       as you have done what it asked, which is eighty pixels of scroll. Both
       ends are GSAP because a scrubbed tween records its start value when it
       is created: sharing the property with a CSS entrance meant the tween
       captured an opacity of zero and pinned it inline forever. */
    const cue = hero.querySelector(".rs-cue");
    gsap.from(cue, { opacity: 0, y: 10, duration: 0.7, delay: 1.4, ease: "power2.out" });
    gsap.fromTo(
      cue,
      { opacity: 1 },
      {
        opacity: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: hero, start: "top top", end: "80px top", scrub: true },
      },
    );
  }, hero);

  return () => ctx.revert();
}
