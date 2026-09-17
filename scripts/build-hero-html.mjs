import { readFileSync, writeFileSync } from "node:fs";
import esbuild from "esbuild";

/* Regenerates hero.html from the component, so the standalone reference and
   the shipped hero cannot drift apart. The template is the page around the
   scene; every shader, the geometry builder, and every constant are pulled
   out of Anatomy.tsx.

   Run after tuning the component:  node scripts/build-hero-html.mjs         */

const SRC = "src/components/home/scene/Anatomy.tsx";
const TPL = "scripts/hero.template.html";
const OUT = "hero.html";

const src = readFileSync(SRC, "utf8");

const need = (re, what) => {
  const m = src.match(re);
  if (!m) throw new Error(`could not find ${what} in ${SRC}`);
  return m[1];
};

const VERT = need(/const VERT = `([\s\S]*?)\n`;/, "VERT");
const FRAG = need(/const FRAG = `([\s\S]*?)\n`;/, "FRAG");
const finV = need(/vertexShader: `([\s\S]*?)\n  `,/, "finish vertex shader");
const finF = need(/fragmentShader: `([\s\S]*?)\n  `,\n\};/, "finish fragment shader");

/* The geometry builder is shared verbatim. It is plain arithmetic with no
   React in it, so rather than writing the composition twice — two copies of
   a composition are two compositions, sooner or later — it is lifted out of
   the component and stripped of its types.

   Stripped by esbuild, not by regex. The first attempt tried to unpick the
   annotations with substitutions and fell over on a multi-line parameter
   list, which is the entirely predictable outcome of parsing a language with
   patterns. esbuild already ships inside Vite, so this adds no dependency and
   cannot be wrong about the syntax. */
const rngFn = need(/(function rng\(seed: number\)[\s\S]*?\n\})/, "rng");
const buildFn = need(/(\/\* ── the composition[\s\S]*?\nfunction build\([\s\S]*?\n\})/, "build");

const strip = (ts) =>
  esbuild.transformSync(ts, {
    loader: "ts",
    format: "esm",
    target: "es2020",
    /* keep the comments — they are half the point of shipping a reference */
    legalComments: "none",
  }).code.trim();

const RNG = strip(rngFn);
const BUILD = strip("interface Built { geometry: unknown }\n" + buildFn)
  .replace(/^\s*$/gm, "")
  .trim();

const KEYS = [
  "COUNT", "COUNT_SMALL", "Z_NEAR", "Z_FAR", "CAMERA_Z", "FOV", "OVERFILL",
  "GRID", "JITTER", "CLEAR_BAND", "SIZE_MIN", "SIZE_MAX",
  "PARALLAX", "EASE", "DRIFT",
  /* the title move, and SCATTER_TILT which the extracted build() reads */
  "SCATTER_TILT", "SWEEP_FROM", "SWEEP_TO", "SWEEP_WIDTH",
  "BLOOM", "BLOOM_RADIUS", "BLOOM_THRESHOLD", "EXPOSURE",
  "ABERRATION", "VIGNETTE",
  "DEPART_AT", "DEPART_BY",
  "INTRO_MS", "SCATTER_Z", "SCATTER_XY",
  "RENDER_SCALE", "RENDER_SCALE_SMALL",
];
const C = Object.fromEntries(
  KEYS.map((k) => [k, Number(need(new RegExp("\\n  " + k + ": (-?[0-9.]+)"), k))])
);

const ACCENTS = need(/const ACCENTS = (\[[^\]]*\])/, "ACCENTS")
  .replace(/"/g, '"')
  .replace(/\s+/g, " ");
const HAIR = need(/const HAIR = "(#\w+)"/, "HAIR");

const out = readFileSync(TPL, "utf8")
  .replace("__C__", JSON.stringify(C, null, 2))
  .replace("__ACCENTS__", ACCENTS)
  .replace("__HAIR__", HAIR)
  /* The trailing newline of a shader matters where one string is concatenated
     onto another; it does not here, but the geometry builder's does — an
     arrow function body ending without a newline would swallow the next
     statement into a comment if the last line were one. */
  .replace("__VERT__", VERT)
  .replace("__FRAG__", FRAG)
  .replace("__FINV__", finV)
  .replace("__FINF__", finF)
  .replace("__RNG__", RNG)
  .replace("__BUILD__", BUILD);

const left = out.match(/__[A-Z_]+__/g);
if (left) {
  throw new Error(`template placeholders left unfilled: ${[...new Set(left)].join(", ")}`);
}

writeFileSync(OUT, out);
console.log(`${OUT} written — ${out.length} bytes, ${KEYS.length} constants in sync`);
