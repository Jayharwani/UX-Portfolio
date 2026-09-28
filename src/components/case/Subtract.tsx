import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* --------------------------------------------------------------------------
   SUBTRACTION — Headroom's signature.

   Headroom's claim is not that it does more. It is that it refuses almost
   everything the category treats as mandatory, and what is left is one
   number. A page can say "simplicity is a series of refusals" or it can
   perform the refusals, one at a time, and let the number appear underneath.

   So: the nine things every rival asks for before it will tell you anything,
   dropped out of the frame as the reader scrolls, leaving what Headroom
   actually shows.

   Every chip is a real refusal named in the case study — categories, rules
   and upkeep are what YNAB, Monarch and Copilot ask for first; the charts
   line is from the fourth of the six versions; streaks and red alerts are
   the two the product refuses by name. None of them were invented to fill
   the grid.

   PHYSICS, AND WHY IT IS REVERSIBLE. Falling is the honest verb — these
   things were dropped, not faded out — but a reader who scrolls back up and
   finds an empty frame has been told the page is broken. Each chip keeps its
   measured slot, so scrolling back removes its body and returns it.

   matter-js is imported dynamically: it is already a dependency, but it has
   no business in the bundle of a page that never scrolls this far.
   -------------------------------------------------------------------------- */

gsap.registerPlugin(ScrollTrigger);

/** what the category asks for before it will tell you anything */
const REFUSED = [
  "categories",
  "rules",
  "upkeep",
  "bank login",
  "budgets",
  "charts",
  "streaks",
  "red alerts",
  "a ledger of the past",
];

/** what is left, and the only figure the product shows */
const SAFE = "$1,730";

type Slot = { x: number; y: number; w: number; h: number };

export function Subtract() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLSpanElement[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st) return;

    const wantsLess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(wantsLess);

    const nodes = chips.current.filter(Boolean);
    let slots: Slot[] = [];
    let trigger: ScrollTrigger | null = null;
    let dead = false;

    const grid = st.querySelector<HTMLElement>(".chips");

    /* Freeze the flow layout into absolute slots, so the chips can be driven
       by transform without the row reflowing under them.
       THE GRID KEEPS ITS HEIGHT EXPLICITLY. Absolutely positioning every
       child collapses the container to nothing, which pulled the number up
       underneath the chips and had them overlapping from the first frame. */
    const measure = () => {
      if (!grid) return;
      const gh = grid.offsetHeight;
      slots = nodes.map((n) => ({
        x: n.offsetLeft,
        y: n.offsetTop,
        w: n.offsetWidth,
        h: n.offsetHeight,
      }));
      nodes.forEach((n, i) => {
        n.style.position = "absolute";
        n.style.left = `${slots[i].x}px`;
        n.style.top = `${slots[i].y}px`;
        n.style.margin = "0";
      });
      grid.style.height = `${gh}px`;
    };

    /* measure while still in flow, then lock */
    const stHeight = st.offsetHeight;
    measure();
    st.style.minHeight = `${stHeight}px`;

    /* ── reduced motion: no engine, no falling ──
       The chips strike through in sequence and the number arrives. Same
       information, same order, none of the movement. */
    if (wantsLess) {
      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 40%",
        scrub: true,
        onUpdate: (self) => {
          const gone = Math.round(self.progress * REFUSED.length);
          nodes.forEach((n, i) => n.classList.toggle("gone", i < gone));
          el.style.setProperty("--reveal", String(Math.min(1, self.progress * 1.25)));
        },
      });
      return () => {
        trigger?.kill();
      };
    }

    let cleanupPhysics: (() => void) | null = null;

    import("matter-js")
      .then((M) => {
        if (dead) return;
        const { Engine, Bodies, Composite, Body } = M.default ?? M;
        const engine = Engine.create();
        engine.gravity.y = 1.1;

        const bodies: Array<InstanceType<typeof M.Body> | null> = nodes.map(() => null);

        const release = (i: number) => {
          if (bodies[i]) return;
          const s = slots[i];
          const b = Bodies.rectangle(s.x + s.w / 2, s.y + s.h / 2, s.w, s.h, {
            restitution: 0.15,
            friction: 0.4,
            frictionAir: 0.012,
          });
          /* a small shove so nine identical chips do not fall identically */
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.22);
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 2.4, y: -1 - Math.random() });
          Composite.add(engine.world, b);
          bodies[i] = b;
          nodes[i].classList.add("falling");
        };

        const restore = (i: number) => {
          const b = bodies[i];
          if (!b) return;
          Composite.remove(engine.world, b);
          bodies[i] = null;
          const n = nodes[i];
          n.classList.remove("falling");
          n.style.transform = "";
        };

        const tick = () => {
          Engine.update(engine, 1000 / 60);
          const h = st.offsetHeight;
          for (let i = 0; i < nodes.length; i++) {
            const b = bodies[i];
            if (!b) continue;
            const s = slots[i];
            const dx = b.position.x - (s.x + s.w / 2);
            const dy = b.position.y - (s.y + s.h / 2);
            nodes[i].style.transform = `translate(${dx}px, ${dy}px) rotate(${b.angle}rad)`;
            /* stop drawing once it has left the stage */
            nodes[i].style.visibility = b.position.y > h + 220 ? "hidden" : "";
          }
        };
        gsap.ticker.add(tick);

        trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 72%",
          end: "bottom 45%",
          scrub: true,
          onUpdate: (self) => {
            const gone = Math.round(self.progress * REFUSED.length);
            for (let i = 0; i < nodes.length; i++) {
              if (i < gone) release(i);
              else restore(i);
            }
            el.style.setProperty("--reveal", String(Math.min(1, self.progress * 1.25)));
          },
        });

        const onResize = () => {
          for (let i = 0; i < nodes.length; i++) restore(i);
          nodes.forEach((n) => {
            n.style.position = "";
            n.style.left = "";
            n.style.top = "";
          });
          if (grid) grid.style.height = "";
          st.style.minHeight = "";
          requestAnimationFrame(() => {
            const h = st.offsetHeight;
            measure();
            st.style.minHeight = `${h}px`;
            ScrollTrigger.refresh();
          });
        };
        window.addEventListener("resize", onResize);

        cleanupPhysics = () => {
          gsap.ticker.remove(tick);
          window.removeEventListener("resize", onResize);
          Composite.clear(engine.world, false);
          Engine.clear(engine);
        };
      })
      .catch(() => {
        /* physics could not load; the chips simply stay put and the number
           still arrives, because the reveal is driven by scroll, not by it */
      });

    return () => {
      dead = true;
      trigger?.kill();
      cleanupPhysics?.();
    };
  }, []);

  return (
    <div className="hr-sub" ref={root}>
      <p className="lbl mono">WHAT EVERY OTHER APP ASKS FOR FIRST</p>

      <div className="stage" ref={stage}>
        <div className="chips" aria-hidden="true">
          {REFUSED.map((r, i) => (
            <span
              className="chip"
              key={r}
              ref={(n) => {
                if (n) chips.current[i] = n;
              }}
            >
              {r}
            </span>
          ))}
        </div>

        <div className="out">
          <b>{SAFE}</b>
          <span>safe to spend today</span>
        </div>
      </div>

      {/* the chips are decorative once they are falling; this is the list a
          screen reader gets, in one sentence, and it never moves */}
      <p className="sr">
        Headroom refuses all of it: {REFUSED.join(", ")}. What is left is one number,{" "}
        {SAFE} safe to spend today.
      </p>

      <p className="cap mono">
        {reduced ? "Nine refusals." : "Scroll. Each one is something Headroom refuses to ask you for."}
      </p>
    </div>
  );
}
