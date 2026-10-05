import { useEffect } from "react";
import { Dots } from "./dots/Dots";
import type { DotsOptions } from "./dots/engine";
import "../styles/friction.css";

/* --------------------------------------------------------------------------
   A scratch page for the dot engine.

   The brief is explicit that this decides whether the case study works, and
   that nothing should be placed on the page until the presets are right on
   their own. This route exists to judge them in isolation; it is not linked
   from anywhere and is disallowed in robots.txt alongside /cards.
   -------------------------------------------------------------------------- */

const CELLS: Array<DotsOptions & { title: string; note: string; label: string }> = [
  { preset: "field", title: "Field", note: "Ten thousand complaints exist.", count: 9994, label: "A dense field of ten thousand dim dots, drifting slowly." },
  { preset: "highlight", title: "Highlight", note: "Twenty-five of them get read.", count: 9994, keep: 25, duration: 2.2, label: "The same field, with twenty-five dots lit to full brightness." },
  { preset: "filter", title: "Filter", note: "9,994 → 3,319 → 150.", count: 6000, bands: [0.332, 0.015], duration: 2.4, label: "Dots falling through three narrowing bands; most fall away." },
  { preset: "cluster", title: "Cluster", note: "Survivors fuse into challenges.", count: 900, groups: [44, 31, 24, 19, 14, 10], duration: 2, label: "Scattered dots converging into six clusters of different densities." },
  { preset: "fan", title: "Fan", note: "Four ways to use one complaint.", count: 680, groups: [1, 1, 1, 1], duration: 1.6, label: "One cluster splitting into four, each taking a different hue." },
  { preset: "grid", title: "Grid", note: "The same complaint across six apps.", count: 820, groups: [1, 1, 1, 1, 1, 1], duration: 1.8, label: "Six small clusters arranged in a row." },
];

export function DotsLab() {
  useEffect(() => {
    document.title = "Dot engine — scratch";
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0f131b";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <div className="fr">
      <div className="lab">
        <h1>Dot engine</h1>
        <p>
          One dot is one review. Six presets on one engine, each playing once on
          sight and holding. Scratch page — not linked, not indexed.
        </p>

        {CELLS.map((c) => (
          <section className="cell" key={c.preset}>
            <div className="head">
              <b>{c.title}</b>
              <span>{c.note}</span>
              <span className="label" style={{ marginLeft: "auto" }}>
                {c.count ? `${c.count.toLocaleString()} DOTS` : ""}
              </span>
            </div>
            <div className="stage">
              <Dots {...c} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default DotsLab;
