/* Dev-only. Renders all four shapes side by side so they can be judged
   against each other before any of this reaches the page. Never listed in
   rollupOptions.input, so it is not in the production build.

   ?p=0.5 freezes every cell mid-morph from rest, which is how the transition
   itself gets looked at rather than only its two ends. */
import { createField } from "../src/lib/pointField";
import type { ShapeName } from "../src/lib/shapes";

const PAPER = "#EEF1F5";
const p = Number(new URLSearchParams(location.search).get("p") ?? "1");

for (const cell of document.querySelectorAll<HTMLElement>(".cell")) {
  const canvas = cell.querySelector("canvas")!;
  const shape = cell.dataset.shape as ShapeName;
  const field = createField(canvas, PAPER, cell.dataset.accent!);

  field.morph("rest", shape, p);

  let last = performance.now();
  const frame = (now: number) => {
    field.tick((now - last) / 1000);
    last = now;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  window.addEventListener("resize", field.resize);
}
