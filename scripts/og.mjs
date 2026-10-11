/* The share card is the page itself.
 *
 * Rendered at exactly 1200 x 630 from the running site rather than drawn in a
 * design tool, so it cannot go stale: the sphere, the headline and the palette
 * in the image are the ones a visitor actually lands on. */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2] ?? "og.png";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const p = spawn(CHROME, [
  "--headless=new", "--remote-debugging-port=9921", "--no-first-run", "--hide-scrollbars",
  "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "about:blank",
]);
await new Promise((r) => setTimeout(r, 3200));
const list = await (await fetch("http://127.0.0.1:9921/json/list")).json();
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
let id = 0;
const waits = new Map();
const cmd = (m, q = {}) =>
  new Promise((res) => { const n = ++id; waits.set(n, res); ws.send(JSON.stringify({ id: n, method: m, params: q })); });
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && waits.has(d.id)) { waits.get(d.id)(d.result); waits.delete(d.id); } };
await new Promise((r) => (ws.onopen = r));
await cmd("Page.enable");
await cmd("Runtime.enable");
await cmd("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await cmd("Page.navigate", { url: "http://localhost:4173/" });
/* long enough for the sphere to settle out of the opening scatter */
await new Promise((r) => setTimeout(r, 16000));
const ev = async (e) => (await cmd("Runtime.evaluate", { expression: e, returnByValue: true })).result?.value;
/* the cue is an instruction to the reader, not part of a still image */
await ev(`document.querySelector(".rs-cue")?.style.setProperty("display", "none"); 1`);
await new Promise((r) => setTimeout(r, 600));
const { data } = await cmd("Page.captureScreenshot", { format: "png" });
writeFileSync(OUT, Buffer.from(data, "base64"));
console.log("  wrote " + OUT);
p.kill();
