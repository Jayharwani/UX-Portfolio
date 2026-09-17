import type { ReactNode } from "react";
import { ProjectCard3D } from "./ProjectCard";
import {
  BumperThumbnail,
  ChronoWeaveThumbnail,
  HeadroomThumbnail,
  SignalThumbnail,
} from "./ProjectThumbnails";

/* ──────────────────────────────────────────────────────────────────────────
   CASE STUDIES

   Four cards, one perspective.

   THE PERSPECTIVE LIVES ON THE GRID, NOT ON THE CARDS, and that is the one
   structural decision in this file. Perspective on each card gives every
   card its own vanishing point at its own centre: they all tilt toward their
   own middles and the grid reads as four unrelated skews. One perspective on
   the container means all four share a viewer, so the card on the right
   leans differently from the card on the left in the way objects on a desk
   do. It is the difference between a 3D effect and a 3D space.

   1200px is a long lens. Shorter values (600 and below) exaggerate the
   convergence and start to read as a fisheye on anything card-sized.
   ────────────────────────────────────────────────────────────────────────── */

export interface Project {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  thumbnail: ReactNode;
}

export const PROJECTS: Project[] = [
  {
    slug: "signal",
    number: "01",
    title: "Signal",
    description: "A live map of DMV tech events.",
    href: "/signal",
    accent: "#1F9D55",
    thumbnail: <SignalThumbnail />,
  },
  {
    slug: "headroom",
    number: "02",
    title: "Headroom",
    description: "Can I spend this, right now?",
    href: "/headroom",
    accent: "#34D399",
    thumbnail: <HeadroomThumbnail />,
  },
  {
    slug: "chronoweave",
    number: "03",
    title: "ChronoWeave",
    description: "Helping people with ADHD feel time pass.",
    href: "/chronoweave",
    accent: "#A78BFA",
    thumbnail: <ChronoWeaveThumbnail />,
  },
  {
    slug: "bumper",
    number: "04",
    title: "Bumper",
    description: "Catches impulse buys before you regret them.",
    href: "/bumper",
    accent: "#14B8A6",
    thumbnail: <BumperThumbnail />,
  },
];

export function CaseStudiesSection({ projects = PROJECTS }: { projects?: Project[] }) {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative w-full px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <header className="mb-14 sm:mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Selected work
          </span>
          <h2 className="mt-4 max-w-[18ch] text-3xl font-medium leading-[1.06] tracking-tight text-white sm:text-5xl">
            I design interfaces that get out of the way.
          </h2>
        </header>

        {/* ONE perspective, shared by all four. See the note above. */}
        <div
          style={{ perspective: "1200px" }}
          className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12"
        >
          {projects.map((p) => (
            <ProjectCard3D
              key={p.slug}
              number={p.number}
              title={p.title}
              description={p.description}
              href={p.href}
              accent={p.accent}
            >
              {p.thumbnail}
            </ProjectCard3D>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudiesSection;
