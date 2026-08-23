/* ──────────────────────────────────────────────────────────────────────────
   Orb web geometry.

   Built in the order an actual orb-weaver builds one, because that ordering IS
   the animation later and because it is the difference between this and a
   Halloween decal. Bridge, frame, radials, hub spiral, auxiliary spiral, then
   the capture spiral drawn inward while the auxiliary is erased behind it.

   Two rules do most of the work of making it read as silk rather than as a
   net:

   · Nothing is evenly spaced. Radial angles vary by ±14% of even spacing and
     frame anchors sit at 0.8–1.0 of nominal radius. Perfect symmetry is the
     single clearest tell of generated geometry — real webs are never
     symmetrical, and the irregularity is what sells it.

   · The capture spiral is Archimedean, not logarithmic. Constant spacing
     between turns with a little jitter, because a real capture spiral is laid
     down by a spider measuring with its own legs, not by a growth function.

   Everything derives from one integer seed, so a web is reproducible and each
   rebuild differs.
   ────────────────────────────────────────────────────────────────────────── */

export interface WebGeometry {
  /** hub, in local svg units */
  cx: number;
  cy: number;
  r: number;
  bridge: string;
  frame: string[];
  radials: string[];
  hubSpiral: string;
  auxSpiral: string;
  captureSpiral: string;
  /** every radial x spiral intersection, for the spider's node graph */
  nodes: { x: number; y: number; radial: number; ring: number }[];
  anchors: { x: number; y: number }[];
}

/** mulberry32 — small, fast, and good enough for geometry jitter */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const P = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;

export function buildWeb(size: number, seed: number): WebGeometry {
  const rand = rng(seed);
  /* The hub is off-centre. A web anchored in a corner is pulled toward its
     anchor points, so a centred hub would look like a doily. */
  const cx = size * 0.52;
  const cy = size * 0.46;
  const r = size * 0.46;

  const RADIALS = 16 + Math.floor(rand() * 5); // 16–20
  const FRAME_PTS = 5 + Math.floor(rand() * 3); // 5–7

  /* ── radial angles, deliberately uneven ──────────────────────────────── */
  const even = (Math.PI * 2) / RADIALS;
  const angles: number[] = [];
  let acc = rand() * Math.PI * 2;
  for (let i = 0; i < RADIALS; i++) {
    angles.push(acc);
    /* ±14% of even spacing (§3.2) */
    acc += even * (1 + (rand() - 0.5) * 0.28);
  }
  /* normalise so the last spoke does not overlap the first */
  const span = angles[angles.length - 1] - angles[0] + even;
  const k = (Math.PI * 2) / span;
  const a0 = angles[0];
  for (let i = 0; i < angles.length; i++) angles[i] = a0 + (angles[i] - a0) * k;

  /* ── frame: an irregular polygon the radials anchor to ───────────────── */
  const anchors: { x: number; y: number }[] = [];
  for (let i = 0; i < FRAME_PTS; i++) {
    const a = (i / FRAME_PTS) * Math.PI * 2 + rand() * 0.5;
    const rr = r * (0.8 + rand() * 0.2); // 0.8–1.0 of nominal (§3.2)
    anchors.push({ x: cx + Math.cos(a) * rr * 1.12, y: cy + Math.sin(a) * rr * 1.12 });
  }
  const frame: string[] = [];
  for (let i = 0; i < anchors.length; i++) {
    const p = anchors[i];
    const q = anchors[(i + 1) % anchors.length];
    frame.push(`M ${P(p.x, p.y)} L ${P(q.x, q.y)}`);
  }

  /* the bridge: the first thread, corner to corner across the gap */
  const bridge = `M ${P(anchors[0].x, anchors[0].y)} L ${P(
    anchors[Math.floor(anchors.length / 2)].x,
    anchors[Math.floor(anchors.length / 2)].y
  )}`;

  /* ── radials: hub out to wherever the frame actually is on that bearing ─ */
  function frameRadiusAt(theta: number) {
    /* distance from hub to the frame polygon along `theta`, by segment
       intersection — so radials genuinely stop at the frame rather than at a
       circle pretending to be one */
    let best = r * 1.12;
    for (let i = 0; i < anchors.length; i++) {
      const p = anchors[i];
      const q = anchors[(i + 1) % anchors.length];
      const dx = Math.cos(theta);
      const dy = Math.sin(theta);
      const ex = q.x - p.x;
      const ey = q.y - p.y;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-6) continue;
      const t = ((p.x - cx) * ey - (p.y - cy) * ex) / den;
      const u = ((p.x - cx) * dy - (p.y - cy) * dx) / den;
      if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
    }
    return best;
  }

  const radialLen = angles.map((a) => frameRadiusAt(a));
  const radials = angles.map(
    (a, i) => `M ${P(cx, cy)} L ${P(cx + Math.cos(a) * radialLen[i], cy + Math.sin(a) * radialLen[i])}`
  );

  /* ── hub spiral: tight, 3–4 turns ────────────────────────────────────── */
  const hubTurns = 2 + Math.floor(rand() * 2);
  const hubR = r * 0.085;
  let d = `M ${P(cx + hubR * 0.15, cy)}`;
  const HUB_STEPS = hubTurns * 14;
  for (let i = 1; i <= HUB_STEPS; i++) {
    const t = i / HUB_STEPS;
    const a = t * hubTurns * Math.PI * 2;
    const rr = hubR * (0.15 + t * 0.85);
    d += ` L ${P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)}`;
  }
  const hubSpiral = d;

  /* ── spirals: both Archimedean, constant spacing per turn ────────────── */
  function spiral(startR: number, endR: number, spacing: number, jitter: number) {
    const turns = Math.max(1, Math.abs(endR - startR) / spacing);
    const steps = Math.ceil(turns * 26);
    const nodes: { x: number; y: number; ring: number }[] = [];
    let path = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = t * turns * Math.PI * 2;
      const base = startR + (endR - startR) * t;
      const rr = base * (1 + (rand() - 0.5) * jitter);
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      path += (i === 0 ? "M " : " L ") + P(x, y);
      nodes.push({ x, y, ring: Math.floor(t * turns) });
    }
    return { path, nodes };
  }

  /* auxiliary: wide spacing, drawn OUTWARD. Temporary scaffolding. */
  const aux = spiral(hubR * 1.4, r * 0.8, r * 0.26, 0.06);
  /* capture: fine spacing, drawn INWARD, erasing the auxiliary behind it */
  const cap = spiral(r * 0.8, hubR * 2.2, r * 0.115, 0.08); // ±8% (§3.2)

  /* ── nodes: radial × capture-spiral intersections ────────────────────── */
  const nodes: { x: number; y: number; radial: number; ring: number }[] = [];
  const RINGS = 6;
  for (let ring = 1; ring <= RINGS; ring++) {
    const rr = hubR * 2.2 + ((r * 0.8 - hubR * 2.2) * ring) / RINGS;
    for (let i = 0; i < angles.length; i += 2) {
      const a = angles[i];
      if (rr > radialLen[i] * 0.98) continue;
      nodes.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, radial: i, ring });
    }
  }

  return {
    cx,
    cy,
    r,
    bridge,
    frame,
    radials,
    hubSpiral,
    auxSpiral: aux.path,
    captureSpiral: cap.path,
    nodes,
    anchors,
  };
}
