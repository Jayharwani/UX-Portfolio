/**
 * Render the share images in scripts/og/ to public/og/.
 *
 *   node scripts/og.mjs            all of them
 *   node scripts/og.mjs home       just one
 *
 * HOMEPAGE_REDESIGN.md §12.2 asks for 1200x630 PNGs at 300 KB or less, made by
 * screenshotting a real page rather than generated as imagery.
 *
 * It drives headless Chrome over the DevTools Protocol directly. Node 22 ships
 * a WebSocket client, so this needs no dependency: Playwright would be about
 * 300 MB of browser download to take four screenshots, and the one thing it
 * would buy here, finding Chrome, is four lines below.
 *
 * Phase 9 adds one template per project and this picks them up automatically.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const W = 1200;
const H = 630;
const MAX_KB = 300;

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chromePath = CANDIDATES.find((p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
});
if (!chromePath) {
  console.error("No Chrome found. Set CHROME_PATH to the executable.");
  process.exit(1);
}

const only = process.argv[2];
const names = readdirSync("scripts/og")
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\.html$/, ""))
  .filter((n) => !only || n === only);

if (!names.length) {
  console.error(only ? `No scripts/og/${only}.html` : "No templates in scripts/og/");
  process.exit(1);
}

const port = 9000 + Math.floor(Math.random() * 900);
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--no-first-run",
    "--no-default-browser-check",
    // the templates load their fonts from public/fonts over file://
    "--allow-file-access-from-files",
    `--window-size=${W},${H}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function socket() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* chrome is still starting */
    }
    await sleep(250);
  }
  throw new Error("Chrome exposed no debugging target");
}

const ws = new WebSocket(await socket());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let seq = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  const p = pending.get(m.id);
  if (!p) return;
  pending.delete(m.id);
  m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: W,
  height: H,
  deviceScaleFactor: 1,
  mobile: false,
});

mkdirSync("public/og", { recursive: true });
let failed = false;

for (const name of names) {
  await send("Page.navigate", { url: pathToFileURL(resolve(`scripts/og/${name}.html`)).href });
  // the webfonts are local, so this is a frame or two, not a network wait
  await send("Runtime.evaluate", {
    expression: "document.fonts.ready.then(() => 1)",
    awaitPromise: true,
  });
  await sleep(120);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  const bytes = Buffer.from(shot.data, "base64");
  const out = `public/og/${name}.png`;
  writeFileSync(out, bytes);

  const kb = Math.round(bytes.length / 1024);
  // §12.2 also asks that nothing important sits outside the 60px safe area
  const fit = await send("Runtime.evaluate", {
    expression: `JSON.stringify([...document.querySelectorAll(".line, .byline")].map((e) => {
      const b = e.getBoundingClientRect();
      return { t: e.textContent.trim().slice(0, 16), l: Math.round(b.left), r: Math.round(b.right), w: Math.round(b.width) };
    }))`,
    returnByValue: true,
  });
  const boxes = JSON.parse(fit.result.value);
  const outside = boxes.filter((b) => b.l < 59 || b.r > W - 59);
  const over = kb > MAX_KB;
  if (over || outside.length) failed = true;

  console.log(`${out}  ${W}x${H}  ${kb} KB${over ? ` OVER ${MAX_KB} KB` : ""}`);
  for (const b of boxes) {
    const bad = b.l < 59 || b.r > W - 59;
    console.log(`    ${bad ? "!" : " "} ${String(b.w).padStart(4)}px wide  x ${b.l} to ${b.r}  "${b.t}"`);
  }
  if (outside.length) console.log(`    ${outside.length} box(es) break the 60px safe area`);
}

ws.close();
chrome.kill();
process.exit(failed ? 1 : 0);
