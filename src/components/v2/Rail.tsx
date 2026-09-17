import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   RAIL — SPEC §7, BUILD step 4.

   Four markers on the right edge tracking the active section. The active one
   extends its line and takes the current accent. Also navigation.

   IT SETS THE PAGE HUE. Every section except Work owns a colour; Work is
   excluded because the work list sets the accent per hovered project and the
   two would fight for it. That exclusion is in the reference and is the only
   reason the accent does not flicker as you scroll through the list.

   OBSERVER PLUS A FAILSAFE. CLAUDE.md requires IntersectionObserver for
   reveals rather than scroll listeners. It is used, and it is also backed by
   a timer: if nothing has reported in three seconds the first marker lights
   anyway. An observer that never speaks is a rail with nothing active, and
   this codebase has been caught by exactly that before.
   -------------------------------------------------------------------------- */

const SECTIONS = [
  { id: "hero", label: "INTRO", hue: [95, 216, 164] as const },
  { id: "route", label: "ROUTE", hue: [233, 197, 139] as const },
  { id: "work", label: "WORK", hue: null },
  { id: "end", label: "CONTACT", hue: [95, 211, 216] as const },
];

export function Rail({ onHue }: { onHue?: (rgb: [number, number, number]) => void }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let spoke = false;
    const obs = SECTIONS.map(({ id, hue }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            spoke = true;
            setActive(id);
            /* Work is deliberately excluded: its list drives the accent per
               hovered project, and two owners would flicker. */
            if (hue && onHue) onHue([...hue] as [number, number, number]);
          }
        },
        { threshold: 0.35 }
      );
      io.observe(el);
      return io;
    });

    const failsafe = window.setTimeout(() => {
      if (!spoke) setActive("hero");
    }, 3000);

    return () => {
      obs.forEach((io) => io?.disconnect());
      window.clearTimeout(failsafe);
    };
  }, [onHue]);

  return (
    <nav id="rail" aria-label="Sections">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : undefined}>
          <span>{s.label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}
