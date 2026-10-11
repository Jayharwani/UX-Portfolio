/* The dependency list is a design decision, so it gets a guard.
 *
 * CLAUDE.md says the runtime dependencies are these eight and no more without
 * asking, and that react, react-dom, react-router, three and gsap are frozen
 * because a major on any of them rewrites either every route or the whole
 * render path. That rule was previously enforced by check-home-scope.mjs,
 * which also carried an allowlist of homepage files from the Print Run era:
 * by the time the Resolve homepage existed the allowlist called
 * ResolveField.tsx and pointField.ts "outside the homepage" and the script
 * failed on every run, which is the same as having no guard at all.
 *
 * This keeps the half that is still true.
 *
 *   node scripts/check-deps.mjs
 */
import { readFileSync } from "node:fs";

/** the eight, and the reason each one is allowed to be here */
const ALLOWED = {
  gsap: "scroll triggers, the intro and the chapter choreography",
  lenis: "the smoothed scroll value the field reads",
  "lucide-react": "icons, on the case studies and the contact cards",
  motion: "the case studies' own animation, lazily, in their own chunks",
  react: "",
  "react-dom": "",
  "react-router": "",
  three: "the point field, behind a dynamic import",
};

/** a major version move on any of these rewrites the whole app */
const FROZEN = ["react", "react-dom", "react-router", "three", "gsap"];

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = pkg.dependencies ?? {};
const problems = [];

for (const name of Object.keys(deps)) {
  if (!(name in ALLOWED)) problems.push(`${name} is a new runtime dependency and was not asked for`);
}
for (const name of Object.keys(ALLOWED)) {
  if (!(name in deps)) problems.push(`${name} is expected and missing`);
}
for (const name of FROZEN) {
  const range = deps[name];
  if (!range) continue;
  /* ^1.2.3 and ~1.2.3 both stay inside their major; anything looser does not */
  if (!/^[\^~]?\d/.test(range)) problems.push(`${name} is pinned as "${range}", which can cross a major`);
}

if (problems.length) {
  console.error(`Dependency check FAILED:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Dependency check passed: ${Object.keys(deps).length} runtime dependencies, all expected.`);
