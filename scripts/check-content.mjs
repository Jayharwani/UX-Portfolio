/**
 * Stop a production build while any content gap is still open.
 *
 * HOMEPAGE_REDESIGN.md §9.4. Runs as the `prebuild` script, so `npm run build`
 * cannot produce a deployable bundle with a [FILL] or [VERIFY] marker in it.
 * In development the same markers render as dashed blue chips, so a gap is
 * visible on the page as well as in a log.
 *
 * It also enforces the one punctuation rule the voice section is strict about:
 * no en dashes and no em dashes anywhere in the content, comments included.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const targets = ["src/content", "public/llms.txt"];
const DASHES = /[–—]/; // en dash, em dash
const problems = [];

const scan = (path) => {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path)) scan(join(path, f));
    return;
  }
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const where = `${path}:${i + 1}`;
      if (line.includes("[FILL")) problems.push(`  ${where}  unfilled   ${line.trim()}`);
      if (line.includes("[VERIFY")) problems.push(`  ${where}  unverified ${line.trim()}`);
      if (DASHES.test(line)) problems.push(`  ${where}  dash       ${line.trim()}`);
    });
};

targets.forEach(scan);

if (problems.length) {
  console.error(
    `\nContent check failed. ${problems.length} open ${problems.length === 1 ? "item" : "items"}:\n\n` +
      problems.join("\n") +
      "\n\nFill or verify each one in src/content, then build again.\n"
  );
  process.exit(1);
}
