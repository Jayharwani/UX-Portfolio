/* The palette exists twice, so something has to say when the two copies stop
 * agreeing.
 *
 * CSS cannot be read by the canvas and WebGL cannot read a stylesheet, so the
 * homepage colours are declared in resolve.css and mirrored in tokens.ts.
 * That is a hand-typed second copy, which is exactly the kind of thing that
 * drifts quietly: change one accent, miss the other, and the dots are a
 * different green from the button for a month before anyone notices.
 *
 * A comment in tokens.ts used to claim this script enforced that. It did not
 * exist. Now it does.
 *
 *   node scripts/check-tokens.mjs
 */
import { readFileSync } from "node:fs";

const ts = readFileSync("src/styles/tokens.ts", "utf8");
const css = readFileSync("src/styles/resolve.css", "utf8");

/** the TypeScript side: everything inside the TOKENS object */
const tsBlock = ts.slice(ts.indexOf("export const TOKENS"), ts.indexOf("} as const"));
const fromTs = new Map();
for (const [, k, v] of tsBlock.matchAll(/^\s*([a-z0-9]+):\s*"(#[0-9a-fA-F]{6})"/gm)) {
  fromTs.set(k, v.toLowerCase());
}

/** the CSS side: --accent-<project> in the .v2.rs block, plus void and paper,
 *  which live further up the cascade in v2.css */
const fromCss = new Map();
for (const [, k, v] of css.matchAll(/--accent-([a-z]+):\s*(#[0-9a-fA-F]{6})/g)) {
  fromCss.set(k, v.toLowerCase());
}
const v2 = readFileSync("src/styles/v2.css", "utf8");
for (const name of ["void", "paper"]) {
  const m = v2.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (m) fromCss.set(name, m[1].toLowerCase());
}

const problems = [];
for (const [k, v] of fromTs) {
  if (!fromCss.has(k)) problems.push(`${k} is in tokens.ts (${v}) and nowhere in the stylesheets`);
  else if (fromCss.get(k) !== v) problems.push(`${k} is ${v} in tokens.ts and ${fromCss.get(k)} in CSS`);
}
for (const k of fromCss.keys()) {
  if (!fromTs.has(k)) problems.push(`${k} is in CSS (${fromCss.get(k)}) and not in tokens.ts`);
}
/* THE COUNT IS DERIVED, NOT TYPED. This used to assert six, which is how a
   fifth project turned a correct palette into a failing check. The rule it was
   trying to state is the one below: two neutrals and one accent per project,
   and the Accent union is the list of projects. Written this way it also
   catches the mistake that actually matters — widening the union without
   adding the colour, which typechecks and renders nothing. */
const accents = (ts.match(/export type Accent = ([^;]+);/)?.[1].match(/"[a-z]+"/g) ?? []).length;
if (!accents) problems.push("could not find the Accent union in tokens.ts");
else if (fromTs.size !== accents + 2) {
  problems.push(
    `the palette is void, paper and one accent per project: ${accents} accents means ` +
      `${accents + 2} colours, and tokens.ts declares ${fromTs.size}`,
  );
}

if (problems.length) {
  console.error(`Token check FAILED:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Token check passed: ${fromTs.size} colours (${accents} accents), both copies agree.`);
