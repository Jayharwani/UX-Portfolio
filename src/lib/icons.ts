/* --------------------------------------------------------------------------
   ICONS, AS SOLIDS MADE OF POINTS.

   The four project states used to be diagrams of each product's mechanic: a
   funnel, a split column, a ground plane, a queue. They were honest and they
   were abstract, and abstract costs the reader a beat they do not spend: you
   had to be told what you were looking at before it meant anything.

   So each project now resolves into the one object that says it without a
   caption. A filter for Friction, money for Headroom, a pin for Signal, a
   cart for Bumper. The lattice still only ever deforms, and the thing it
   deforms into is now legible in the first half second.

   THE POINTS GO WHERE THE SHAPE IS, WHICH IS ITS EDGE. Filling a silhouette
   evenly is the one thing that reliably destroys it: a solid of uniform dots
   has no outline, so a shopping bag and a rounded rectangle look the same.
   Every icon is run through a distance transform and sampled against it, so
   the silhouette gets most of the points and the inside stays airy. The
   object reads as a drawn edge with volume behind it rather than as a cloud
   that happens to be bag-shaped.

   The distance comes back with each point, so the renderer can draw the edge
   heavier than the fill without knowing anything about icons.

   The sample is taken once per icon and cached. Points come back ordered by
   angle around the centre, so a morph between two icons sweeps rather than
   scrambles.
   -------------------------------------------------------------------------- */

export type IconDef = {
  /** filled path data, in a 24 x 24 box */
  fills?: string[];
  /** stroked path data, same box, round caps and joins */
  strokes?: string[];
  /** stroke width, in the same 24 units */
  width?: number;
  /** or a character, drawn in the page's own display face */
  glyph?: string;
  /** how much of the box the glyph fills. Three digits need less than one. */
  glyphScale?: number;
  fillRule?: CanvasFillRule;
  /** how deep the shell of points reaches, in raster pixels. The default
   *  hollows anything thicker than a line, which is what makes the funnel and
   *  the pin read as drawn objects instead of as blobs. An object whose parts
   *  are already about as thin as that shell has nothing to hollow, and
   *  hollowing it anyway splits every stroke into two rails and turns the
   *  glyph into tracery, so it asks to stay solid. */
  shell?: number;
};

export type IconSample = {
  /** x,y pairs in -1 to 1, ordered by angle around the centre */
  xy: Float32Array;
  /** 1 on the silhouette, falling toward 0 deep inside it */
  edge: Float32Array;
};

/** the raster used for sampling: fine enough to keep an icon's corners,
 *  small enough to scan in a millisecond */
const GRID = 240;

/** how fast a point stops counting as an edge, in raster pixels. Per icon,
 *  via IconDef.shell, because how much of a thing can be hollowed out is a
 *  property of the thing. */
const SHELL = 5;

const cache = new Map<string, IconSample>();

/** Deterministic, so the same icon is the same icon on every load. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Chamfer distance from the outside of the shape, in thirds of a pixel.
 *  Two scans, 3 for a step and 4 for a diagonal, which lands within about
 *  six per cent of euclidean and is far cheaper than computing one. */
function distanceField(alpha: Uint8ClampedArray): Float32Array {
  const n = GRID * GRID;
  const d = new Float32Array(n);
  for (let p = 0; p < n; p++) d[p] = alpha[p * 4 + 3] > 140 ? 1e9 : 0;

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const p = y * GRID + x;
      if (d[p] === 0) continue;
      let v = d[p];
      if (y > 0) {
        v = Math.min(v, d[p - GRID] + 3);
        if (x > 0) v = Math.min(v, d[p - GRID - 1] + 4);
        if (x < GRID - 1) v = Math.min(v, d[p - GRID + 1] + 4);
      }
      if (x > 0) v = Math.min(v, d[p - 1] + 3);
      d[p] = v;
    }
  }
  for (let y = GRID - 1; y >= 0; y--) {
    for (let x = GRID - 1; x >= 0; x--) {
      const p = y * GRID + x;
      if (d[p] === 0) continue;
      let v = d[p];
      if (y < GRID - 1) {
        v = Math.min(v, d[p + GRID] + 3);
        if (x > 0) v = Math.min(v, d[p + GRID - 1] + 4);
        if (x < GRID - 1) v = Math.min(v, d[p + GRID + 1] + 4);
      }
      if (x < GRID - 1) v = Math.min(v, d[p + 1] + 3);
      d[p] = v;
    }
  }
  return d;
}

export function iconPoints(key: string, def: IconDef, n: number): IconSample {
  const hit = cache.get(key);
  if (hit && hit.edge.length === n) return hit;

  const out: IconSample = { xy: new Float32Array(n * 2), edge: new Float32Array(n) };

  const canvas = document.createElement("canvas");
  canvas.width = GRID;
  canvas.height = GRID;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return out;

  /* a stencil, not a colour: only the alpha channel of this raster is ever
     read, so white is just "drawn here" */
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";

  if (def.glyph) {
    /* the display face, so the money is the site's own money */
    ctx.font = `800 ${GRID * (def.glyphScale ?? 0.86)}px Geist, ui-sans-serif, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.glyph, GRID / 2, GRID / 2 + GRID * 0.02);
  } else {
    const s = GRID / 24;
    ctx.save();
    ctx.scale(s, s);
    ctx.lineWidth = def.width ?? 1.9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const d of def.fills ?? []) ctx.fill(new Path2D(d), def.fillRule ?? "nonzero");
    for (const d of def.strokes ?? []) ctx.stroke(new Path2D(d));
    ctx.restore();
  }

  const dist = distanceField(ctx.getImageData(0, 0, GRID, GRID).data);
  const falloff = 3 * (def.shell ?? SHELL);

  /* A WEIGHTED SAMPLE, NOT AN EVEN ONE. Each solid pixel's share is how close
     it is to the outside, so the outline gets roughly five times the points
     of a deep interior and the shape survives being made of dots. */
  const px: number[] = [];
  const cum: number[] = [];
  let total = 0;
  for (let p = 0; p < GRID * GRID; p++) {
    if (dist[p] === 0) continue;
    total += 0.16 + 0.84 * Math.exp(-dist[p] / falloff);
    px.push(p);
    cum.push(total);
  }
  if (!px.length) return out;

  /* stratified: one draw per equal slice of the weight, so the sample covers
     the whole glyph instead of clumping wherever the random numbers landed */
  const picked: Array<[number, number, number]> = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const u = ((i + rand(i * 1.7)) / n) * total;
    while (k < px.length - 1 && cum[k] < u) k++;
    const p = px[k];
    /* a sub-pixel scatter, so the sample does not look like a screen door */
    const jx = (rand(i * 3.1) - 0.5) * 1.8;
    const jy = (rand(i * 7.7) - 0.5) * 1.8;
    picked.push([
      (((p % GRID) + jx) / GRID) * 2 - 1,
      1 - ((((p / GRID) | 0) + jy) / GRID) * 2,
      Math.exp(-dist[p] / falloff),
    ]);
  }

  /* ordered by angle, so morphing from one icon to the next sweeps around
     rather than reshuffling every point at once */
  picked.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));

  for (let i = 0; i < n; i++) {
    out.xy[i * 2] = picked[i][0];
    out.xy[i * 2 + 1] = picked[i][1];
    out.edge[i] = picked[i][2];
  }
  cache.set(key, out);
  return out;
}

/* The four. Each one is the thing somebody would draw if you asked them what
   the product was, which is the entire point of using them. */
export const ICONS: Record<string, IconDef> = {
  /* a filter: many go in across the top, few come out of the bottom */
  friction: { fills: ["M2 4h20L14.3 13.6V21.4l-4.6-2.3V13.6z"] },

  /* money, in the site's own display face. Solid: at this weight the strokes
     are barely wider than the shell, so hollowing them draws two rails down
     every stem and the middle of the glyph turns to scribble. */
  headroom: { glyph: "$", shell: 40 },

  /* THE MAP, NOT A PIN ON ONE. A pin says "a place"; this says which places.
     The ring is the Beltway, the diamond inside it is the District, and the
     line running down through both is the Potomac. Hand simplified on
     purpose: it has to read as that map at a glance from across a room, which
     survey accuracy would actively work against. */
  signal: {
    width: 1.15,
    strokes: [
      "M12 3.7C16.8 3.7 20.6 7.4 20.6 12C20.6 16.6 16.8 20.3 12 20.3C7.2 20.3 3.4 16.6 3.4 12C3.4 7.4 7.2 3.7 12 3.7Z",
      "M11.3 9.5L13.9 12.1L11.3 14.7L8.7 12.1Z",
      "M5.6 2.6C8.7 6.1 10.9 8.6 10.5 11.6C10.1 14.7 8.3 17.9 7.5 21.6",
    ],
  },

  /* the pin, now a small thing that lands on the map rather than being it */
  pin: {
    fillRule: "evenodd",
    fills: [
      "M12 1.4c-4.2 0-7.6 3.4-7.6 7.6 0 5.6 7.6 13.6 7.6 13.6s7.6-8 7.6-13.6c0-4.2-3.4-7.6-7.6-7.6Zm0 10.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z",
    ],
  },

  /* what ten thousand reviews come out as */
  num150: { glyph: "150", glyphScale: 0.44 },

  /* a cart, which is the moment Bumper interrupts. A bag was the first
     choice and a bag is a rounded rectangle: nothing about its outline says
     shopping. A cart has a handle, a basket and two wheels, and no other
     object has that silhouette. */
  bumper: {
    width: 1.9,
    strokes: ["M1.7 2.6H4.6L7.2 15.4Q7.5 16.8 8.9 16.8H18.1Q19.5 16.8 19.8 15.4L21.4 7.2H5.1"],
    fills: [
      "M11.25 20A1.85 1.85 0 1 1 7.55 20A1.85 1.85 0 1 1 11.25 20Z",
      "M20.15 20A1.85 1.85 0 1 1 16.45 20A1.85 1.85 0 1 1 20.15 20Z",
    ],
  },

  /* THE THREE PIECES OF ONE SENTENCE. Healthy Switch's whole argument is
     "keep the burger, swap the fries", so the formation needs the thing that
     stays and the thing that changes, and the change has to be a swap rather
     than an improvement. A burger that became a salad would be the product's
     opposite.

     The burger is drawn as a stack with real gaps between the layers, because
     a single blobby silhouette at this size is a bread roll. The gaps are what
     say sandwich. */
  burger: {
    fills: [
      /* top bun */
      "M2.8 10.6C2.8 6.1 6.9 3.1 12 3.1C17.1 3.1 21.2 6.1 21.2 10.6Z",
      /* lettuce, wider than the bun and scalloped underneath, which is the
         one detail that stops the stack reading as a stack of coins */
      "M1.9 11.3H22.1V12.4Q20.3 14.3 18.5 12.4Q16.7 14.3 14.9 12.4Q13.1 14.3 11.3 12.4Q9.5 14.3 7.7 12.4Q5.9 14.3 4.1 12.4Q3.0 13.7 1.9 12.4Z",
      /* the patty */
      "M3.1 14.9H20.9Q22.0 14.9 22.0 16.0V16.9Q22.0 18.0 20.9 18.0H3.1Q2.0 18.0 2.0 16.9V16.0Q2.0 14.9 3.1 14.9Z",
      /* bottom bun */
      "M2.6 18.8H21.4Q21.4 21.8 18.4 21.8H5.6Q2.6 21.8 2.6 18.8Z",
    ],
  },

  /* the side, before. Five sticks at five different heights, because an even
     comb is a fence, and the carton under them is what makes the comb food.

     THE GAPS ARE THE DRAWING. First go, the sticks were 1.9 units wide with
     0.6 between them, which at this raster is six pixels of gap against a
     five pixel shell: the distance transform bridged them and the whole side
     came out as one slab. Narrower sticks and wider gaps is the fix, and the
     notch in the top of the carton is the same argument — a straight edge
     flush against five stick ends is another way to say slab. */
  fries: {
    fills: [
      "M6.7 5.0L7.8 4.5L8.5 12.8L7.4 12.8Z",
      "M9.3 2.9L10.4 2.9L10.8 12.8L9.7 12.8Z",
      "M11.8 4.2L12.9 3.8L13.1 12.8L12.0 12.8Z",
      "M14.3 2.6L15.4 3.0L15.2 12.8L14.1 12.8Z",
      "M16.7 5.6L17.8 5.1L17.5 12.8L16.4 12.8Z",
      "M6.1 12.2H9.7L12.0 14.5L14.3 12.2H17.9L16.6 21.7Q16.5 22.5 15.7 22.5H8.3Q7.5 22.5 7.4 21.7Z",
    ],
  },

  /* the side, after. Two arcs meeting at a tip and a base, which is the whole
     of a leaf; the stem is what keeps it from reading as an eye. */
  leaf: {
    width: 1.5,
    fills: ["M20.8 3.2Q21.0 16.5 4.6 19.8Q6.5 4.0 20.8 3.2Z"],
    strokes: ["M4.6 19.8L2.6 22.2"],
  },
};
