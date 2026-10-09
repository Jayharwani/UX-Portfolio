import type { MouseEvent } from "react";
import { gsap } from "gsap";
import type { NavigateFunction } from "react-router";

/* --------------------------------------------------------------------------
   LEAVING FOR A CASE STUDY.

   The cover turns like a page and the screen fades to that project's own
   colour, then the route changes. The fade target is the case study's
   background, so the transition lands on the page it opens rather than
   flashing through black on the way.

   THE CHUNK IS ALREADY IN FLIGHT. preload() runs the moment an issue becomes
   active in the run, which is hundreds of milliseconds before anyone can
   click. These are the same dynamic imports App.tsx uses for its lazy routes,
   so the module cache is shared and the route resolves from memory.

   MODIFIER CLICKS ARE LEFT ALONE. Cmd-click, Ctrl-click and the middle button
   mean "open in a new tab", and a page-turn animation is not a reason to take
   that away. Everything here is a real anchor underneath, so doing nothing is
   always the correct fallback.
   -------------------------------------------------------------------------- */

const LOADERS: Record<string, () => Promise<unknown>> = {
  "/friction": () => import("../../FrictionPage"),
  "/headroom": () => import("../../HeadroomPage"),
  "/signal": () => import("../../SignalCasePage"),
  "/bumper": () => import("../../BumperCasePage"),
};

const started = new Set<string>();

export function preload(href: string): Promise<unknown> {
  const load = LOADERS[href];
  if (!load) return Promise.resolve();
  if (started.has(href)) return Promise.resolve();
  started.add(href);
  return load().catch(() => {
    /* offline, or the chunk 404s after a deploy. The anchor still navigates,
       and React Router will fetch it again on the way. */
    started.delete(href);
  });
}

export async function turnTo(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  cover: HTMLElement | null,
  veil: HTMLElement | null,
  navigate: NavigateFunction,
): Promise<void> {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();

  const ready = LOADERS[href]?.() ?? Promise.resolve();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await ready;
    navigate(href);
    return;
  }

  const tl = gsap.timeline();
  if (cover) {
    tl.to(cover, { rotateY: -105, transformOrigin: "0% 50%", duration: 0.32, ease: "power3.in" }, 0);
  }
  if (veil) {
    tl.to(veil, { autoAlpha: 1, duration: 0.24, ease: "power1.in" }, 0.08);
  }
  /* Both, not whichever is slower by assumption: on a warm cache the import
     resolves first and the animation is the floor; on a cold one it is the
     other way round. */
  await Promise.all([tl.then(), ready]);
  navigate(href);
}
