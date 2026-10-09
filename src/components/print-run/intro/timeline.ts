import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { INTRO_SCALE, type EmblemHandle } from "../EmblemSlot";
import type { Mode } from "./mode";
import type { MutableRefObject } from "react";

gsap.registerPlugin(DrawSVGPlugin);

/* --------------------------------------------------------------------------
   THE INTRO.

   Four colour plates fly in and lock into register, and the register mark
   becomes Jay's monogram. That is the whole idea of the page in three
   seconds: the design and the build arriving on the same spot.

   THE PAGE IS ALREADY THERE UNDERNEATH. Nothing here builds the homepage; it
   covers a finished one with a veil and then takes the veil away. The
   headline is real text at full opacity on the first frame, which is the only
   way it can be the Largest Contentful Paint element at all.

   THE SWAP HAPPENS INSIDE THE FLASH. At 1230ms the flat plates give way to
   the real extruded emblem, at the one moment when the screen is at 35% paper
   and nobody can see the seam. If the stage has not compiled by then the
   plates simply stay: a swap you can see is worse than no swap.

   EVERY TARGET IS READ LATE. The stage arrives from a dynamic import some
   hundreds of milliseconds after this timeline is built, so a tween pointed
   at stage.state at build time would always find nothing and the intro would
   permanently take the flat path. The spin and the travel both drive a plain
   proxy object and apply the result to whatever exists at that frame, which
   also means a stage that finishes compiling mid-turn joins in cleanly.

   ONE FLASH, 35% PAPER, 140ms, well inside WCAG 2.3.1's three-per-second
   limit. None of it runs under reduced motion, where this file is never
   reached at all.

   THE HERO ENTRANCE IS BUILT AT 2300ms, NOT AT MOUNT. A fromTo built at mount
   stages its "from" values immediately, which would hold the headline at
   opacity 0 for the first two seconds and disqualify it from LCP. Building it
   inside a callback leaves the markup in its finished CSS state until the
   moment it is actually needed.
   -------------------------------------------------------------------------- */

type Opts = {
  mode: Exclude<Mode, "none">;
  root: HTMLElement;
  emblem: MutableRefObject<EmblemHandle>;
  onFinish: () => void;
};

/** where each plate starts: viewport fractions, and degrees of rotation */
const PLATES = [
  { x: -0.16, y: -0.13, r: -10 },
  { x: 0.17, y: -0.12, r: 9 },
  { x: -0.14, y: 0.14, r: 11 },
  { x: 0.18, y: 0.13, r: -8 },
];

const q = <T extends HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel);
const qa = <T extends HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

/** The finished state of everything the intro touches. Runs on skip, on a
 *  natural finish and on teardown, so it has to be safe to run twice. */
function settle(root: HTMLElement, emblem: EmblemHandle) {
  if (emblem.box) gsap.set(emblem.box, { x: 0, y: 0, scale: 1, rotationY: 0, opacity: 1, clearProps: "zIndex" });
  if (emblem.stage) emblem.stage.state.spinY = 0;
  gsap.set(qa(root, ".pr-plate"), { opacity: 0 });
  gsap.set(qa(root, ".pr-flash, .pr-ring, .pr-regmark, .pr-screen, .pr-veil"), { opacity: 0 });

  gsap.set(".pr-snap", { opacity: 0, x: 0, y: 0 });
  gsap.set(".pr-l1-ink", { opacity: 1, scale: 1 });
  gsap.set(".pr-ch", { opacity: 1, yPercent: 0 });
  gsap.set([".pr-byline", ".pr-evidence", ".pr-hemline"], { opacity: 1, y: 0 });
}

function heroEntrance(): gsap.core.Timeline {
  const tl = gsap.timeline();
  /* The register snap: an accent copy of line one, off by (8, 6), collapsing
     onto the real line. Two plates not quite lined up, until they are. */
  tl.fromTo(".pr-snap", { opacity: 0.9, x: 8, y: 6 }, { opacity: 0, x: 0, y: 0, duration: 0.38, ease: "back.out(2)" }, 0)
    .fromTo(".pr-l1-ink", { scale: 1.04 }, { scale: 1, duration: 0.38, ease: "back.out(2)" }, 0)
    .fromTo(
      ".pr-ch",
      { opacity: 0, yPercent: 12 },
      { opacity: 1, yPercent: 0, duration: 0.42, stagger: 0.016, ease: "power3.out" },
      0.08,
    )
    .fromTo(
      [".pr-byline", ".pr-evidence", ".pr-hemline"],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      0.22,
    );
  return tl;
}

export function buildIntro({ mode, root, emblem, onFinish }: Opts): gsap.core.Timeline {
  const plates = qa(root, ".pr-plate");
  const veil = q(root, ".pr-veil");
  const mark = q(root, ".pr-regmark");
  const flash = q(root, ".pr-flash");
  const ring = q(root, ".pr-ring");
  const screen = q(root, ".pr-screen");

  let entrance: gsap.core.Timeline | null = null;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    entrance?.kill();
    settle(root, emblem.current);
    onFinish();
  };

  const tl = gsap.timeline({ onComplete: finish });
  tl.eventCallback("onInterrupt", finish);

  if (mode === "short") {
    /* A returning visitor, inside thirty days. The mark lands, the headline
       snaps, and that is the entire ceremony. */
    gsap.set(veil, { opacity: 0 });
    gsap.set(plates, { opacity: 0 });
    const box = emblem.current.box;
    if (box) tl.fromTo(box, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" }, 0);
    tl.call(() => {
      entrance = heroEntrance();
    }, undefined, 0.2);
    tl.set({}, {}, 0.7);
    return tl;
  }

  gsap.set(veil, { opacity: 1 });
  gsap.set(mark, { opacity: 1, scale: 1 });
  gsap.set(plates, { opacity: 0 });
  gsap.set([ring, flash, screen], { opacity: 0 });

  /* 0 to 350: the register mark draws itself */
  tl.fromTo(q(root, ".pr-reg-ring"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, ease: "power2.inOut" }, 0).fromTo(
    qa(root, ".pr-reg-arm"),
    { scaleX: 0, scaleY: 0 },
    { scaleX: 1, scaleY: 1, duration: 0.3, stagger: 0.03, ease: "power3.out" },
    0.05,
  );

  /* 150 to 1150: four plates, four directions, one landing */
  plates.forEach((plate, i) => {
    const p = PLATES[i];
    tl.fromTo(
      plate,
      { x: () => p.x * window.innerWidth, y: () => p.y * window.innerHeight, rotate: p.r, scale: 1.35, opacity: 0 },
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1, ease: "expo.out" },
      0.15,
    );
  });

  /* 1200: the lock */
  tl.fromTo(flash, { opacity: 0 }, { opacity: 0.35, duration: 0.05, ease: "none" }, 1.2)
    .to(flash, { opacity: 0, duration: 0.09, ease: "none" }, 1.25)
    .to(mark, { scale: 2.4, opacity: 0, duration: 0.3, ease: "power2.out" }, 1.2)
    .fromTo(ring, { scale: 0.2, opacity: 0.5 }, { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out" }, 1.2);

  /* 1230: the swap, inside the flash. The offsets are captured here rather
     than at build time, because the slot's position depends on fonts having
     loaded and on the viewport as it is now. */
  const start = { x: 0, y: 0 };
  tl.call(
    () => {
      gsap.set(plates, { opacity: 0 });
      const box = emblem.current.box;
      if (!box) return;
      gsap.set(box, { x: 0, y: 0, scale: 1 });
      const r = box.getBoundingClientRect();
      start.x = window.innerWidth / 2 - (r.left + r.width / 2);
      start.y = window.innerHeight / 2 - (r.top + r.height / 2);
      gsap.set(box, { zIndex: 11, opacity: 1, x: start.x, y: start.y, scale: INTRO_SCALE });
    },
    undefined,
    1.23,
  );

  /* 1230 to 2150: one full turn, on whichever emblem exists by then */
  const spin = { t: 0 };
  tl.fromTo(
    spin,
    { t: 0 },
    {
      t: 1,
      duration: 0.92,
      ease: "power3.inOut",
      onUpdate: () => {
        const h = emblem.current;
        if (h.stage) h.stage.state.spinY = spin.t * Math.PI * 2;
        else if (h.box) gsap.set(h.box, { rotationY: spin.t * 360, transformPerspective: 900 });
      },
    },
    1.23,
  );

  /* 2150 to 2750: the emblem travels to its slot and settles to rest size */
  const travel = { t: 1 };
  tl.fromTo(
    travel,
    { t: 1 },
    {
      t: 0,
      duration: 0.6,
      ease: "expo.inOut",
      onUpdate: () => {
        const box = emblem.current.box;
        if (!box) return;
        gsap.set(box, {
          x: start.x * travel.t,
          y: start.y * travel.t,
          scale: 1 + (INTRO_SCALE - 1) * travel.t,
        });
      },
    },
    2.15,
  );

  /* 2300 to 2900: the page develops out of the dots */
  tl.to(veil, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 2.3).fromTo(
    screen,
    { opacity: 0.5, scale: 1 },
    { opacity: 0, scale: 1.6, duration: 0.6, ease: "power2.out" },
    2.3,
  );

  tl.call(
    () => {
      entrance = heroEntrance();
    },
    undefined,
    2.3,
  );

  /* Pin the stated length, so progress maps to it whatever the last tween
     happens to end at. */
  tl.set({}, {}, mode === "full" ? 3.2 : 2.4);

  return tl;
}
