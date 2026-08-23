import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ──────────────────────────────────────────────────────────────────────────
   One spider, hanging.

   It descends from above the viewport on a single dragline, comes to rest
   near the top-right web, and stays there swaying. It never walks, never
   scuttles, and never flees the cursor — it turns to face it. That last rule
   is the whole difference between charming and vermin, and it is one line.

   The sway is a real pendulum rather than a sine wave. A sine loop reads as a
   GIF within about four seconds because every swing is identical; a damped
   pendulum with a little wind never repeats exactly, settles when left alone,
   and swings wider when the cursor passes. Same cost, completely different
   impression.

   Cute comes from the micro-behaviour, not from the drawing. The body is two
   ellipses and eight two-segment polylines — deliberately minimal, because a
   drawn character reads as junior. What makes it feel alive is a leg twitch
   every few seconds and a head that follows you.

   Everything animates transform and opacity only. The thread is a single SVG
   line whose y2 is set once per frame, which is cheap because the element is
   1px wide.
   ────────────────────────────────────────────────────────────────────────── */

interface Props {
  /** where the dragline is anchored, as a fraction of the hero box */
  anchorX: number;
  /** how far down it comes to rest, in px from the anchor */
  restLength: number;
  interactive: boolean;
}

export default function Spider({ anchorX, restLength, interactive }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGLineElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const legsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const thread = threadRef.current;
    const body = bodyRef.current;
    if (!wrap || !thread || !body) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* pendulum state. `a` is the angle of the dragline from vertical. */
    let a = 0.22; // released off-vertical so it swings in rather than dropping dead
    let av = 0;
    let len = reduce || !interactive ? restLength : 0;
    let facing = 0;
    let facingTarget = 0;
    let pointerX = -9999;
    let pointerY = -9999;

    if (reduce || !interactive) {
      /* static: hanging at rest, no swing, no descent */
      thread.setAttribute("y2", String(restLength));
      wrap.style.setProperty("--drop", `${restLength}px`);
      wrap.style.opacity = "1";
      return;
    }

    /* the descent. Slow, and eased at the end so it settles rather than stops. */
    const drop = gsap.to(
      { v: 0 },
      {
        v: restLength,
        duration: 2.6,
        ease: "power2.out",
        delay: 1.1,
        onUpdate() {
          len = (this.targets()[0] as { v: number }).v;
        },
      }
    );
    gsap.to(wrap, { opacity: 1, duration: 0.6, delay: 1.1 });

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* a slow wandering breeze, so an untouched page still moves */
    let t = 0;

    const tick = () => {
      t += 1 / 60;

      /* pendulum: angular acceleration is -(g/L)·sin(a), plus wind, minus drag.
         Real physics rather than a sine, so the motion never repeats exactly. */
      const L = Math.max(40, len);
      const g = 0.9;
      const wind = Math.sin(t * 0.37) * 0.00055 + Math.sin(t * 0.11 + 1.3) * 0.00035;
      av += (-(g / L) * Math.sin(a) + wind) * 1.0;
      av *= 0.995; // light damping: it settles, but slowly
      a += av;

      const px = Math.sin(a) * L;
      const py = Math.cos(a) * L;

      thread.setAttribute("y2", py.toFixed(2));
      thread.setAttribute("x2", px.toFixed(2));

      /* the body hangs at the end of the thread and stays vertical-ish,
         leaning into the swing the way a hanging weight does */
      const lean = a * 34;

      /* face the cursor when it comes near (§5.5): turn toward, never away */
      const r = wrap.getBoundingClientRect();
      const bx = r.left + px;
      const by = r.top + py;
      const d = Math.hypot(pointerX - bx, pointerY - by);
      if (d < 150) {
        /* a small yaw toward the pointer, clamped so it reads as a glance */
        facingTarget = Math.max(-16, Math.min(16, (pointerX - bx) * 0.14));
        /* and it swings a little toward you, because you disturbed the air */
        av += Math.sign(pointerX - bx) * 0.00012;
      } else {
        facingTarget = 0;
      }
      facing += (facingTarget - facing) * 0.06;

      body.setAttribute(
        "transform",
        `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${(lean + facing * 0.35).toFixed(2)})`
      );
    };

    gsap.ticker.add(tick);

    /* idle leg twitch: one random leg, every 3–6s (§5.4) */
    let twitch = 0;
    const scheduleTwitch = () => {
      twitch = window.setTimeout(() => {
        const legs = legsRef.current;
        if (legs) {
          const pick = legs.children[Math.floor(Math.random() * legs.children.length)] as SVGElement;
          if (pick) {
            gsap.fromTo(
              pick,
              { rotate: 0 },
              {
                rotate: (Math.random() - 0.5) * 13,
                duration: 0.18,
                yoyo: true,
                repeat: 1,
                transformOrigin: "0px 0px",
                ease: "power2.inOut",
              }
            );
          }
        }
        scheduleTwitch();
      }, 3000 + Math.random() * 3000);
    };
    scheduleTwitch();

    return () => {
      gsap.ticker.remove(tick);
      drop.kill();
      window.clearTimeout(twitch);
      window.removeEventListener("pointermove", onMove);
    };
  }, [restLength, interactive]);

  /* Eight legs, two segments each, mirrored. Drawn rather than looped so the
     joint angles differ slightly per leg — identical legs read as generated. */
  const LEGS: [number, number, number, number, number, number][] = [
    [-3, -1, -9, -6, -14, -1],
    [-3, 0, -10, -1, -15, 3],
    [-3, 1, -9, 4, -13, 8],
    [-3, 2, -7, 7, -10, 12],
    [3, -1, 9, -6, 14, -1],
    [3, 0, 10, -1, 15, 3],
    [3, 1, 9, 4, 13, 8],
    [3, 2, 7, 7, 10, 12],
  ];

  return (
    <div
      ref={wrapRef}
      className="spider"
      aria-hidden="true"
      style={{ left: `${anchorX * 100}%`, opacity: 0 }}
    >
      <svg width="60" height={restLength + 40} viewBox={`-30 0 60 ${restLength + 40}`} overflow="visible">
        {/* the dragline */}
        <line
          ref={threadRef}
          x1="0"
          y1="0"
          x2="0"
          y2="0"
          stroke="var(--text)"
          strokeOpacity="0.3"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
        />
        <g ref={bodyRef}>
          <g ref={legsRef} stroke="var(--text)" strokeOpacity="0.62" strokeWidth="0.9" fill="none" strokeLinecap="round">
            {LEGS.map((l, i) => (
              <polyline key={i} points={`${l[0]},${l[1]} ${l[2]},${l[3]} ${l[4]},${l[5]}`} />
            ))}
          </g>
          {/* abdomen, then cephalothorax: the smaller one leads */}
          <ellipse cx="0" cy="5.5" rx="4.6" ry="5.4" fill="var(--text)" fillOpacity="0.3" stroke="var(--text)" strokeOpacity="0.62" strokeWidth="0.75" />
          <ellipse cx="0" cy="-1.6" rx="3.1" ry="2.9" fill="var(--text)" fillOpacity="0.3" stroke="var(--text)" strokeOpacity="0.62" strokeWidth="0.75" />
          <circle cx="-1.15" cy="-2.9" r="0.62" fill="var(--text)" fillOpacity="0.85" />
          <circle cx="1.15" cy="-2.9" r="0.62" fill="var(--text)" fillOpacity="0.85" />
        </g>
      </svg>
    </div>
  );
}
