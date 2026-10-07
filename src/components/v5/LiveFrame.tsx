import type { ReactNode } from "react";
import type { FlagshipProject } from "../../content/home";

/* --------------------------------------------------------------------------
   THE FRAME — a browser or a phone, holding one screen in two states.

   THE SAME MARKUP IS RENDERED TWICE. The spec layer is not a second drawing
   of the screen, it is the screen's own tree with `wire` set: text becomes a
   6px bar, a filled block becomes dashed paper, colour drops out. Two
   drawings would be two things to keep in step, and they would stop matching
   the first time a preview changed. One tree cannot drift from itself.

   Previews are visual only: aria-hidden and inert, with no focusable child.
   Every fact a frame shows is also written as text in the project copy
   beside it, so nothing is lost by hiding them (§10.1).
   -------------------------------------------------------------------------- */

/* React 18's DOM typings predate `inert`, but the attribute itself is what
   keeps a preview out of the tab order and the accessibility tree, so it is
   spread in rather than dropped. React 19 types it properly. */
const INERT = { inert: "" } as unknown as { inert?: boolean };

export function LiveFrame({
  project,
  children,
}: {
  project: FlagshipProject;
  children: (wire: boolean) => ReactNode;
}) {
  const domain = new URL(project.liveHref).host;

  return (
    <div className="frame" data-kind={project.frame}>
      <div className="frame-body">
        {project.frame === "browser" ? (
          <div className="chrome" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="url">{domain}</span>
          </div>
        ) : null}

        <div className="screen">
          {/* the spec: the same screen as a wireframe, over a dot grid */}
          <div className="layer-spec" aria-hidden="true" {...INERT}>
            <div className="dots" />
            {children(true)}
          </div>

          {/* shipped: the real component, in the product's own colour */}
          <div className="layer-live" aria-hidden="true" {...INERT}>
            {children(false)}
          </div>

          <i className="scanline" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

/* ── the pieces a preview is built from ───────────────────────────────────
   Each one knows how to be itself and how to be its own wireframe, so a
   preview never has to say which layer it is in. */

/** a line of text; a 6px --line bar in the spec state */
export function T({
  wire,
  children,
  w,
  className = "",
  ...rest
}: {
  wire: boolean;
  /** absent where the live layer is a bar too, like a cart line */
  children?: ReactNode;
  /** bar width, as a percentage of its box */
  w?: number;
  className?: string;
  [key: string]: unknown;
}) {
  if (wire) return <i className={`pv-bar ${className}`} style={{ width: `${w ?? 60}%` }} />;
  return (
    <span className={`pv-t ${className}`} {...rest}>
      {children}
    </span>
  );
}

/** a filled area: paper with a dashed outline in the spec state */
export function Block({
  wire,
  children,
  className = "",
  ...rest
}: {
  wire: boolean;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <div className={`pv-block ${className}`} data-wire={wire || undefined} {...rest}>
      {wire ? null : children}
    </div>
  );
}
