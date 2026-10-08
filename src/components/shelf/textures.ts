import * as THREE from "three";

/* --------------------------------------------------------------------------
   EVERY TEXTURE IN THIS SCENE IS DRAWN, NOT DOWNLOADED.

   Four spine graphics, four covers and the oak grain as image files would be
   the better part of a megabyte and a visible wait on the one view the whole
   site opens with. Drawn into an offscreen canvas they cost nothing to fetch,
   land on the first frame, and can take their colour from the project data
   rather than from whatever was exported months ago.

   Everything here is memoised by its arguments, because a CanvasTexture is a
   GPU upload and React will call a component more than once.
   -------------------------------------------------------------------------- */

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

/* ── oak ──────────────────────────────────────────────────────────────────
   Grain is a stack of long, low-amplitude sine bands with a little noise, the
   way a quarter-sawn board reads: mostly straight, occasionally wandering. */
export function wood(tint: string, seed = 1) {
  return make(`wood:${tint}:${seed}`, 512, 512, (g) => {
    g.fillStyle = tint;
    g.fillRect(0, 0, 512, 512);

    let s = seed * 9301;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);

    for (let i = 0; i < 46; i++) {
      const y = rnd() * 512;
      const amp = 2 + rnd() * 7;
      const freq = 0.004 + rnd() * 0.01;
      const dark = rnd() * 0.07 + 0.015;
      g.strokeStyle = `rgba(90, 62, 34, ${dark})`;
      g.lineWidth = 0.7 + rnd() * 2.4;
      g.beginPath();
      for (let x = 0; x <= 512; x += 4) {
        const yy = y + Math.sin(x * freq + i) * amp + Math.sin(x * freq * 3.1) * amp * 0.25;
        x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }

    /* pores: the fine speckle that stops a flat fill reading as plastic */
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(74, 51, 28, ${rnd() * 0.05})`;
      g.fillRect(rnd() * 512, rnd() * 512, 1 + rnd(), 1);
    }
  });
}

/* ── the spine ────────────────────────────────────────────────────────────
   Read from the side, at a glance, upside down to the reader's head: the
   title runs bottom to top, which is the British and European convention and
   the one that stays readable when the book is standing. */
export function spine(title: string, index: string, cloth: string, foil: string) {
  return make(`spine:${title}`, 256, 1024, (g) => {
    g.fillStyle = cloth;
    g.fillRect(0, 0, 256, 1024);

    /* a darker band at head and tail, where cloth wears */
    const shade = g.createLinearGradient(0, 0, 0, 1024);
    shade.addColorStop(0, "rgba(0,0,0,0.26)");
    shade.addColorStop(0.09, "rgba(0,0,0,0)");
    shade.addColorStop(0.91, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.26)");
    g.fillStyle = shade;
    g.fillRect(0, 0, 256, 1024);

    /* the rolled edges of a case binding catch the light */
    const edge = g.createLinearGradient(0, 0, 256, 0);
    edge.addColorStop(0, "rgba(0,0,0,0.3)");
    edge.addColorStop(0.1, "rgba(255,255,255,0.08)");
    edge.addColorStop(0.9, "rgba(255,255,255,0.06)");
    edge.addColorStop(1, "rgba(0,0,0,0.3)");
    g.fillStyle = edge;
    g.fillRect(0, 0, 256, 1024);

    g.save();
    g.translate(128, 512);
    g.rotate(-Math.PI / 2);

    g.fillStyle = foil;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "600 70px Geist, Inter, system-ui, sans-serif";
    g.fillText(title.toUpperCase(), 0, 2);
    g.restore();

    /* two foil rules and the number at the tail, like a series binding */
    g.fillStyle = foil;
    g.globalAlpha = 0.85;
    g.fillRect(44, 150, 168, 3);
    g.fillRect(44, 874, 168, 3);
    g.globalAlpha = 1;

    g.save();
    g.translate(128, 940);
    g.fillStyle = foil;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "500 40px Geist Mono, ui-monospace, monospace";
    g.fillText(index, 0, 0);
    g.restore();
  });
}

/* ── the cover ────────────────────────────────────────────────────────────
   Only ever seen once, during the open, so it carries the one thing the
   spine had no room for: what the project actually is. */
export function cover(title: string, subtitle: string, year: string, cloth: string, foil: string) {
  return make(`cover:${title}`, 768, 1024, (g) => {
    g.fillStyle = cloth;
    g.fillRect(0, 0, 768, 1024);

    const sheen = g.createLinearGradient(0, 0, 768, 1024);
    sheen.addColorStop(0, "rgba(255,255,255,0.09)");
    sheen.addColorStop(0.55, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(0,0,0,0.14)");
    g.fillStyle = sheen;
    g.fillRect(0, 0, 768, 1024);

    /* a blind-stamped border, pressed rather than printed */
    g.strokeStyle = "rgba(0,0,0,0.22)";
    g.lineWidth = 2;
    g.strokeRect(56, 56, 656, 912);

    /* The title runs large and vertical, as it does on the plate's own front
       book. The left-hand book is turned out of the shelf, so this panel is
       in view at rest rather than only during an open, and a cover carrying a
       small title over a subtitle and a date read as clutter beside the
       spines. One word, the size of the thing it names. */
    g.save();
    g.translate(384, 512);
    g.rotate(-Math.PI / 2);
    g.fillStyle = foil;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "600 128px Geist, Inter, system-ui, sans-serif";
    g.fillText(title.toUpperCase(), 0, 0);
    g.restore();

    g.globalAlpha = 0.72;
    g.fillStyle = foil;
    g.font = "500 26px Geist Mono, ui-monospace, monospace";
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    g.fillText(year, 104, 920);
    g.textAlign = "right";
    g.fillText(subtitle.toUpperCase(), 664, 920);
    g.globalAlpha = 1;
  });
}

/* ── the page block ───────────────────────────────────────────────────────
   Fore-edges are not white. They are a stack of leaf edges with a shadow in
   every gap, which is why a flat cream box reads as a brick. */
export function pages() {
  return make("pages", 512, 64, (g) => {
    g.fillStyle = "#efe7d6";
    g.fillRect(0, 0, 512, 64);
    let s = 7919;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let x = 0; x < 512; x += 2) {
      g.fillStyle = `rgba(120, 104, 78, ${0.08 + rnd() * 0.16})`;
      g.fillRect(x, 0, 1, 64);
    }
  });
}
