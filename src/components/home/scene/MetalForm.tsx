import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* ──────────────────────────────────────────────────────────────────────────
   THE FORM — one object, real materials, studio light.

   ── THE THREE CONSTANTS TO TUNE FIRST ───────────────────────────────────
     C.ROUGHNESS   how polished. 0.12 is wet mercury, 0.35 is brushed.
     MATERIAL      colour, iridescence, clearcoat. This IS the art direction.
     C.BLOOM       past ~0.5 it stops reading as light and reads as a mistake.
   ─────────────────────────────────────────────────────────────────────────

   WHY AN OBJECT AND NOT A FIELD. A fullscreen shader is a picture; an object
   with a real material is a THING, and a thing under studio light is the only
   one of these that gets compared to a product render rather than to a
   wallpaper. It also has a silhouette, which a field never has, and a
   silhouette is what makes a composition.

   THE MATERIAL IS DOING REAL WORK, not faking it:

   · The environment is BUILT, not loaded. RoomEnvironment is a little room of
     emissive boxes; PMREMGenerator pre-filters it into a proper roughness
     mip chain. That is genuine image-based lighting with real soft-box
     streaks in the reflections, and it costs one render at startup and zero
     network requests. An HDRI file would be another 2 MB and a second
     failure mode.

   · IRIDESCENCE is the material's own thin-film term, not a colour ramp.
     MeshPhysicalMaterial models the interference layer with an IOR and a
     physical thickness range, so the hue shift follows the viewing angle the
     way anodised titanium does — which is why it reads as a surface property
     rather than as a gradient someone painted on.

   · CLEARCOAT is a second specular lobe over the metal. It is what stops a
     dark metal from going flat and dead in the shadow side.

   THE HAND-WRITTEN PART. The form is a sphere displaced by fbm in a vertex
   shader injected into MeshPhysicalMaterial through onBeforeCompile — so the
   displacement gets the whole PBR pipeline, rather than being a custom
   material that has to reimplement lighting badly.

   The normal is RECOMPUTED, and that is the detail that matters. Displacing
   positions and leaving the sphere's normals behind gives a lumpy shape lit
   like a ball: every highlight in the wrong place. Two neighbours are sampled
   along the surface tangents, displaced by the same function, and the normal
   is the cross product of the resulting edges. Three noise evaluations per
   vertex instead of one, and it is the difference between a material and a
   mistake.
   ────────────────────────────────────────────────────────────────────────── */

const C = {
  /* ── the form ── */
  DETAIL: 6, // icosahedron subdivision. 6 is a smooth silhouette at any size
  DETAIL_SMALL: 4,
  RADIUS: 1.02,
  AMP: 0.13, // displacement depth. Past ~0.2 it stops being a form and
  //            starts being a crumpled bag
  FREQ: 0.95, // noise frequency over the surface. Higher = more lobes
  MORPH: 0.16, // how fast the shape evolves
  NORMAL_EPS: 0.03, // tangent step for the recomputed normal

  /* ── the material ── */
  ROUGHNESS: 0.22,
  CLEARCOAT: 1.0,
  CLEARCOAT_ROUGHNESS: 0.12,
  IRIDESCENCE: 0.9,
  IRIDESCENCE_IOR: 1.36,
  IRIDESCENCE_MIN: 140, // nanometres. The band spacing of the thin film
  IRIDESCENCE_MAX: 430,

  /* ── the camera ── */
  FOV: 38,
  /* The camera distance is FITTED, not fixed. A fixed distance frames the
     form against the vertical field of view, so a 390-wide phone showed a
     form 163% of the frame width with its silhouette cut off on both sides.
     FILL is the fraction of the CONSTRAINING half-extent the form should
     occupy — height in landscape, width in portrait — and the distance falls
     out of it. One number, correct at every aspect. */
  FILL: 0.75,
  FILL_PORTRAIT: 0.66,
  /* the lift is a fraction of the visible half-height rather than a world
     offset, so the composition holds as the camera moves */
  LIFT_F: 0.25,
  PARALLAX: 0.62, // world units the camera orbits at full pointer deflection
  EASE: 0.045, // damping. Lower is heavier and more expensive-feeling

  /* ── the grade ── */
  BLOOM: 0.3,
  BLOOM_RADIUS: 0.75,
  BLOOM_THRESHOLD: 0.72,
  EXPOSURE: 0.88,
  ABERRATION: 0.2,
  GRAIN: 0.02,
  VIGNETTE: 0.62,

  /* ── the entrance ── */
  INTRO_MS: 2000,
  INTRO_DOLLY: 0.68, // camera starts this fraction of the way in

  /* ── performance ── */
  RENDER_SCALE: 1.0,
  RENDER_SCALE_SMALL: 0.72,
} as const;

const MATERIAL = {
  /* Near-black with a blue bias. At metalness 1 this is not a diffuse colour,
     it is the specular TINT — every photon here comes from the environment,
     so the colour decides what the reflections are made of.

     FIRST PASS WAS BLOWN OUT AND THIS IS HALF OF WHY. RoomEnvironment is a
     bright room, and a bright room reflected at full intensity in a polished
     metal gives a white blob no matter how dark the tint is. Four numbers
     came down together: this colour, envMapIntensity, both light intensities
     and the exposure. A dark object with a few bright specular edges is what
     expensive looks like; an evenly lit one is what a stock 3D render looks
     like. */
  color: "#0E141C",
  metalness: 1.0,
} as const;

const KEY = "#FFE3C6"; // the one warm light in the section
const RIM = "#7FD4F0";
const BG = "#0B0D10"; // the page's own --ink, so the band edge has no seam

/* ── the displacement, injected into the standard material ────────────────
   uTime   seconds; drives the morph through the noise's third axis
   uAmp    displacement depth, eased from 0 during the entrance so the form
           resolves out of a sphere
   uFreq   noise frequency over the surface — the number of lobes
   uEps    tangent step for the recomputed normal                            */
const DISPLACE_GLSL = `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uEps;

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

  /* Three octaves, and one much larger slow fold on top. The fold is what
     changes the SILHOUETTE over time; octaves alone only ripple the surface,
     and a form whose outline never changes stops being interesting in about
     four seconds. */
  float shape(vec3 p) {
    vec3 q = p * uFreq + vec3(0.0, 0.0, uTime);
    float n = snoise(q) * 0.55;
    n += snoise(q * 2.07) * 0.18;
    n += snoise(q * 4.13) * 0.06;
    n += snoise(p * uFreq * 0.42 + vec3(uTime * 0.55, 0.0, 0.0)) * 0.42;
    return n;
  }

  vec3 displaced(vec3 p) { return p * (1.0 + shape(p) * uAmp); }

  vec3 gPos;
`;

/* ── the recomputed normal ────────────────────────────────────────────────
   Replaces three's <beginnormal_vertex>. Displacing positions and keeping
   the sphere's normals gives a lumpy shape lit like a ball — every highlight
   in the wrong place. Two neighbours along the surface tangents are displaced
   by the same function and the normal is the cross product of the resulting
   edges: three noise evaluations per vertex instead of one, and the whole
   difference between a material and a mistake.

   %R% is the sphere radius, substituted at build. */
const NORMAL_GLSL = `
  gPos = displaced(position);

  /* a stable tangent basis — a fixed 'up' degenerates at the poles, so swap
     axes when the normal gets close to one */
  vec3 up = abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(up, normal));
  vec3 t2 = cross(normal, t1);

  /* the neighbours are renormalised back onto the sphere before being
     displaced, so both samples come from the same surface */
  vec3 n1 = displaced(normalize(position + t1 * uEps) * %R%);
  vec3 n2 = displaced(normalize(position + t2 * uEps) * %R%);
  vec3 objectNormal = normalize(cross(n1 - gPos, n2 - gPos));
  if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
`;

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
      /* scaled by r², so the fringing lives at the edges of the frame the way
         it does in a real lens and never touches the type in the middle */
      vec2 off = c * r2 * uAberration * 0.06;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - off).b;

      /* grain moves; static grain reads as a dirty screen */
      float g = hash(vUv * uRes + fract(uTime * 11.0)) - 0.5;
      col += g * uGrain;

      col *= 1.0 - uVignette * r2 * 1.5;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

interface Props {
  /** false parks the loop — the hero is scrolled past */
  running: boolean;
  reduce: boolean;
  /** phones and downgraded machines: lower subdivision, smaller buffer */
  small: boolean;
}

export default function MetalForm({ running, reduce, small }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const runRef = useRef(running);
  runRef.current = running;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scale = small ? C.RENDER_SCALE_SMALL : C.RENDER_SCALE;
    const pr = Math.min(window.devicePixelRatio, 2) * scale;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = C.EXPOSURE;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);

    const camera = new THREE.PerspectiveCamera(
      C.FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );

    /* how far back the camera has to sit for the form to fill FILL of the
       constraining dimension, at whatever aspect the window happens to be */
    const halfHPerUnit = Math.tan(((C.FOV / 2) * Math.PI) / 180);
    const extent = C.RADIUS * (1 + C.AMP);
    let restDist = C.RADIUS * 4;
    const fit = () => {
      const aspect = camera.aspect;
      const half = Math.min(halfHPerUnit, halfHPerUnit * aspect);
      const fill = aspect < 1 ? C.FILL_PORTRAIT : C.FILL;
      restDist = extent / (half * fill);
    };
    camera.position.set(0, 0, restDist);

    /* ── image-based lighting, built rather than downloaded ── */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomScene, 0.035);
    scene.environment = envRT.texture;
    roomScene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });
    pmrem.dispose();

    /* two lights on top of the environment, placed like a studio: a warm key
       high and left, a cool rim low and behind. The environment gives the
       soft fill; these give the shape somewhere to be brightest and an edge
       to separate it from the ground. */
    const key = new THREE.DirectionalLight(new THREE.Color(KEY), 0.42);
    key.position.set(-2.6, 3.0, 2.4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(new THREE.Color(RIM), 1.15);
    rim.position.set(2.8, -1.4, -2.2);
    scene.add(rim);

    /* ── the form ── */
    const geo = new THREE.IcosahedronGeometry(
      C.RADIUS,
      small ? C.DETAIL_SMALL : C.DETAIL
    );
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(MATERIAL.color),
      metalness: MATERIAL.metalness,
      roughness: C.ROUGHNESS,
      clearcoat: C.CLEARCOAT,
      clearcoatRoughness: C.CLEARCOAT_ROUGHNESS,
      iridescence: C.IRIDESCENCE,
      iridescenceIOR: C.IRIDESCENCE_IOR,
      iridescenceThicknessRange: [C.IRIDESCENCE_MIN, C.IRIDESCENCE_MAX],
      envMapIntensity: 0.32,
    });

    const uTime = { value: 0 };
    const uAmp = { value: 0 };
    const uFreq = { value: C.FREQ };
    const uEps = { value: C.NORMAL_EPS };

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.uniforms.uAmp = uAmp;
      shader.uniforms.uFreq = uFreq;
      shader.uniforms.uEps = uEps;
      shader.vertexShader = DISPLACE_GLSL + shader.vertexShader;

      /* beginnormal_vertex runs before begin_vertex, so the displaced
         position is computed here, stashed, and reused below. Replacing the
         chunk wholesale is safe because nothing here uses morph targets or
         skinning. */
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        NORMAL_GLSL.replaceAll("%R%", C.RADIUS.toFixed(3))
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "vec3 transformed = gPos;"
      );
    };

    const mesh = new THREE.Mesh(geo, mat);
    /* COMPOSITION, and it is a legibility decision before it is an aesthetic
       one. Centred, the form put its brightest region exactly behind the
       supporting label and swallowed it. Lifted, the name crosses the darker
       underside and the label clears the silhouette entirely — the drama of
       type over object survives, and nothing has to be read against a
       specular highlight. */
    scene.add(mesh);

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
      fit();
      mesh.position.y = C.LIFT_F * halfHPerUnit * restDist;
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

    /* ── reduced motion: one frame, fully graded, at a chosen moment ──
       Not t=0: the form at t=0 is a sphere, which is the least interesting
       shape it ever has. This is the still someone gets to keep. */
    if (reduce) {
      uTime.value = 6.2;
      uAmp.value = C.AMP;
      finish.uniforms.uTime.value = 6.2;
      mesh.rotation.set(0.24, -0.5, 0.08);
      composer.render();
    }

    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    let spin = 0;
    let painted = false;

    /* A document that mounts hidden produces no animation frames, so uAmp
       would never leave zero and the hero would be a dark sphere. If nothing
       has been drawn two and a half seconds in, the scene lands resolved.
       setTimeout is not rAF-driven, which is the entire point. */
    const bail = window.setTimeout(() => {
      if (painted || reduce) return;
      uTime.value = 6.2;
      uAmp.value = C.AMP;
      finish.uniforms.uTime.value = 6.2;
      mesh.rotation.set(0.24, -0.5, 0.08);
      bloom.strength = C.BLOOM;
      composer.render();
    }, 2500);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!runRef.current) return;
      painted = true;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - t0) / 1000;

      /* one entrance: the camera pulls back while the sphere unfolds into the
         form and the bloom arrives with it */
      const p = Math.min(1, (now - t0) / C.INTRO_MS);
      const e = 1 - Math.pow(1 - p, 3);
      uAmp.value = C.AMP * e;
      bloom.strength = C.BLOOM * e;

      uTime.value = t * C.MORPH;
      finish.uniforms.uTime.value = t;

      /* the idle rotation is not a constant spin: the rate itself breathes,
         so the form never settles into a period you can count */
      spin += dt * (0.055 + 0.028 * Math.sin(t * 0.07));
      mesh.rotation.y = spin;
      mesh.rotation.x = Math.sin(t * 0.13) * 0.18;
      mesh.rotation.z = Math.sin(t * 0.09 + 1.1) * 0.1;

      ex += (tx - ex) * C.EASE;
      ey += (ty - ey) * C.EASE;
      const dolly = restDist * (C.INTRO_DOLLY + (1 - C.INTRO_DOLLY) * e);
      camera.position.set(ex * C.PARALLAX, -ey * C.PARALLAX * 0.62, dolly);
      camera.lookAt(0, mesh.position.y * 0.55, 0);

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
      envRT.dispose();
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
