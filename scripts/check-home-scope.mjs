/* Fails when a change reaches outside the homepage, or when a frozen
   dependency moves.
 *
 * The whole point of the Print Run rebuild is that the case studies do not
 * change, and "I did not mean to touch that" is not something you notice by
 * reading a diff of forty files. The zero-pixel screenshot comparison is the
 * real backstop; this is the cheap check you can run after every edit.
 *
 *   node scripts/check-home-scope.mjs [base]
 *
 * The base defaults to main. */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? "main";

const ALLOWLIST = [
  /^src\/components\/HomePrintRun\.tsx$/,
  /^src\/components\/print-run\//,
  /^src\/components\/Field\.tsx$/,
  /^src\/components\/v2\/(Rail|RouteMap|Contact|useReveal)\.(tsx|ts)$/,
  /^src\/lib\/(clock|stage|emblemGeometry|emblemMaterials|field)\.ts$/,
  /^src\/styles\/(print-run\.css|tokens\.ts)$/,
  /^src\/data\/issues\.ts$/,
  /^src\/assets\/emblems\//,
  /^src\/App\.tsx$/,
  /^src\/vite-env\.d\.ts$/,
  /^scripts\/(check-home-scope\.mjs|emblems\/)/,
  /^docs\//,
  /^index\.html$/,
  /^vite\.config\.ts$/,
  /^CLAUDE\.md$/,
  /^package(-lock)?\.json$/,
  /^\.gitignore$/,
];

/* react-router is the one place a major version would rewrite every route in
   the app, and three/gsap pin the homepage's whole render path. */
const FROZEN = ["react", "react-dom", "react-router", "three", "gsap"];

const list = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return [];
  }
};

const changed = new Set([
  ...list(`git diff --name-only ${base}`),
  ...list("git ls-files --others --exclude-standard"),
]);
const outside = [...changed].filter((f) => !ALLOWLIST.some((re) => re.test(f)));

const deps = (p) => ({ ...p.dependencies, ...p.devDependencies });
let before = {};
try {
  before = deps(JSON.parse(execSync(`git show ${base}:package.json`, { encoding: "utf8" })));
} catch {
  /* no such base: the dependency half of the check simply does not run */
}
const after = deps(JSON.parse(readFileSync("package.json", "utf8")));
const frozenChanged = Object.keys(before).length
  ? FROZEN.filter((d) => before[d] && before[d] !== after[d])
  : [];

const problems = [
  ...outside.map((f) => `outside the homepage: ${f}`),
  ...frozenChanged.map((d) => `frozen dependency moved: ${d} ${before[d]} to ${after[d]}`),
];

if (problems.length) {
  console.error(`Scope check FAILED against ${base}:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Scope check passed against ${base}: ${changed.size} changed files, all inside the homepage.`);
