import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as THREE from "three";
import { PALETTE } from "../shelf";
import { shelfPalette } from "../shelfPalette";
import { plaque } from "../textures";

/* --------------------------------------------------------------------------
   THE PROPS, AS PRIMITIVES.

   Every object here is lathed, extruded or stacked out of basic geometry.
   Nothing is imported, because a glTF of a ceramic mug is a quarter of a
   megabyte and a lathe of nine points is forty bytes of source.

   A lathe is the right tool for anything thrown on a wheel. The profile runs
   up the outside, over the rim and back down the inside, which gives a real
   wall thickness -- a bowl modelled as a single surface reads as a saucer the
   moment the camera looks into it, and this camera looks down at everything.

   Materials are cached by colour and roughness. Fifty props sharing six
   materials is six state changes a frame; fifty props each newing their own
   is fifty, and on a 2019 laptop that is the difference.
   -------------------------------------------------------------------------- */

const cache = new Map<string, THREE.MeshStandardMaterial>();
export function mat(color: string, roughness = 0.92, metalness = 0) {
  const key = `${color}:${roughness}:${metalness}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    cache.set(key, m);
  }
  return m;
}
export function disposeProps() {
  cache.forEach((m) => m.dispose());
  cache.clear();
}

const V = (x: number, y: number) => new THREE.Vector2(x, y);

/** up the outside, over the rim, back down the inside */
function hollow(r: number, h: number, waist: number, mouth: number) {
  const t = Math.min(0.1 * r + 0.012, r * 0.22);
  return [
    V(0.001, 0),
    V(r * 0.5, 0.004),
    V(r * waist, h * 0.34),
    V(r * mouth, h * 0.93),
    V(r * mouth, h),
    V(r * mouth - t, h),
    V(r * waist - t, h * 0.34),
    V(r * 0.46, h * 0.1),
    V(0.001, h * 0.09),
  ];
}

export function Bowl({ r = 0.3, h = 0.2, color = PALETTE.stoneware, ...rest }: Thrown) {
  const geo = useMemo(() => new THREE.LatheGeometry(hollow(r, h, 0.82, 1), 26), [r, h]);
  return <mesh geometry={geo} material={mat(color, 0.9)} castShadow receiveShadow {...rest} />;
}

export function Vase({ r = 0.22, h = 0.62, color = PALETTE.stoneware, ...rest }: Thrown) {
  const geo = useMemo(() => new THREE.LatheGeometry(hollow(r, h, 1, 0.62), 26), [r, h]);
  return <mesh geometry={geo} material={mat(color, 0.86)} castShadow receiveShadow {...rest} />;
}

export function Pot({ r = 0.26, h = 0.3, color = PALETTE.stoneware, ...rest }: Thrown) {
  const geo = useMemo(() => new THREE.LatheGeometry(hollow(r, h, 0.88, 1.04), 24), [r, h]);
  return <mesh geometry={geo} material={mat(color, 0.95)} castShadow receiveShadow {...rest} />;
}

export function Mug({ r = 0.14, h = 0.24, color = PALETTE.stoneware, ...rest }: Thrown) {
  const geo = useMemo(() => new THREE.LatheGeometry(hollow(r, h, 0.98, 1), 20), [r, h]);
  return (
    <group {...rest}>
      <mesh geometry={geo} material={mat(color, 0.9)} castShadow receiveShadow />
      <mesh position={[r * 1.02, h * 0.58, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat(color, 0.9)} castShadow>
        <torusGeometry args={[r * 0.52, r * 0.17, 8, 16, Math.PI * 1.25]} />
      </mesh>
    </group>
  );
}

/* -- things that grow ----------------------------------------------------
   A sprig is a stem with leaves alternating up it, each one turned a little
   further round than the last. Real eucalyptus does exactly this, and it is
   why a handful of flattened discs reads as a plant rather than as beads on
   a wire. Spacing is the whole trick: leaves have to sit further apart than
   they are wide, with bare stem showing between them, or the sprig fuses into
   a knobbly column and reads as a succulent.

   EVERY LEAF ON A PLANT IS ONE MESH. Not one each -- one for all of them.
   Modelled the obvious way this scene drew 412 times a frame, and the leaves
   were most of it: ten plants times four sprigs times five leaves is two
   hundred meshes, each costing a draw call, and each costing a second one in
   the shadow pass. Baking the transforms into the vertices and merging them
   gives identical pixels for two calls per plant. The cost is that a merged
   plant cannot be animated per leaf, which none of them are. */

export interface SprigSpec {
  len: number;
  leaves: number;
  size: number;
  tilt: number;
  spin: number;
}

const LEAF = new THREE.SphereGeometry(1, 9, 6);

function bake(specs: SprigSpec[]) {
  const leaves: THREE.BufferGeometry[] = [];
  const stems: THREE.BufferGeometry[] = [];
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  const m = new THREE.Matrix4();

  for (const sp of specs) {
    const root = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(sp.tilt, sp.spin, 0));

    const stem = new THREE.CylinderGeometry(0.007, 0.011, sp.len, 5);
    stem.applyMatrix4(m.copy(root).multiply(new THREE.Matrix4().makeTranslation(0, sp.len / 2, 0)));
    stems.push(stem);

    for (let i = 0; i < sp.leaves; i++) {
      const t = 0.34 + (i / Math.max(1, sp.leaves - 1)) * 0.66;
      const side = i % 2 ? 1 : -1;
      const s = sp.size * (1.06 - t * 0.3);
      pos.set(side * s * 1.75, sp.len * t, Math.sin(i * 2.3) * s * 0.55);
      quat.setFromEuler(new THREE.Euler(Math.sin(i * 1.3) * 0.35, i * 1.1, side * 1.05 - 0.15));
      scl.set(s, s * 1.02, s * 0.12);
      const g = LEAF.clone();
      g.applyMatrix4(m.copy(root).multiply(new THREE.Matrix4().compose(pos, quat, scl)));
      leaves.push(g);
    }
  }
  return {
    leaves: mergeGeometries(leaves, false) as THREE.BufferGeometry,
    stems: mergeGeometries(stems, false) as THREE.BufferGeometry,
  };
}

export function Foliage({
  sprigs,
  color = PALETTE.leaf,
  ...rest
}: { sprigs: SprigSpec[]; color?: string } & Thrown) {
  const geo = useMemo(() => bake(sprigs), [sprigs]);
  return (
    <group {...rest}>
      <mesh geometry={geo.stems} material={mat(PALETTE.ivy, 0.95)} />
      <mesh geometry={geo.leaves} material={mat(color, 0.96)} castShadow />
    </group>
  );
}

/** a sprig fan, evenly spun, for the common case */
export function fan(n: number, len: number, size = 0.072, leaves = 5): SprigSpec[] {
  return Array.from({ length: n }, (_, i) => ({
    len: len * (0.82 + ((i * 37) % 10) / 20),
    leaves,
    size,
    tilt: 0.12 + (i % 3) * 0.14,
    spin: (i / n) * Math.PI * 2,
  }));
}

export function PottedPlant({
  r = 0.24,
  h = 0.3,
  pot = PALETTE.stoneware,
  sprigs = 3,
  len = 0.8,
  leaf = PALETTE.leaf,
  ...rest
}: Thrown & { pot?: string; sprigs?: number; len?: number; leaf?: string }) {
  const spec = useMemo(() => fan(sprigs, len), [sprigs, len]);
  return (
    <group {...rest}>
      <Pot r={r} h={h} color={pot} />
      <mesh position={[0, h * 0.86, 0]} material={mat(PALETTE.walnut, 1)}>
        <cylinderGeometry args={[r * 0.84, r * 0.84, 0.03, 16]} />
      </mesh>
      <Foliage sprigs={spec} color={leaf} position={[0, h * 0.88, 0]} />
    </group>
  );
}

/* -- the lamp ------------------------------------------------------------
   The only light source in frame. The bulb is an emissive disc inside the
   shade rather than a real one: a point light bright enough to look like a
   bulb blows out everything within half a unit of it, so the glow is painted
   and the light it casts is set separately and kept low. */
export function Lamp({ on = true, ...rest }: Thrown & { on?: boolean }) {
  const brass = mat(PALETTE.brass, 0.32, 1);
  return (
    <group {...rest}>
      {/* clamp foot */}
      <mesh material={brass} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.21, 0.05, 22]} />
      </mesh>
      {/* upright */}
      <mesh position={[0, 0.5, 0]} material={brass} castShadow>
        <cylinderGeometry args={[0.021, 0.025, 1.0, 10]} />
      </mesh>
      <mesh position={[0, 1.0, 0]} material={brass} castShadow>
        <sphereGeometry args={[0.038, 12, 10]} />
      </mesh>
      {/* THE REACH. A short arm put the head a unit and a half from the books,
          and inverse-square did the rest: the board under the lamp came out
          four times brighter than the thing the lamp is supposed to be
          lighting. The arm carries the head out over the run instead. */}
      <mesh position={[0.31, 0.972, 0]} rotation={[0, 0, -1.45]} material={brass} castShadow>
        <cylinderGeometry args={[0.019, 0.019, 0.62, 10]} />
      </mesh>
      <group position={[0.62, 0.96, 0]} rotation={[0, 0, -1]}>
        <mesh material={brass} castShadow>
          <cylinderGeometry args={[0.175, 0.095, 0.21, 20, 1, true]} />
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 18]} />
          <meshStandardMaterial
            color={on ? shelfPalette.bulb : PALETTE.stoneware}
            emissive={on ? shelfPalette.bulb : "#000000"}
            emissiveIntensity={on ? 12 : 0}
            roughness={1}
          />
        </mesh>
      </group>
    </group>
  );
}

/* -- the camera ----------------------------------------------------------
   Blocks and cylinders. At this scale a 35mm body is six shapes, and the
   thing that makes it read is the lens barrel stepping out in three
   diameters rather than one. */
export function FilmCamera(rest: Thrown) {
  const body = mat(PALETTE.bodyDark, 0.72);
  const steel = mat(PALETTE.brass, 0.4, 0.55);
  return (
    <group {...rest}>
      <RoundedBox args={[0.56, 0.3, 0.2]} radius={0.035} smoothness={3} position={[0, 0.15, 0]} material={body} castShadow receiveShadow />
      <RoundedBox args={[0.56, 0.1, 0.2]} radius={0.03} smoothness={3} position={[0, 0.33, 0]} material={steel} castShadow />
      <mesh position={[0.1, 0.42, 0]} material={steel} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.06, 14]} />
      </mesh>
      <mesh position={[-0.18, 0.41, 0]} material={steel} castShadow>
        <cylinderGeometry args={[0.038, 0.038, 0.05, 12]} />
      </mesh>
      <group position={[0.02, 0.16, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={body} castShadow>
          <cylinderGeometry args={[0.115, 0.125, 0.14, 20]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={steel} castShadow>
          <cylinderGeometry args={[0.1, 0.108, 0.05, 20]} />
        </mesh>
        <mesh position={[0, 0.115, 0]} material={mat(PALETTE.bodyDark, 0.18, 0.2)}>
          <cylinderGeometry args={[0.082, 0.082, 0.02, 20]} />
        </mesh>
      </group>
    </group>
  );
}

/* -- flat things ---------------------------------------------------------- */

export function Plaque({ text, w = 2.1, ...rest }: Thrown & { text: string; w?: number }) {
  const m = useMemo(() => {
    const art = plaque(text);
    const bump = plaque(text, "bump");
    return new THREE.MeshStandardMaterial({ map: art, bumpMap: bump, bumpScale: 3, roughness: 0.9 });
  }, [text]);
  const plain = mat(PALETTE.walnut, 0.9);
  return (
    <group {...rest}>
      <RoundedBox args={[w, w / 8.5, 0.09]} radius={0.016} smoothness={3} material={plain} castShadow receiveShadow />
      <mesh position={[0, 0, 0.046]} material={m}>
        <planeGeometry args={[w - 0.03, w / 8.5 - 0.02]} />
      </mesh>
    </group>
  );
}

export function Stack({
  n = 3,
  w = 0.62,
  d = 0.46,
  colors = [PALETTE.stoneware, PALETTE.stoneware, PALETTE.stoneware],
  ...rest
}: Thrown & { n?: number; w?: number; d?: number; colors?: string[] }) {
  return (
    <group {...rest}>
      {Array.from({ length: n }, (_, i) => {
        const t = 0.07 + ((i * 29) % 7) / 190;
        return (
          <RoundedBox
            key={i}
            args={[w - i * 0.015, t, d - i * 0.012]}
            radius={0.012}
            smoothness={2}
            position={[((i * 53) % 9) / 190 - 0.02, i * 0.082 + t / 2, ((i * 31) % 9) / 220 - 0.018]}
            rotation={[0, (((i * 17) % 11) - 5) / 55, 0]}
            material={mat(colors[i % colors.length], 0.95)}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

export function PencilCup({ r = 0.15, h = 0.3, ...rest }: Thrown) {
  const geo = useMemo(() => new THREE.LatheGeometry(hollow(r, h, 1, 1), 18), [r, h]);
  const tips = [PALETTE.stoneware, PALETTE.bodyDark, PALETTE.ivy, PALETTE.brass];
  return (
    <group {...rest}>
      <mesh geometry={geo} material={mat(PALETTE.stoneware, 0.92)} castShadow receiveShadow />
      {tips.map((c, i) => (
        <mesh
          key={i}
          position={[Math.cos(i * 1.9) * 0.05, h * 0.78, Math.sin(i * 1.9) * 0.05]}
          rotation={[((i % 3) - 1) * 0.1, 0, ((i % 2) - 0.5) * 0.18]}
          material={mat(c, 0.86)}
          castShadow
        >
          <cylinderGeometry args={[0.016, 0.016, 0.52, 6]} />
        </mesh>
      ))}
    </group>
  );
}

export function Jar({ r = 0.17, h = 0.34, fill = PALETTE.walnut, ...rest }: Thrown & { fill?: string }) {
  return (
    <group {...rest}>
      <mesh position={[0, h * 0.42, 0]} material={mat(fill, 0.95)}>
        <cylinderGeometry args={[r * 0.9, r * 0.9, h * 0.72, 18]} />
      </mesh>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r, r, h, 18, 1, true]} />
        <meshStandardMaterial color={PALETTE.stoneware} roughness={0.12} transparent opacity={0.34} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, h + 0.03, 0]} material={mat(PALETTE.walnut, 0.9)} castShadow>
        <cylinderGeometry args={[r * 1.04, r * 1.04, 0.07, 18]} />
      </mesh>
    </group>
  );
}

export function Geo({ r = 0.17, color = PALETTE.stoneware, ...rest }: Thrown) {
  return (
    <mesh material={mat(color, 0.88)} castShadow receiveShadow {...rest}>
      <icosahedronGeometry args={[r, 0]} />
    </mesh>
  );
}

export function Figurine(rest: Thrown) {
  const m = mat(PALETTE.brass, 0.38, 0.6);
  return (
    <group {...rest}>
      <mesh position={[0, 0.02, 0]} material={m} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.04, 14]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={m} castShadow>
        <capsuleGeometry args={[0.055, 0.1, 3, 10]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={m} castShadow>
        <sphereGeometry args={[0.062, 12, 10]} />
      </mesh>
    </group>
  );
}

type Thrown = {
  r?: number;
  h?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};
