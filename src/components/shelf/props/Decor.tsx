import { PALETTE, SHELF } from "../shelf";
import {
  Bowl,
  Figurine,
  FilmCamera,
  Geo,
  Jar,
  Lamp,
  Mug,
  PencilCup,
  Plaque,
  Pot,
  PottedPlant,
  Foliage,
  Stack,
  Vase,
} from "./shapes";

/* --------------------------------------------------------------------------
   WHAT IS ON THE SHELVES.

   Everything stands ON a board, so every y here is a tier and nothing is
   floated by hand. The z values stay between -0.42 and 0.08: the boards run
   from the wall at -0.84 to a nose at +0.52, and a prop near the nose at this
   camera angle hangs over the edge in a way that reads as a mistake rather
   than as styling.

   The arrangement is deliberately uneven. Objects grouped in twos and threes
   with real gaps between the groups read as a shelf somebody uses; evenly
   spaced objects read as a product grid, which is the one thing a room like
   this must not look like.

   It is also weighted. The camera sits close and looks across the run, so
   roughly x -5 to +3 is what anyone actually sees; the best props go there
   and the far ends get quiet filler that only shows up if a reader orbits.
   -------------------------------------------------------------------------- */

const [FLOOR, LOW, MID, BOOKS, TOP] = SHELF.tiers;

/* module scope, so the baked geometry is built once rather than on every
   render of the component that holds it */
const VASE_SPRIGS = [
  { len: 0.7, leaves: 5, size: 0.072, tilt: 0.16, spin: 0.3 },
  { len: 0.6, leaves: 4, size: 0.07, tilt: 0.3, spin: 2.4 },
  { len: 0.5, leaves: 4, size: 0.066, tilt: 0.42, spin: 4.5 },
];
const TALL_SPRIGS = [
  { len: 0.86, leaves: 6, size: 0.075, tilt: 0.1, spin: 0.2 },
  { len: 0.72, leaves: 5, size: 0.072, tilt: 0.26, spin: 2.2 },
  { len: 0.6, leaves: 4, size: 0.068, tilt: 0.4, spin: 4.1 },
];

export function Decor() {
  return (
    <group>
      {/* ── top board ─────────────────────────────────────────────────── */}
      <Bowl position={[-4.5, TOP, -0.16]} r={0.4} h={0.17} color="#A9793F" />
      <Bowl position={[-4.47, TOP + 0.15, -0.14]} r={0.32} h={0.15} color="#B8864A" />
      <Mug position={[-3.5, TOP, -0.04]} r={0.15} h={0.26} color={PALETTE.cream} />
      <Bowl position={[-3.47, TOP, -0.04]} r={0.25} h={0.045} color={PALETTE.cream} />
      <Bowl position={[-2.5, TOP, -0.12]} r={0.38} h={0.19} color="#9FB38F" />
      <Bowl position={[-2.47, TOP + 0.17, -0.1]} r={0.31} h={0.17} color="#B6C6A6" />
      <Bowl position={[-1.35, TOP, -0.1]} r={0.29} h={0.15} color={PALETTE.clay} />
      <Bowl position={[-1.32, TOP + 0.13, -0.08]} r={0.24} h={0.14} color={PALETTE.cream} />
      <PottedPlant position={[-0.25, TOP, -0.12]} r={0.24} h={0.29} pot={PALETTE.cream} sprigs={3} len={0.55} />
      <Geo position={[0.85, TOP + 0.15, -0.08]} r={0.15} color={PALETTE.stone} rotation={[0.5, 0.4, 0]} />
      <Mug position={[1.6, TOP, -0.06]} r={0.16} h={0.28} color="#7F86A8" />
      <PottedPlant position={[2.7, TOP, -0.14]} r={0.26} h={0.3} pot={PALETTE.clayDeep} sprigs={4} len={0.5} leaf="#7E9B74" />
      <Bowl position={[4.1, TOP, -0.12]} r={0.36} h={0.16} color={PALETTE.stone} />

      {/* ── the books' board ──────────────────────────────────────────── */}
      <Bowl position={[-4.7, BOOKS, -0.14]} r={0.36} h={0.16} color={PALETTE.clayDeep} />
      <Mug position={[-3.9, BOOKS, -0.04]} r={0.15} h={0.26} color={PALETTE.stone} />
      <Bowl position={[-3.87, BOOKS, -0.04]} r={0.25} h={0.04} color={PALETTE.stone} />
      <group position={[-2.85, BOOKS, -0.14]}>
        <Vase r={0.19} h={0.5} color={PALETTE.cream} />
        <Foliage position={[0, 0.45, 0]} sprigs={VASE_SPRIGS} />
      </group>

      {/* right of the books, which is where the eye lands after them */}
      <group position={[-0.1, BOOKS, -0.16]}>
        <Pot r={0.24} h={0.3} color={PALETTE.cream} />
        <Foliage position={[0, 0.27, 0]} sprigs={TALL_SPRIGS} />
      </group>
      <Geo position={[0.6, BOOKS + 0.15, -0.08]} r={0.16} color="#CDBBA2" rotation={[0.4, 0.8, 0.2]} />
      <FilmCamera position={[1.35, BOOKS, -0.08]} rotation={[0, -0.46, 0]} scale={0.86} />
      <Plaque text="JAY HARWANI · MOTION & DESIGN" w={1.55} position={[2.5, BOOKS + 0.11, 0.0]} rotation={[0, -0.3, 0]} />
      <Mug position={[3.95, BOOKS, -0.06]} r={0.16} h={0.27} color="#8891B4" />

      {/* ── the lamp's board ──────────────────────────────────────────── */}
      <Bowl position={[-4.6, MID, -0.14]} r={0.38} h={0.18} color={PALETTE.clayDeep} />
      <Mug position={[-3.8, MID, -0.04]} r={0.15} h={0.26} color={PALETTE.stone} />
      <PottedPlant position={[-2.95, MID, -0.14]} r={0.23} h={0.27} pot={PALETTE.cream} sprigs={3} len={0.52} />
      <Stack n={4} w={0.74} d={0.54} position={[-1.85, MID, -0.1]} rotation={[0, 0.16, 0]} />
      <Bowl position={[-0.8, MID, -0.12]} r={0.4} h={0.19} color={PALETTE.stone} />
      <Jar position={[0.2, MID, -0.08]} r={0.17} h={0.34} />
      <PencilCup position={[0.78, MID, 0.0]} r={0.14} h={0.28} />
      <Stack n={3} w={0.68} d={0.5} position={[1.55, MID, -0.1]} rotation={[0, -0.1, 0]} colors={[PALETTE.cream, "#C9B9A2", PALETTE.clay]} />
      <Lamp position={[2.3, MID, -0.16]} rotation={[0, -0.72, 0]} scale={0.94} />
      <Geo position={[3.4, MID + 0.16, -0.08]} r={0.17} color={PALETTE.clayDeep} rotation={[0.3, 1.1, 0.2]} />

      {/* ── lower boards, mostly read as texture under the subject ────── */}
      <Jar position={[-3.3, LOW, -0.08]} r={0.16} h={0.38} fill="#C7B596" />
      <Bowl position={[-2.3, LOW, -0.12]} r={0.42} h={0.19} color={PALETTE.cream} />
      <PottedPlant position={[-1.2, LOW, -0.14]} r={0.25} h={0.3} pot={PALETTE.cream} sprigs={4} len={0.55} leaf="#7FA075" />
      <Stack n={5} w={0.82} d={0.58} position={[0.35, LOW, -0.1]} rotation={[0, 0.1, 0]} colors={[PALETTE.cream, "#A9B79C", PALETTE.clay, "#C5B49C"]} />
      <PencilCup position={[1.3, LOW, 0.0]} r={0.15} h={0.3} />
      <Figurine position={[1.95, LOW, 0.0]} />
      <Bowl position={[2.9, LOW, -0.12]} r={0.38} h={0.17} color="#A9793F" />

      <Stack n={4} w={0.8} d={0.58} position={[-2.6, FLOOR, -0.1]} rotation={[0, -0.12, 0]} />
      <Bowl position={[-1.3, FLOOR, -0.12]} r={0.44} h={0.2} color={PALETTE.stone} />
      <PottedPlant position={[0.1, FLOOR, -0.14]} r={0.27} h={0.33} pot={PALETTE.clayDeep} sprigs={4} len={0.6} />
      <Stack n={3} w={0.76} d={0.56} position={[1.5, FLOOR, -0.1]} colors={[PALETTE.clay, PALETTE.cream, "#A9B79C"]} />
    </group>
  );
}
