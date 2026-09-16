import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* ──────────────────────────────────────────────────────────────────────────
   LIQUID FIELD — one fullscreen fragment shader, graded like film.

   ── THE THREE CONSTANTS TO TUNE FIRST ───────────────────────────────────
     C.SPEED     how fast the surface evolves. Lower is more expensive-looking.
     PALETTE     the cosine-palette coefficients. This IS the art direction.
     C.BLOOM     bloom strength. Past ~0.5 it stops reading as light and
                 starts reading as a mistake.
   ─────────────────────────────────────────────────────────────────────────

   WHY A FRAGMENT SHADER AND NOT OBJECTS. The whole image is one draw call on
   a fullscreen quad, so cost scales with PIXELS, not with scene complexity —
   which means it can be rendered at 0.7x resolution and upscaled for free.
   That trade is invisible here and nowhere else: the field is a smooth
   gradient with no edges to soften, and the type is real HTML sitting on top,
   so nothing that has to be sharp is being scaled at all. Full-resolution
   type over a half-resolution field is the entire performance strategy.

   WHY IT READS AS METAL AND NOT AS COLOURED FOG. Two things, and they are
   the whole difference:

   1. A DERIVED NORMAL. The domain-warp vector doubles as a surface normal,
      so the field can be lit — a Blinn specular lobe and a fresnel rim. A
      noise field with colour mapped onto it looks like weather; the same
      field with a specular highlight travelling across it looks like a
      surface with a light above it.

   2. THIN-FILM BANDING. Iridescence is not "many colours", it is colour that
      repeats as a function of thickness, which is why oil on water bands.
      The palette is driven by height MULTIPLIED (C.BANDS), so the bands are
      physical rather than decorative.

   DOMAIN WARPING (Quílez) is what makes the flow organic: fbm of a position
   that has itself been displaced by fbm, twice. Plain fbm boils. Warped fbm
   folds, stretches and curls the way a real fluid does.
   ────────────────────────────────────────────────────────────────────────── */

const C = {
  /* ── the surface ──
     FIRST PASS WAS TOO LOUD AND THIS IS WHERE IT WAS FIXED. At SCALE 1.35
     with BANDS 2.6 the frame was wall-to-wall marbling: technically the same
     shader, but reading as an oil-slick texture rather than as a lit surface.
     The expensive version of this effect is LOW frequency and FEW bands —
     large slow forms, mostly deep navy, with iridescence appearing only where
     a fold catches the light. Contrast everywhere is what cheap looks like. */
  SCALE: 0.62, // noise frequency. Big forms read premium; busy reads free
  SPEED: 0.045, // evolution rate. The single biggest "taste" knob
  WARP: 2.3, // domain-warp strength. 0 = plain fbm, 4+ = churning
  BANDS: 1.05, // thin-film repeats. More than ~1.5 becomes psychedelic
  BUMP: 0.55, // how strongly the warp reads as surface relief
  SPEC: 0.26, // specular lobe strength
  FRESNEL: 0.18,

  /* ── the pointer ── */
  PUSH: 0.085, // how far the flow bulges away from the cursor
  RIPPLE: 0.007,
  EASE: 0.045, // pointer damping. Lower is heavier and more expensive-feeling

  /* ── the grade ── */
  BLOOM: 0.34,
  BLOOM_RADIUS: 0.72,
  BLOOM_THRESHOLD: 0.68,
  EXPOSURE: 1.02,
  ABERRATION: 0.22, // radial only, so it lives at the edges like a real lens
  GRAIN: 0.022,
  VIGNETTE: 0.58,

  /* ── the entrance ── */
  INTRO_MS: 1900,

  /* ── performance ── */
  RENDER_SCALE: 0.7, // the field is smooth; the type is HTML and unaffected
  RENDER_SCALE_SMALL: 0.55,
} as const;

/* Cosine palette (Quílez): colour = a + b * cos(2π(c·t + d)).
   Deep navy base, cool cyan through violet in the mids, one warm highlight
   where the light catches. Four vectors, and they are the art direction —
   everything else in this file is machinery. */
const PALETTE = {
  /* a is the centre of the colour range, b its amplitude. Both are held low:
     the surface should sit mostly in deep navy and only travel far enough to
     find a cool teal and a violet, never far enough to find a full spectrum.
     Halving b was most of what turned this from a demo into a grade. */
  a: [0.085, 0.105, 0.148],
  b: [0.085, 0.1, 0.13],
  c: [1.0, 0.98, 0.92],
  d: [0.61, 0.5, 0.36],
} as const;

const BASE = "#0B0D10"; // the page's own --ink, so the band edge has no seam
const WARM = "#FFE3C6"; // the highlight. Any more orange and it reads bronze
const COOL = "#7FD4F0";

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FIELD_FRAG = `
  precision highp float;
  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform vec2  uMouse;    // eased pointer, 0..1 in uv space
  uniform float uSwirl;    // rises with pointer speed, decays — extra turbulence
  uniform float uIntro;    // 0..1 entrance
  uniform vec3  uBase;
  uniform vec3  uWarm;
  uniform vec3  uCool;
  uniform vec3  pA;
  uniform vec3  pB;
  uniform vec3  pC;
  uniform vec3  pD;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uWarp;
  uniform float uBands;
  uniform float uBump;
  uniform float uSpec;
  uniform float uFres;
  uniform float uPush;
  uniform float uRipple;

  /* ── Ashima simplex 3D. z carries time, so the field EVOLVES rather than
     scrolling past — a scrolling field always reads as a texture on a belt. */
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C2 = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C2.yyy));
    vec3 x0 = v - i + dot(i, C2.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C2.xxx;
    vec3 x2 = x0 - i2 + C2.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  /* The gain is 0.44 rather than the textbook 0.5, which means each octave
     contributes less than half the last and the result is dominated by its
     largest form. Textbook fbm gives an evenly detailed surface — correct,
     and it reads as texture. Weighting the base frequency up is what makes it
     read as a large object instead. */
  float fbm(vec3 p) {
    float amp = 0.5;
    float sum = 0.0;
    for (int i = 0; i < OCTAVES; i++) {
      sum += amp * snoise(p);
      p *= 2.03;
      amp *= 0.44;
    }
    return sum;
  }

  vec3 pal(float t) { return pA + pB * cos(6.28318530718 * (pC * t + pD)); }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 uv = vUv;

    /* ── the pointer displaces the flow, it does not move a sprite ──
       A gaussian push away from the cursor plus a decaying ring, applied to
       the DOMAIN before any noise is evaluated. The surface bulges and the
       bands bend around it, which is what a fluid does and what a parallax
       layer cannot do. */
    vec2 d = uv - uMouse;
    d.x *= aspect;
    float dist = length(d);
    float falloff = exp(-dist * 4.2);
    vec2 dir = d / max(dist, 0.0001);
    uv += dir * falloff * uPush;
    uv += dir * sin(dist * 20.0 - uTime * 1.6) * falloff * uRipple;

    float t = uTime * uSpeed;
    vec3 p = vec3(uv * uScale * vec2(aspect, 1.0), t);

    /* domain warp, twice. fbm of a position displaced by fbm of a position
       displaced by fbm — the reason this folds instead of boiling */
    float w = uWarp * (1.0 + uSwirl * 0.6);
    vec2 q = vec2(fbm(p), fbm(p + vec3(5.2, 1.3, 2.1)));
    vec2 r = vec2(
      fbm(p + vec3(w * q, 0.0) + vec3(1.7, 9.2, 0.0)),
      fbm(p + vec3(w * q, 0.0) + vec3(8.3, 2.8, 0.0))
    );
    float hgt = fbm(p + vec3(w * r, 0.0));

    /* ── the normal, for free ──
       r is the direction the domain was pushed, which is a serviceable
       gradient of the surface. Lighting it is what separates metal from fog,
       and it costs nothing because r was already computed. */
    vec3 n = normalize(vec3(-r.x * uBump, -r.y * uBump, 1.0));
    vec3 L = normalize(vec3(-0.42, 0.70, 0.58));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float diff = max(dot(n, L), 0.0);
    float spec = pow(max(dot(n, H), 0.0), 44.0);
    float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);

    /* ── thin-film banding ──
       Height MULTIPLIED before the palette, so colour repeats with thickness
       the way interference does. Straight height would give a gradient; this
       gives iridescence. */
    vec3 irid = pal(hgt * uBands + diff * 0.22);

    /* only the higher folds take colour — the rest of the frame stays the
       base. A field that is iridescent everywhere has nothing to be
       iridescent against. */
    vec3 col = uBase;
    col = mix(col, irid, smoothstep(0.02, 0.62, hgt) * 0.80);
    col += uWarm * spec * uSpec;
    col += uCool * fres * uFres;

    /* ── composition ──
       The field is quietened through the middle of the frame, where the name
       sits. Not a scrim over the top: the light genuinely falls off there, so
       the type has a bed without anything being pasted over the image. */
    vec2 cc = uv - vec2(0.5, 0.47);
    cc.x *= aspect * 0.44;
    float calm = smoothstep(0.05, 0.58, length(cc));
    col = mix(uBase * 1.10, col, 0.08 + 0.92 * calm);

    /* the entrance: the surface resolves out of the dark, once */
    col = mix(uBase * 0.55, col, uIntro);

    /* one last pull-down. Everything above is additive, and additive terms
       accumulate into a frame that is brighter than any of them intended. */
    col *= 0.88;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ── the finishing pass ──
   Everything a lens does and a renderer does not: chromatic aberration that
   lives only at the edges (radial, scaled by r², like real glass), animated
   grain, and a vignette. All three are barely-there on purpose — the tell of
   amateur post is that you can name the effects. */
const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uAberration: { value: C.ABERRATION },
    uGrain: { value: C.GRAIN },
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
    uniform float uGrain;
    uniform float uVignette;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 off = c * r2 * uAberration * 0.06;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - off).b;

      /* grain moves, because static grain reads as a dirty screen */
      float g = hash(vUv * uRes + fract(uTime * 11.0)) - 0.5;
      col += g * uGrain;

      col *= 1.0 - uVignette * r2 * 1.5;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

const v3 = (hex: string) => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};
const arr3 = (a: readonly number[]) => new THREE.Vector3(a[0], a[1], a[2]);

interface Props {
  /** false parks the loop — the hero is scrolled past */
  running: boolean;
  reduce: boolean;
  /** true on phones and downgraded machines: fewer octaves, smaller buffer */
  small: boolean;
}

export default function LiquidField({ running, reduce, small }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const runRef = useRef(running);
  runRef.current = running;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scale = small ? C.RENDER_SCALE_SMALL : C.RENDER_SCALE;
    const pr = Math.min(window.devicePixelRatio, 2) * scale;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = C.EXPOSURE;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    /* a fullscreen triangle-ish quad: the vertex shader writes clip space
       directly, so the camera is a formality */
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms: Record<string, THREE.IUniform> = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uSwirl: { value: 0 },
      uIntro: { value: reduce ? 1 : 0 },
      uBase: { value: v3(BASE) },
      uWarm: { value: v3(WARM) },
      uCool: { value: v3(COOL) },
      pA: { value: arr3(PALETTE.a) },
      pB: { value: arr3(PALETTE.b) },
      pC: { value: arr3(PALETTE.c) },
      pD: { value: arr3(PALETTE.d) },
      uScale: { value: C.SCALE },
      uSpeed: { value: C.SPEED },
      uWarp: { value: C.WARP },
      uBands: { value: C.BANDS },
      uBump: { value: C.BUMP },
      uSpec: { value: C.SPEC },
      uFres: { value: C.FRESNEL },
      uPush: { value: C.PUSH },
      uRipple: { value: C.RIPPLE },
    };

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FIELD_FRAG,
      /* octaves are a compile-time constant because a GLSL loop bound has to
         be: three on a phone, four on a desktop, and the difference is a
         third of the shader's cost */
      defines: { OCTAVES: small ? 3 : 4 },
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(geo, mat);
    quad.frustumCulled = false;
    scene.add(quad);

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
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w * pr, h * pr);
      (uniforms.uRes.value as THREE.Vector2).set(w * pr, h * pr);
      (finish.uniforms.uRes.value as THREE.Vector2).set(w * pr, h * pr);
    };
    size();

    /* ── the pointer: springy, damped, never linear ── */
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let tx = 0.5;
    let ty = 0.5;
    let px = 0.5;
    let py = 0.5;
    let swirl = 0;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      /* speed feeds turbulence, so a flick stirs the surface and a slow drag
         only bends it */
      swirl = Math.min(1, swirl + Math.hypot(nx - tx, ny - ty) * 5.5);
      tx = nx;
      ty = ny;
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

    /* ── reduced motion: one frame, fully graded, at a hand-picked time ──
       Not time zero — the field at t=0 is the least interesting frame it ever
       has. This is the still someone gets to keep. */
    if (reduce) {
      uniforms.uTime.value = 42;
      finish.uniforms.uTime.value = 42;
      composer.render();
    }

    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    let painted = false;

    /* The same guard the rest of this page carries: a document that mounts
       hidden produces no animation frames, so uIntro would never leave zero
       and the hero would be a flat rectangle. If nothing has been drawn two
       and a half seconds in, the scene lands fully resolved. setTimeout is
       not rAF-driven, which is the entire point. */
    const bail = window.setTimeout(() => {
      if (painted || reduce) return;
      uniforms.uIntro.value = 1;
      uniforms.uTime.value = 42;
      finish.uniforms.uTime.value = 42;
      bloom.strength = C.BLOOM;
      composer.render();
    }, 2500);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!runRef.current) return;
      painted = true;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const p = Math.min(1, (now - t0) / C.INTRO_MS);
      const e = 1 - Math.pow(1 - p, 3);
      uniforms.uIntro.value = e;
      /* bloom arrives with the surface, so the entrance is one move rather
         than a fade followed by a glow */
      bloom.strength = C.BLOOM * e;

      uniforms.uTime.value = (now - t0) / 1000;
      finish.uniforms.uTime.value = (now - t0) / 1000;

      px += (tx - px) * C.EASE;
      py += (ty - py) * C.EASE;
      (uniforms.uMouse.value as THREE.Vector2).set(px, py);

      swirl *= Math.pow(0.12, dt); // decays over roughly a second
      uniforms.uSwirl.value = swirl;

      composer.render();
    };
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
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
