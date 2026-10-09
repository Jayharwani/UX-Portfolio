/* Writes src/assets/emblems/<key>.svg from specs.mjs. Dev only, never shipped.
   Run: node scripts/emblems/build.mjs */
import { mkdirSync, writeFileSync } from "node:fs";
import { EMBLEMS, PICKS, KEYS } from "./specs.mjs";

const OUT = "src/assets/emblems";
mkdirSync(OUT, { recursive: true });

for (const key of KEYS) {
  const emblem = EMBLEMS[key];
  const variant = PICKS[key];
  const subpaths = emblem[variant];
  if (!subpaths) throw new Error(`${key}: no variant "${variant}"`);

  const d = subpaths.join("");
  /* One path per emblem, so SVGLoader hands ExtrudeGeometry one shape list and
     evenodd resolves the holes. currentColor because the flat sprite inherits
     the accent; the 3D build replaces the material anyway. */
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${emblem.w} ${emblem.h}">` +
    `<path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`;

  writeFileSync(`${OUT}/${key}.svg`, svg);
  console.log(`  ${key.padEnd(10)} ${variant}  ${emblem.w}x${emblem.h}  ${d.length} chars`);
}
console.log(`  wrote ${KEYS.length} emblems to ${OUT}/`);
