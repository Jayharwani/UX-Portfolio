import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────────
   THE CONSTELLATION — one real 3D space, two canvases.

   TUNE THESE FIRST if the depth does not read. In order of effect:

     Z_FAR / Z_NEAR    the depth of the room. Widen this before anything else.
     PARALLAX          how far the camera travels with the pointer.
     SIZE / FRONT_Z    how large and how close the nearest particles get.

   Everything else below is dressing.

   WHY TWO CANVASES. The name has to have particles in front of it AND behind
   it, and it has to stay perfectly crisp — which rules out putting the type
   in the scene as geometry. So the field is split: a back canvas under the
   HTML <h1>, a front canvas over it, and the real text in between. Both
   canvases run the same camera, so they are one space that happens to be
   composited in two passes. Three draw calls in total.

   WHY A CUSTOM SHADER. PointsMaterial with sizeAttenuation gives size by
   distance but not opacity by distance, and atmospheric perspective — far
   things going dim, not just small — is half of what makes depth legible.
   The vertex shader computes both from view-space depth, so the fade stays
   correct as the field rotates rather than being baked once at build time.

   WHY THE LINES ARE BUILT ONCE. Neighbour search is O(n²); at 340 particles
   that is 58k distance tests, which is nothing once and a disaster every
   frame. The group's rotation carries the lines with the points, so the
   structure stays correct without recomputing anything.
   ────────────────────────────────────────────────────────────────────────── */

const TUNE = {
  /* the room */
  Z_NEAR: 450, // nearest back-layer particle
  Z_FAR: -420, // furthest
  CAMERA_Z: 600,
  FOV: 58,
  /* how far past the edge of the frame the field is built, so the parallax
     and the drift always have something to bring into view */
  OVERFILL: 1.3,

  /* the interaction */
  PARALLAX_X: 165, // world units the camera travels at full pointer deflection
  PARALLAX_Y: 105,
  EASE: 0.05, // lerp factor per frame — lower is heavier

  /* the field */
  COUNT: 340,
  FRONT_COUNT: 60,
  FRONT_Z_MIN: 120,
  FRONT_Z_MAX: 455,
  SIZE: 4.4,
  FRONT_SIZE: 7.2,
  /* the link threshold is in NORMALISED space, not world units — see the
     note on frustum fill below. 0 to 1 across the whole room. */
  LINK_N: 0.17,
  MAX_LINKS: 3,

  /* the drift, radians per second */
  SPIN_Y: 0.012,
  SPIN_X: 0.005,

  /* the entrance */
  INTRO_MS: 1500,
  INTRO_FROM: 0.62, // camera starts this fraction of the way in

  /* colour: far is a dim cool blue, near goes cyan into a soft violet */
  C_FAR: "#1E3566",
  C_MID: "#67D2F0",
  C_NEAR: "#A08CF2",
  BG: "#0B0D10", // the page's own --ink, so there is no seam at the band edge
} as const;

const POINT_VERT = `
  uniform float uPR;
  uniform float uSize;
  uniform float uNear;
  uniform float uFar;
  uniform float uOpacity;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = max(-mv.z, 1.0);
    gl_Position = projectionMatrix * mv;
    /* size by distance, clamped because GPUs cap gl_PointSize and a particle
       that hits the cap stops shrinking with distance, which reads as a bug */
    gl_PointSize = min(aSize * uSize * uPR * (420.0 / d), 110.0);
    vColor = aColor;
    /* atmospheric perspective: the far wall of the room fades toward nothing
       rather than staying crisp and small */
    vAlpha = uOpacity * clamp((uFar - d) / (uFar - uNear), 0.06, 1.0);
  }
`;

const POINT_FRAG = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.06, r);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/** deterministic, so the sky is a composition rather than a slot machine */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C_FAR = new THREE.Color(TUNE.C_FAR);
const C_MID = new THREE.Color(TUNE.C_MID);
const C_NEAR = new THREE.Color(TUNE.C_NEAR);
const scratch = new THREE.Color();

/** depth 0 = back wall, 1 = closest to camera */
function depthColor(t: number) {
  return t < 0.62
    ? scratch.copy(C_FAR).lerp(C_MID, t / 0.62)
    : scratch.copy(C_MID).lerp(C_NEAR, (t - 0.62) / 0.38);
}

interface LayerOpts {
  count: number;
  /** viewport aspect — the field is built to fill the frustum, so it matters */
  aspect: number;
  zMin: number;
  zMax: number;
  size: number;
  opacity: number;
  withLines: boolean;
  seed: number;
}

interface Layer {
  group: THREE.Group;
  uniforms: Record<string, THREE.IUniform>;
  dispose: () => void;
}

function buildLayer(o: LayerOpts): Layer {
  const rand = rng(o.seed);
  const group = new THREE.Group();

  const pos = new Float32Array(o.count * 3);
  const col = new Float32Array(o.count * 3);
  const siz = new Float32Array(o.count);
  /* normalised copies, for the neighbour search — see the note below */
  const nrm = new Float32Array(o.count * 3);

  /* THE FIELD FILLS THE FRUSTUM, NOT A BOX.

     The first version scattered particles through a fixed box and most of the
     near ones landed off screen, because a perspective projection throws a
     point at distance d outward in proportion to 1/d: at the near plane only
     x within about ±133 is still in frame, against ±900 at the back wall.
     A box therefore spends its near plane — the large, bright, depth-carrying
     particles — outside the picture, which is exactly the "looks flat"
     failure the brief warns about.

     Each particle is placed inside the frustum AT ITS OWN DEPTH instead, so
     every plane from the back wall to just in front of the lens is populated
     across the visible frame. It also makes the whole thing aspect-aware for
     free, which is what stops a tall phone frame from looking empty. */
  const tan = Math.tan(((TUNE.FOV / 2) * Math.PI) / 180);

  for (let i = 0; i < o.count; i++) {
    const z = o.zMin + rand() * (o.zMax - o.zMin);
    const d = TUNE.CAMERA_Z - z;
    const halfH = tan * d * TUNE.OVERFILL;
    const halfW = halfH * o.aspect;
    const nx = rand() * 2 - 1;
    const ny = rand() * 2 - 1;
    pos[i * 3] = nx * halfW;
    pos[i * 3 + 1] = ny * halfH;
    pos[i * 3 + 2] = z;

    /* Neighbours are found in normalised space for the same reason. In world
       units the near particles sit centimetres apart and the far ones metres,
       so one distance threshold either wires the near plane into a solid mesh
       or leaves the far one with no links at all. */
    nrm[i * 3] = nx;
    nrm[i * 3 + 1] = ny;
    nrm[i * 3 + 2] = (z - TUNE.Z_FAR) / (TUNE.Z_NEAR - TUNE.Z_FAR);

    const t = (z - TUNE.Z_FAR) / (TUNE.Z_NEAR - TUNE.Z_FAR);
    const c = depthColor(Math.max(0, Math.min(1, t)));
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;

    /* rand() * rand() is deliberately not uniform: it biases small, so most
       of the field is fine specks and a handful are big enough to read as
       genuinely close. An even distribution gives a spray of equal dots,
       which is exactly what "looks flat" means. */
    siz[i] = 0.8 + rand() * rand() * 3.6;
  }

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pointGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  pointGeo.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));

  const uniforms: Record<string, THREE.IUniform> = {
    uPR: { value: 1 },
    uSize: { value: o.size },
    uNear: { value: TUNE.CAMERA_Z - TUNE.Z_NEAR },
    uFar: { value: TUNE.CAMERA_Z - TUNE.Z_FAR + 260 },
    uOpacity: { value: 0 },
  };

  const pointMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pointGeo, pointMat);
  points.frustumCulled = false;
  group.add(points);

  let lineGeo: THREE.BufferGeometry | null = null;
  let lineMat: THREE.LineBasicMaterial | null = null;

  if (o.withLines) {
    /* O(n²) once at build. Capped per node, so the field stays sparse no
       matter how the threshold and the count interact. */
    const lp: number[] = [];
    const lc: number[] = [];
    const d2 = TUNE.LINK_N * TUNE.LINK_N;
    for (let i = 0; i < o.count; i++) {
      let made = 0;
      for (let j = i + 1; j < o.count && made < TUNE.MAX_LINKS; j++) {
        const dx = nrm[i * 3] - nrm[j * 3];
        const dy = nrm[i * 3 + 1] - nrm[j * 3 + 1];
        const dz = nrm[i * 3 + 2] - nrm[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz > d2) continue;
        lp.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
        lp.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        /* endpoints take their own depth colour, dimmed — vertex colours are
           how a LineBasicMaterial gets atmospheric perspective at all */
        for (const k of [i, j]) {
          lc.push(col[k * 3] * 0.42, col[k * 3 + 1] * 0.42, col[k * 3 + 2] * 0.42);
        }
        made++;
      }
    }
    lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lp), 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(lc), 3));
    lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.frustumCulled = false;
    group.add(lines);
  }

  return {
    group,
    uniforms,
    dispose: () => {
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo?.dispose();
      lineMat?.dispose();
    },
  };
}

interface Props {
  /** false parks the loop — the hero is scrolled past */
  running: boolean;
  reduce: boolean;
  /** scales the particle count down on phones and slow machines */
  density: number;
}

export default function Constellation({ running, reduce, density }: Props) {
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  /* running changes often; keeping it in a ref means the loop reads the
     current value without the whole scene being torn down and rebuilt */
  const runRef = useRef(running);
  runRef.current = running;

  useEffect(() => {
    const backMount = backRef.current;
    const frontMount = frontRef.current;
    if (!backMount || !frontMount) return;

    const count = Math.round(TUNE.COUNT * density);
    const frontCount = Math.round(TUNE.FRONT_COUNT * density);
    const pr = Math.min(window.devicePixelRatio, 2);

    const camera = new THREE.PerspectiveCamera(
      TUNE.FOV,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.set(0, 0, TUNE.CAMERA_Z);

    const backScene = new THREE.Scene();
    const frontScene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    const back = buildLayer({
      count,
      aspect,
      zMin: TUNE.Z_FAR,
      zMax: TUNE.Z_NEAR,
      size: TUNE.SIZE,
      opacity: 1,
      withLines: true,
      seed: 7,
    });
    const front = buildLayer({
      count: frontCount,
      aspect,
      zMin: TUNE.FRONT_Z_MIN,
      zMax: TUNE.FRONT_Z_MAX,
      size: TUNE.FRONT_SIZE,
      opacity: 0.5,
      withLines: false,
      seed: 31,
    });
    backScene.add(back.group);
    frontScene.add(front.group);

    const backRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    backRenderer.setPixelRatio(pr);
    backRenderer.setClearColor(new THREE.Color(TUNE.BG), 1);
    backMount.appendChild(backRenderer.domElement);

    /* the front pass is transparent so the name shows through everywhere the
       near particles are not */
    const frontRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    frontRenderer.setPixelRatio(pr);
    frontRenderer.setClearColor(0x000000, 0);
    frontMount.appendChild(frontRenderer.domElement);

    back.uniforms.uPR.value = pr;
    front.uniforms.uPR.value = pr;

    const size = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      backRenderer.setSize(w, h);
      frontRenderer.setSize(w, h);
    };
    size();

    /* ── the pointer ── */
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce && !coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    /* resize is throttled to a frame: a drag on a window corner fires it
       dozens of times a second and each one is two setSize calls */
    let resizeQueued = false;
    const onResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        size();
      });
    };
    window.addEventListener("resize", onResize);

    const drawBoth = () => {
      backRenderer.render(backScene, camera);
      frontRenderer.render(frontScene, camera);
    };

    const lineMat = back.group.children[1]
      ? ((back.group.children[1] as THREE.LineSegments).material as THREE.LineBasicMaterial)
      : null;

    /* ── reduced motion: one frame, at rest, and nothing else ── */
    if (reduce) {
      back.uniforms.uOpacity.value = 1;
      front.uniforms.uOpacity.value = 0.5;
      if (lineMat) lineMat.opacity = 0.24;
      drawBoth();
    }

    let raf = 0;
    let last = performance.now();
    const t0 = performance.now();

    /* The same guard the text carries, for the same reason. A document that
       mounts hidden produces no animation frames, so the loop never runs, so
       uOpacity never leaves zero and the hero is a dark rectangle with a name
       on it. If nothing has been drawn two and a half seconds in, the scene
       is put on screen at its resting state with no entrance at all.
       setTimeout is not rAF-driven, which is the entire point. */
    let painted = false;
    const bail = window.setTimeout(() => {
      if (painted) return;
      back.uniforms.uOpacity.value = 1;
      front.uniforms.uOpacity.value = 0.5;
      if (lineMat) lineMat.opacity = 0.24;
      camera.position.set(0, 0, TUNE.CAMERA_Z);
      camera.lookAt(0, 0, 0);
      drawBoth();
    }, 2500);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!runRef.current) return;
      painted = true;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      /* one orchestrated entrance: the camera eases back to its resting
         distance while the field comes up out of the dark */
      const p = Math.min(1, (now - t0) / TUNE.INTRO_MS);
      const e = 1 - Math.pow(1 - p, 3);
      const restZ = TUNE.CAMERA_Z;
      const introZ = restZ * TUNE.INTRO_FROM;

      back.uniforms.uOpacity.value = e;
      front.uniforms.uOpacity.value = e * 0.5;
      if (lineMat) lineMat.opacity = e * 0.24;

      /* the parallax. lookAt after moving, so the camera ORBITS the field
         rather than strafing across it — orbiting separates the near and far
         planes far more for the same amount of travel. */
      const tx = mx * TUNE.PARALLAX_X;
      const ty = -my * TUNE.PARALLAX_Y;
      camera.position.x += (tx - camera.position.x) * TUNE.EASE;
      camera.position.y += (ty - camera.position.y) * TUNE.EASE;
      camera.position.z = introZ + (restZ - introZ) * e;
      camera.lookAt(0, 0, 0);

      /* the ambient drift, so the space is alive with no pointer at all —
         which is the only motion a phone ever gets */
      back.group.rotation.y += TUNE.SPIN_Y * dt;
      back.group.rotation.x = Math.sin(now * 0.00007) * TUNE.SPIN_X * 12;
      front.group.rotation.y += TUNE.SPIN_Y * 0.6 * dt;

      drawBoth();
    };

    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      back.dispose();
      front.dispose();
      backScene.clear();
      frontScene.clear();
      backRenderer.dispose();
      frontRenderer.dispose();
      /* forceContextLoss is what actually frees the GPU context. Without it a
         single-page app that mounts this a few times runs out of contexts and
         the browser starts dropping the oldest ones. */
      backRenderer.forceContextLoss();
      frontRenderer.forceContextLoss();
      backRenderer.domElement.remove();
      frontRenderer.domElement.remove();
    };
  }, [reduce, density]);

  return (
    <>
      <div className="entry__sky entry__sky--back" ref={backRef} aria-hidden="true" />
      <div className="entry__sky entry__sky--front" ref={frontRef} aria-hidden="true" />
    </>
  );
}
