import { useMemo } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { shelfPalette } from "./shelfPalette";

/* --------------------------------------------------------------------------
   ONE LIGHT TELLS THE STORY.

   A brass lamp standing to the right of the books throws a warm pool across
   them, and everything else falls into a cool, quiet dark. That is the whole
   rig, and the discipline it demands is this: when somewhere is too dark, do
   NOT raise the ambient. Raising ambient lifts the entire frame by the same
   amount, which is precisely how the old scene ended up with 0.1% of its
   pixels below luma 60 and nothing reading as the subject. Move the key, widen
   it, or put a small bounce where the problem is.

   There is no ambientLight here at all. The hemisphere at 0.15 exists only so
   that unlit geometry is dark rather than black, because pure black has no
   shape and reads as a hole.

   INTENSITIES ARE IN CANDELA and fall off with the square of distance. The
   spec's starting numbers assume a lamp roughly two units from the books; this
   lamp is about 1.7 away, so the key is calibrated down from 40 rather than
   pasted in. The value meter decides, not the eye.
   -------------------------------------------------------------------------- */

RectAreaLightUniformsLib.init();

type V3 = [number, number, number];

export interface Rig {
  /** world position of the bulb inside the lamp head */
  bulb: V3;
  /** what the key is aimed at: the middle of the four books */
  focus: V3;
  highTier: boolean;
}

export function ShelfLights({ bulb, focus, highTier }: Rig) {
  const target = useMemo(() => new THREE.Object3D(), []);

  return (
    <>
      {/* THE TARGET IS A REAL CHILD, not something assigned in an effect.
          Assigning spot.target imperatively left the light pointing at the
          world origin, and because the origin happens to sit on the books'
          own board the result looked plausible: a warm pool, just never on
          the books. Four different key intensities produced byte-identical
          frames before this was caught, which is the tell -- a light nothing
          depends on is a light that is not reaching anything. */}
      <primitive object={target} position={focus} />
      {/* floor, not fill: stops the unlit side of anything going to pure black */}
      <hemisphereLight args={[shelfPalette.skyFill, shelfPalette.groundFill, 4.8]} />

      {/* the one light that matters, and the only one that casts */}
      <spotLight
        position={bulb}
        target={target}
        color={shelfPalette.lampWarm}
        intensity={112}
        decay={2}
        /* ANGLE AND PENUMBRA TOGETHER DECIDE WHAT THE INTENSITY MEANS.
           penumbra is the fraction of the cone that is falloff, so 0.85 inside
           a 0.62rad cone leaves a hard core of 0.09rad -- and the four books
           subtend 0.36rad from here. The whole run was sitting in the soft
           edge, receiving a fraction of the stated candela, which is why
           tripling the number barely moved the frame. The core now covers the
           books and the edge lands on the board either side. */
        angle={0.78}
        penumbra={0.5}
        castShadow
        shadow-mapSize={highTier ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-camera-near={0.1}
        shadow-camera-far={12}
      />

      {/* the shade's own glow, so the lamp looks lit from inside rather than
          like a dark object with a bright disc stuck to it */}
      <pointLight position={bulb} color={shelfPalette.shadeGlow} intensity={2.4} distance={1.2} decay={2} />

      {/* cool fill from the front left. It is what keeps the shadows readable
          and, because it is cool against a warm key, what makes the warm read
          as warm at all. */}
      <directionalLight position={[-6, 5, 6]} color={shelfPalette.fillCool} intensity={2.4} />

      {/* a thin cool line along the board noses and the tops of the leaves */}
      <rectAreaLight
        position={[0, 3.1, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={14}
        height={0.5}
        color={shelfPalette.rim}
        intensity={2.9}
      />

      {/* something for the brass, the glaze and the clearcoat to reflect.
          background={false} by default, so this never lights the frame on its
          own; it only shows up in speculars. */}
      <Environment resolution={128} environmentIntensity={0.25}>
        <Lightformer form="rect" color={shelfPalette.lampWarm} intensity={2} position={[3, 2, 2]} scale={[2, 1, 1]} />
        <Lightformer form="rect" color={shelfPalette.fillCool} intensity={0.6} position={[-4, 3, 3]} scale={[4, 2, 1]} />
      </Environment>
    </>
  );
}
