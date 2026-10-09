import type { MutableRefObject } from "react";
import { ISSUES } from "../../data/issues";
import { EmblemSlot, type EmblemHandle } from "./EmblemSlot";

/* --------------------------------------------------------------------------
   THE COVER.

   THE HEADLINE IS PAINTED AT FULL OPACITY ON THE FIRST FRAME, and that is a
   performance decision, not a typographic one. web.dev excludes elements at
   opacity 0 from Largest Contentful Paint, and an <svg> is not a candidate at
   all, so the old plotter hero could never be the LCP element however fast it
   drew. Real HTML text, visible immediately, is the only version of this that
   measures well. The intro covers it with a veil instead of hiding it.

   The register snap behind line one is an aria-hidden accent copy at an
   offset that collapses to zero. A print register mark is two plates that do
   not quite line up until they do, and the headline is "Designs it. Then
   ships it.": the design and the build landing on each other is the whole
   claim. Line two stays outlined because the outline is this site's word for
   the half that is not built yet.

   The evidence strip is four real anchors to the four issues. It is the
   fastest proof the page owns, and a recruiter skimming for project names
   finds them above the fold without scrolling or waiting for anything.
   -------------------------------------------------------------------------- */

const ISSUE_STAMP = typeof __ISSUE__ === "string" ? __ISSUE__ : "2026.10";

export function Cover({ handle, full }: { handle: MutableRefObject<EmblemHandle>; full: boolean }) {
  return (
    <section className="pr-cover" id="hero">
      <div className="pr-masthead">
        <span className="pr-wordmark">Jay Harwani</span>
        <span className="mono pr-issue-no">Issue {ISSUE_STAMP} · Baltimore</span>
      </div>

      <div className="pr-cover-body">
        <h1 className="pr-display">
          <span className="pr-l1">
            <span className="pr-snap" aria-hidden="true">
              Designs it.
            </span>
            <span className="pr-l1-ink">Designs it.</span>
          </span>
          {/* Split into characters here, in the render, rather than by walking
              the DOM after mount. Contact.tsx learned this the hard way: a
              script-side split re-runs on every render and fights
              reconciliation, and GSAP's SplitText would need a revert() that
              has to survive a skipped intro. Rendering the spans in the first
              place makes the problem not exist. The word is read once, from
              the visually hidden copy. */}
          <span className="pr-l2">
            <span className="vh-word">Then ships it.</span>
            {"Then ships it.".split("").map((ch, i) => (
              <span className="pr-ch" key={i} aria-hidden="true">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </h1>

        <EmblemSlot handle={handle} full={full} />
      </div>

      <p className="pr-byline">Jay Harwani, product designer who writes the front end.</p>

      <div className="pr-evidence">
        <span className="mono pr-evidence-label">Four products, all live</span>
        <ul className="pr-chips">
          {ISSUES.map((issue) => (
            <li key={issue.key}>
              <a href={`#issue-${issue.key}`} data-accent={issue.accent}>
                <i aria-hidden="true" />
                {issue.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pr-hemline">
        <span className="pr-open">
          <i aria-hidden="true" />
          Open to product design roles
        </span>
        <span className="mono pr-scroll-cue">Scroll</span>
      </div>
    </section>
  );
}
