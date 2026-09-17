import { useScene } from "./useScene";

/* --------------------------------------------------------------------------
   THE COVERAGE GAP — Signal's signature, CASES.md §3.

   Signal's reason to exist is one sentence in the case study: "Baltimore gets
   quietly dropped from almost every regional list." A page can print that, or
   it can draw the region and let the reader watch the drop happen — DC lights,
   Northern Virginia lights, and then a pause before the third metro arrives.

   THIS IS A DIAGRAM, NOT DATA. The three nodes sit in their true relative
   positions (Baltimore north-east of DC, Northern Virginia south-west) and
   nothing here claims an event count. Scattering invented dots across the
   region would make a better-looking graphic and a worse case study, and
   PRODUCT.md is explicit that this portfolio trades on specific, real claims.
   -------------------------------------------------------------------------- */

const NODES = [
  /* dy keeps the two southern labels off each other — they sit eight
     kilometres apart on the real map and their type collides at this scale */
  { id: "nova", x: 33, y: 52, label: "NORTHERN VIRGINIA", at: 0.3, dy: 7.5 },
  { id: "dc", x: 46, y: 44, label: "WASHINGTON DC", at: 0.18, dy: -6.5 },
  { id: "bmore", x: 72, y: 20, label: "BALTIMORE", at: 0.62, dy: -6.5, late: true },
];

export function Coverage() {
  const ref = useScene<HTMLDivElement>();

  return (
    <div className="sg-gap" ref={ref}>
      <svg viewBox="0 0 100 70" role="img" aria-label="Schematic of the DMV region: Washington DC and Northern Virginia, with Baltimore to the north-east.">
        <defs>
          <pattern id="sgGrid" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.6" r="0.35" fill="rgba(238,241,245,.12)" />
          </pattern>
        </defs>
        <rect width="100" height="70" fill="url(#sgGrid)" />

        {/* the corridor the incumbents cover */}
        <path className="sg-link a" d="M33 52 L46 44" />
        {/* the leg they drop */}
        <path className="sg-link b" d="M46 44 L72 20" />

        {NODES.map((n) => (
          <g
            key={n.id}
            className={`sg-node${n.late ? " late" : ""}`}
            style={{ ["--at" as string]: n.at }}
          >
            <circle className="halo" cx={n.x} cy={n.y} r="7" />
            <circle className="dot" cx={n.x} cy={n.y} r="2.1" />
            <text x={n.x} y={n.y + n.dy} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      <p className="sg-gap-cap mono">
        <span>EVERY REGIONAL LIST COVERS THE FIRST TWO.</span>
        <b>SIGNAL COVERS THE THIRD.</b>
      </p>
    </div>
  );
}
