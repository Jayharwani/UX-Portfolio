import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, SHELF } from "./shelf";
import { shelfPalette } from "./shelfPalette";
import { TEX, useTiledMaps } from "./materials/useTiledMaps";

/* --------------------------------------------------------------------------
   THE SHELVING, AND THE WALL BEHIND IT.

   Five boards, running off both edges of the frame. That last part is the
   whole trick: a shelf that ends inside the shot reads as a prop sitting on a
   table, while one that runs out of frame reads as a wall of shelving the
   camera happens to be standing close to.

   THE NOSE IS THE POINT. A board is proved solid by one thin highlight along
   its front edge, so the bevel is small -- about 1.5% of a book's height. The
   old scene rounded the boards by 5% and they read as foam. A square edge is
   worse still: it catches nothing and the board looks like card.

   GRAIN RUNS ALONG THE BOARD, never across it, and every board gets its own
   offset into the tile so no two share a figure. Repeating grain is the single
   most recognisable sign of a texture rather than a material.
   -------------------------------------------------------------------------- */

const BACK = SHELF.wallZ;
const FRONT = 0.52;
const BOARD_D = FRONT - BACK;
const BOARD_Z = (FRONT + BACK) / 2;

/** 1.5% of the tallest book: enough for the key to draw one line on it */
const NOSE = 0.018;

/** vertical dividers, by tier index and x. Only below the books: an upright
    beside them would cut the one part of the frame that has to stay legible. */
const DIVIDERS: Array<[number, number]> = [
  [1, -2.9],
  [1, 2.4],
  [2, -3.45],
  [2, 2.2],
];

function Board({ y, i }: { y: number; i: number }) {
  /* one tile is about a unit along the board, so the widest figure lands at
     roughly the width of one book spine */
  /* Fifteen tiles along one board put the widest figure at a book-spine's
     width, which is the rule, but fifteen copies of one 2K tile is a pattern
     and the eye finds patterns. Ten is the compromise: the figure runs a
     little wide and the repeat stops being findable. Each board also starts
     at its own offset, so no two share a grain. */
  const maps = useTiledMaps(TEX.walnut, [10, 0.9], [i * 0.37, i * 0.21]);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        ...maps,
        color: shelfPalette.walnutTint,
        roughness: 1,
        metalness: 0,
        /* The grain has to arrive as shading, not as colour: at this light
           level the contrast inside the diffuse map compresses into two or
           three luma steps and the board reads as matte card. A strong normal
           and a thin clearcoat give the figure something to catch. */
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        normalScale: new THREE.Vector2(1.0, 1.0),
      }),
    [maps]
  );
  return (
    <RoundedBox
      args={[SHELF.span * 2, SHELF.board, BOARD_D]}
      radius={NOSE}
      smoothness={3}
      position={[0, y - SHELF.board / 2, BOARD_Z]}
      material={mat}
      castShadow
      receiveShadow
    />
  );
}

export function Shelving() {
  const plaster = useTiledMaps(TEX.plaster, [16, 11]);
  const walnut = useTiledMaps(TEX.walnut, [3, 1.6], [0.6, 0.3]);

  const mats = useMemo(
    () => ({
      wall: new THREE.MeshStandardMaterial({
        ...plaster,
        color: PALETTE.wall,
        roughness: 0.92,
        metalness: 0,
        normalScale: new THREE.Vector2(0.35, 0.35),
      }),
      upright: new THREE.MeshPhysicalMaterial({
        ...walnut,
        color: shelfPalette.walnutTint,
        roughness: 1,
        metalness: 0,
        clearcoat: 0.2,
        clearcoatRoughness: 0.5,
        normalScale: new THREE.Vector2(0.5, 0.5),
      }),
    }),
    [plaster, walnut]
  );

  return (
    <group>
      {/* The wall. Large enough that it still fills the frame when a reader
          drags the camera to the end of its leash. */}
      <mesh position={[0, 0, BACK - 0.06]} receiveShadow material={mats.wall}>
        <planeGeometry args={[34, 24]} />
      </mesh>

      {SHELF.tiers.map((y, i) => (
        <Board key={y} y={y} i={i} />
      ))}

      {DIVIDERS.map(([tier, x]) => {
        const lo = SHELF.tiers[tier];
        const hi = SHELF.tiers[tier + 1];
        const h = hi - lo - SHELF.board;
        return (
          <RoundedBox
            key={`${tier}:${x}`}
            args={[SHELF.board, h, BOARD_D - 0.1]}
            radius={NOSE}
            smoothness={3}
            position={[x, lo + h / 2, BOARD_Z - 0.05]}
            material={mats.upright}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}
