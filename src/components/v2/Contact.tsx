import { CONTACT, CREDITS } from "../../data/projects";
import { useReveal } from "./useReveal";

/* --------------------------------------------------------------------------
   CONTACT — SPEC §7, BUILD step 7.

   Two large links. On hover each word rolls over letter by letter: every
   character carries a duplicate stacked beneath it, the top rolls up and the
   accent copy rolls in, staggered 26ms. An arrow leaves up-right while a
   second enters from below-left inside a clipped box.

   THE SPLIT IS RENDERED, NOT SCRIPTED. The reference walks the DOM after load
   and rewrites textContent into spans. Doing that in React would fight
   reconciliation and re-split on every render — BUILD step 7 flags exactly
   that ("splitting runs once, not on every render"). Rendering the spans in
   the first place makes the problem not exist.

   THE WORD IS READ ONCE. The visible characters are aria-hidden and the real
   word sits in a visually-hidden span, so a screen reader hears "Email", not
   "E m a i l" twice over.

   No GitHub link. That is deliberate and it is in the spec: Jay is a designer.
   -------------------------------------------------------------------------- */

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

function Word({ text }: { text: string }) {
  return (
    <span className="w">
      <span className="vh-word">{text}</span>
      {text.split("").map((ch, i) => (
        <span className="ch" key={i} style={{ ["--d" as string]: `${i * 26}ms` }} aria-hidden="true">
          <b>{ch === " " ? " " : ch}</b>
          <b>{ch === " " ? " " : ch}</b>
        </span>
      ))}
    </span>
  );
}

/** up to 22px of pull toward the cursor, per SPEC */
function magnetise(e: React.PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--dx", `${((e.clientX - (r.left + r.width / 2)) / r.width) * 22}px`);
  e.currentTarget.style.setProperty("--dy", `${((e.clientY - (r.top + r.height / 2)) / r.height) * 22 * 0.6}px`);
}
function demagnetise(e: React.PointerEvent<HTMLAnchorElement>) {
  e.currentTarget.style.setProperty("--dx", "0px");
  e.currentTarget.style.setProperty("--dy", "0px");
}

export function Contact() {
  /* `in` drives the headline: .bigline .ln>span sits at translateY(115%)
     inside a clipped line box until `section.in` lifts it. Without a reveal
     the whole line is not dim, it is absent. `rv` does the same for the
     eyebrow above it. */
  const [section, revealed] = useReveal<HTMLElement>();

  return (
    <section className={`end${revealed ? " v2rv in" : ""}`} id="end" ref={section}>
      <div className="eyebrow">
        <span>AVAILABLE NOW</span>
      </div>

      <h2 className="bigline">
        <span className="ln">
          <span>Let&rsquo;s build</span>
        </span>
        <span className="ln">
          <span>something.</span>
        </span>
      </h2>

      <div className="links">
        <a
          className="lk"
          href={`mailto:${CONTACT.email}`}
          onPointerMove={magnetise}
          onPointerLeave={demagnetise}
        >
          <span className="row">
            <Word text="Email" />
            <span className="arw" aria-hidden="true">
              {ARROW}
              {ARROW}
            </span>
          </span>
          <span className="meta">{CONTACT.email}</span>
          <i className="ul" />
        </a>

        <a
          className="lk"
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onPointerMove={magnetise}
          onPointerLeave={demagnetise}
        >
          <span className="row">
            <Word text="LinkedIn" />
            <span className="arw" aria-hidden="true">
              {ARROW}
              {ARROW}
            </span>
          </span>
          <span className="meta">{CONTACT.linkedinLabel}</span>
          <i className="ul" />
        </a>
      </div>

      <div className="credits">
        {CREDITS.map(([role, value]) => (
          <div key={role}>
            {role} <b>{value}</b>
          </div>
        ))}
      </div>

      <div className="v2foot">
        <span>Jay Harwani</span>
        <span className="mono" style={{ marginLeft: "auto" }}>
          2026
        </span>
      </div>
    </section>
  );
}
