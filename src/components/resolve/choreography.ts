import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { springEase } from "../../lib/spring";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* --------------------------------------------------------------------------
   WHEN THINGS ARRIVE.

   THE ENTRANCE IS 1.2 SECONDS AND IT HAPPENS ONCE. A page you come back to
   that insists on introducing itself again is a page that does not remember
   you, so a session flag retires it after the first visit. It never blocks
   input: nothing is covered, nothing is disabled, and scrolling during it
   simply takes over.

   THE HEADLINE RISES FROM A MASK RATHER THAN FADING IN. Fading costs Largest
   Contentful Paint, because Chrome does not count an element at zero opacity
   as painted: an earlier version of this page spent two and a half seconds
   with nothing to show by its own choice. A line travelling up inside a clip
   is painted the whole time.

   THE CHAPTERS ARRIVE IN THE ORDER YOU READ THEM. Number, then title by
   character, then the lines of copy, then the buttons. Each one waits until
   the shape beside it is most of the way assembled, so you never read a claim
   next to a cloud that has not decided what it is yet.
   -------------------------------------------------------------------------- */

const ONCE = "rs-intro-played";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;



export function intro(hero: HTMLElement): () => void {
  if (reduced() || sessionStorage.getItem(ONCE)) return () => {};
  sessionStorage.setItem(ONCE, "1");

  const spatial = springEase("spatial-default");
  const effects = springEase("effects-default");
  const ctx = gsap.context(() => {
    const tl = gsap.timeline();
    /* 150-750ms: the two headline lines, out of their own clip */
    tl.from(
      hero.querySelectorAll(".rs-line > *"),
      { yPercent: 115, duration: spatial.duration, ease: spatial.ease, stagger: 0.08 },
      0.15,
    );
    /* 500-1000ms: the label and the promise */
    tl.from(
      [hero.querySelector(".rs-eyebrow"), hero.querySelector(".rs-byline")],
      { opacity: 0, y: 8, duration: effects.duration, ease: effects.ease, stagger: 0.08 },
      0.5,
    );
  }, hero);

  return () => ctx.revert();
}

/* --------------------------------------------------------------------------
   Each chapter's copy, keyed to its own shape.
   -------------------------------------------------------------------------- */
export function chapters(root: HTMLElement, track: HTMLElement): () => void {
  if (reduced()) return () => {};

  const spatial = springEase("spatial-default");
  const effects = springEase("effects-default");

  /* hand the panels over: the stylesheet stops trying to reveal them the
     moment something better is running */
  root.dataset.choreographed = "";

  const ctx = gsap.context(() => {
    for (const chapter of Array.from(track.querySelectorAll<HTMLElement>(".rs-chapter"))) {
      const panel = chapter.querySelector<HTMLElement>(".rs-panel");
      const title = chapter.querySelector<HTMLElement>(".rs-title");
      if (!panel || !title) continue;

      /* autoSplit re-splits on resize, which matters because these lines
         rewrap at every width the page supports */
      /* a class of our own, because the defaults are not guaranteed and a
         character that cannot be selected cannot be clipped either */
      const split = SplitText.create(title, {
        type: "chars",
        charsClass: "rs-char",
        autoSplit: true,
        aria: "hidden",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: spatial.ease, duration: spatial.duration },
      });
      tl.from(chapter.querySelector(".rs-no"), { opacity: 0, duration: effects.duration, ease: effects.ease })
        .from(split.chars, { yPercent: 110, stagger: 0.018 }, 0.06)
        .from(
          [chapter.querySelector(".rs-result"), chapter.querySelector(".rs-what"), chapter.querySelector(".rs-tag")],
          { opacity: 0, y: 14, stagger: 0.06, duration: effects.duration, ease: effects.ease },
          0.2,
        )
        .from(chapter.querySelector(".rs-actions"), { opacity: 0, y: 10, duration: effects.duration, ease: effects.ease }, 0.42);

      /* IT PLAYS WHEN THE SHAPE IS NEARLY THERE, NOT WHEN THE SECTION IS.
         The formation finishes about three quarters of the way between one
         chapter's centre and the next, so a reveal tied to the section's top
         would put the words on screen a screen and a half early, next to a
         cloud that is still deciding what it is. */
      ScrollTrigger.create({
        trigger: chapter,
        start: "top 55%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      /* and it leaves the way the hero does: up and out, not scrolled off */
      gsap.to(panel, {
        y: -24,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: chapter, start: "bottom 80%", end: "bottom 30%", scrub: 0.6 },
      });
    }
  }, track);

  return () => {
    ctx.revert();
    delete root.dataset.choreographed;
  };
}
