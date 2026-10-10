import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { setFieldTarget } from "./ResolveField";
import { CONTACT, CREDITS } from "../../data/projects";
import { TOKENS, type Accent } from "../../styles/tokens";

/* --------------------------------------------------------------------------
   REACH — the last section.

   Two ways to get hold of Jay, as the only two things on the page you are
   asked to press. They are real anchors with real hrefs: the 3D is what they
   look like, not what they are, so middle-click, cmd-click, tab and a screen
   reader all behave exactly as they would on any link.

   THE BUTTONS ARE NOT THE EFFECT. The effect is that the lattice behind them
   answers. Hovering Email gathers the whole field into one stream leaving the
   frame, which is what sending is; hovering LinkedIn gathers it into clusters
   around hubs, which is what a network is. The button tilts and its layers
   separate, but if that were all it did it would be a nice button on a page
   that happened to have a point cloud on it, and the point of this page is
   that there is only one object and everything is made of it.

   THE TILT IS REAL 3D, NOT A SHADOW. Each tile has a back plate sitting
   behind it in Z, inside a container with perspective, so the parallax
   between the plate and the face is genuine depth rather than a drawn
   highlight. It leans toward the pointer and settles back on leave.

   Transform and opacity only, and both are on the compositor.
   -------------------------------------------------------------------------- */

/** how far the tile leans, in degrees */
const TILT = 11;

type Target = Parameters<typeof setFieldTarget>[0];

function ReachButton({
  href,
  label,
  detail,
  accent,
  field,
  external,
  icon,
}: {
  href: string;
  label: string;
  detail: string;
  accent: Accent;
  field: Target;
  external?: boolean;
  icon: React.ReactNode;
}) {
  const tile = useRef<HTMLAnchorElement>(null);

  const lean = useCallback((e: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = tile.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    /* written straight to the element rather than through a custom property
       on a parent: a variable on the container would recalculate styles for
       every child on every pointer move */
    el.style.setProperty("--rx", `${(-ny * TILT).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(nx * TILT).toFixed(2)}deg`);
  }, []);

  const settle = useCallback(() => {
    const el = tile.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setFieldTarget(null);
  }, []);

  const take = useCallback(() => setFieldTarget(field, TOKENS[accent]), [field, accent]);

  return (
    <a
      className="rs-reach-btn"
      ref={tile}
      href={href}
      data-accent={accent}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={lean}
      onPointerEnter={take}
      onPointerLeave={settle}
      onFocus={take}
      onBlur={settle}
    >
      {/* the plate that sits behind the face and separates on hover */}
      <span className="rs-reach-plate" aria-hidden="true" />

      <span className="rs-reach-face">
        <span className="rs-reach-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="rs-reach-label">
          {label}
          <ArrowUpRight className="rs-reach-arrow" aria-hidden="true" strokeWidth={1.6} />
        </span>
        <span className="mono rs-reach-detail">{detail}</span>
        {external ? <span className="vh-word"> opens in a new tab</span> : null}
      </span>
    </a>
  );
}

export function Reach() {
  return (
    <section className="rs-reach rs-stop" id="end">
      <p className="mono rs-eyebrow">Available now</p>
      <h2 className="rs-reach-title">
        Let&rsquo;s build
        <br />
        something.
      </h2>

      <div className="rs-reach-row">
        <ReachButton
          href={`mailto:${CONTACT.email}`}
          label="Email"
          detail={CONTACT.email}
          accent="headroom"
          field="sent"
          icon={<Mail strokeWidth={1.25} />}
        />
        <ReachButton
          href={CONTACT.linkedin}
          label="LinkedIn"
          detail={CONTACT.linkedinLabel}
          accent="signal"
          field="network"
          external
          icon={<Linkedin strokeWidth={1.25} />}
        />
      </div>

      <div className="rs-credits">
        {CREDITS.map(([role, value]) => (
          <div key={role}>
            <span className="mono">{role}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>

      <div className="rs-colophon">
        <span>Jay Harwani</span>
        <span className="mono">2026</span>
      </div>
    </section>
  );
}
