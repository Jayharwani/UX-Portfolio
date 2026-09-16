import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* ──────────────────────────────────────────────────────────────────────────
   ANATOMY — the page's own parts, pulled apart into depth.

   ── THE THREE CONSTANTS TO TUNE FIRST ───────────────────────────────────
     C.COUNT      how many frames. Density is the whole mood.
     ACCENTS      the four project colours. The only colour in the section.
     C.BLOOM      past ~0.4 it stops reading as light and reads as a mistake.
   ─────────────────────────────────────────────────────────────────────────

   WHY THIS AND NOT A BLOB, A FIELD, OR PARTICLES.

   Every previous attempt imported a look from somewhere else and set the
   portfolio behind it. This one is built out of what the page is already
   made of: hairline frames, rules, and the four project accents. The frames
   are the same frames the work section puts its live previews in, three
   hundred pixels further down — so the hero is not decorating the site, it
   is the site's own anatomy laid out in space.

   For a design engineer that is also the argument. The hero is an interface
   taken apart and put back together, which is the job.

   WHAT MAKES IT 2026 RATHER THAN 2019. Three things the research kept
   pointing at, all of them here and none of them bolted on:

   · BROKEN GRID. Frames sit on a deliberately asymmetric lattice with real
     jitter and overlap, not a centred array.
   · DEPTH WITH A PURPOSE. The assembly is the message — scattered to
     aligned — rather than depth for its own sake.
   · KINETIC TYPE. The name settles in variable-font weight and tracking as
     the frames land. That part lives in Hero.tsx, in CSS, where the type
     stays real text.

   THE ENTRANCE IS ONE UNIFORM. Every vertex carries both where it starts
   (scattered, far back) and where it belongs, and the vertex shader mixes
   between them by uAssemble. The whole composition resolves from one number
   ramping 0 to 1 — no per-frame CPU work, no tweening thirty objects, and it
   is impossible for the pieces to arrive out of sync.

   EVERYTHING IS LINES. One BufferGeometry, one draw call, one material. A
   site whose entire visual language is hairlines should have a hero made of
   hairlines, and the cheapest thing to render happens to also be the most
   honest thing to render.
   ────────────────────────────────────────────────────────────────────────── */

const C = {
  /* ── the field ── */
  COUNT: 20, // frames. Twenty reads as a composition; thirty-four read as
  //            noise, and the fix for noise is never more of it
  Z_NEAR: 1.1, // nearest frame, world units in front of the origin
  Z_FAR: -15.0,
  CAMERA_Z: 6.0,
  FOV: 42,
  OVERFILL: 1.22, // how far past the frame edge the lattice is built
  GRID: 7, // broken-grid divisions before jitter
  JITTER: 0.46, // how far a frame may wander off its cell, 0..0.5
  /* the horizontal band the name occupies. Large frames are pushed out of
     it rather than dimmed inside it — leaving a corridor empty is honest
     composition; scrimming over a busy one is a patch. */
  CLEAR_BAND: 0.34,

  /* frame proportions, picked from the shapes a layout actually uses */
  SIZE_MIN: 0.5,
  SIZE_MAX: 1.5,

  /* ── the interaction ── */
  PARALLAX: 0.78, // world units the camera orbits at full pointer deflection
  EASE: 0.045, // damping. Lower is heavier and more expensive-feeling
  DRIFT: 0.09, // autonomous camera sway, so it lives without a pointer

  /* ── the grade ── */
  BLOOM: 0.2,
  BLOOM_RADIUS: 0.8,
  BLOOM_THRESHOLD: 0.42,
  EXPOSURE: 1.15,
  ABERRATION: 0.09, // low: coloured fringing on a one-pixel line reads as a
  //                    rendering fault rather than as a lens
  /* grain lives on the page now, not in this pass — one texture over
     everything, so the hero's ground and the bands' cannot disagree */
  VIGNETTE: 0.55,

  /* ── the exit ──
     Scrolling out of the hero runs the assembly BACKWARDS. The pieces return
     along the exact paths they arrived on, because the shader already knows
     both ends of every vertex's journey — the scroll just drives the same
     mix the entrance did. A composition that comes apart as you leave it is
     the scroll-driven scene deconstruction the trend pieces keep pointing
     at, and here it costs one uniform and no new geometry. */
  DEPART_AT: 0.25, // fraction of the hero scrolled before it starts coming apart
  DEPART_BY: 0.85, // and fully apart by here

  /* ── the entrance ── */
  INTRO_MS: 2200,
  SCATTER_Z: 26, // how far back the pieces start
  SCATTER_XY: 3.4,

  /* ── performance ── */
  RENDER_SCALE: 1.0,
  RENDER_SCALE_SMALL: 0.8,
  COUNT_SMALL: 14,
} as const;

/* The four project accents, in the order the work section uses them. This is
   the only colour in the hero, and it is colour the page has already earned
   rather than a palette invented for a background. */
const ACCENTS = ["#1F9D55", "#34D399", "#A78BFA", "#14B8A6"] as const;
const HAIR = "#F2F1EC"; // --on-ink

/* NO BACKGROUND COLOUR. The canvas used to clear to the page's --ink and it
   still produced a visible seam where the hero met the band below it, because
   the clear colour does not survive the pipeline: ACES tone mapping darkens
   it and the vignette then multiplied it further toward black. The hero was
   rendering a different, darker grey than the CSS underneath, and no amount
   of matching the two hex values would have fixed it — one of them was going
   through a tone mapper and the other was not.

   So the canvas is transparent and the page provides the ground. The bands
   and the hero are now the same colour because they are the SAME PIXELS, not
   because two numbers were tuned to agree. */

const VERT = `
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aWeight;

  uniform float uTime;
  uniform float uAssemble;
  uniform float uFade;
  uniform float uNear;
  uniform float uFar;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    /* THE ENTRANCE, in one line. Each vertex knows where it started and
       where it belongs; uAssemble is the only thing that moves. */
    vec3 p = mix(aStart, position, uAssemble);

    /* a slow individual drift once assembled, so the composition breathes
       without anything looping visibly. Per-vertex phase, so neighbouring
       frames never move together. */
    float live = uAssemble * uAssemble;
    p.y += sin(uTime * 0.23 + aPhase) * 0.042 * live;
    p.x += cos(uTime * 0.17 + aPhase * 1.7) * 0.034 * live;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = max(-mv.z, 0.001);
    gl_Position = projectionMatrix * mv;

    vColor = aColor;
    /* atmospheric perspective: the back of the stack fades toward the page
       colour rather than staying crisp and small */
    float depth = clamp((uFar - d) / (uFar - uNear), 0.0, 1.0);
    vAlpha = uFade * aWeight * (0.12 + 0.88 * depth * depth);
  }
`;

const FRAG = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uAberration: { value: C.ABERRATION },
    uVignette: { value: C.VIGNETTE },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uTime;
    uniform float uAberration;
      uniform float uVignette;
    varying vec2 vUv;

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      /* scaled by r², so the fringing lives at the edges of the frame the way
         it does in a real lens and never touches the type in the middle */
      vec2 off = c * r2 * uAberration * 0.06;
      vec4 mid = texture2D(tDiffuse, vUv);
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = mid.g;
      col.b = texture2D(tDiffuse, vUv - off).b;

      /* THE VIGNETTE MULTIPLIES ALPHA, NOT COLOUR. Multiplying colour fades
         the frame toward BLACK, which is a different colour from the page and
         is what put a hard seam under the hero. Multiplying alpha fades it
         toward whatever is behind the canvas, which is the page itself. A
         vignette should mean "less of this", not "more black". */
      float a = mid.a * (1.0 - uVignette * r2 * 1.5);
      gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    }
  `,
};

/** deterministic, so the composition is a decision rather than a slot machine */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Built {
  geometry: THREE.BufferGeometry;
}

/* ── the composition ──────────────────────────────────────────────────────
   Each frame is an outline plus the rules that make it read as an INTERFACE
   frame rather than as a rectangle: a header rule near the top, two or three
   content rules below it, and on a few of them one short accent bar. That
   detail is the entire difference between "floating rectangles" and "the
   anatomy of a layout".

   Placement is a broken grid: cells, then a large jitter, then explicit
   permission to overlap. A regular lattice reads as a screensaver; a jittered
   one reads as a composition someone made.                                  */
function build(count: number, aspect: number, seed: number): Built {
  const rand = rng(seed);
  const pos: number[] = [];
  const start: number[] = [];
  const col: number[] = [];
  const phase: number[] = [];
  const weight: number[] = [];

  const tan = Math.tan(((C.FOV / 2) * Math.PI) / 180);
  const hair = new THREE.Color(HAIR);
  const accents = ACCENTS.map((a) => new THREE.Color(a));

  const seg = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    z: number,
    c: THREE.Color,
    w: number,
    ph: number
  ) => {
    pos.push(ax, ay, z, bx, by, z);
    /* the scatter: far back, thrown sideways, and the further back a piece
       starts the further it travels — so the assembly reads as depth
       collapsing rather than as a fade */
    const sz = z - C.SCATTER_Z * (0.35 + rand() * 0.65);
    const sx = (rand() * 2 - 1) * C.SCATTER_XY;
    const sy = (rand() * 2 - 1) * C.SCATTER_XY;
    start.push(ax + sx, ay + sy, sz, bx + sx, by + sy, sz);
    for (let k = 0; k < 2; k++) {
      col.push(c.r, c.g, c.b);
      phase.push(ph);
      weight.push(w);
    }
  };

  for (let i = 0; i < count; i++) {
    /* biased toward the back, so the near plane stays sparse and the name
       never has to fight a large frame sitting right on the lens */
    const t = Math.pow(rand(), 0.7);
    const z = C.Z_NEAR + (C.Z_FAR - C.Z_NEAR) * t;

    const d = C.CAMERA_Z - z;
    const halfH = tan * d * C.OVERFILL;
    const halfW = halfH * aspect;

    /* broken grid: a cell, then enough jitter to break it */
    const gx = Math.floor(rand() * C.GRID);
    const gy = Math.floor(rand() * C.GRID);
    const cx = ((gx + 0.5) / C.GRID) * 2 - 1 + (rand() * 2 - 1) * (C.JITTER / C.GRID) * 2;
    let cy = ((gy + 0.5) / C.GRID) * 2 - 1 + (rand() * 2 - 1) * (C.JITTER / C.GRID) * 2;

    /* frame proportions taken from the shapes a layout actually uses */
    const scale = (C.SIZE_MIN + rand() * (C.SIZE_MAX - C.SIZE_MIN)) * (d / C.CAMERA_Z);

    /* THE CORRIDOR. A big frame crossing the middle of the frame competes
       with the name, so big frames are moved out of that band and small
       distant ones are allowed to stay — the band gets texture without
       getting a rival. Emptying the space beats dimming what is in it. */
    const big = scale > (C.SIZE_MIN + C.SIZE_MAX) * 0.5 * (d / C.CAMERA_Z);
    if (big && Math.abs(cy) < C.CLEAR_BAND) {
      cy = (cy < 0 ? -1 : 1) * (C.CLEAR_BAND + rand() * (1 - C.CLEAR_BAND));
    }

    const x = cx * halfW;
    const y = cy * halfH;
    const ratios = [1.6, 1.33, 1.0, 0.75];
    const ratio = ratios[Math.floor(rand() * ratios.length)];
    const w = scale * ratio;
    const h = scale;
    const ph = rand() * 6.283;

    const l = x - w / 2;
    const r = x + w / 2;
    const b = y - h / 2;
    const tp = y + h / 2;

    /* the outline */
    seg(l, tp, r, tp, z, hair, 0.55, ph);
    seg(r, tp, r, b, z, hair, 0.55, ph);
    seg(r, b, l, b, z, hair, 0.55, ph);
    seg(l, b, l, tp, z, hair, 0.55, ph);

    /* the header rule — this one line is most of what makes it read as a
       frame with something in it */
    const hy = tp - h * 0.19;
    seg(l, hy, r, hy, z, hair, 0.34, ph);

    /* content rules, short and left-aligned the way real ones are */
    const rows = 2 + Math.floor(rand() * 2);
    for (let k = 0; k < rows; k++) {
      const ry = hy - h * (0.16 + k * 0.15);
      const rw = w * (0.3 + rand() * 0.45);
      seg(l + w * 0.09, ry, l + w * 0.09 + rw, ry, z, hair, 0.26, ph);
    }

    /* one frame in three carries a project accent: a short bar in the
       header, exactly where the work cards put theirs */
    if (rand() < 0.34) {
      const a = accents[Math.floor(rand() * accents.length)];
      const by2 = tp - h * 0.095;
      seg(l + w * 0.09, by2, l + w * 0.09 + w * 0.22, by2, z, a, 1.0, ph);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute("aStart", new THREE.Float32BufferAttribute(start, 3));
  geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(col, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
  geometry.setAttribute("aWeight", new THREE.Float32BufferAttribute(weight, 1));
  return { geometry };
}

interface Props {
  /** false parks the loop — the hero is scrolled past */
  running: boolean;
  reduce: boolean;
  /** phones and downgraded machines: fewer frames, smaller buffer */
  small: boolean;
}

export default function Anatomy({ running, reduce, small }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const runRef = useRef(running);
  runRef.current = running;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scale = small ? C.RENDER_SCALE_SMALL : C.RENDER_SCALE;
    const pr = Math.min(window.devicePixelRatio, 2) * scale;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = C.EXPOSURE;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      C.FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, C.CAMERA_Z);

    const { geometry } = build(
      small ? C.COUNT_SMALL : C.COUNT,
      window.innerWidth / window.innerHeight,
      11
    );

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uAssemble: { value: reduce ? 1 : 0 },
      uFade: { value: reduce ? 1 : 0 },
      uNear: { value: C.CAMERA_Z - C.Z_NEAR },
      uFar: { value: C.CAMERA_Z - C.Z_FAR },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    scene.add(lines);

    /* ── the grade ── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      reduce ? C.BLOOM : 0,
      C.BLOOM_RADIUS,
      C.BLOOM_THRESHOLD
    );
    composer.addPass(bloom);
    const finish = new ShaderPass(FinishShader);
    composer.addPass(finish);
    composer.addPass(new OutputPass());

    const size = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w * pr, h * pr);
      (finish.uniforms.uRes.value as THREE.Vector2).set(w * pr, h * pr);
    };
    size();

    /* ── the pointer ── */
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let tx = 0;
    let ty = 0;
    let ex = 0;
    let ey = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce && !coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

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

    /* ── reduced motion: one frame, assembled, fully graded ── */
    if (reduce) {
      uniforms.uTime.value = 11;
      finish.uniforms.uTime.value = 11;
      camera.position.set(0.22, -0.1, C.CAMERA_Z);
      camera.lookAt(0, 0, 0);
      composer.render();
    }

    let raf = 0;
    const t0 = performance.now();
    let painted = false;

    /* A document that mounts hidden produces no animation frames, so
       uAssemble would never leave zero and the hero would be an empty
       rectangle. If nothing has been drawn two and a half seconds in, the
       composition lands assembled. setTimeout is not rAF-driven, which is
       the entire point. */
    const bail = window.setTimeout(() => {
      if (painted || reduce) return;
      uniforms.uAssemble.value = 1;
      uniforms.uFade.value = 1;
      uniforms.uTime.value = 11;
      finish.uniforms.uTime.value = 11;
      bloom.strength = C.BLOOM;
      camera.position.set(0.22, -0.1, C.CAMERA_Z);
      camera.lookAt(0, 0, 0);
      composer.render();
    }, 2500);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!runRef.current) return;
      painted = true;
      const t = (now - t0) / 1000;

      /* one orchestrated entrance: the pieces converge out of depth while
         the whole field comes up, and the bloom arrives with them rather
         than after */
      const p = Math.min(1, (now - t0) / C.INTRO_MS);
      const e = 1 - Math.pow(1 - p, 4);

      /* how far out of the hero we have scrolled, 0 to 1. Read from the host
         rather than from window.scrollY against a guessed height, so it stays
         correct whatever the hero's size turns out to be. */
      const box = host.getBoundingClientRect();
      const past = Math.min(1, Math.max(0, -box.top / Math.max(box.height, 1)));
      const depart = Math.min(
        1,
        Math.max(0, (past - C.DEPART_AT) / (C.DEPART_BY - C.DEPART_AT))
      );
      /* eased, so the composition lets go slowly and then all at once */
      const d = depart * depart * (3 - 2 * depart);

      uniforms.uAssemble.value = e * (1 - d);
      uniforms.uFade.value = Math.min(1, p * 1.6) * (1 - d);
      bloom.strength = C.BLOOM * e * (1 - d);

      uniforms.uTime.value = t;
      finish.uniforms.uTime.value = t;

      /* the camera keeps moving with no pointer at all, which is the only
         motion a phone ever gets */
      const driftX = Math.sin(t * 0.13) * C.DRIFT;
      const driftY = Math.sin(t * 0.097 + 1.2) * C.DRIFT * 0.6;
      ex += (tx - ex) * C.EASE;
      ey += (ty - ey) * C.EASE;
      camera.position.set(
        ex * C.PARALLAX + driftX,
        -ey * C.PARALLAX * 0.62 + driftY,
        C.CAMERA_Z
      );
      camera.lookAt(0, 0, 0);

      composer.render();
    };
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      bloom.dispose();
      finish.dispose?.();
      composer.dispose();
      renderer.dispose();
      /* what actually frees the GPU context — without it an SPA that mounts
         this a few times runs the browser out of contexts */
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [reduce, small]);

  return <div className="entry__field" ref={mount} aria-hidden="true" />;
}
