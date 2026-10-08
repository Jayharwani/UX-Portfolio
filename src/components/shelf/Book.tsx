import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PlacedProject } from "./shelf";
import { cover, pages, spine } from "./textures";

/* --------------------------------------------------------------------------
   A BOOK, STANDING ON A SHELF WITH ITS SPINE OUT.

   THE AXES ARE THE WHOLE THING, and getting them wrong is why the first
   version rendered four flat colour swatches: the book was modelled with its
   spine on -x, which is a book shelved sideways, so the camera was looking at
   a blank back board.

     x   thickness. The narrow strip you actually see, 15 to 22mm.
     y   height.
     z   depth, running back into the shelf. The spine is the +z face,
         because +z is the face pointing out at the reader.

   Which makes the boards panels in the YZ plane, not the XY plane, and makes
   the hinge a rotation about Y with its origin on the spine edge at
   z = +depth/2. Swing that group and the front board opens like a door; swing
   a centred mesh and the board spins about its own middle.

   The hover is damped in useFrame rather than sprung by a library: one lerp
   per book per frame costs nothing, and it means a book being opened by GSAP
   and hovered at the same time has one owner for its transform.
   -------------------------------------------------------------------------- */

const DEPTH = 0.74;
const BOARD = 0.011;
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
  /** y of the shelf surface, so every book stands on it rather than centring */
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
  const spineTex = useMemo(() => spine(project.title, n, project.cloth, project.foil), [project, n]);
  const coverTex = useMemo(
    () => cover(project.title, project.subtitle, project.year, project.cloth, project.foil),
    [project]
  );
  const pageTex = useMemo(() => pages(), []);

  const mats = useMemo(() => {
    const cloth = new THREE.MeshStandardMaterial({ color: project.cloth, roughness: 0.9, metalness: 0 });
    return {
      cloth,
      /* the spine art is its own thin slab on the front face rather than a
         slot in a material array: one less thing to get out of order */
      spine: new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.84 }),
      cover: new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.8 }),
      pages: new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.96, color: "#f4ecdb" }),
    };
  }, [project.cloth, spineTex, coverTex, pageTex]);

  const w = project.thickness;
  const h = project.height;
  const lean = project.lean * DEG;
  const turn = project.turn * DEG;
  const y = baseY + h / 2;

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || active) return;
    /* frame-rate independent: the same feel at 60 and at 144 */
    const k = 1 - Math.pow(0.0009, dt);
    const out = hovered && !busy;
    g.position.z += ((out ? 0.25 : 0) - g.position.z) * k;
    /* the hover turn is relative to however the book already stands: the two
       end books are angled out at rest and must not snap square to lift */
    g.rotation.y += ((turn + (out ? 5 * DEG : 0)) - g.rotation.y) * k;
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

  return (
    <group
      ref={(g) => {
        group.current = g;
        register(project.slug, g && coverPivot.current ? { group: g, coverPivot: coverPivot.current } : null);
      }}
      position={[project.x, y, 0]}
      rotation={[0, turn, lean]}
      onPointerOver={enter}
      onPointerOut={leave}
      onClick={(e) => {
        e.stopPropagation();
        if (!busy) onOpen(project.slug);
      }}
    >
      {/* back board: a panel in the YZ plane at the far side */}
      <mesh position={[-w / 2 + BOARD / 2, 0, 0]} castShadow receiveShadow material={mats.cloth}>
        <boxGeometry args={[BOARD, h, DEPTH]} />
      </mesh>

      {/* the text block, inset on every side the way a real one is */}
      <mesh position={[0, 0, -0.008]} castShadow receiveShadow material={mats.pages}>
        <boxGeometry args={[w - BOARD * 2.6, h - 0.026, DEPTH - 0.02]} />
      </mesh>

      {/* THE HINGE. The pivot sits on the spine edge, so the board swings off
          it; a mesh rotated about its own centre would spin in place. */}
      <group ref={coverPivot} position={[w / 2 - BOARD / 2, 0, DEPTH / 2]}>
        <mesh position={[0, 0, -DEPTH / 2]} castShadow receiveShadow material={mats.cover}>
          <boxGeometry args={[BOARD, h, DEPTH]} />
        </mesh>
      </group>

      {/* the spine: the face that points at the reader */}
      <mesh position={[0, 0, DEPTH / 2 + 0.002]} castShadow material={mats.spine}>
        <boxGeometry args={[w, h, 0.004]} />
      </mesh>
    </group>
  );
}
