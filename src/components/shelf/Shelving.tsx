import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, SHELF } from "./shelf";
import { wood } from "./textures";

/* --------------------------------------------------------------------------
   THE SHELVING, AND THE WALL BEHIND IT.

   Four boards, running off both edges of the frame. That last part is the
   whole trick: a shelf that ends inside the shot reads as a prop sitting on a
   table, while one that runs out of frame reads as a wall of shelving the
   camera happens to be standing close to. The reference is the second thing.

   Boards are round-nosed, because a square-edged board at doll scale looks
   like a sheet of card. Everything is matte -- at this scale a highlight is a
   dot, not a sweep, and the moment anything goes glossy the miniature reads
   as a render of furniture instead.
   -------------------------------------------------------------------------- */

const BACK = SHELF.wallZ;
const FRONT = 0.52;
const BOARD_D = FRONT - BACK;
const BOARD_Z = (FRONT + BACK) / 2;

/** vertical dividers, by tier index and x.

    Only on the boards below the books. A divider beside the books would cut
    the one part of the frame that has to stay legible, and the lower boards
    are where an upright earns its keep anyway: it is what stops a stack of
    journals reading as a stack of journals floating in a gap. */
const DIVIDERS: Array<[number, number]> = [
  [0, -3.6],
  [0, 0.95],
  [1, -2.9],
  [1, 2.4],
  [2, -3.45],
  [2, 2.2],
];

export function Shelving() {
  const mats = useMemo(() => {
    const grain = wood(PALETTE.walnut, 2);
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(3, 1);

    const endGrain = wood(PALETTE.walnut, 6);
    endGrain.wrapS = endGrain.wrapT = THREE.RepeatWrapping;

    return {
      board: new THREE.MeshStandardMaterial({ map: grain, roughness: 0.88, metalness: 0 }),
      upright: new THREE.MeshStandardMaterial({ map: endGrain, roughness: 0.9, metalness: 0 }),
      wall: new THREE.MeshStandardMaterial({ color: PALETTE.wall, roughness: 1 }),
    };
  }, []);

  return (
    <group>
      {/* the wall. Large enough that the key light's window gobo lands on
          plaster at every viewport rather than running off the edge. */}
      <mesh position={[0, 0, BACK - 0.06]} receiveShadow material={mats.wall}>
        <planeGeometry args={[34, 24]} />
      </mesh>

      {SHELF.tiers.map((y) => (
        <RoundedBox
          key={y}
          args={[SHELF.span * 2, SHELF.board, BOARD_D]}
          radius={SHELF.board * 0.4}
          smoothness={3}
          position={[0, y - SHELF.board / 2, BOARD_Z]}
          material={mats.board}
          castShadow
          receiveShadow
        />
      ))}

      {DIVIDERS.map(([tier, x]) => {
        const lo = SHELF.tiers[tier];
        const hi = SHELF.tiers[tier + 1];
        const h = hi - lo - SHELF.board;
        return (
          <RoundedBox
            key={`${tier}:${x}`}
            args={[SHELF.board, h, BOARD_D - 0.1]}
            radius={SHELF.board * 0.34}
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
