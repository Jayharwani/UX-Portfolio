/* --------------------------------------------------------------------------
   WHERE A POINT ON THE CARD LANDS ON THE SCREEN, AND BACK AGAIN.

   The card is a real 3D transform inside a `perspective`, so a pointer at
   (clientX, clientY) is not at the card coordinate directly under it. Two
   pieces solve that: a projector that reproduces the CSS exactly, and a
   homography built from the four projected corners that inverts it.

   WHY NOT getBoundingClientRect OR elementFromPoint. Both give you the
   flattened bounding box of a tilted plane, which is not the plane. And both
   are layout reads, which is the one thing this cannot afford: the projector
   runs over thousands of particle positions every frame.

   Built once per pose. After that it is arithmetic with no allocations.
   -------------------------------------------------------------------------- */

import { BASE_H, BASE_W } from "./fit";

export type Pose = {
  /** the card's top-left in stage pixels */
  tx: number;
  ty: number;
  ry: number;
  rx: number;
  rz: number;
  k: number;
  persp: number;
  /** perspective-origin in stage pixels */
  ox: number;
  oy: number;
};

export type Pt = [number, number];

const HALF_W = BASE_W / 2;
const HALF_H = BASE_H / 2;

/** Card space to screen. Matches `translate3d() rotateY() rotateX() rotateZ()
 *  scale()` about the card's centre, inside a parent with perspective. */
export function projector(p: Pose): (u: number, v: number) => Pt {
  const m = new DOMMatrix()
    .rotateAxisAngleSelf(0, 1, 0, p.ry)
    .rotateAxisAngleSelf(1, 0, 0, p.rx)
    .rotateAxisAngleSelf(0, 0, 1, p.rz)
    .scaleSelf(p.k, p.k, 1);
  /* DOMMatrix is column-major: x' = m11·x + m21·y, y' = m12·x + m22·y */
  const { m11, m12, m13, m21, m22, m23 } = m;
  const cx = p.tx + HALF_W;
  const cy = p.ty + HALF_H;
  const { persp, ox, oy } = p;

  return (u: number, v: number): Pt => {
    const x = u - HALF_W;
    const y = v - HALF_H;
    const X = m11 * x + m21 * y;
    const Y = m12 * x + m22 * y;
    const Z = m13 * x + m23 * y;
    /* CSS perspective: whatever is nearer the viewer grows */
    const f = persp / (persp - Z);
    return [ox + (cx + X - ox) * f, oy + (cy + Y - oy) * f];
  };
}

/** Eight unknowns from four point pairs, solved by Gauss-Jordan with partial
 *  pivoting. h33 is fixed at 1, which is what makes it eight and not nine. */
export function homography(src: Pt[], dst: Pt[]): number[] {
  const a: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let piv = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(a[r][c]) > Math.abs(a[piv][c])) piv = r;
    [a[c], a[piv]] = [a[piv], a[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = a[r][c] / a[c][c];
      for (let k = c; k < 9; k++) a[r][k] -= f * a[c][k];
    }
  }
  return [...a.map((row, i) => row[8] / row[i]), 1];
}

export function applyH(h: number[], x: number, y: number): Pt {
  const w = h[6] * x + h[7] * y + h[8];
  return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];
}

/** the card's corners, in card space */
export const CORNERS: Pt[] = [
  [0, 0],
  [BASE_W, 0],
  [BASE_W, BASE_H],
  [0, BASE_H],
];

/** screen to card, for the pointer */
export function screenToCard(pose: Pose): number[] {
  const p = projector(pose);
  return homography(
    CORNERS.map(([u, v]) => p(u, v)),
    CORNERS,
  );
}
