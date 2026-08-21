import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SANDBOX } from "./controls";

/* ──────────────────────────────────────────────────────────────────────────
   The sandbox arena.

   matter-js is a SOLVER here and owns no pixels. Six invisible bodies are
   stepped, and six real DOM cards are positioned from them each frame. That
   inversion is the whole trick: the controls stay real HTML, so they keep
   their native keyboard behaviour, their semantics and their focus handling,
   while still being throwable objects.

   Three problems this has to solve at once, and getting any of them wrong
   makes the feature feel broken rather than delightful:

   1. Drag versus use. Touch the middle of a card and you operate the control;
      touch the chrome and you throw the card. Solved three ways below —
      pointer-events on the control, a velocity gate, and a visible grip.

   2. Keyboard. Floating physics-driven controls are an accessibility minefield
      and a reviewer will check it inside a minute. Tab order follows DOM order
      permanently regardless of where a card physically sits, and focusing a
      card freezes and self-rights it so the target stops moving.

   3. Cost. Six sleeping bodies and one shared ticker callback. The physics
      steps only while the hero is on screen and the tab is visible, so an idle
      hero costs nothing.

   No instructions anywhere. Discovered delight outranks announced delight by a
   wide margin, and the moment this gets a "Drag me" label it converts a
   discovery into an instruction and loses most of its value.
   ────────────────────────────────────────────────────────────────────────── */

const CARD_H = 118; // approximate; refined from the real element at mount
const SETTLE_ANGLE = 0.12;
const SETTLE_SPEED = 0.4;

export default function Sandbox({
  interactive,
  onImpact,
}: {
  interactive: boolean;
  /** fires when a card lands, so the fold rule can flash at the contact x */
  onImpact?: (x: number) => void;
}) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena || !interactive) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    import("matter-js").then((M) => {
      if (disposed) return;
      const { Engine, Bodies, Composite, Body, Sleeping, Mouse, MouseConstraint, Events } = M;

      const W = arena.clientWidth;
      const H = arena.clientHeight;
      if (!W || !H) return;

      /* §4.3: a light solver. Six boxes need nothing like the defaults. */
      const engine = Engine.create({ enableSleeping: true });
      engine.positionIterations = 3;
      engine.velocityIterations = 2;
      engine.constraintIterations = 1;

      const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const sizes = els.map((el) => ({ w: el.offsetWidth || 150, h: el.offsetHeight || CARD_H }));

      /* Invisible static walls at the arena bounds, so nothing can be thrown
         away and lost. The floor is the arena's bottom edge, which is where
         the fold rule sits — the rule is the ground, not decoration near it. */
      const wall = { isStatic: true, render: { visible: false }, friction: 0.4 };
      const walls = [
        Bodies.rectangle(W / 2, H + 40, W + 400, 80, wall), // floor
        Bodies.rectangle(-40, H / 2, 80, H * 3, wall), // left
        Bodies.rectangle(W + 40, H / 2, 80, H * 3, wall), // right
        Bodies.rectangle(W / 2, -H * 1.6, W + 400, 80, wall), // high ceiling
      ];
      Composite.add(engine.world, walls);

      /* Irregular rest positions. A perfectly aligned row reads as a component
         gallery; a loose scatter reads as objects someone left on a desk. */
      const bodies = els.map((el, i) => {
        const { w, h } = sizes[i];
        const slot = (i + 0.5) / els.length;
        const x = Math.max(w / 2 + 8, Math.min(W - w / 2 - 8, W * slot + (((i * 37) % 11) - 5) * 4));
        const y = -140 - i * 90; // start above the arena, fall in
        const b = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: 14 },
          restitution: 0.18,
          friction: 0.45,
          frictionAir: 0.022,
          density: 0.0016,
        });
        Body.setAngle(b, (((i * 53) % 9) - 4) * 0.0125); // ±4°
        return b;
      });
      Composite.add(engine.world, bodies);

      /* Drag. The MouseConstraint only ever sees pointerdowns that reached the
         card chrome: the control wrapper stops propagation, so a slider drag
         can never become a throw. */
      const mouse = Mouse.create(arena);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.16, damping: 0.08, render: { visible: false } },
      });
      /* let the page keep its wheel */
      (mouse as any).element.removeEventListener("wheel", (mouse as any).mousewheel);
      (mouse as any).element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
      Composite.add(engine.world, mc);

      Events.on(mc, "startdrag", ((e: { body?: Matter.Body }) => {
        if (e.body) Sleeping.set(e.body, false);
      }) as (e: Matter.IEvent<Matter.MouseConstraint>) => void);

      /* impact flash on the fold rule, once per landing */
      const landed = new Set<number>();
      Events.on(engine, "collisionStart", (evt) => {
        for (const pair of evt.pairs) {
          const b = bodies.indexOf(pair.bodyA as any) >= 0 ? pair.bodyA : pair.bodyB;
          const idx = bodies.indexOf(b as any);
          if (idx >= 0 && !landed.has(idx) && (pair.bodyA === walls[0] || pair.bodyB === walls[0])) {
            landed.add(idx);
            onImpact?.(b.position.x);
          }
        }
      });

      /* focus freeze: a keyboard user gets a stable, upright target */
      let frozen = -1;
      const onFocusIn = (e: FocusEvent) => {
        const card = (e.target as HTMLElement).closest("[data-sandbox-card]") as HTMLElement | null;
        if (!card) return;
        const i = els.indexOf(card as HTMLDivElement);
        if (i < 0) return;
        frozen = i;
        card.style.zIndex = "40";
        Body.setVelocity(bodies[i], { x: 0, y: 0 });
        Body.setAngularVelocity(bodies[i], 0);
        gsap.to(bodies[i], { angle: 0, duration: 0.2, ease: "power2.out", onUpdate: () => Body.setAngle(bodies[i], bodies[i].angle) });
      };
      const onFocusOut = (e: FocusEvent) => {
        const card = (e.target as HTMLElement).closest("[data-sandbox-card]") as HTMLElement | null;
        if (card) card.style.zIndex = "";
        frozen = -1;
      };
      arena.addEventListener("focusin", onFocusIn);
      arena.addEventListener("focusout", onFocusOut);

      /* grip affordance: the chrome shows it can be picked up, the control
         does not. Set on pointermove so the card teaches its two modes without
         a caption. */
      const onMove = (e: PointerEvent) => {
        const t = e.target as HTMLElement;
        const card = t.closest("[data-sandbox-card]") as HTMLElement | null;
        els.forEach((el) => el.removeAttribute("data-grip"));
        if (card && !t.closest("[data-control]")) card.setAttribute("data-grip", "true");
      };
      arena.addEventListener("pointermove", onMove);
      const onLeave = () => els.forEach((el) => el.removeAttribute("data-grip"));
      arena.addEventListener("pointerleave", onLeave);

      /* visibility gating: no stepping when nobody can see it */
      let onScreen = true;
      const io = new IntersectionObserver(([en]) => (onScreen = en.isIntersecting), { rootMargin: "120px" });
      io.observe(arena);

      const tick = () => {
        if (!onScreen || document.hidden) return;
        Engine.update(engine, 1000 / 60);
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          const el = els[i];
          if (!el) continue;
          const { w, h } = sizes[i];

          /* Weak self-righting. Thrown cards tumble, then settle upright over
             roughly 800ms. Without it a card can rest at 40° with a slider
             the visitor cannot sensibly use, which reads as a bug rather than
             as physics. */
          if (i !== frozen && !b.isStatic && Math.abs(b.angle) > 0.005) {
            Body.setAngularVelocity(b, b.angularVelocity * 0.86 - b.angle * 0.006);
          }

          el.style.transform = `translate3d(${b.position.x - w / 2}px, ${b.position.y - h / 2}px, 0) rotate(${b.angle}rad)`;

          /* Velocity gate: a card in flight cannot have its slider dragged by
             accident. Interactivity returns as it settles. */
          const settled = b.speed < SETTLE_SPEED && Math.abs(b.angle) < SETTLE_ANGLE;
          const ctl = el.querySelector("[data-control]") as HTMLElement | null;
          if (ctl) ctl.style.pointerEvents = settled || i === frozen ? "auto" : "none";
        }
      };
      gsap.ticker.add(tick);
      setReady(true);

      cleanup = () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        arena.removeEventListener("focusin", onFocusIn);
        arena.removeEventListener("focusout", onFocusOut);
        arena.removeEventListener("pointermove", onMove);
        arena.removeEventListener("pointerleave", onLeave);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [interactive, onImpact]);

  return (
    <div
      ref={arenaRef}
      className="relative w-full h-full"
      /* the arena is not labelled and carries no instructions by design */
      style={{ touchAction: "pan-y" }}
    >
      {SANDBOX.map((s, i) => {
        const { Component } = s;
        return (
          <div
            key={s.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-sandbox-card
            data-project={s.project}
            className="sbx-card-wrap"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              willChange: interactive ? "transform" : undefined,
              /* before physics reports a position, keep them out of the way
                 rather than stacked at the origin */
              visibility: interactive && !ready ? "hidden" : "visible",
            }}
          >
            <Component />
          </div>
        );
      })}
    </div>
  );
}
