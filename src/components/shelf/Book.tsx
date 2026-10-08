import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { H, type PlacedProject } from "./shelf";
import { shelfPalette, sheenOf } from "./shelfPalette";
import { TEX, useTiledMaps } from "./materials/useTiledMaps";
import { cover, pageNormal } from "./textures";

/* --------------------------------------------------------------------------
   A BOOK, STANDING ON A SHELF WITH ITS SPINE OUT.

   THE AXES ARE THE WHOLE THING:

     x   thickness. The narrow strip you actually see.
     y   height.
     z   depth, running back towards the wall. The spine is the +z face,
         because +z is the face pointing out at the reader.

   Which makes the boards panels in the YZ plane, and makes the hinge a
   rotation about Y with its origin on the spine edge at z = +depth/2. Swing
   that group and the front board opens like a door; swing a centred mesh and
   it spins about its own middle.

   EVERY DIMENSION IS A FRACTION OF H, the tallest book, so the whole run
   rescales from one number rather than from twenty.

   A CASE BINDING IS NOT A BOX. Its boards are bigger than the pages they
   protect and stand proud of them on three sides: the top, the bottom and the
   fore-edge. That overhang is called the square, it is why a hardback can sit
   on a shelf for fifty years without the paper fraying, and at this scale it
   is most of what separates a book from a painted brick -- it puts a line of
   shadow between the cloth and the paper on every edge you can see.

   THE TYPE IS GEOMETRY, NOT A PICTURE OF TYPE. A canvas texture goes soft
   exactly when a reader leans in, which is the moment the title has to be
   legible. troika renders it from the outline, so it is sharp at any distance,
   and it takes a real material -- which is how foil can be metal and catch the
   lamp while ink on ochre stays matte.
   -------------------------------------------------------------------------- */

const DEG = Math.PI / 180;
/** depth of every book, front to back */
export const DEPTH = 0.78;
/** the boards: 1.2% of H thick, standing 2% of H proud of the page block */
const BOARD = 0.012 * H;
const SQUARE = 0.02 * H;
const RADIUS = 0.02 * H;
/** the spine stands a little proud of the boards, the way a case binding does */
const FACE = DEPTH / 2 + 0.022;
const SPINE_D = 0.07;

export interface BookHandle {
  group: THREE.Group;
  coverPivot: THREE.Group;
}

export function Book({
  project,
  index,
  baseY,
  active,
  busy,
  forced,
  onHover,
  onOpen,
  register,
}: {
  project: PlacedProject;
  index: number;
  /** y of the board's top surface, so the book stands on it */
  baseY: number;
  active: boolean;
  busy: boolean;
  /** pulled out by keyboard focus rather than by a pointer */
  forced: boolean;
  onHover: (slug: string | null) => void;
  onOpen: (slug: string) => void;
  register: (slug: string, handle: BookHandle | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const coverPivot = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const n = String(index + 1).padStart(2, "0");
  const linen = useTiledMaps(TEX.linen, [4, 4]);

  const mats = useMemo(() => {
    const isFoil = project.ink === shelfPalette.foil;
    return {
      cloth: new THREE.MeshPhysicalMaterial({
        ...linen,
        color: project.cloth,
        roughness: 0.82,
        metalness: 0,
        /* sheen is what the word "cloth" means to a renderer: a weak lobe at
           grazing angles, so the edge of a spine catches what the flat of it
           does not. Without it, linen and vinyl are the same surface. */
        sheen: 0.4,
        sheenRoughness: 0.55,
        sheenColor: new THREE.Color(sheenOf(project.cloth)),
        normalScale: new THREE.Vector2(0.35, 0.35),
      }),
      paper: new THREE.MeshStandardMaterial({
        color: project.paper,
        roughness: 0.9,
        metalness: 0,
        normalMap: pageNormal(),
        normalScale: new THREE.Vector2(0.6, 1),
      }),
      /* Foil is stamped metal leaf and behaves like metal: it is dark until
         something lands on it, then it is the brightest thing on the book.
         On ochre it would disappear, so Bumper gets ink instead. */
      type: new THREE.MeshStandardMaterial({
        color: project.ink,
        /* Stamped foil is metal leaf, and a metal shows only what it
           reflects. In a room lit by one small lamp that is almost nothing, so
           the environment has to be turned up hard on this material alone --
           otherwise the titles render as dark smudges on dark cloth, which is
           exactly what 1.3 produced. A little diffuse is kept at 0.88 so the
           letters never go fully black when the lamp is behind them. */
        metalness: isFoil ? 0.88 : 0,
        roughness: isFoil ? 0.3 : 0.6,
        envMapIntensity: isFoil ? 4 : 1,
      }),
      cover: new THREE.MeshStandardMaterial({
        map: cover(project.title, project.blurb, project.year, project.cloth, project.ink),
        roughness: 0.84,
      }),
    };
  }, [linen, project.cloth, project.ink, project.paper, project.title, project.blurb, project.year]);

  const w = project.thickness;
  const h = project.height;
  const lean = project.lean * DEG;
  const y = baseY + h / 2;

  /* TWO CONSTRAINTS, AND THE SMALLER ONE WINS. Cap height wants to be about
     55% of the spine's width, which sets the type across the spine; the title
     also has to fit ALONG it, and a long word on a short book is the binding
     constraint. FRICTION at the cap-height size came out 1.28 units long on a
     book 1.16 tall and ran off both ends. Clash Display's caps advance about
     0.78em once the 0.08em tracking is in; 0.62 was optimistic and HEADROOM and
     BUMPER still ran over. */
  const capRule = (w * 0.55) / 0.72;
  const fitRule = (h * 0.72) / (project.title.length * 0.78);
  const titleSize = Math.min(capRule, fitRule);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || active) return;
    const k = 1 - Math.pow(0.0012, dt);
    const out = (hovered || forced) && !busy;
    g.position.z += ((out ? DEPTH * 0.22 : 0) - g.position.z) * k;
    g.position.y += ((out ? y + h * 0.02 : y) - g.position.y) * k;
    g.rotation.y += ((out ? 4 * DEG : 0) - g.rotation.y) * k;
    g.rotation.z += (lean - g.rotation.z) * k;
  });

  const enter = (e: { stopPropagation(): void }) => {
    e.stopPropagation();
    if (busy) return;
    setHovered(true);
    onHover(project.slug);
    document.body.style.cursor = "pointer";
  };
  const leave = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = "";
  };

  const blockW = w - BOARD * 2;
  const blockH = h - SQUARE * 2;
  const blockD = DEPTH - SQUARE;

  return (
    <group
      ref={(g) => {
        group.current = g;
        register(project.slug, g && coverPivot.current ? { group: g, coverPivot: coverPivot.current } : null);
      }}
      position={[project.x, y, 0]}
      rotation={[0, 0, lean]}
      onPointerOver={enter}
      onPointerOut={leave}
      onClick={(e) => {
        e.stopPropagation();
        if (!busy) onOpen(project.slug);
      }}
    >
      {/* back board */}
      <RoundedBox
        args={[BOARD, h, DEPTH]}
        radius={BOARD * 0.4}
        smoothness={3}
        position={[-w / 2 + BOARD / 2, 0, 0]}
        material={mats.cloth}
        castShadow
        receiveShadow
      />

      {/* the text block, inside the square on three sides and set back from
          the spine so the hinge has somewhere to go */}
      <RoundedBox
        args={[blockW, blockH, blockD]}
        radius={0.006}
        smoothness={2}
        position={[0, 0, -SQUARE / 2]}
        material={mats.paper}
        castShadow
        receiveShadow
      />

      {/* THE HINGE. The pivot sits on the spine edge so the board swings off
          it; a mesh rotated about its own centre would spin in place. */}
      <group ref={coverPivot} position={[w / 2 - BOARD / 2, 0, DEPTH / 2]}>
        <RoundedBox
          args={[BOARD, h, DEPTH]}
          radius={BOARD * 0.4}
          smoothness={3}
          position={[0, 0, -DEPTH / 2]}
          material={mats.cloth}
          castShadow
          receiveShadow
        />
        {/* The cover art exists for the second of the open sequence when the
            board swings towards the reader, and for no other frame. Mounting
            it only then is four draw calls back on every frame that is not
            an open, which is almost all of them. */}
        {active ? (
          <mesh position={[BOARD / 2 + 0.001, 0, -DEPTH / 2]} rotation={[0, Math.PI / 2, 0]} material={mats.cover}>
            <planeGeometry args={[DEPTH - RADIUS * 2, h - RADIUS * 2]} />
          </mesh>
        ) : null}
      </group>

      {/* the spine */}
      <RoundedBox
        args={[w, h, SPINE_D]}
        radius={RADIUS}
        smoothness={4}
        position={[0, 0, FACE - SPINE_D / 2]}
        material={mats.cloth}
        castShadow
        receiveShadow
      />

      {/* the headband: the scrap of woven cotton at the head of a case
          binding, and the one detail that says "bound" rather than "glued" */}
      <mesh position={[0, h / 2 - 0.012 * H, FACE - SPINE_D / 2]} material={mats.paper} receiveShadow>
        <boxGeometry args={[w * 0.72, 0.01 * H, SPINE_D * 0.8]} />
      </mesh>

      {/* Title and number, reading top to bottom: the English convention, and
          the one that stays upright while the book is standing. */}
      <Text
        font="/shelf/fonts/ClashDisplay-Medium.woff"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        fontSize={titleSize}
        letterSpacing={0.08}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0, -h * 0.1, FACE + 0.0006 * H]}
        anchorX="center"
        anchorY="middle"
      >
        {project.title.toUpperCase()}
        <primitive object={mats.type} attach="material" />
      </Text>
      <Text
        font="/shelf/fonts/ClashDisplay-Medium.woff"
        characters="0123456789"
        fontSize={titleSize * 0.55}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0, h / 2 - h * 0.075, FACE + 0.0006 * H]}
        anchorX="center"
        anchorY="middle"
      >
        {n}
        <primitive object={mats.type} attach="material" />
      </Text>
    </group>
  );
}
