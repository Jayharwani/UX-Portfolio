import { LAMP, PALETTE, SHELF } from "../shelf";
import { Bookend, Bowl, Foliage, Lamp, Mug, PencilCup, Plaque, Stack, Vine } from "./shapes";
import { FilmCamera, StonewareVase } from "./Models";

/* --------------------------------------------------------------------------
   WHAT IS ON THE SHELVES, AND WHAT IS NOT.

   Mostly what is not. The old arrangement had thirty-odd objects: stacked
   pastel bowls, two faceted gems, lavender mugs, a glass jar, a chess pawn,
   duplicate pencil cups. None of them said anything about whose shelf this
   is, and together they turned the frame into a search puzzle with four books
   hidden in it.

   The limits are the design. Six objects on the books' board, four on the one
   above and four below, and at least a third of every board left empty.
   Empty walnut in a pool of light is not wasted space; it is the thing that
   makes the pool read as light.

   Every y here is a tier, so nothing is floated by hand, and z stays between
   -0.42 and +0.45: the boards run from the wall at -0.84 to a nose at +0.52,
   and a prop at the nose hangs over the edge at this camera angle in a way
   that reads as a mistake rather than as styling.
   -------------------------------------------------------------------------- */

const [, LOW, MID, BOOKS, TOP] = SHELF.tiers;

/* eucalyptus for the vase: three sprigs, splayed, a few leaves catching the
   lamp. Module scope so the merged geometry is built once. */
const EUCALYPTUS = [
  { len: 0.66, leaves: 5, size: 0.075, tilt: 0.14, spin: 0.3 },
  { len: 0.56, leaves: 4, size: 0.07, tilt: 0.3, spin: 2.4 },
  { len: 0.47, leaves: 4, size: 0.066, tilt: 0.44, spin: 4.5 },
];

export function Decor() {
  return (
    <group>
      {/* ── the top board: only its underside and front edge are in shot, so
             whatever stands here is read as a silhouette and cropped ────── */}
      <Bowl position={[-2.15, TOP, -0.12]} r={0.34} h={0.16} color={PALETTE.stoneware} />
      <Mug position={[-0.95, TOP, -0.04]} r={0.15} h={0.26} color={PALETTE.stoneware} />
      <Stack n={3} w={0.66} d={0.5} position={[0.5, TOP, -0.1]} rotation={[0, 0.14, 0]} colors={[PALETTE.walnut, PALETTE.stoneware, PALETTE.walnut]} />
      <Bowl position={[1.3, TOP, -0.12]} r={0.3} h={0.14} color={PALETTE.stoneware} />

      {/* ── the books' board ───────────────────────────────────────────── */}

      {/* against the last book, so the run has a reason to stand up */}
      <Bookend position={[-0.47, BOOKS, -0.06]} h={0.6} />

      {/* Between the books and the lamp, where the key still reaches. At 3.2
          the vase stood taller than the books, swallowed its own eucalyptus
          and became the brightest object in the frame -- the one thing the
          hierarchy cannot afford. */}
      <group position={[-0.05, BOOKS, -0.14]}>
        <StonewareVase scale={1.75} />
        <Foliage position={[0, 0.52, 0]} sprigs={EUCALYPTUS} />
      </group>

      <Lamp position={LAMP.at} rotation={[0, LAMP.rotY, 0]} />

      {/* beyond the lamp base, turned toward the viewer so it catches a
          brass highlight down one edge */}
      <FilmCamera position={[1.42, BOOKS, -0.26]} rotation={[0, -0.5, 0]} scale={4.2} />

      {/* on the front edge, lower right, where the spec puts identity */}
      {/* The frame only reaches x = 1.5 at this depth, so "lower right third"
          is 0.95 and not 2.55; at 2.55 the plaque was a well-made object
          nobody would ever see. */}
      <Plaque line1="JAY HARWANI" line2="PRODUCT DESIGNER" w={1.0} position={[0.86, BOOKS + 0.125, 0.45]} rotation={[0, -0.2, 0]} />

      {/* ── the board below: mostly shadow, read as depth rather than as
             objects ──────────────────────────────────────────────────────── */}
      <Stack n={4} w={0.78} d={0.56} position={[-1.6, MID, -0.1]} rotation={[0, 0.16, 0]} colors={[PALETTE.walnut, PALETTE.stoneware, PALETTE.walnut, PALETTE.ivy]} />
      <PencilCup position={[-0.7, MID, 0.0]} r={0.15} h={0.3} />
      <Bowl position={[0.35, MID, -0.12]} r={0.4} h={0.19} color={PALETTE.stoneware} />
      <Stack n={3} w={0.72} d={0.52} position={[1.5, MID, -0.1]} rotation={[0, -0.1, 0]} colors={[PALETTE.walnut, PALETTE.ivy, PALETTE.stoneware]} />

      {/* ── the board below that: two objects, both of them silhouette ──
             The bottom board is out of frame entirely at this camera, so it
             carries nothing. Dressing a shelf nobody can see is draw calls
             spent on a photograph that does not exist. */}
      <Stack n={4} w={0.8} d={0.58} position={[-1.2, LOW, -0.1]} rotation={[0, -0.12, 0]} />
      <Bowl position={[0.4, LOW, -0.12]} r={0.42} h={0.19} color={PALETTE.stoneware} />

      {/* ── the framing ────────────────────────────────────────────────────
             Two vines off the top board, entering at the corners and falling
             past the edge of the shot. They never cross the books. */}
      <Vine position={[-2.95, TOP - SHELF.board, 0.44]} len={2.5} leaves={13} spread={0.5} seed={3} />
      <Vine position={[1.62, TOP - SHELF.board, 0.46]} len={1.9} leaves={10} spread={-0.42} seed={11} />
    </group>
  );
}
