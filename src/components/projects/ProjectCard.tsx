import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   PROJECTCARD3D

   A card that leans toward the cursor, catches a light as it does, and holds
   its contents at different depths so they separate as it turns.

   THREE THINGS HAVE TO BE TRUE FOR THE 3D TO BE REAL rather than a skew:

     · the PARENT owns the perspective, not the card. Perspective on the
       element itself gives every card its own vanishing point at its own
       centre, and a grid of those reads as four unrelated skews. One
       perspective on the grid means all four cards share a viewer.
     · the card sets transform-style: preserve-3d, or its children are
       flattened into the card's plane before it rotates and translateZ does
       nothing at all.
     · the children that should float need a real translateZ. Depth is
       parallax, and parallax needs distance.

   THE POINTER IS TRACKED IN NORMALISED SPACE (0..1 across the card) rather
   than in pixels, so every mapping below is independent of how big the card
   turns out to be and nothing needs remeasuring on resize.

   REDUCED MOTION GETS A FLAT CARD. Not a gentler tilt: a 3D surface that
   moves under the cursor is the entire effect, so the honest reduced version
   is a card that does not move. The hover border and the link still work.
   ────────────────────────────────────────────────────────────────────────── */

/** degrees at full deflection. Past about 15 the card stops reading as a
    surface catching light and starts reading as a page turning. */
const MAX_TILT = 12;

/** How far the foreground layer floats above the card's own plane. The
    THUMBNAIL decides which of its parts use it; this is only the ceiling. */
export const CARD_DEPTH = 48;

/** Heavy and unbouncy on purpose. Stiffness alone makes a card snappy;
    stiffness with damping this high makes it feel like it has mass. */
const SPRING = { stiffness: 150, damping: 20, mass: 0.6 } as const;

/** +1 leans the card toward the cursor. Flip to -1 for the other convention. */
const TILT_DIR = 1;

export interface ProjectCard3DProps {
  /** "01" — typography, not a number, so it keeps its leading zero */
  number: string;
  title: string;
  description: string;
  href: string;
  /** the thumbnail; anything inside can use translateZ to float */
  children: ReactNode;
  /** hex or css colour that tints the glare and the hover border */
  accent?: string;
  className?: string;
}

export function ProjectCard3D({
  number,
  title,
  description,
  href,
  children,
  accent = "#ffffff",
  className = "",
}: ProjectCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* pointer position across the card, 0..1, and how "lifted" it is */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lift = useMotionValue(0);

  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const sl = useSpring(lift, SPRING);

  const rotateY = useTransform(sx, [0, 1], [MAX_TILT * TILT_DIR, -MAX_TILT * TILT_DIR]);
  const rotateX = useTransform(sy, [0, 1], [-MAX_TILT * TILT_DIR, MAX_TILT * TILT_DIR]);

  /* The glare is one radial gradient whose CENTRE is the cursor. Because the
     card is also rotating under it, the highlight slides across the surface
     rather than sitting on it, which is the whole illusion. */
  const gx = useTransform(sx, (v) => `${(v * 100).toFixed(2)}%`);
  const gy = useTransform(sy, (v) => `${(v * 100).toFixed(2)}%`);
  const glare = useMotionTemplate`radial-gradient(28rem circle at ${gx} ${gy}, ${accent}22, transparent 62%)`;
  const glareOpacity = useTransform(sl, [0, 1], [0, 1]);

  /* the whole card lifts a little toward the viewer on hover, which is what
     stops the tilt reading as the card being pushed INTO the page */
  const z = useTransform(sl, [0, 1], [0, 14]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    px.set((e.clientX - b.left) / b.width);
    py.set((e.clientY - b.top) / b.height);
  };

  const onEnter = () => {
    if (!reduce) lift.set(1);
  };

  /* Returning the pointer to the centre on leave, rather than leaving it
     wherever it exited, is why the card settles level instead of holding a
     lean nobody is pointing at. */
  const onLeave = () => {
    lift.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={`group relative ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, z, transformStyle: "preserve-3d" }}
        className="
          relative w-full overflow-hidden rounded-2xl
          border border-white/10 bg-white/[0.02] backdrop-blur-xl
          transition-colors duration-500 ease-out
          group-hover:border-white/20
          [transform-style:preserve-3d]
        "
      >
        {/* the thumbnail. aspect-ratio rather than a fixed height, so four
            cards line up at every width without a media query. */}
        <div className="relative aspect-[16/11] w-full [transform-style:preserve-3d]">
          {children}

          {/* ── the glare ──
              pointer-events-none is not optional: a full-bleed overlay that
              accepts the pointer would swallow every move event the card
              needs to track, and the tilt would die the moment the cursor
              crossed onto it. */}
          <motion.div
            aria-hidden="true"
            style={{ backgroundImage: glare, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-plus-lighter transition-opacity duration-300"
          />

          {/* a hairline inner edge, so the rounded corner reads as glass with
              a thickness rather than as a clipped rectangle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-white/10"
          />
        </div>

        {/* ── the caption ──
            Deliberately NOT floated. The thumbnail is the thing performing;
            type that pitches and yaws with it is type you have to read at an
            angle. It stays on the card's own plane and reacts only in colour
            and in the rule beneath it. */}
        <div className="relative z-10 flex flex-col gap-2 p-6 sm:p-7">
          <span className="font-mono text-xs tracking-[0.18em] text-white/40 tabular-nums">
            {number}
          </span>

          <h3 className="text-2xl font-medium tracking-tight text-white sm:text-[1.75rem]">
            {title}
          </h3>

          {/* one rule, drawn from the left on hover, in the project's colour */}
          <span
            aria-hidden="true"
            style={{ backgroundColor: accent }}
            className="h-px w-full origin-left scale-x-0 opacity-70 transition-transform duration-700 ease-out group-hover:scale-x-100"
          />

          <p className="max-w-[46ch] text-sm leading-relaxed text-white/50">{description}</p>

          <span className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 group-hover:text-white">
            View case
            <span className="transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">
              &#8599;
            </span>
          </span>
        </div>

        {/* ── the hit target ──
            One link covering the card, above everything, so the whole surface
            is clickable and there is exactly ONE thing in the tab order per
            card. The caption above is not a link; this is. */}
        <Link
          to={href}
          aria-label={`Open the ${title} case study`}
          className="absolute inset-0 z-30 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        />
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DEPTH

   Wrap anything inside a thumbnail to float it above the card's plane.
   Requires every ancestor up to the tilting element to preserve-3d, which
   ProjectCard3D and the thumbnails below all do.
   ────────────────────────────────────────────────────────────────────────── */
export function Depth({
  z = 24,
  className = "",
  children,
}: {
  z?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ transform: `translateZ(${z}px)` }}
      className={`[transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
}

export default ProjectCard3D;
