import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* --------------------------------------------------------------------------
   THE SHOWCASE ENGINE. Path A (§8.3).

   IT WRITES FOUR NUMBERS AND NOTHING ELSE. --enter, --exit, --draw and
   --reveal per project, plus --fill per progress button. CSS turns them into
   transforms and clip paths, which is why Path A and Path B are
   interchangeable and why nothing here knows what anything looks like.

   PINNING IS position: sticky, not ScrollTrigger's pin. The pin option
   rewrites the DOM around the trigger, and a page that has one scroll
   container and one sticky stage has nothing to gain from it.

   LAYOUT IS CSS'S. The section's height is set in a media query, and this
   reads it. An engine that sets heights is an engine that fights the
   stylesheet on every resize.

   gsap.matchMedia builds the timeline when the query matches and reverts it
   when it stops, which is what clears the inline properties so the stacked
   layout's own data-state takes over (§8.5).
   -------------------------------------------------------------------------- */

gsap.registerPlugin(ScrollTrigger);

export interface Els {
  section: HTMLElement;
  /** one per project; the four drivers are written here and inherit down */
  projects: HTMLElement[];
  fills: HTMLElement[];
  names: HTMLElement[];
}

export function mountShowcaseMotion(
  { section, projects, fills, names }: Els,
  onShip: (i: number) => void,
  onActive: (i: number) => void
) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const shipped = new Set<number>();
    let active = -1;
    const tl = gsap.timeline({ defaults: { ease: "none" } });

    /* project 1 is already in its spec state when the stage first pins, so it
       has no enter phase (§7.3) */
    gsap.set(projects[0], { "--enter": 1 });

    projects.forEach((p, i) => {
      if (i > 0) {
        tl.fromTo(projects[i - 1], { "--exit": 0 }, { "--exit": 1, duration: 0.12 }, i);
        tl.fromTo(p, { "--enter": 0 }, { "--enter": 1, duration: 0.12 }, i);
      }
      tl.fromTo(p, { "--draw": 0 }, { "--draw": 1, duration: 0.1 }, i + 0.12);
      tl.fromTo(p, { "--reveal": 0 }, { "--reveal": 1, duration: 0.28 }, i + 0.4);
      tl.fromTo(fills[i], { "--fill": 0 }, { "--fill": 1, duration: 1 }, i);

      /* one-shot: counters and the settle, time based rather than scrubbed, and
         never replayed on the way back up */
      tl.call(
        () => {
          if (shipped.has(i)) return;
          shipped.add(i);
          onShip(i);
          gsap.fromTo(
            p.querySelector(".frame-link"),
            { scale: 0.995 },
            { scale: 1, duration: 0.44, ease: "elastic.out(1, 0.75)" }
          );
        },
        [],
        i + 0.68
      );
    });

    /* The active name is derived from where the playhead IS, not from a
       callback at 0.06. tl.call fires on crossing, so scrolling back up from
       project 4 to the middle of project 1 last crossed project 2's marker
       and left its name lit. A project owns the timeline from i + 0.06 to
       i + 1.06, so the index is a floor, and a floor is right in both
       directions. */
    const syncActive = () => {
      const i = Math.min(projects.length - 1, Math.max(0, Math.floor(tl.time() - 0.06)));
      if (i === active) return;
      active = i;
      onActive(i);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate: syncActive,
    });

    /* §8.6: a restored scroll position has to render its own project on the
       first frame. `scrub` lerps toward the target, so without this the stage
       opens on project 1 and travels to project 3 in front of the reader who
       just pressed Back. */
    tl.totalProgress(trigger.progress);
    syncActive();

    /* the measured width of a line changes when the webfont lands, and every
       start and end on this trigger is derived from layout (§8.5) */
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    /* Jump to a project's shipped dwell. The progress nav uses it, and so does
       focus management: a reader tabbing into copy that is at opacity 0 needs
       the page to come to them before the ring lands (§6.3.8, WCAG 2.4.11). */
    const goTo = (i: number, smooth: boolean) => {
      const segment = (section.offsetHeight - window.innerHeight) / projects.length;
      const y = section.offsetTop + (i + 0.84) * segment;
      window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
    };

    const onNavClick = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.index);
      if (Number.isFinite(i)) goTo(i, true);
    };
    names.forEach((b) => b.addEventListener("click", onNavClick));

    /* Being the active project is not the same as being on screen. The stage
       is sticky, so a ring can land on the active project's own button while
       the page sits at a scroll position that renders it below the fold:
       tabbing in put "Read case study" 170px past the bottom of a 900px
       viewport with nothing to correct it. The test is the rect, not the
       index. */
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      const p = el.closest<HTMLElement>(".project");
      if (!p) return;
      const i = Number(p.dataset.index);
      if (!Number.isFinite(i)) return;
      const b = el.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (i === active && b.top >= top && b.bottom <= window.innerHeight) return;
      /* After the browser's own scroll-into-view, not before it. The engine
         ran first and scrolled to the dwell, and the browser then scrolled
         back to where it had decided the element was, leaving the ring 170px
         below the fold. One frame later, ours is the last word. */
      requestAnimationFrame(() => goTo(i, false));
    };
    section.addEventListener("focusin", onFocusIn);

    return () => {
      names.forEach((b) => b.removeEventListener("click", onNavClick));
      section.removeEventListener("focusin", onFocusIn);
      trigger.kill();
      tl.kill();
    };
  });

  return () => mm.revert();
}
