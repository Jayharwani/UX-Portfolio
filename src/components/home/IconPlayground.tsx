import { useEffect, useRef, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Icon playground: the hero signature. Ten dark tech blocks with real
   physics (matter-js). They drop in on load, you can drag and throw them,
   they collide and scatter. Desktop gets physics; pass interactive={false}
   for a static scatter (mobile, reduced motion).
   Brand icon paths are the official simple-icons vectors.
   ────────────────────────────────────────────────────────────────────────── */

/* ── official brand paths (simple-icons) ── */
const P = {
  openai:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  gemini:
    "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  adobe:
    "M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z",
  cursor:
    "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23",
};

function Simple({ d, fill, size }: { d: string; fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill={fill} />
    </svg>
  );
}

/* official multicolor Figma mark */
function FigmaIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.68} height={size} viewBox="0 0 38 57" aria-hidden="true">
      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

/* Gemini with its blue-violet gradient */
function GeminiIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="gem-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#4796E3" />
          <stop offset="55%" stopColor="#9177C7" />
          <stop offset="100%" stopColor="#D3606D" />
        </linearGradient>
      </defs>
      <path d={P.gemini} fill="url(#gem-g)" />
    </svg>
  );
}

/* Google Antigravity: orbit mark in Google colors (no official vector yet) */
function AntigravityIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5.2" fill="none" stroke="#4285F4" strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="#9AA1AD" strokeWidth="1.4" transform="rotate(-24 12 12)" />
      <circle cx="20.6" cy="7.4" r="1.9" fill="#EA4335" />
      <circle cx="12" cy="12" r="1.7" fill="#FBBC05" />
    </svg>
  );
}

/* concept glyphs, kept in the accent so the set stays disciplined */
function UXIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5 17 9c1.4 1.9 2.2 3.5 2.2 5.2A7.2 7.2 0 0 1 12 21.5 7.2 7.2 0 0 1 4.8 14.2C4.8 12.5 5.6 10.9 7 9l5-6.5z" stroke="#5B8CFF" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="14.2" r="2.1" stroke="#5B8CFF" strokeWidth="1.7" />
      <path d="M12 2.5v9.6" stroke="#5B8CFF" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function CodeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" stroke="#5B8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.5 4-3 16" stroke="#5B8CFF" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
function AIDesignIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5c.9 4.4 3.1 6.6 8.5 8.5-5.4 1.9-7.6 4.1-8.5 8.5-.9-4.4-3.1-6.6-8.5-8.5 5.4-1.9 7.6-4.1 8.5-8.5z" fill="rgba(91,140,255,0.2)" stroke="#5B8CFF" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 2.6c.35 1.7 1.2 2.55 3 3.4-1.8.85-2.65 1.7-3 3.4-.35-1.7-1.2-2.55-3-3.4 1.8-.85 2.65-1.7 3-3.4z" fill="#5B8CFF" />
    </svg>
  );
}

interface Tile {
  id: string;
  label: string;
  size: number; // block edge, px
  icon: (iconSize: number) => ReactNode;
}

const TILES: Tile[] = [
  { id: "figma", label: "Figma", size: 96, icon: (s) => <FigmaIcon size={s} /> },
  { id: "claude", label: "Claude", size: 96, icon: (s) => <Simple d={P.claude} fill="#D97757" size={s} /> },
  { id: "chatgpt", label: "ChatGPT", size: 86, icon: (s) => <Simple d={P.openai} fill="#E8ECF3" size={s} /> },
  { id: "antigravity", label: "Google Antigravity", size: 86, icon: (s) => <AntigravityIcon size={s} /> },
  { id: "gemini", label: "Google Gemini", size: 86, icon: (s) => <GeminiIcon size={s} /> },
  { id: "ux", label: "UX Design", size: 78, icon: (s) => <UXIcon size={s} /> },
  { id: "code", label: "Coding", size: 78, icon: (s) => <CodeIcon size={s} /> },
  { id: "cursor", label: "Cursor", size: 86, icon: (s) => <Simple d={P.cursor} fill="#E8ECF3" size={s} /> },
  { id: "adobe", label: "Adobe", size: 78, icon: (s) => <Simple d={P.adobe} fill="#FA0F00" size={s} /> },
  { id: "aidesign", label: "AI Design", size: 78, icon: (s) => <AIDesignIcon size={s} /> },
];

const tileStyle = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: 18,
  background: "linear-gradient(155deg, #1A2234 0%, #10151F 100%)",
  border: "1px solid var(--border-strong)",
  boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/* static scatter used on mobile and for reduced motion */
const STATIC_POS = [
  { x: 22, y: 16, r: -8 },
  { x: 62, y: 10, r: 6 },
  { x: 44, y: 34, r: -3 },
  { x: 13, y: 46, r: 7 },
  { x: 74, y: 38, r: -6 },
  { x: 30, y: 62, r: 4 },
  { x: 58, y: 58, r: -7 },
  { x: 80, y: 68, r: 5 },
  { x: 12, y: 76, r: -4 },
  { x: 45, y: 82, r: 8 },
];

export default function IconPlayground({ interactive = true, tapOnly = false }: { interactive?: boolean; tapOnly?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!interactive) return;
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let cleanup: (() => void) | undefined;

    // physics engine loads lazily so it never blocks first paint
    import("matter-js").then((Matter) => {
      if (destroyed || !container) return;
      const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Sleeping, Query } = Matter;

      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return;

      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;

      /* the ceiling sits at the TOP OF THE HERO, not the top of the band —
         a good toss sends a block sailing up past the headline and back.
         (The container overflows visibly for the same reason.) */
      const heroEl = container.closest("section");
      const rise = Math.max(
        300,
        heroEl ? Math.round(container.getBoundingClientRect().top - heroEl.getBoundingClientRect().top) : 460
      );
      const sideH = H + rise + 280;
      const sideY = (H - rise - 20) / 2;

      const wallOpts = { isStatic: true, friction: 0.2 };
      const walls = [
        Bodies.rectangle(W / 2, H + 60, W + 400, 120, wallOpts), // floor
        Bodies.rectangle(-60, sideY, 120, sideH, wallOpts), // left
        Bodies.rectangle(W + 60, sideY, 120, sideH, wallOpts), // right
        Bodies.rectangle(W / 2, -(rise + 60), W + 400, 120, wallOpts), // ceiling at hero top
      ];
      Composite.add(engine.world, walls);

      // tile bodies drop in from above, staggered — spawn spacing adapts so
      // every tile starts BELOW the ceiling (else it lands on top of it)
      const spawnStep = Math.max(24, Math.min(52, (rise - 90) / TILES.length));
      const bodies = TILES.map((t, i) => {
        const x = W * (0.16 + 0.68 * ((i * 0.618) % 1));
        const y = -40 - i * spawnStep;
        const b = Bodies.rectangle(x, y, t.size, t.size, {
          chamfer: { radius: 17 },
          restitution: 0.38,
          friction: 0.12,
          frictionAir: 0.014,
          angle: (Math.random() - 0.5) * 0.7,
        });
        return b;
      });
      Composite.add(engine.world, bodies);

      let removeTap: (() => void) | undefined;
      if (!tapOnly) {
        // desktop: full drag-and-toss
        const mouse = Mouse.create(container);
        const mc = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.18, damping: 0.12, render: { visible: false } },
        });
        Composite.add(engine.world, mc);
        // matter's mouse eats page scroll; give the wheel back to the page
        const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
        m.element.removeEventListener("wheel", m.mousewheel);
        m.element.removeEventListener("mousewheel", m.mousewheel as EventListener);
        m.element.removeEventListener("DOMMouseScroll", m.mousewheel as EventListener);

        // wake everything when grabbed
        Matter.Events.on(mc, "startdrag", (e: { body?: Matter.Body }) => {
          if (e.body) Sleeping.set(e.body, false);
        });
      } else {
        // touch: no drag constraint (page scroll stays free) — a tap on a
        // block pops it with an upward kick and a spin
        const onTap = (e: PointerEvent) => {
          const r = container.getBoundingClientRect();
          const pt = { x: e.clientX - r.left, y: e.clientY - r.top };
          const hit = Query.point(bodies, pt)[0];
          if (!hit) return;
          Sleeping.set(hit, false);
          Body.applyForce(hit, hit.position, {
            x: (Math.random() - 0.5) * 0.05 * hit.mass,
            y: -(0.05 + Math.random() * 0.035) * hit.mass,
          });
          Body.setAngularVelocity(hit, (Math.random() - 0.5) * 0.35);
        };
        container.addEventListener("pointerdown", onTap);
        removeTap = () => container.removeEventListener("pointerdown", onTap);
      }

      // rAF render loop; physics only steps while the hero is on screen
      // (plain rect check — IntersectionObserver misreports in some
      // embedded/emulated viewports and would freeze the scene)
      let raf = 0;
      let alive = true;
      const sync = () => {
        for (let i = 0; i < bodies.length; i++) {
          const el = tileRefs.current[i];
          const b = bodies[i];
          if (!el) continue;
          el.style.transform = `translate(${b.position.x - TILES[i].size / 2}px, ${b.position.y - TILES[i].size / 2}px) rotate(${b.angle}rad)`;
        }
      };
      const loop = () => {
        if (!alive) return;
        const r = container.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 900;
        if (r.bottom > 0 && r.top < vh) {
          Engine.update(engine, 1000 / 60);
          sync();
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // keep walls honest if the hero resizes
      const ro = new ResizeObserver(() => {
        const w2 = container.clientWidth;
        const h2 = container.clientHeight;
        if (!w2 || !h2) return;
        Body.setPosition(walls[0], { x: w2 / 2, y: h2 + 60 });
        Body.setPosition(walls[2], { x: w2 + 60, y: (h2 - rise - 20) / 2 });
        bodies.forEach((b) => Sleeping.set(b, false));
      });
      ro.observe(container);

      cleanup = () => {
        alive = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        removeTap?.();
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [interactive, tapOnly]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{
        userSelect: "none",
        /* tap mode keeps vertical scrolling free; drag mode owns the pointer */
        touchAction: !interactive ? "auto" : tapOnly ? "pan-y" : "none",
        /* visible: tossed blocks fly up over the hero copy instead of clipping */
        overflow: interactive ? "visible" : "hidden",
      }}
      aria-label={tapOnly ? "Blocks of the tools I work with — tap one to bounce it" : "Draggable blocks of the tools I work with"}
      role="img"
    >
      {TILES.map((t, i) => {
        const iconSize = Math.round(t.size * 0.46);
        const sp = STATIC_POS[i];
        return (
          <div
            key={t.id}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            title={t.label}
            style={{
              position: "absolute",
              ...tileStyle(t.size),
              cursor: !interactive ? "default" : tapOnly ? "pointer" : "grab",
              ...(interactive
                ? { left: 0, top: 0, transform: "translate(-300px, -300px)" } /* offscreen until physics places it */
                : { left: `${sp.x}%`, top: `${sp.y}%`, transform: `rotate(${sp.r}deg)` }),
            }}
          >
            {t.icon(iconSize)}
          </div>
        );
      })}
    </div>
  );
}
