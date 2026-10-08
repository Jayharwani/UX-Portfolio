import * as THREE from "three";

/* --------------------------------------------------------------------------
   EVERY TEXTURE IN THIS SCENE IS DRAWN, NOT DOWNLOADED.

   Four spine graphics, four covers, the oak and the plaque as image files
   would be the better part of a megabyte on the one view the whole site opens
   with. Drawn into an offscreen canvas they cost nothing to fetch, land on the
   first frame, and take their colour from the project data rather than from
   whatever was exported months ago.

   Each graphic is drawn TWICE from one function: once in colour, once as
   height. The lettering on these books is raised, and a flat colour map cannot
   do that at any resolution -- a title with no height is a decal and reads
   like one. The height pass goes in as a bumpMap so every stroke gets a lit
   edge and a shadowed one. Drawing both from the same code is the point: a
   title that moved in one and not the other would emboss bare cloth next to
   flat letters.

   Everything is memoised by its arguments, because a CanvasTexture is a GPU
   upload and React will call a component more than once.
   -------------------------------------------------------------------------- */

export type Mode = "art" | "bump";

const RAISED = "#D8D8D8"; // standing proud of the surface
const SUNK = "#4E4E4E"; // pressed into it
const FLAT = "#808080"; // the surface itself

const cache = new Map<string, THREE.Texture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const hit = cache.get(key);
  if (hit) return hit;

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new Error("no 2d context");
  draw(g);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

/** dispose everything on unmount; a route change should not leak the GPU */
export function disposeTextures() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}

function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

/* -- the spine -----------------------------------------------------------
   Number at the head, title below it, both reading bottom to top: the
   European convention, and the one that stays upright while the book is
   standing. */
export function spine(title: string, index: string, cloth: string, ink: string, mode: Mode = "art") {
  return make(`spine:${title}:${mode}`, 256, 1024, (g) => {
    const art = mode === "art";
    g.fillStyle = art ? cloth : FLAT;
    g.fillRect(0, 0, 256, 1024);

    if (art) {
      /* cloth wears at head and tail, where a hand pulls the book out */
      const shade = g.createLinearGradient(0, 0, 0, 1024);
      shade.addColorStop(0, "rgba(0,0,0,0.15)");
      shade.addColorStop(0.1, "rgba(0,0,0,0)");
      shade.addColorStop(0.9, "rgba(0,0,0,0)");
      shade.addColorStop(1, "rgba(0,0,0,0.15)");
      g.fillStyle = shade;
      g.fillRect(0, 0, 256, 1024);
    }

    const fg = art ? ink : RAISED;
    g.fillStyle = fg;
    g.textAlign = "center";
    g.textBaseline = "middle";

    g.save();
    g.translate(128, 186);
    g.rotate(-Math.PI / 2);
    g.font = "700 84px Geist, Inter, system-ui, sans-serif";
    g.fillText(index, 0, 0);
    g.restore();

    g.save();
    g.translate(128, 615);
    g.rotate(-Math.PI / 2);
    g.font = "700 80px Geist, Inter, system-ui, sans-serif";
    g.fillText(title.toUpperCase(), 0, 0);
    g.restore();
  });
}

/* -- the cover -----------------------------------------------------------
   Seen once, during the open, and only for about a second, so it carries the
   one thing the spine had no room for and nothing else. */
export function cover(
  title: string,
  blurb: string,
  year: string,
  cloth: string,
  ink: string,
  mode: Mode = "art"
) {
  return make(`cover:${title}:${mode}`, 768, 1024, (g) => {
    const art = mode === "art";
    g.fillStyle = art ? cloth : FLAT;
    g.fillRect(0, 0, 768, 1024);

    if (art) {
      const sheen = g.createLinearGradient(0, 0, 768, 1024);
      sheen.addColorStop(0, "rgba(255,255,255,0.1)");
      sheen.addColorStop(0.6, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(0,0,0,0.12)");
      g.fillStyle = sheen;
      g.fillRect(0, 0, 768, 1024);
    }

    const fg = art ? ink : RAISED;
    g.strokeStyle = fg;
    g.lineWidth = 3;
    g.globalAlpha = art ? 0.5 : 1;
    g.strokeRect(62, 62, 644, 900);
    g.globalAlpha = 1;

    g.fillStyle = fg;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "700 102px Geist, Inter, system-ui, sans-serif";
    g.fillText(title.toUpperCase(), 384, 416);

    g.font = "500 30px Geist, Inter, system-ui, sans-serif";
    g.globalAlpha = art ? 0.8 : 1;
    const lines: string[] = [];
    let line = "";
    for (const w of blurb.split(" ")) {
      const next = line ? `${line} ${w}` : w;
      if (g.measureText(next).width > 520 && line) {
        lines.push(line);
        line = w;
      } else line = next;
    }
    if (line) lines.push(line);
    lines.slice(0, 3).forEach((l, i) => g.fillText(l, 384, 516 + i * 44));

    g.font = "500 28px Geist Mono, ui-monospace, monospace";
    g.fillText(year, 384, 878);
    g.globalAlpha = 1;
  });
}

/* -- the page block ------------------------------------------------------
   Fore-edges are not white. They are a stack of leaf edges with a shadow in
   every gap, which is why a flat cream box reads as a brick. */
export function pages(seed = 7) {
  return make(`pages:${seed}`, 512, 64, (g) => {
    g.fillStyle = "#F3ECDE";
    g.fillRect(0, 0, 512, 64);
    const rnd = seeded(seed);
    for (let x = 0; x < 512; x += 2) {
      g.fillStyle = `rgba(150, 132, 104, ${0.06 + rnd() * 0.14})`;
      g.fillRect(x, 0, 1, 64);
    }
  });
}

/* -- oak -----------------------------------------------------------------
   Grain is a stack of long, low-amplitude sine bands with a little noise, the
   way a quarter-sawn board reads: mostly straight, occasionally wandering.
   Drawn wide, so it runs along the length of a board rather than across it. */
export function wood(tint: string, seed = 1) {
  return make(`wood:${tint}:${seed}`, 1024, 256, (g) => {
    g.fillStyle = tint;
    g.fillRect(0, 0, 1024, 256);
    const rnd = seeded(seed);

    for (let i = 0; i < 40; i++) {
      const y = rnd() * 256;
      const amp = 1.5 + rnd() * 5;
      const freq = 0.002 + rnd() * 0.006;
      g.strokeStyle = `rgba(120, 84, 46, ${rnd() * 0.08 + 0.015})`;
      g.lineWidth = 0.8 + rnd() * 2.6;
      g.beginPath();
      for (let x = 0; x <= 1024; x += 6) {
        const yy = y + Math.sin(x * freq + i) * amp + Math.sin(x * freq * 3.1) * amp * 0.3;
        if (x === 0) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.stroke();
    }

    for (let i = 0; i < 3000; i++) {
      g.fillStyle = `rgba(104, 72, 38, ${rnd() * 0.05})`;
      g.fillRect(rnd() * 1024, rnd() * 256, 1 + rnd() * 2, 1);
    }
  });
}

/* -- the plaque ----------------------------------------------------------
   Engraved rather than printed, so in the height pass its letters go DOWN
   while everything else on these shelves stands up. */
export function plaque(text: string, mode: Mode = "art") {
  return make(`plaque:${text}:${mode}`, 1024, 128, (g) => {
    const art = mode === "art";
    g.fillStyle = art ? "#E2C093" : FLAT;
    g.fillRect(0, 0, 1024, 128);
    if (art) {
      const rnd = seeded(5);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(120, 84, 46, ${rnd() * 0.06})`;
        g.fillRect(rnd() * 1024, rnd() * 128, 2 + rnd() * 5, 1);
      }
    }
    g.fillStyle = art ? "#5A4327" : SUNK;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "600 50px Geist, Inter, system-ui, sans-serif";
    g.fillText(text, 512, 66);
  });
}

/* -- the window ----------------------------------------------------------
   A gobo for the key light: two panes, a glazing bar, and leaves crossing one
   corner. Projected onto the back wall it does the job a window out of frame
   does in a photograph, and it is the single thing that stops flat plaster
   reading as a backdrop.

   Greyscale, because a spotlight's map multiplies the light's own colour. */
export function windowGobo() {
  return make("gobo", 512, 512, (g) => {
    g.fillStyle = "#0E0E0E";
    g.fillRect(0, 0, 512, 512);

    /* soft-edged: a hard gobo reads as a cut-out rather than as daylight */
    const glow = g.createRadialGradient(256, 232, 30, 256, 256, 318);
    glow.addColorStop(0, "#ffffff");
    glow.addColorStop(0.52, "#F2F2F2");
    glow.addColorStop(1, "#0E0E0E");
    g.fillStyle = glow;
    g.fillRect(0, 0, 512, 512);

    g.strokeStyle = "#1E1E1E";
    g.lineWidth = 15;
    g.beginPath();
    g.moveTo(256, 18);
    g.lineTo(256, 494);
    g.moveTo(18, 270);
    g.lineTo(494, 270);
    g.stroke();

    /* leaves across one corner, the way a plant on a sill throws them */
    const rnd = seeded(23);
    g.fillStyle = "#222222";
    for (let i = 0; i < 24; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 36 + rnd() * 140;
      g.save();
      g.translate(92 + Math.cos(a) * r * 0.95, 80 + Math.sin(a) * r * 0.62);
      g.rotate(a);
      g.beginPath();
      g.ellipse(0, 0, 15 + rnd() * 14, 10 + rnd() * 9, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }

    g.filter = "blur(4px)";
    g.drawImage(g.canvas, 0, 0);
    g.filter = "none";
  });
}
