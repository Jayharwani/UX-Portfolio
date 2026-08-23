import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────────
   A corner node mesh — fibre-optic, not arachnid.

   The brief is explicit that this should read as a neural network or a fibre
   bundle rather than an organic web, and that distinction lives almost
   entirely in the CONNECTION RULE rather than in the styling. An orb web is
   radial: everything runs to a hub. A network is proximity-based: every node
   links to whatever happens to be near it, so the topology is irregular, has
   no centre, and reads as infrastructure.

   So nodes are scattered in a corner volume and connected by distance
   threshold, capped per node. Same geometry family as the SVG webs it
   replaces; completely different read.

   Cost control, because this is the heaviest thing the hero has carried:

   · ONE LineSegments and ONE Points for the whole cluster. Not a mesh per
     node, which would be dozens of draw calls for something that must sit
     behind text and never be looked at directly.
   · Positions are written into a preallocated Float32Array in place. Nothing
     is allocated per frame.
   · Edges are computed once at build time and only their endpoints move.
   ────────────────────────────────────────────────────────────────────────── */

interface Props {
  /** where the cluster sits, in world units */
  origin: [number, number, number];
  /** how far the nodes spread from the origin */
  spread: number;
  count: number;
  /** connect nodes closer than this */
  linkDist: number;
  /** 0..1 — deeper clusters are dimmer, which is what sells the depth */
  intensity: number;
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
  origin,
  spread,
  count,
  linkDist,
  intensity,
  seed,
  interactive,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  /* Built once. `home` is where each node wants to be; `pos` is where it
     currently is; `vel` carries the spring. Keeping the three separate is what
     lets the cursor push nodes around and have them return properly rather
     than snapping, which is the difference between physics and a hover state. */
  const { home, pos, vel, edges, pointGeo, lineGeo } = useMemo(() => {
    const rand = rng(seed);
    const home = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      /* cube-root bias pulls nodes toward the origin so the cluster has a
         dense core and a sparse edge, rather than reading as an even fog */
      const r = Math.cbrt(rand()) * spread;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      home[i * 3] = origin[0] + r * Math.sin(phi) * Math.cos(theta);
      home[i * 3 + 1] = origin[1] + r * Math.sin(phi) * Math.sin(theta);
      home[i * 3 + 2] = origin[2] + r * Math.cos(phi) * 0.55;
    }
    const pos = new Float32Array(home);
    const vel = new Float32Array(count * 3);

    /* proximity edges, capped so dense areas do not turn into a solid blob */
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
  }, [origin, spread, count, linkDist, seed]);

  /* a round soft sprite, so the nodes read as glowing points rather than as
     square pixels. Generated once, 32px, no network request. */
  const dotTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(180,205,255,0.75)");
    grad.addColorStop(1, "rgba(120,160,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);

  const linePositions = lineGeo.getAttribute("position") as THREE.BufferAttribute;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    /* clamp: a backgrounded tab returns with a huge delta and would explode
       the spring on the first frame back */
    const dt = Math.min(delta, 0.05);

    /* pointer in normalised device coords, projected onto the cluster plane */
    const px = state.pointer.x * state.viewport.width * 0.5;
    const py = state.pointer.y * state.viewport.height * 0.5;

    /* §C: a slow Z breathe, per cluster, so an untouched scene is never still */
    const breathe = Math.sin(t * 0.24 + seed) * 0.16;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const hx = home[ix];
      const hy = home[ix + 1];
      const hz = home[ix + 2] + breathe;

      /* spring home */
      vel[ix] += (hx - pos[ix]) * 5.5 * dt;
      vel[ix + 1] += (hy - pos[ix + 1]) * 5.5 * dt;
      vel[ix + 2] += (hz - pos[ix + 2]) * 5.5 * dt;

      if (interactive) {
        /* cursor repulsion in the xy plane, quadratic falloff. Repel rather
           than attract: attraction drags the whole cluster toward the centre
           of the composition, which is exactly where it must not go. */
        const dx = pos[ix] - px;
        const dy = pos[ix + 1] - py;
        const d2 = dx * dx + dy * dy;
        const R = 2.6;
        if (d2 < R * R && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) ** 2 * 9;
          vel[ix] += (dx / d) * f * dt;
          vel[ix + 1] += (dy / d) * f * dt;
        }
      }

      /* damping. High enough that displaced nodes drift back over about a
         second rather than snapping, which is what makes it read as a
         medium with weight rather than as a hover effect. */
      const damp = Math.pow(0.0016, dt);
      vel[ix] *= damp;
      vel[ix + 1] *= damp;
      vel[ix + 2] *= damp;

      pos[ix] += vel[ix] * dt;
      pos[ix + 1] += vel[ix + 1] * dt;
      pos[ix + 2] += vel[ix + 2] * dt;
    }

    /* rewrite the edge endpoints from the node positions */
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
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        {/* additive so overlapping threads brighten where they cross, which is
            what makes a flat line read as fibre carrying light */}
        <lineBasicMaterial
          color="#5B8CFF"
          transparent
          opacity={0.34 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial
          map={dotTexture}
          color="#AFC6FF"
          size={0.085}
          sizeAttenuation
          transparent
          opacity={0.9 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
