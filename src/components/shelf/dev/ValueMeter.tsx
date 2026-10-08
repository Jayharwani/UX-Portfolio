import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/* --------------------------------------------------------------------------
   THE VALUE METER.  Development only; see HomeShelf for the import.meta.env.DEV
   gate that keeps it out of the bundle.

   It reads the finished frame back off the GPU once a second and reports three
   numbers: what share of pixels is darker than luma 60, the mean luma, and
   what share is clipped. Those are the acceptance criteria for the whole look,
   and they are the reason this scene can be tuned at all -- "looks dark enough"
   is not a thing anyone can agree on, and 0.1% versus 75% is.

   PRIORITY 2 MATTERS. The EffectComposer renders at priority 1, so a frame
   callback at 2 runs after it and reads the post-processed result. Anything
   lower reads the raw buffer and reports numbers for an image nobody sees.
   -------------------------------------------------------------------------- */

export type Reading = { dark: number; mean: number; clipped: number };

/* The badge is a plain DOM node this component makes and removes itself,
   rather than a drei <Html> inside the canvas. <Html> would have dragged a
   portal, and the import with it, into a production bundle that never renders
   one -- a development tool is not worth a kilobyte of everyone else's. */
function badge() {
  let el = document.getElementById("shelf-meter") as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = "shelf-meter";
    el.className = "shelf-meter";
    document.body.appendChild(el);
  }
  return el;
}

export default function ValueMeter() {
  const gl = useThree((s) => s.gl);
  const frame = useRef(0);

  useEffect(() => () => document.getElementById("shelf-meter")?.remove(), []);

  useFrame(() => {
    frame.current += 1;
    if (frame.current % 60 !== 0) return;
    const ctx = gl.getContext();
    const w = ctx.drawingBufferWidth;
    const h = ctx.drawingBufferHeight;
    const px = new Uint8Array(w * h * 4);
    ctx.readPixels(0, 0, w, h, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
    let dark = 0;
    let clipped = 0;
    let sum = 0;
    let n = 0;
    /* a prime stride, so the sample never lands on a repeating pattern */
    for (let i = 0; i < px.length; i += 4 * 61) {
      const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
      sum += l;
      n += 1;
      if (l < 60) dark += 1;
      if (l > 245) clipped += 1;
    }
    const r: Reading = { dark: dark / n, mean: sum / n, clipped: clipped / n };
    badge().textContent = `dark ${(r.dark * 100).toFixed(1)}%  mean ${r.mean.toFixed(0)}  clip ${(r.clipped * 100).toFixed(2)}%`;
  }, 2);

  return null;
}
