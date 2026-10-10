import * as THREE from "three";
import { SHAPES, COUNT, ANIMATED, type ShapeName } from "./shapes";
import { TOKENS } from "../styles/tokens";

/* --------------------------------------------------------------------------
   THE FIELD.

   One set of points, sprung toward whatever shape the page currently wants.
   Framework-agnostic: hand it a canvas, drive it from the page's clock, call
   destroy() on unmount. It knows nothing about React.

   SPRINGS, NOT TWEENS, AND THE REASON IS REVERSIBILITY. The morph is tied to
   scroll, so a reader can stop halfway and go back, and a duration-based
   tween restarts from zero when you interrupt it. A spring keeps its velocity
   through the reversal and simply turns around, which is the difference
   between a morph that responds to you and one that is playing at you.

   It is also Material 3 Expressive's own motion model: Google replaced
   duration-and-easing with stiffness and damping for exactly this reason.
   Damping is set just under critical, so the field arrives with the smallest
   possible overshoot and settles. Calm, not bouncy.

   THE STAGGER IS WHAT MAKES IT FEEL GOOD. Every point arriving at once reads
   as a slideshow between two images. Each point's progress is offset a little
   by where it is and a little at random, so the change crosses the field as a
   wave and you can watch it happen.
   -------------------------------------------------------------------------- */

/* The count comes from the lattice itself: 64 x 36. The whole field is one
   draw call, so the ceiling is the per-frame spring integration, not the GPU,
   and 2,304 springs is nothing. */

const STIFFNESS = 120;
/* critical damping here is 2*sqrt(120) = 21.9; just under it gives one small
   overshoot and a settle, which is the difference between calm and dead */
const DAMPING = 18;
/** how much of the morph is spent waiting for the slowest points */
const STAGGER = 0.45;
/** how far the field swells at the halfway point of a morph, in world units */
const PUFF = 0.26;
/** chases the accent so it settles in the same 600ms the CSS transition uses */
const ACCENT_RATE = 7.7;

export type FieldHandle = {
  /** morph between two shapes; p is 0 to 1 and may run backwards. `time` is
   *  seconds, for the states that are alive. */
  morph: (from: ShapeName, to: ShapeName, p: number, time?: number) => void;
  tick: (deltaSec: number) => void;
  setPointer: (nx: number, ny: number) => void;
  resize: () => void;
  /** 0 to 1, eased. Fades the whole field without touching its motion, so a
   *  section can hold it quiet and a hover can bring it back up. */
  setOpacity: (v: number) => void;
  /** eased, not snapped: the colour crosses with the shape rather than
   *  cutting on a scroll threshold */
  setAccent: (hex: string) => void;
  /** throw the lattice outward with no velocity, so the springs draw it back
   *  in. This is the intro, and it is the same springs as everything else. */
  scatter: (spread?: number) => void;
  /** 0 to 1. While this is above zero every point is pulled toward a target
   *  that is still wandering, which is what makes the opening read as a mess
   *  resolving rather than as a shape sliding into place. */
  setTurbulence: (amount: number) => void;
  /** move the whole lattice in world units, so the copy and the object are
   *  beside each other instead of on top of each other. Wide screens use x,
   *  narrow ones use y, because a phone has height to spare and no width. */
  setOffset: (x: number, y?: number) => void;
  /** scale the object. The shapes are sized for a wide frame; a vertical
   *  camera field of view means a narrow viewport crops horizontally, and an
   *  object cropped on both sides is not an object. */
  setFit: (k: number) => void;
  /** the rectangle the copy occupies, in CSS pixels from the top left of the
   *  viewport. Points inside it fade almost out and lean away from it. Pass
   *  a zero-size rect to switch it off. */
  setSafe: (left: number, top: number, right: number, bottom: number) => void;
  /** where the camera should be, as an orbit around the lattice. Damped, so
   *  it is a move and not a cut. */
  setCamera: (azimuth: number, elevation: number, distance: number) => void;
  destroy: () => void;
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function createField(canvas: HTMLCanvasElement, paper: string, accent: string): FieldHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  /* Far enough back that the widest state still fits beside the copy column.
     At 4.2 the mouth of the funnel was wider than the frame once the lattice
     was offset to the right, so the one thing the shape had to show, that it
     narrows, was the one thing cropped off. */
  camera.position.set(0, 0, 5.4);

  /* ── buffers ──
     pos is where the points are, target is where they are going, vel is what
     the spring is doing. Keeping all three as flat Float32Arrays means the
     integration loop never allocates. */
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const target = new Float32Array(COUNT * 3);
  const lit = new Float32Array(COUNT);
  const size = new Float32Array(COUNT);

  /* scratch for the two shapes being blended */
  const aPos = new Float32Array(COUNT * 3);
  const aLit = new Float32Array(COUNT);
  const aSize = new Float32Array(COUNT);
  const bPos = new Float32Array(COUNT * 3);
  const bLit = new Float32Array(COUNT);
  const bSize = new Float32Array(COUNT);

  /** each point's place in the queue, fixed once so the wave is the same
   *  wave every time rather than re-shuffling on each morph */
  const delay = new Float32Array(COUNT);
  /** which way each point swells on its way between two shapes */
  const puff = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    delay[i] = (r - Math.floor(r)) * STAGGER;

    /* an even scatter of directions on the sphere, not an even scatter of
       angles: the second one bunches at the poles */
    const h1 = Math.sin(i * 7.233) * 43758.5453;
    const h2 = Math.sin(i * 3.717) * 43758.5453;
    const a = (h1 - Math.floor(h1)) * Math.PI * 2;
    const b = Math.acos((h2 - Math.floor(h2)) * 2 - 1);
    puff[i * 3] = Math.sin(b) * Math.cos(a);
    puff[i * 3 + 1] = Math.sin(b) * Math.sin(a);
    /* a little more of it in depth, because depth is the thing the swell is
       there to show */
    puff[i * 3 + 2] = Math.cos(b) * 1.3;
  }

  SHAPES.drift(pos, lit, size, COUNT, 0);
  target.set(pos);

  let cachedFrom: ShapeName | null = null;
  let cachedTo: ShapeName | null = null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("aLit", new THREE.BufferAttribute(lit, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    /* additive would bloom into a white blob wherever the field is dense,
       which is exactly where the meaning is */
    blending: THREE.NormalBlending,
    uniforms: {
      uPaper: { value: new THREE.Color(paper) },
      uAccent: { value: new THREE.Color(accent) },
      uVoid: { value: new THREE.Color(TOKENS.void) },
      /* a single key, up and slightly to the left of the viewer, so the
         shading agrees across every point in the field */
      uLight: { value: new THREE.Vector3(-0.34, 0.5, 0.8).normalize() },
      uScale: { value: 1 },
      uOpacity: { value: 1 },
      uFocus: { value: 5.4 },
      uFogNear: { value: 4.4 },
      uFogDensity: { value: 0.2 },
      /* the copy's rectangle, in CSS pixels with y measured from the bottom,
         because that is the space a vertex shader can cheaply get to */
      uSafe: { value: new THREE.Vector4(0, 0, 0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: /* glsl */ `
      attribute float aLit;
      attribute float aSize;
      uniform float uScale;
      uniform vec4 uSafe;
      uniform vec2 uRes;
      varying float vLit;
      varying float vFade;
      varying float vDepth;
      varying float vSafe;

      /** how far past the rectangle a point has to be before it is free of
       *  it. A hard edge would draw the copy's bounding box in dots. */
      const float FEATHER = 80.0;
      /** and how hard it is pushed out of the way */
      const float PUSH = 24.0;

      void main() {
        vLit = aLit;
        /* A POINT CANNOT BE SMALLER THAN ONE PIXEL. Shrinking a point to zero
           does not remove it, the rasteriser floors it at 1px, so a rim that
           was supposed to dissolve came back as a uniform faint grid and drew
           a rectangle around the whole form. Fading it is the only way to
           actually take it away. */
        vFade = clamp(aSize * 0.9, 0.0, 1.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        /* perspective point size: near points are bigger, which is the only
           thing that gives a cloud of dots any depth at all */
        gl_PointSize = aSize * uScale * (5.8 / -mv.z);

        vec4 clip = projectionMatrix * mv;

        /* THE COPY HAS RIGHT OF WAY. Anywhere the text is, the field is
           almost gone and what is left leans out of the way. Doing it here
           rather than by moving the whole object means the object keeps its
           own composition and only the handful of points that would have
           landed on a sentence get out of its way. */
        vSafe = 0.0;
        if (uSafe.z > uSafe.x) {
          vec2 px = ((clip.xy / clip.w) * 0.5 + 0.5) * uRes;
          vec2 c = (uSafe.xy + uSafe.zw) * 0.5;
          vec2 h = (uSafe.zw - uSafe.xy) * 0.5;
          vec2 q = abs(px - c) - h;
          float d = max(q.x, q.y);
          vSafe = 1.0 - smoothstep(0.0, FEATHER, d);
          if (vSafe > 0.0) {
            /* out along the nearest face, not away from the centre: pushing
               radially would send half of them across the text */
            vec2 dir = q.x > q.y
              ? vec2(sign(px.x - c.x), 0.0)
              : vec2(0.0, sign(px.y - c.y));
            px += dir * (PUSH * vSafe);
            clip.xy = ((px / uRes) * 2.0 - 1.0) * clip.w;
          }
        }
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uPaper;
      uniform vec3 uAccent;
      uniform vec3 uVoid;
      uniform vec3 uLight;
      uniform float uOpacity;
      uniform float uFocus;
      uniform float uFogNear;
      uniform float uFogDensity;
      varying float vLit;
      varying float vFade;
      varying float vDepth;
      varying float vSafe;

      void main() {
        /* EVERY POINT IS A LIT SPHERE, NOT A DISC. A flat circle of uniform
           colour is the single reason a point cloud reads as a 2D scatter:
           there is no surface for the eye to resolve. Reconstructing a
           hemisphere normal from gl_PointCoord costs one sqrt and turns each
           dot into a small object with a terminator and a highlight. */
        vec2 d = gl_PointCoord * 2.0 - 1.0;
        float r2 = dot(d, d);
        if (r2 > 1.0) discard;
        float r = sqrt(r2);
        vec3 n = vec3(d.x, -d.y, sqrt(max(0.0, 1.0 - r2)));

        float lambert = clamp(dot(n, uLight), 0.0, 1.0);
        float shade = 0.3 + 0.7 * lambert;
        vec3 h = normalize(uLight + vec3(0.0, 0.0, 1.0));
        float spec = pow(clamp(dot(n, h), 0.0, 1.0), 22.0);

        /* DEPTH OF FIELD, cheaply. Points away from the focal plane lose
           their edge and some of their weight, which is what a lens does and
           what separates near from far far more convincingly than size
           alone. */
        float blur = clamp(abs(vDepth - uFocus) / 3.2, 0.0, 1.0);
        float soft = mix(0.07, 0.62, blur);
        float edge = 1.0 - smoothstep(1.0 - soft, 1.0, r);

        vec3 col = mix(uPaper, uAccent, vLit) * shade + spec * (0.35 + 0.4 * vLit);

        /* ATMOSPHERE. Far points sink toward the background rather than
           staying as bright as near ones, which is the oldest depth cue there
           is and the one the flat version was missing entirely. */
        float fog = 1.0 - exp(-pow(max(0.0, vDepth - uFogNear) * uFogDensity, 2.0));
        col = mix(col, uVoid, fog * 0.92);

        float a = mix(0.74, 1.0, vLit) * edge * uOpacity * vFade;
        a *= mix(1.0, 0.5, blur) * (1.0 - fog * 0.55);
        a *= mix(1.0, 0.12, vSafe);
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  const accentNow = material.uniforms.uAccent.value as THREE.Color;
  const accentTarget = accentNow.clone();
  let opacityTarget = 1;
  let rx = 0;
  let ry = 0;
  let churn = 0;
  let clock = 0;
  let fit = 1;
  let dead = false;

  /* THE CAMERA MOVES, AND THAT IS THE DIFFERENCE BETWEEN A PICTURE OF A SHAPE
     AND BEING IN THE ROOM WITH IT. Every state is read from its own angle:
     down into the funnel, along the queue, across the gap. Nothing else gives
     a point cloud parallax, and without parallax the depth cues in the shader
     are describing a space the viewer never moves through. */
  const cam = { az: 0, el: 0.05, dist: 5.4 };
  const camTo = { az: 0, el: 0.05, dist: 5.4 };

  const resize = () => {
    if (dead) return;
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    (material.uniforms.uRes.value as THREE.Vector2).set(w, h);
    /* point size follows the canvas, so the field has the same visual weight
       on a laptop and on a large display */
    material.uniforms.uScale.value = (h / 900) * dpr * 1.5 * fit;
  };
  resize();

  return {
    morph(from, to, p, time = 0) {
      /* an animated state has to be rewritten every call; a static one only
         when it actually changes */
      if (from !== cachedFrom || ANIMATED.has(from)) {
        SHAPES[from](aPos, aLit, aSize, COUNT, time);
        cachedFrom = from;
      }
      if (to !== cachedTo || ANIMATED.has(to)) {
        SHAPES[to](bPos, bLit, bSize, COUNT, time);
        cachedTo = to;
      }
      const span = 1 - STAGGER;
      for (let i = 0; i < COUNT; i++) {
        const t = smoothstep(clamp01((p - delay[i]) / span));
        /* IT COMES APART AND REASSEMBLES, IT DOES NOT CROSS-FADE. A straight
           line between two shapes is the one path that makes both of them
           look flat: the object never has a moment of being a volume, so the
           reader sees one picture slide into another. Swelling each point
           along its own direction and back, zero at both ends, turns the
           halfway point into a cloud the shapes dissolve into and resolve
           out of. Small on purpose, because the brief is calm. */
        const swell = Math.sin(Math.PI * t) * PUFF;
        const i3 = i * 3;
        target[i3] = aPos[i3] + (bPos[i3] - aPos[i3]) * t + puff[i3] * swell;
        target[i3 + 1] = aPos[i3 + 1] + (bPos[i3 + 1] - aPos[i3 + 1]) * t + puff[i3 + 1] * swell;
        target[i3 + 2] = aPos[i3 + 2] + (bPos[i3 + 2] - aPos[i3 + 2]) * t + puff[i3 + 2] * swell;
        lit[i] = aLit[i] + (bLit[i] - aLit[i]) * t;
        size[i] = aSize[i] + (bSize[i] - aSize[i]) * t;
      }
      geometry.attributes.aLit.needsUpdate = true;
      geometry.attributes.aSize.needsUpdate = true;
    },

    tick(deltaSec) {
      if (dead) return;
      /* clamped, because a tab that was hidden hands back a delta measured in
         seconds and an unclamped spring integrator explodes on it */
      const dt = Math.min(deltaSec, 1 / 30);

      clock += dt;

      if (churn > 0.001) {
        /* THE OPENING IS A MESS THAT RESOLVES, not a shape sliding in. Each
           point chases a target that is still wandering on its own orbit, and
           the wander decays to nothing. The springs do not change: what
           changes is how settled the thing they are chasing is. */
        for (let i = 0; i < COUNT; i++) {
          const i3 = i * 3;
          const seed = i * 0.7531;
          const wobble = churn * 1.9;
          const tx = target[i3] + Math.sin(seed + clock * 1.7) * wobble;
          const ty = target[i3 + 1] + Math.sin(seed * 1.7 + clock * 1.3) * wobble;
          const tz = target[i3 + 2] + Math.cos(seed * 2.3 + clock * 1.1) * wobble;
          vel[i3] += ((tx - pos[i3]) * STIFFNESS - vel[i3] * DAMPING) * dt;
          vel[i3 + 1] += ((ty - pos[i3 + 1]) * STIFFNESS - vel[i3 + 1] * DAMPING) * dt;
          vel[i3 + 2] += ((tz - pos[i3 + 2]) * STIFFNESS - vel[i3 + 2] * DAMPING) * dt;
          pos[i3] += vel[i3] * dt;
          pos[i3 + 1] += vel[i3 + 1] * dt;
          pos[i3 + 2] += vel[i3 + 2] * dt;
        }
      } else {
        for (let i = 0; i < COUNT * 3; i++) {
          const a = (target[i] - pos[i]) * STIFFNESS - vel[i] * DAMPING;
          vel[i] += a * dt;
          pos[i] += vel[i] * dt;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      /* the whole field leans toward the pointer: enough to feel answered,
         not enough to be a toy */
      const k = 1 - Math.exp(-3 * dt);
      ry += (pointer.x * 0.22 - ry) * k;
      rx += (pointer.y * 0.12 - rx) * k;

      /* The camera eases toward the pose this state asked for, with a slow
         drift on top so there is always a little parallax even when nobody is
         doing anything. Damped rather than scrubbed: the move should lag the
         scroll slightly, the way a real camera operator does. */
      const ck = 1 - Math.exp(-2.4 * dt);
      cam.az += (camTo.az - cam.az) * ck;
      cam.el += (camTo.el - cam.el) * ck;
      cam.dist += (camTo.dist - cam.dist) * ck;

      const az = cam.az + Math.sin(clock * 0.09) * 0.045;
      const el = cam.el + Math.sin(clock * 0.07 + 1.3) * 0.022;
      /* THE CAMERA ORBITS THE ORIGIN, NOT THE OBJECT. It used to orbit and
         aim at the lattice's own position, which quietly cancelled every
         offset: move the object right, the camera moved right with it, and
         the framing never changed. Placement was really being done by the
         canvas mask hiding the left of a centred object, which works until
         you want the object somewhere the mask is not. */
      camera.position.set(
        Math.sin(az) * Math.cos(el) * cam.dist,
        Math.sin(el) * cam.dist,
        Math.cos(az) * Math.cos(el) * cam.dist,
      );
      camera.lookAt(0, 0, 0);
      /* the focal plane sits on the lattice, so the subject is the sharp part
         and everything in front of and behind it falls away */
      material.uniforms.uFocus.value = cam.dist;
      material.uniforms.uFogNear.value = cam.dist - 1.1;
      /* THE CANVAS CROSSFADES ON THE PAGE'S CLOCK, NOT ITS OWN. The accent
         is a 600ms transition in CSS, and an exponential chase settles to
         within a per cent in about 4.6 time constants, so the rate that
         lands on the same 600ms is 7.7. On the shared rate of 3 the object
         was still arriving at its new colour a second after the chapter
         number had finished, which reads as the two being unrelated. */
      accentNow.lerp(accentTarget, 1 - Math.exp(-ACCENT_RATE * dt));
      const o = material.uniforms.uOpacity;
      o.value += (opacityTarget - o.value) * k;
      points.rotation.set(rx, ry, 0);

      renderer.render(scene, camera);
    },

    setPointer(nx, ny) {
      pointer.x = nx;
      pointer.y = ny;
    },

    setOpacity(v) {
      opacityTarget = v;
    },

    setTurbulence(amount) {
      churn = amount;
    },

    setAccent(hex) {
      accentTarget.set(hex);
    },

    setOffset(x, y = 0) {
      points.position.set(x, y, 0);
    },

    /* call resize() after this: the dots have to scale with the object, or a
       shrunk object is a finer stipple of the same shape rather than the same
       shape seen from further away */
    setFit(k) {
      fit = k;
      points.scale.setScalar(k);
    },

    setSafe(left, top, right, bottom) {
      const h = canvas.clientHeight || 1;
      /* the shader works bottom up, the DOM works top down */
      (material.uniforms.uSafe.value as THREE.Vector4).set(left, h - bottom, right, h - top);
    },

    setCamera(azimuth, elevation, distance) {
      camTo.az = azimuth;
      camTo.el = elevation;
      camTo.dist = distance;
    },

    scatter(spread = 3.4) {
      /* THE INTRO IS NOT A SEPARATE ANIMATION. Displacing the lattice and
         letting the existing springs pull it home gives an opening that is
         made of exactly the same physics as every later morph, so the page
         has one motion language rather than an overture and then a different
         piece of software. It also cannot desynchronise from the scroll
         state, because it never touches the target. */
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const a = i * 2.399963;
        const r = Math.sin(i * 12.9898) * 43758.5453;
        const t = r - Math.floor(r);
        const radius = spread * (0.55 + 0.45 * t);
        pos[i3] = Math.cos(a) * radius;
        pos[i3 + 1] = (t - 0.5) * spread * 1.4;
        pos[i3 + 2] = Math.sin(a) * radius - spread * 0.5;
        vel[i3] = 0;
        vel[i3 + 1] = 0;
        vel[i3 + 2] = 0;
      }
      geometry.attributes.position.needsUpdate = true;
    },

    resize,

    destroy() {
      if (dead) return;
      dead = true;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      /* dispose releases three's objects but leaves the context alive until
         the browser decides otherwise, and routing back and forth is enough
         to hit the per-page limit */
      renderer.forceContextLoss();
    },
  };
}
