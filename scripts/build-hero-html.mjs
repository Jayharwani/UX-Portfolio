import { readFileSync, writeFileSync } from "node:fs";

/* Regenerates hero.html from the component, so the standalone reference and
   the shipped hero cannot drift apart. The template is the page around the
   scene; every shader and every constant is extracted from LiquidField.tsx.

   Run after tuning the component:  node scripts/build-hero-html.mjs         */

const SRC = "src/components/home/scene/LiquidField.tsx";
const TPL = "scripts/hero.template.html";
const OUT = "hero.html";

const src = readFileSync(SRC, "utf8");

const grab = (name) => {
  const m = src.match(new RegExp("const " + name + " = `([\\s\\S]*?)\\n`;"));
  if (!m) throw new Error(`could not find ${name} in ${SRC}`);
  return m[1];
};

const VERT = grab("VERT");
const FIELD = grab("FIELD_FRAG");
const finV = src.match(/vertexShader: `([\s\S]*?)\n  `,/)[1];
const finF = src.match(/fragmentShader: `([\s\S]*?)\n  `,\n\};/)[1];

const KEYS = [
  "SCALE", "SPEED", "WARP", "BANDS", "BUMP", "SPEC", "FRESNEL",
  "PUSH", "RIPPLE", "EASE",
  "BLOOM", "BLOOM_RADIUS", "BLOOM_THRESHOLD", "EXPOSURE",
  "ABERRATION", "GRAIN", "VIGNETTE",
  "INTRO_MS", "RENDER_SCALE", "RENDER_SCALE_SMALL",
];
const C = Object.fromEntries(
  KEYS.map((k) => {
    const m = src.match(new RegExp("\\n  " + k + ": ([0-9.]+)"));
    if (!m) throw new Error(`could not find constant ${k} in ${SRC}`);
    return [k, Number(m[1])];
  })
);

const pal = src.match(
  /const PALETTE = \{[\s\S]*?a: \[(.*?)\],\s*\n  b: \[(.*?)\],\s*\n  c: \[(.*?)\],\s*\n  d: \[(.*?)\],/
);
const PALETTE = Object.fromEntries(
  ["a", "b", "c", "d"].map((k, i) => [k, pal[i + 1].split(",").map(Number)])
);

const WARM = src.match(/const WARM = "(#\w+)"/)[1];
const COOL = src.match(/const COOL = "(#\w+)"/)[1];

const out = readFileSync(TPL, "utf8")
  .replace("__C__", JSON.stringify(C, null, 2))
  .replace("__PAL__", JSON.stringify(PALETTE))
  .replace("__WARM__", WARM)
  .replace("__COOL__", COOL)
  .replace("__VERT__", VERT)
  .replace("__FIELD__", FIELD)
  .replace("__FINV__", finV)
  .replace("__FINF__", finF);

writeFileSync(OUT, out);
console.log(`${OUT} written — ${out.length} bytes, ${KEYS.length} constants in sync`);
