import * as THREE from "three";
import { emblemGeometry, hullGeometry } from "./emblemGeometry";
import { celMaterial, hullMaterial } from "./emblemMaterials";
import { TOKENS } from "../styles/tokens";

/* --------------------------------------------------------------------------
   THE EMBLEM STAGE.

   Framework-agnostic, like field.ts. Hand it a canvas and an SVG string, it
   gives back a tick() to drive from the clock and a `state` object for GSAP to
   tween. It knows nothing about React.

   ONE CONTEXT, EVER. The homepage is allowed a single WebGL context and this
   is it. No post-processing, no second render target, no text in WebGL.

   The pixel ratio is capped twice: at 2 for the usual reason, and again by a
   backing-store budget, because the 2D field is also on this page and the two
   canvases share one GPU. 1.3M device pixels for a 320px emblem is already
   generous; the field gets the rest of the 2.5M budget.
   -------------------------------------------------------------------------- */

const MAX_BACKING = 1_300_000;

export type Stage = {
  /** GSAP tweens these; tick() reads them */
  state: { spinY: number; exit: number; fade: number };
  /** resolves once the shaders are compiled and the first frame is drawn */
  ready: Promise<void>;
  tick: (deltaSec: number) => void;
  /** pointer position within the slot, each -0.5 to 0.5 */
  setPointer: (nx: number, ny: number) => void;
  setAccent: (hex: string) => void;
  resize: (cssSize: number) => void;
  wake: () => void;
  sleep: () => void;
  destroy: () => void;
};

export function createStage(canvas: HTMLCanvasElement, svg: string, cssSize: number): Stage {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  const ratioFor = (size: number) =>
    Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_BACKING) / Math.max(size, 1));

  let size = cssSize;
  renderer.setPixelRatio(ratioFor(size));
  renderer.setSize(size, size, false);
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  /* The geometry is normalised to one unit wide. At this distance a 30 degree
     lens shows about 1.3 units, so the mark fills roughly three quarters of
     its slot: big enough to be the second thing you look at, with enough air
     that the keyline is not touching the edge. */
  camera.position.set(0, 0, 2.5);

  const geo = emblemGeometry(svg);
  const hull = hullGeometry(geo);

  /* One Color object shared by both materials. accent.lerp() therefore
     re-tints the rim and the keyline together, with no uniform writes and no
     chance of the two drifting apart mid-transition. */
  const accent = new THREE.Color(TOKENS.teal);
  const accentTarget = accent.clone();

  const cel = celMaterial(
    new THREE.Color(TOKENS.paper),
    new THREE.Color(TOKENS.void),
    accent,
    5.5 * renderer.getPixelRatio(),
  );
  const line = hullMaterial(accent);

  const group = new THREE.Group();
  const solid = new THREE.Mesh(geo, cel);
  const outline = new THREE.Mesh(hull, line);
  /* the keyline draws first, so the solid always wins the depth test against
     its own inflated shell */
  outline.renderOrder = 0;
  solid.renderOrder = 1;
  group.add(outline, solid);
  scene.add(group);

  const state = { spinY: 0, exit: 0, fade: 1 };
  const target = { x: 0, y: 0 };
  /* A dead-on solid reads as flat artwork: you cannot see the extrusion, the
     bevel or the side faces, so the whole reason for building it in 3D goes
     missing. A few degrees off-axis at rest shows all three. */
  const REST_X = 0.08;
  const REST_Y = -0.22;
  let rx = REST_X;
  let ry = REST_Y;
  let awake = true;
  let dead = false;

  const ready = renderer.compileAsync(scene, camera).then(() => {
    renderer.render(scene, camera);
  });

  return {
    state,
    ready,

    tick(deltaSec) {
      if (!awake || dead) return;
      /* Frame-rate independent damping. A plain lerp with a fixed factor
         settles twice as fast at 120Hz as at 60, which is how a tilt ends up
         feeling different on two machines running the same code. */
      const k = 1 - Math.exp(-6 * Math.min(deltaSec, 0.1));
      ry += (REST_Y + target.x * 0.7 - ry) * k;
      rx += (REST_X + target.y * 0.4 - rx) * k;
      accent.lerp(accentTarget, k);
      cel.uniforms.uFade.value = state.fade;
      line.uniforms.uFade.value = state.fade;
      group.rotation.set(rx + state.exit * 0.6, ry + state.spinY, 0);
      renderer.render(scene, camera);
    },

    setPointer(nx, ny) {
      target.x = nx;
      target.y = ny;
    },

    setAccent(hex) {
      accentTarget.set(hex);
    },

    resize(next) {
      if (dead || next === size) return;
      size = next;
      renderer.setPixelRatio(ratioFor(size));
      renderer.setSize(size, size, false);
      cel.uniforms.uCell.value = 5.5 * renderer.getPixelRatio();
    },

    wake() {
      awake = true;
    },

    sleep() {
      awake = false;
    },

    destroy() {
      if (dead) return;
      dead = true;
      geo.dispose();
      hull.dispose();
      cel.dispose();
      line.dispose();
      renderer.dispose();
      /* dispose() releases three's own objects but leaves the context alive
         until the browser decides otherwise. Routing to a case study and back
         a few times is enough to hit the per-page context limit, at which
         point the oldest context is killed and some other canvas goes blank. */
      renderer.forceContextLoss();
    },
  };
}
