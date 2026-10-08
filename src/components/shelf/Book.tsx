import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { PlacedProject } from "./shelf";
import { cover, pages, spine } from "./textures";

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

   WHY THE ARTWORK IS ON A PLANE AND NOT ON THE BOX. These books are chunky
   and round-cornered, which is most of the look -- and a rounded box does not
   carry box UVs. Mapping a spine graphic straight onto one drags the title
   around the fillets. So the case is rounded geometry in plain cloth and the
   graphic sits on a flat plane a hair proud of it, inset far enough to stay
   inside the flat of the face. The texture is drawn on the cloth colour, so
   the join is invisible.

   The hover is damped in useFrame rather than sprung by a library: one lerp
   per book per frame costs nothing, and it means a book being opened by GSAP
   and hovered at the same time has one owner for its transform.
   -------------------------------------------------------------------------- */

export const DEPTH = 0.78;
const BOARD = 0.026;
const RADIUS = 0.022;
const SPINE_D = 0.085;
/** z of the spine's outer face: proud of the boards, like a case binding */
const FACE = DEPTH / 2 + 0.03;
const DEG = Math.PI / 180;

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
  onHover: (slug: string | null) => void;
  onOpen: (slug: string) => void;
  register: (slug: string, handle: BookHandle | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const coverPivot = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const n = String(index + 1).padStart(2, "0");

  const mats = useMemo(() => {
    const spineArt = spine(project.title, n, project.cloth, project.ink);
    const spineBump = spine(project.title, n, project.cloth, project.ink, "bump");
    const coverArt = cover(project.title, project.blurb, project.year, project.cloth, project.ink);
    const coverBump = cover(project.title, project.blurb, project.year, project.cloth, project.ink, "bump");

    return {
      cloth: new THREE.MeshStandardMaterial({ color: project.cloth, roughness: 0.94, metalness: 0 }),
      /* bumpScale is what stops the lettering reading as a decal: the type on
         these books stands proud of the cloth, so every stroke needs a lit
         edge and a shadowed one. */
      spine: new THREE.MeshStandardMaterial({
        map: spineArt,
        bumpMap: spineBump,
        bumpScale: 3,
        roughness: 0.92,
      }),
      cover: new THREE.MeshStandardMaterial({
        map: coverArt,
        bumpMap: coverBump,
        bumpScale: 3,
        roughness: 0.9,
      }),
      paper: new THREE.MeshStandardMaterial({
        map: pages(index + 3),
        color: project.paper,
        roughness: 0.97,
      }),
    };
  }, [project.cloth, project.ink, project.paper, project.title, project.blurb, project.year, n, index]);

  const w = project.thickness;
  const h = project.height;
  const lean = project.lean * DEG;
  const y = baseY + h / 2;

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || active) return;
    /* frame-rate independent: the same feel at 60 and at 144 */
    const k = 1 - Math.pow(0.0012, dt);
    const out = hovered && !busy;
    /* 0.3 forward was the brief's number and it is too much at this camera
       angle: the run is seen from well off to the left, so a book that steps
       that far towards the lens swings across the spine of the one beside it
       and hovering Friction hid Headroom completely. 0.2 still reads as a
       book coming off the shelf and leaves all four legible. */
    g.position.z += ((out ? 0.2 : 0) - g.position.z) * k;
    g.rotation.y += ((out ? 4.5 * DEG : 0) - g.rotation.y) * k;
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

  /* the flat of each face, inside the fillets */
  const faceW = w - RADIUS * 2;
  const faceH = h - RADIUS * 2;
  const faceD = DEPTH - RADIUS * 2;

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
        radius={BOARD * 0.42}
        smoothness={3}
        position={[-w / 2 + BOARD / 2, 0, 0]}
        material={mats.cloth}
        castShadow
        receiveShadow
      />

      {/* the text block, inset on every side the way a real one is */}
      <RoundedBox
        args={[w - BOARD * 2.4, h - 0.05, DEPTH - 0.055]}
        radius={0.012}
        smoothness={3}
        position={[0, 0, -0.03]}
        material={mats.paper}
        castShadow
        receiveShadow
      />

      {/* THE HINGE. The pivot sits on the spine edge so the board swings off
          it; a mesh rotated about its own centre would spin in place. */}
      <group ref={coverPivot} position={[w / 2 - BOARD / 2, 0, DEPTH / 2]}>
        <RoundedBox
          args={[BOARD, h, DEPTH]}
          radius={BOARD * 0.42}
          smoothness={3}
          position={[0, 0, -DEPTH / 2]}
          material={mats.cloth}
          castShadow
          receiveShadow
        />
        {/* the cover graphic, on the outer face */}
        <mesh position={[BOARD / 2 + 0.001, 0, -DEPTH / 2]} rotation={[0, Math.PI / 2, 0]} material={mats.cover}>
          <planeGeometry args={[faceD, faceH]} />
        </mesh>
      </group>

      {/* The spine: a rounded slab in cloth, standing a little proud of the
          boards the way a case binding does, with the graphic on its face.

          The clearance is the point. The first pass put the plane at
          DEPTH/2 + 0.0225 and the slab's own front face at 0.413, half a
          millimetre in front of it -- so every title was buried inside its own
          spine and all four books rendered as plain colour slabs. */}
      <RoundedBox
        args={[w, h, SPINE_D]}
        radius={RADIUS}
        smoothness={4}
        position={[0, 0, FACE - SPINE_D / 2]}
        material={mats.cloth}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 0, FACE + 0.0016]} material={mats.spine}>
        <planeGeometry args={[faceW, faceH]} />
      </mesh>
    </group>
  );
}
