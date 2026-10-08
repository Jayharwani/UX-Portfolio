import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

/* --------------------------------------------------------------------------
   THE LENS.

   ONE COMPONENT PER TIER, never one component with conditional children.
   EffectComposer builds its pass list from its children at mount; swapping a
   child in or out mid-life leaves the composer holding a pass it has already
   disposed, and the symptom is a black frame rather than an error.

   TONE MAPPING IS AN EFFECT HERE, NOT A RENDERER SETTING, and that is the
   single most important line in this file. @react-three/postprocessing sets
   gl.toneMapping to NoToneMapping for as long as its composer is mounted
   (dist/EffectComposer.js:118). Whatever the renderer was configured with is
   dead for the whole life of the page. Before this effect existed the scene
   shipped raw linear-to-sRGB: 5.5% of its pixels clipped and nothing had any
   shape.

   AgX rather than ACES because this is a dark room with one hot source. ACES
   pushes saturated highlights towards white and the lamp's warm pool went
   pink; AgX holds its hue into the shoulder, which is the whole look.

   BLOOM'S THRESHOLD OF 1 only works because the composer renders in half
   float. The one thing in the scene above 1 is the bulb, whose basic material
   carries its colour scaled past the display range on purpose. Everything
   else -- the lit spines, the brass, the page edges -- stays below it, so
   nothing glows that should not.
   -------------------------------------------------------------------------- */

type V3 = [number, number, number];

const AO = { aoRadius: 0.5, distanceFalloff: 1, intensity: 2.4, color: "#140C07" } as const;
const BLOOM = { mipmapBlur: true, levels: 5, luminanceThreshold: 1, luminanceSmoothing: 0.2 } as const;
const VIGNETTE = { offset: 0.28, darkness: 0.62 } as const;

export function ShelfPostHigh({ focus }: { focus: V3 }) {
  return (
    <EffectComposer multisampling={4}>
      <N8AO {...AO} quality="medium" />
      {/* focused on the books by world position, not by a normalised depth:
          focusDistance is relative to the camera's far plane, and a far plane
          that moves takes the focus with it */}
      {/* focalLength here is the depth of the in-focus slab, not a lens
          focal length, and 0.02 of the far plane is about 1.2 units at this
          camera -- narrower than a single book is deep, so the spines went
          soft along with everything else. The subject has to be the one sharp
          thing in the frame or the blur is just a blurry picture. */}
      <DepthOfField target={focus} focalLength={0.26} bokehScale={1.3} />
      <Bloom {...BLOOM} intensity={0.55} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette {...VIGNETTE} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
    </EffectComposer>
  );
}

export function ShelfPostMedium() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO {...AO} quality="low" halfRes />
      <Bloom {...BLOOM} intensity={0.55} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette {...VIGNETTE} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
      <SMAA />
    </EffectComposer>
  );
}

export function ShelfPostLow() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom {...BLOOM} intensity={0.5} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette {...VIGNETTE} eskil={false} />
      <SMAA />
    </EffectComposer>
  );
}
