import { Depth } from "./ProjectCard";

/* ──────────────────────────────────────────────────────────────────────────
   THUMBNAILS

   One per project. Each fills its card and uses <Depth> to hold its hero
   element off the card's own plane, so the contents separate as the card
   turns rather than turning with it as a picture would.

   THE DEPTHS ARE A HIERARCHY, NOT A SETTING. Ground at 0, structure at 10 to
   20, the one thing the project is ABOUT at 40 or more. If everything floats,
   nothing does — the parallax between layers is the whole depth cue, so a
   card where every layer shares a z is a flat card with extra steps.

   Nothing here loops. The cards already move when you point at them, and a
   background that animates on its own while four of them sit in a grid is
   four competing timelines with no conductor.
   ────────────────────────────────────────────────────────────────────────── */

/** the ground every thumbnail sits on: a soft vignette so the rounded corner
    never shows a flat fill meeting the border */
function Ground({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`absolute inset-0 ${className}`} />;
}

/* ── 01 · SIGNAL ────────────────────────────────────────────────────────── */
export function SignalThumbnail() {
  /* x / y in percent, and the category each pin belongs to */
  const pins = [
    { x: 22, y: 34, tone: "bg-emerald-400", ring: "ring-emerald-400/40" },
    { x: 38, y: 62, tone: "bg-emerald-400", ring: "ring-emerald-400/40" },
    { x: 52, y: 28, tone: "bg-amber-400", ring: "ring-amber-400/40" },
    { x: 63, y: 52, tone: "bg-emerald-400", ring: "ring-emerald-400/40" },
    { x: 74, y: 33, tone: "bg-amber-400", ring: "ring-amber-400/40" },
    { x: 80, y: 68, tone: "bg-rose-400", ring: "ring-rose-400/40" },
  ];

  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      <Ground className="bg-[radial-gradient(120%_120%_at_30%_20%,#101A2B_0%,#080D16_60%,#05080E_100%)]" />

      {/* the street grid, as two repeating gradients rather than forty divs */}
      <Ground
        className="
          opacity-[0.22]
          [background-image:repeating-linear-gradient(to_right,rgba(255,255,255,0.10)_0_1px,transparent_1px_72px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.10)_0_1px,transparent_1px_72px)]
        "
      />

      {/* one route sweeping through, which is what stops the grid reading as
          graph paper */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 275"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M-10 96 C 80 70, 120 132, 210 112 S 340 60, 410 92"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>

      {/* the pins sit well forward — they are the thing the product IS */}
      <Depth z={44} className="absolute inset-0">
        {pins.map((p, i) => (
          <span
            key={i}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[7px] p-[5px] ring-1 ${p.ring} bg-[#0B1220]/80 backdrop-blur-sm`}
          >
            <span className={`block h-[7px] w-[7px] rounded-[2px] ${p.tone}`} />
          </span>
        ))}
      </Depth>

      {/* the count, nearest of all */}
      <Depth z={62} className="absolute bottom-[12%] left-[7%]">
        <div className="rounded-xl border border-white/10 bg-[#0B1220]/90 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            This week &middot; Fit
          </p>
          <p className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-medium tabular-nums text-white">12</span>
            <span className="text-xs text-white/60">you can make</span>
          </p>
        </div>
      </Depth>
    </div>
  );
}

/* ── 02 · HEADROOM ──────────────────────────────────────────────────────── */
export function HeadroomThumbnail() {
  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      <Ground className="bg-[radial-gradient(120%_120%_at_70%_15%,#0F3A2A_0%,#0A2119_55%,#06110D_100%)]" />
      {/* a soft key light, so the receipt has something to be lit against */}
      <Ground className="bg-[radial-gradient(60%_50%_at_50%_42%,rgba(52,211,153,0.16),transparent_70%)]" />

      <Depth z={52} className="absolute inset-0 grid place-items-center">
        <div className="w-[62%] min-w-[200px] rounded-2xl bg-white p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            Safe to spend
          </p>
          <p className="mt-1 text-[2rem] font-semibold leading-none tracking-tight text-neutral-900 tabular-nums">
            $1,730
          </p>
          <p className="mt-1.5 text-[11px] text-emerald-600 tabular-nums">
            &asymp; $87/day &middot; 20 days
          </p>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-[69%] rounded-full bg-emerald-500" />
          </div>

          <dl className="mt-4 space-y-1.5 text-[11px] tabular-nums">
            <div className="flex justify-between text-neutral-700">
              <dt>Rent</dt>
              <dd className="text-neutral-500">$650</dd>
            </div>
            <div className="flex justify-between text-neutral-700">
              <dt>Wifi</dt>
              <dd className="text-neutral-500">$120</dd>
            </div>
          </dl>
        </div>
      </Depth>
    </div>
  );
}


/* ── 04 · BUMPER ────────────────────────────────────────────────────────── */
export function BumperThumbnail() {
  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      <Ground className="bg-[radial-gradient(120%_120%_at_35%_20%,#0B3A38_0%,#07211F_55%,#041110_100%)]" />
      <Ground className="bg-[radial-gradient(55%_45%_at_50%_45%,rgba(20,184,166,0.16),transparent_72%)]" />

      {/* the page being interrupted, set back so the modal has depth to land in */}
      <Depth z={14} className="absolute inset-0 grid place-items-center">
        <div className="w-[78%] rounded-lg border border-white/10 bg-[#07211F]/70">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
          </div>
          <div className="px-3 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
              checkout.store/cart
            </p>
            <p className="mt-2 text-lg font-medium tabular-nums text-white/70">$89</p>
          </div>
        </div>
      </Depth>

      <Depth z={58} className="absolute inset-x-0 bottom-[14%] grid place-items-center">
        <div className="w-[76%] rounded-xl border border-white/10 bg-[#0D2A27]/95 p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <p className="text-[13px] font-medium leading-snug text-white">
            Wait. Do you need this, or do you want it?
          </p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md bg-teal-400 px-3 py-1.5 text-[11px] font-medium text-[#04211F]">
              Sleep on it
            </span>
            <span className="rounded-md border border-white/15 px-3 py-1.5 text-[11px] text-white/70">
              Buy anyway
            </span>
          </div>
        </div>
      </Depth>
    </div>
  );
}
