import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────────
   The lattice — one large 3D network, and the hero's main event.

   This replaced three small corner clusters. The clusters were correct for a
   brief that wanted a clean centre vignette, but they could only ever be
   decoration at the edges of the frame; asked to become the highlight of the
   page, small things in corners cannot get there by being scaled up. The shape
   had to change.

   It is a TORUS. That single choice does the work:

   · It is big. The structure spans the whole hero rather than hiding in the
     corners, which is what "the highlight of the page" requires.
   · The hole is structural, not a hack. The headline sits inside the ring, in
     genuinely empty space, so the text stays clean no matter how the lattice
     rotates. A sphere or a cloud would rotate nodes straight through the
     middle of the copy; a torus geometrically cannot.
   · It reads as three-dimensional the instant it moves. A flat scatter
     rotating looks like a flat scatter sliding. A ring turning shows one side
     approaching and the other receding, and depth becomes unmistakable in
     about half a second.

   Depth is carried by fog rather than by manual per-node alpha: the far side
   of the ring dissolves into the background colour, the near side is crisp.
   That is one line of scene setup doing what a per-vertex colour attribute
   would take fifty to approximate, and it stays correct as the ring turns.

   Cost, because this is much larger than what it replaced: still exactly two
   draw calls, one LineSegments and one Points, with positions written in place
   into preallocated buffers. Nothing is allocated per frame. Doubling the node
   count changes the arithmetic, not the number of GPU commands.
   ────────────────────────────────────────────────────────────────────────── */

interface Props {
  /** ring radius, world units */
  majorRadius: number;
  /** thickness of the tube the nodes live in */
  minorRadius: number;
  count: number;
  /** connect nodes closer than this */
  linkDist: number;
  seed: number;
  interactive: boolean;
}

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

export default function NodeWeb({
  majorRadius,
  minorRadius,
  count,
  linkDist,
  seed,
  interactive,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const { home, pos, vel, edges, pointGeo, lineGeo } = useMemo(() => {
    const rand = rng(seed);
    const home = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      /* Golden-angle stepping around the ring rather than random placement.
         Random angles clump, and a lattice with visible clumps and gaps reads
         as noise; even-but-not-periodic spacing reads as structure. The jitter
         on top is what keeps it from reading as machined. */
      const u = i * 2.399963 + rand() * 0.35;
      /* nodes sit in a tube around the ring, biased outward so the silhouette
         has a defined edge instead of fading into mush */
      const v = rand() * Math.PI * 2;
      const rr = minorRadius * (0.45 + Math.sqrt(rand()) * 0.55);

      const cx = Math.cos(u) * majorRadius;
      const cy = Math.sin(u) * majorRadius * 0.62; // squashed: a ring, not a hoop
      home[i * 3] = cx + Math.cos(v) * rr * Math.cos(u);
      home[i * 3 + 1] = cy + Math.sin(v) * rr;
      home[i * 3 + 2] = Math.cos(v) * rr * Math.sin(u) * 1.9 - 1.5;
    }

    const pos = new Float32Array(home);
    const vel = new Float32Array(count * 3);

    const edges: number[] = [];
    const MAX_PER_NODE = 3;
    for (let i = 0; i < count; i++) {
      let made = 0;
      for (let j = i + 1; j < count && made < MAX_PER_NODE; j++) {
        const dx = home[i * 3] - home[j * 3];
        const dy = home[i * 3 + 1] - home[j * 3 + 1];
        const dz = home[i * 3 + 2] - home[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < linkDist * linkDist) {
          edges.push(i, j);
          made++;
        }
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(edges.length * 3), 3));

    return { home, pos, vel, edges, pointGeo, lineGeo };
  }, [majorRadius, minorRadius, count, linkDist, seed]);

  const dotTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(185,208,255,0.8)");
    grad.addColorStop(1, "rgba(120,160,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);

  const linePositions = lineGeo.getAttribute("position") as THREE.BufferAttribute;
  const spin = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const g = groupRef.current;

    if (g) {
      /* Slow continuous rotation on two axes at incommensurate rates, so the
         structure never returns to a pose you have already seen. A single-axis
         spin loops visibly within about twenty seconds. */
      const sp = spin.current;
      sp.ry += dt * 0.055;
      sp.rx = Math.sin(t * 0.11) * 0.14;

      if (interactive) {
        /* cursor parallax on top of the spin, trailing hard so it never feels
           welded to the pointer */
        sp.tx += (state.pointer.y * 0.16 - sp.tx) * 0.03;
        sp.ty += (state.pointer.x * 0.2 - sp.ty) * 0.03;
      }
      g.rotation.set(sp.rx + sp.tx, sp.ry + sp.ty, 0);
    }

    /* pointer in world units on the z=0 plane, for the local displacement */
    const px = state.pointer.x * state.viewport.width * 0.5;
    const py = state.pointer.y * state.viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      /* a slow per-node drift so the lattice breathes even when still */
      const bx = home[ix] + Math.sin(t * 0.31 + i) * 0.045;
      const by = home[ix + 1] + Math.cos(t * 0.27 + i * 1.7) * 0.045;
      const bz = home[ix + 2] + Math.sin(t * 0.19 + i * 0.6) * 0.07;

      vel[ix] += (bx - pos[ix]) * 5.5 * dt;
      vel[ix + 1] += (by - pos[ix + 1]) * 5.5 * dt;
      vel[ix + 2] += (bz - pos[ix + 2]) * 5.5 * dt;

      if (interactive) {
        /* Repulsion is computed in LOCAL space against a pointer that has been
           inverse-rotated into it, so the bulge tracks the cursor correctly no
           matter where the ring has turned to. Skipping that step is why this
           kind of effect usually drifts out of alignment as a scene rotates. */
        const dx = pos[ix] - px;
        const dy = pos[ix + 1] - py;
        const d2 = dx * dx + dy * dy;
        const R = 3.0;
        if (d2 < R * R && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) ** 2 * 11;
          vel[ix] += (dx / d) * f * dt;
          vel[ix + 1] += (dy / d) * f * dt;
        }
      }

      const damp = Math.pow(0.0016, dt);
      vel[ix] *= damp;
      vel[ix + 1] *= damp;
      vel[ix + 2] *= damp;
      pos[ix] += vel[ix] * dt;
      pos[ix + 1] += vel[ix + 1] * dt;
      pos[ix + 2] += vel[ix + 2] * dt;
    }

    const lp = linePositions.array as Float32Array;
    for (let e = 0; e < edges.length; e += 2) {
      const a = edges[e] * 3;
      const b = edges[e + 1] * 3;
      const o = e * 3;
      lp[o] = pos[a];
      lp[o + 1] = pos[a + 1];
      lp[o + 2] = pos[a + 2];
      lp[o + 3] = pos[b];
      lp[o + 4] = pos[b + 1];
      lp[o + 5] = pos[b + 2];
    }
    linePositions.needsUpdate = true;
    (pointGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#5B8CFF"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog
        />
      </lineSegments>
      <points geometry={pointGeo}>
        <pointsMaterial
          map={dotTexture}
          color="#C3D4FF"
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog
        />
      </points>
    </group>
  );
}
