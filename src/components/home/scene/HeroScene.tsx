import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import NodeWeb from "./NodeWeb";
import RoboSpider from "./RoboSpider";

/* ──────────────────────────────────────────────────────────────────────────
   The hero's 3D layer.

   This is the heaviest thing this page has ever carried — three plus R3F is
   roughly 600KB before anything renders — and this site has been through
   several rounds of performance work, so the mitigations are not optional:

   · Lazy chunk. Nothing here is in the homepage bundle; it arrives after the
     hero has already painted, so first paint is unaffected.
   · Tier-gated. The device tier that governs the rest of the site governs this
     too. A weak machine never downloads it.
   · dpr capped at [1, 1.6]. A 3D canvas at DPR 2 on a 27" display is the same
     fill-rate trap the particle canvas fell into earlier; the budget is
     backing-store pixels, not device pixels.
   · No shadows, no post-processing, no environment map. Every one of those is
     a per-frame cost for something that sits behind text at low opacity.

   The one rule this DOES break, stated plainly rather than hidden: R3F runs
   its own render loop, so the page now has two rAF drivers rather than one.
   That was a hard constraint through the performance work. It is broken here
   because the alternative is driving three's renderer manually from
   gsap.ticker, which fights the library at every version bump for a saving of
   one scheduler. Worth knowing it is a deliberate exception rather than an
   oversight.
   ────────────────────────────────────────────────────────────────────────── */

export default function HeroScene({ interactive }: { interactive: boolean }) {
  const reduce = !!useReducedMotion();
  const live = interactive && !reduce;

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 9], fov: 42 }}
        style={{ pointerEvents: "none" }}
      >
        {/* Enough light to give the spider volume and no more. The webs are
            additive and unlit by design, so all of this is for the spider. */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[4, 5, 6]}
          angle={0.5}
          penumbra={1}
          intensity={28}
          color="#DCE6FF"
        />
        <pointLight position={[-5, -3, 3]} intensity={7} color="#5B8CFF" />

        {/* Corners only, so the centre stays a clean vignette for the text.
            Three clusters at different depths: the intensity falloff is what
            reads as distance, more than the z position does. */}
        <NodeWeb
          origin={[6.1, 3.0, -1.2]}
          spread={2.5}
          count={46}
          linkDist={1.35}
          intensity={1}
          seed={7}
          interactive={live}
        />
        <NodeWeb
          origin={[-6.6, -2.7, -3.4]}
          spread={2.3}
          count={34}
          linkDist={1.3}
          intensity={0.62}
          seed={23}
          interactive={live}
        />
        <NodeWeb
          origin={[6.4, -3.1, -5.0]}
          spread={1.8}
          count={24}
          linkDist={1.25}
          intensity={0.4}
          seed={51}
          interactive={live}
        />

        {/* top-right quadrant, hanging off the primary cluster */}
        <RoboSpider anchor={[4.5, 4.4, 0.3]} drop={2.5} interactive={live} />
      </Canvas>
    </div>
  );
}
