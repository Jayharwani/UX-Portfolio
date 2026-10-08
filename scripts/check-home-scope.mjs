// Fails when a changed file is outside the homepage allowlist,
// or when a frozen dependency changes version.
//
// BASE. The spec's kickoff says `node scripts/check-home-scope.mjs main`. That is
// only right once the shelf homepage is on main. It is not: `main` is still the
// pre-shelf site (HomeV2), and the shelf lives on the `shelf` branch, two commits
// ahead. Diffing against main therefore reports the entire shelf build as "changed",
// which tells you nothing about whether THIS redesign stayed in its lane.
//
// So the base defaults to `shelf`, the commit the walnut work actually branched
// from. Pass an explicit base to override: `node scripts/check-home-scope.mjs main`
// once the shelf is merged.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? "shelf";

// The homepage, as it actually exists in this repo. Approved by Jay in Phase 0.
const ALLOWLIST = [
  // the scene and its parts
  /^src\/components\/HomeShelf\.tsx$/,
  /^src\/components\/shelf\//,
  // the overlay's stylesheet; every class in it is prefixed shelf- or m-
  /^src\/styles\/shelf\.css$/,
  // assets, docs and the instructions that govern this work
  /^public\/shelf\//,
  /^docs\//,
  /^CLAUDE\.md$/,
  /^scripts\//,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/,
];

// Deliberately NOT on the list, and the reason, so nobody adds them by reflex:
//   src/App.tsx        the router. `/` already points at HomeShelf; nothing in this
//                      redesign needs it, so a diff here means something leaked.
//   src/index.css      global. A homepage style belongs under .shelf-root.
//   src/styles/*.css   case study and shared styles.
//   src/components/case/, src/components/v2/, and every case study page.

const FROZEN = ["react", "react-dom", "react-router", "react-router-dom", "three", "gsap"];
const MAJOR_LOCKED = {
  "@react-three/fiber": "8",
  "@react-three/drei": "9",
  "@react-three/postprocessing": "2",
};

const list = (cmd) => execSync(cmd, { encoding: "utf8" }).split("\n").filter(Boolean);
const changed = new Set([
  ...list(`git diff --name-only ${base}`),
  ...list("git ls-files --others --exclude-standard"),
]);
const outside = [...changed].filter((f) => !ALLOWLIST.some((re) => re.test(f)));

const deps = (p) => ({ ...p.dependencies, ...p.devDependencies });
const before = deps(JSON.parse(execSync(`git show ${base}:package.json`, { encoding: "utf8" })));
const after = deps(JSON.parse(readFileSync("package.json", "utf8")));
const frozenChanged = FROZEN.filter((d) => before[d] !== after[d]);
const majorChanged = Object.entries(MAJOR_LOCKED)
  .filter(([d, major]) => after[d] && !after[d].replace(/^[^\d]*/, "").startsWith(`${major}.`))
  .map(([d]) => d);

const problems = [
  ...outside.map((f) => `outside homepage scope: ${f}`),
  ...frozenChanged.map((d) => `frozen dependency changed: ${d} ${before[d]} to ${after[d]}`),
  ...majorChanged.map((d) => `major version changed: ${d} is now ${after[d]}`),
];
if (problems.length) {
  console.error(`Scope check failed (base ${base}):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Scope check passed (base ${base}): ${changed.size} changed files, all inside the homepage.`);
