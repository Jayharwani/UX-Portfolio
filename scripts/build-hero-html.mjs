import { readFileSync, writeFileSync } from "node:fs";

/* Regenerates hero.html from the component, so the standalone reference and
   the shipped hero cannot drift apart. The template is the page around the
   scene; every shader and every constant is extracted from MetalForm.tsx.

   Run after tuning the component:  node scripts/build-hero-html.mjs         */

const SRC = "src/components/home/scene/MetalForm.tsx";
const TPL = "scripts/hero.template.html";
const OUT = "hero.html";

const src = readFileSync(SRC, "utf8");

const need = (re, what) => {
  const m = src.match(re);
  if (!m) throw new Error(`could not find ${what} in ${SRC}`);
  return m[1];
};

/* The trailing newline matters and the capture drops it. DISPLACE_GLSL is
   prepended straight onto three's own vertex shader, whose first line is
   `#define STANDARD` — and a preprocessor directive that does not begin a
   line is a syntax error. Without this the component compiled fine and the
   generated file rendered nothing but the type, which is exactly the class
   of bug a generated reference exists to avoid and only running it catches. */
const DISPLACE = need(/const DISPLACE_GLSL = `([\s\S]*?)\n`;/, "DISPLACE_GLSL") + "\n";
const NORMAL = need(/const NORMAL_GLSL = `([\s\S]*?)\n`;/, "NORMAL_GLSL");
const finV = need(/vertexShader: `([\s\S]*?)\n  `,/, "finish vertex shader");
const finF = need(/fragmentShader: `([\s\S]*?)\n  `,\n\};/, "finish fragment shader");

const KEYS = [
  "FOV", "FILL", "FILL_PORTRAIT", "LIFT_F",
  "DETAIL", "DETAIL_SMALL", "RADIUS", "AMP", "FREQ", "MORPH", "NORMAL_EPS",
  "ROUGHNESS", "CLEARCOAT", "CLEARCOAT_ROUGHNESS",
  "IRIDESCENCE", "IRIDESCENCE_IOR", "IRIDESCENCE_MIN", "IRIDESCENCE_MAX",
  "PARALLAX", "EASE",
  "BLOOM", "BLOOM_RADIUS", "BLOOM_THRESHOLD", "EXPOSURE",
  "ABERRATION", "GRAIN", "VIGNETTE",
  "INTRO_MS", "INTRO_DOLLY", "RENDER_SCALE", "RENDER_SCALE_SMALL",
];
const C = Object.fromEntries(
  KEYS.map((k) => [k, Number(need(new RegExp("\\n  " + k + ": ([0-9.]+)"), k))])
);

/* the light and env intensities live at their call sites rather than in C,
   so they are pulled from there — if they ever move into C this throws
   rather than silently shipping a stale reference */
const envI = need(/envMapIntensity: ([0-9.]+)/, "envMapIntensity");
const keyI = need(/DirectionalLight\(new THREE\.Color\(KEY\), ([0-9.]+)\)/, "key intensity");
const rimI = need(/DirectionalLight\(new THREE\.Color\(RIM\), ([0-9.]+)\)/, "rim intensity");

const matColor = need(/color: "(#\w+)",\n  metalness/, "material colour");
const KEY = need(/const KEY = "(#\w+)"/, "KEY colour");
const RIM = need(/const RIM = "(#\w+)"/, "RIM colour");
const BG = need(/const BG = "(#\w+)"/, "BG colour");

const out = readFileSync(TPL, "utf8")
  .replace("__C__", JSON.stringify(C, null, 2))
  .replace("__DISPLACE__", DISPLACE)
  .replace("__NORMAL__", NORMAL)
  .replace("__FINV__", finV)
  .replace("__FINF__", finF)
  .replace("__MATCOLOR__", matColor)
  .replace("__KEY__", KEY)
  .replace("__RIM__", RIM)
  .replace("__BG__", BG)
  .replace("__ENVI__", envI)
  .replace("__KEYI__", keyI)
  .replace("__RIMI__", rimI);

if (out.includes("__")) {
  const left = out.match(/__[A-Z_]+__/g);
  if (left) throw new Error(`template placeholders left unfilled: ${[...new Set(left)].join(", ")}`);
}

writeFileSync(OUT, out);
console.log(`${OUT} written — ${out.length} bytes, ${KEYS.length} constants in sync`);
