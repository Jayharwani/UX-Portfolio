/* ──────────────────────────────────────────────────────────────────────────
   The toolchain, as marks.

   Nine tool names set as running text was the second half of what made that
   band read as a wall of words. Marks say the same thing in a glance and, at
   a single ink colour and one optical size, read as a considered set rather
   than a sponsor wall — which is the failure mode of every portfolio that
   pastes nine coloured logos in a row.

   Drawn here rather than imported, for three reasons: no dependency, no
   network request, and the whole set inherits currentColor so it sits on the
   stone band today and would sit on ink tomorrow without a second asset.

   Each mark is built in a 24-unit box on its own geometry — logos are
   silhouettes at this size, so construction beats tracing. Every one carries
   a <title>, which is what a screen reader reads and what a hover shows, so
   nothing here depends on recognising a shape.
   ────────────────────────────────────────────────────────────────────────── */

function Mark({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <svg className="tool" viewBox="0 0 24 24" role="img" aria-label={name}>
      <title>{name}</title>
      {children}
    </svg>
  );
}

/* Figma: five shapes on a 2-wide, 3-tall grid — three half-pills down the
   left, one down the right, and the circle that makes it unmistakable. */
const Figma = (
  <Mark name="Figma">
    <g fill="currentColor" transform="translate(12 12) scale(0.94) translate(-12 -12)">
      <path d="M12 0H8a4 4 0 0 0 0 8h4z" />
      <path d="M12 0h4a4 4 0 0 1 0 8h-4z" />
      <path d="M12 8H8a4 4 0 0 0 0 8h4z" />
      <path d="M12 16H8a4 4 0 0 0 0 8h4z" />
      <circle cx="16" cy="12" r="4" />
    </g>
  </Mark>
);

/* React: the nucleus and three orbits at 60 degrees. */
const React_ = (
  <Mark name="React">
    <circle cx="12" cy="12" r="2.05" fill="currentColor" />
    <g fill="none" stroke="currentColor" strokeWidth="1.05">
      <ellipse cx="12" cy="12" rx="10.6" ry="4.1" />
      <ellipse cx="12" cy="12" rx="10.6" ry="4.1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10.6" ry="4.1" transform="rotate(120 12 12)" />
    </g>
  </Mark>
);

/* TypeScript: the tile and its two letters. */
const TypeScript = (
  <Mark name="TypeScript">
    <rect x="1.1" y="1.1" width="21.8" height="21.8" rx="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M5.2 9.4h5.1M7.75 9.4v8.2" />
      <path d="M18.6 10.2a2.9 2.9 0 0 0-4.6.6c-.6 1.5.8 2.4 2.1 2.9s2.7 1.4 2.1 2.9a2.9 2.9 0 0 1-4.6.6" />
    </g>
  </Mark>
);

/* Tailwind: the two waves. */
const Tailwind = (
  <Mark name="Tailwind CSS">
    <path
      transform="translate(12 12) scale(1.22) translate(-12 -12)"
      fill="currentColor"
      d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.39 10.85 14.53 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"
    />
  </Mark>
);

/* three.js: a tetrahedron, wireframe — the thing the library draws. */
const Three = (
  <Mark name="three.js">
    <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 2.2 22 20.4H2z" strokeWidth="1.45" />
      <path d="M12 2.2v10.4M12 12.6 2 20.4M12 12.6l10 7.8" strokeWidth="1.05" opacity="0.62" />
    </g>
  </Mark>
);

/* GSAP: an ease curve with its two control handles — what the library is
   actually for, and the one diagram every motion designer reads instantly. */
const Gsap = (
  <Mark name="GSAP">
    <rect x="1.1" y="1.1" width="21.8" height="21.8" rx="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M5.4 18.6C10 18.6 10.4 5.4 18.6 5.4" strokeWidth="1.8" />
      <circle cx="5.4" cy="18.6" r="1.25" strokeWidth="1.1" opacity="0.65" />
      <circle cx="18.6" cy="5.4" r="1.25" strokeWidth="1.1" opacity="0.65" />
    </g>
  </Mark>
);

/* Claude: the burst. Eleven rays, alternating length, which is what keeps it
   from reading as a plain asterisk. */
const Claude = (
  <Mark name="Claude">
    <g stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      {Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
        const r1 = i % 2 ? 8.6 : 10.4;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 2.1}
            y1={12 + Math.sin(a) * 2.1}
            x2={12 + Math.cos(a) * r1}
            y2={12 + Math.sin(a) * r1}
          />
        );
      })}
    </g>
  </Mark>
);

/* Cursor. */
const Cursor = (
  <Mark name="Cursor">
    <path
      fill="currentColor"
      d="M6 2.6 6 19.1l3.9-3.7 2.5 5.8 2.7-1.2-2.5-5.6h5.3z"
    />
  </Mark>
);

/* Adobe: two wedges and the centre chevron. */
const Adobe = (
  <Mark name="Adobe Creative Cloud">
    <g fill="currentColor">
      <path d="M9.5 1.7H1.4v20.6z" />
      <path d="M14.5 1.7h8.1v20.6z" />
      <path d="M14.2 22.3l-1.75-4.4H8.7L12.6 8.6z" />
    </g>
  </Mark>
);

/* A list, so the row is a set to a screen reader rather than nine loose
   images, and static children so no key bookkeeping is needed. */
export function ToolRow() {
  return (
    <ul className="toolrow" aria-label="Tools">
      <li>{Figma}</li>
      <li>{React_}</li>
      <li>{TypeScript}</li>
      <li>{Tailwind}</li>
      <li>{Three}</li>
      <li>{Gsap}</li>
      <li>{Claude}</li>
      <li>{Cursor}</li>
      <li>{Adobe}</li>
    </ul>
  );
}
