import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import NodeWeb from "./NodeWeb";

/* ──────────────────────────────────────────────────────────────────────────
   The hero's 3D layer.

   One large rotating lattice, and nothing else. The robo-spider was removed:
   its motion was too fast and too continuous, and a small object moving
   quickly in the corner of a page you are trying to read is an irritant no
   matter how well it is modelled. It also split attention with the lattice,
   and the brief for this pass is that the lattice IS the highlight.

   What makes the scene read as three-dimensional, in order of how much each
   contributes:

   1. The rotation. A ring turning shows one side approaching and the other
      receding. Nothing else here comes close to that as a depth cue.
   2. The fog. The far side of the ring dissolves into the exact background
      colour, so distance reads as atmosphere rather than as scale. This is
      also what stops the back of the lattice competing with the headline.
   3. Perspective. A 42-degree camera at z=11 gives real convergence: nodes
      nearer the camera are visibly larger and further apart.

   Lighting is gone entirely. Everything here is additive and unlit by design,
   so the ambient and spot lights that existed for the spider were paying for
   nothing. Removing them takes real per-frame work out of the renderer.

   Performance notes as before: lazy chunk, tier-gated, dpr capped at 1.6, no
   shadows, no post-processing, no environment map. R3F still runs its own
   render loop, which remains this page's one deliberate exception to the
   single-rAF-driver rule.
   ────────────────────────────────────────────────────────────────────────── */

export default function HeroScene({ interactive }: { interactive: boolean }) {
  const reduce = !!useReducedMotion();
  const live = interactive && !reduce;

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 11], fov: 42 }}
        style={{ pointerEvents: "none" }}
        onCreated={({ scene }) => {
          /* Fog in the page's exact background colour. The far side of the
             lattice does not fade to grey, it fades to the page — which is why
             it reads as distance rather than as transparency. */
          scene.fog = new THREE.Fog("#0A0E16", 9, 26);
        }}
      >
        <NodeWeb
          majorRadius={8.2}
          minorRadius={2.4}
          count={260}
          linkDist={1.5}
          seed={7}
          interactive={live}
        />
      </Canvas>
    </div>
  );
}
