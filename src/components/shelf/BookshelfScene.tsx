import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useNavigate } from "react-router";
import gsap from "gsap";
import * as THREE from "three";
import { Book, type BookHandle } from "./Book";
import { LIGHT, PLATE, PROJECTS, layout } from "./shelf";
import { disposeTextures } from "./textures";

/* --------------------------------------------------------------------------
   THE SCENE.

   The room is a photograph and the books are real geometry standing in front
   of it. That is the whole architecture, and it is the only way this reference
   is reachable at 60fps: the eucalyptus alone is several hundred individually
   lit leaves, the vase has glaze scatter and the wall carries dappled shadow
   from a window that is not in frame. None of that is primitives.

   What the books get in exchange for being real is a real hinge, real
   raycasting, and a camera that can move. What the room gets for being flat
   is every photon the renderer never has to trace.

   ALIGNMENT IS A CONTRACT, NOT A GUESS. The plate declares where its painted
   books are (PLATE.books, measured off the image), the plate and the canvas
   are both laid out by the same object-fit maths, and the camera is framed so
   the 3D run lands in that rect at any viewport. Nothing here is a magic
   offset that breaks at 1280.
   -------------------------------------------------------------------------- */

const DEG = Math.PI / 180;
const books = layout(PROJECTS);

/* The shelf surface, in scene units. The camera frames the painted block, so
   its centre is the origin and its floor is half its height below that. */
const TALLEST = Math.max(...books.map((b) => b.height));
const FLOOR = -TALLEST / 2;

/** the painted block, as a fraction of the plate */
const FRAME = {
  cx: (PLATE.books.x + PLATE.books.w / 2) / PLATE.w,
  cy: (PLATE.books.y + PLATE.books.h / 2) / PLATE.h,
  h: PLATE.books.h / PLATE.h,
};

/* ── camera ───────────────────────────────────────────────────────────────
   A long lens, because the photograph was taken with one: the spines are very
   nearly parallel and the shelf's horizontals barely converge. A wide fov
   would splay the outer books and nothing would sit. */
function Rig({ locked, reduce }: { locked: boolean; reduce: boolean }) {
  const { camera, size } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* the run of books has to fill the painted rect's height, whatever the
     viewport does to it */
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const plateAspect = PLATE.w / PLATE.h;
    const viewAspect = size.width / size.height;
    /* object-fit: cover, so the plate is scaled by whichever axis is short */
    const coverH = viewAspect > plateAspect ? (plateAspect / viewAspect) : 1;
    /* the tallest book must occupy exactly the painted block's share of the
       frame. A padding factor here does not pad, it shrinks: the first pass
       carried 1.34 and the books came out a third too small and floating. */
    const tallest = Math.max(...books.map((b) => b.height));
    const wanted = tallest / (FRAME.h * coverH);
    cam.fov = 17;
    cam.position.set(0, 0, (wanted / 2) / Math.tan((cam.fov / 2) * DEG));
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, dt) => {
    if (reduce) return;
    const k = 1 - Math.pow(0.004, dt);
    const amp = locked ? 0 : 1;
    /* clamped hard: a parallax that swings far enough to show the books are
       not in the photograph is worse than none */
    camera.rotation.y += (-target.current.x * 0.9 * DEG * amp - camera.rotation.y) * k;
    camera.rotation.x += (-target.current.y * 0.6 * DEG * amp - camera.rotation.x) * k;
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight color={LIGHT.fill} intensity={0.8} />
      {/* the sun, from the top left, matching the plate's own shadows */}
      <directionalLight
        color={LIGHT.sun}
        intensity={2.1}
        position={[-3.2, 4.4, 3.1]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0012}
      />
      {/* the brass lamp standing to the left of the books in the photograph */}
      <pointLight color={LIGHT.lamp} intensity={1.2} distance={4} position={[-1.15, 0.5, 0.7]} />
      {/* a dim bounce off the shelf, so the fore-edges are not black */}
      <pointLight color="#fff3e2" intensity={0.25} distance={3} position={[0.4, -0.7, 1.1]} />
    </>
  );
}

export function BookshelfScene({
  onHover,
  reduce,
}: {
  onHover: (slug: string | null) => void;
  reduce: boolean;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const handles = useRef(new Map<string, BookHandle>());
  const camRef = useRef<THREE.Camera | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const fallback = useRef<number | undefined>(undefined);

  const register = useCallback((slug: string, h: BookHandle | null) => {
    if (h) handles.current.set(slug, h);
    else handles.current.delete(slug);
  }, []);

  useEffect(() => () => {
    tl.current?.kill();
    window.clearTimeout(fallback.current);
    disposeTextures();
  }, []);

  /* ── the open ───────────────────────────────────────────────────────────
     Pull the book clear of its neighbours, turn it to face the reader, swing
     the front board on its spine hinge, and only then leave. The route change
     is the last beat rather than the first, so the page a reader lands on is
     the one the book just showed them. */
  const open = useCallback(
    (slug: string) => {
      const h = handles.current.get(slug);
      const cam = camRef.current;
      if (!h || !cam || busy) return;

      setBusy(true);
      setActive(slug);
      window.dispatchEvent(new Event("shelf:opening"));
      onHover(null);
      document.body.style.cursor = "";

      const book = books.find((b) => b.slug === slug);
      const href = book?.href ?? "/";

      if (reduce) {
        navigate(href);
        return;
      }

      let gone = false;
      const go = () => {
        if (gone) return;
        gone = true;
        navigate(href);
      };

      const t = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.current = t;

      /* 0.46 of the resting distance put the near plane inside the book: at
         fov 17 it framed 1.0 units of height against a book 1.1 tall, so the
         cover overflowed on every side. 0.66 leaves the board whole with air
         around it, and centring on the book's own x rather than half of it
         means the one being opened is the one in the middle. */
      t.to(cam.position, { x: h.group.position.x, z: cam.position.z * 0.66, duration: 1.2 }, 0)
        .to(h.group.position, { z: 0.54, y: h.group.position.y + 0.05, duration: 0.75 }, 0)
        .to(h.group.rotation, { y: -75 * DEG, duration: 0.95 }, 0.12)
        .to(h.coverPivot.rotation, { y: -118 * DEG, duration: 0.8, ease: "power2.inOut" }, 0.72)
        /* an explicit last beat rather than onComplete: the route change is
           the thing this whole sequence exists to do, and it should not be a
           property of the timeline that a later edit can drop. The guard and
           the fallback mean a dropped frame, a backgrounded tab or a killed
           tween still land the reader on the case study. */
        .call(go, undefined, 1.72);

      fallback.current = window.setTimeout(go, 2200);
    },
    [busy, navigate, onHover, reduce]
  );

  /* the escape hatch: everything the open did, backwards */
  useEffect(() => {
    const back = () => {
      if (!busy) return;
      tl.current?.kill();
      window.clearTimeout(fallback.current);
      const h = active ? handles.current.get(active) : null;
      const cam = camRef.current;
      if (h && cam) {
        gsap.to(h.group.position, { z: 0, duration: 0.55, ease: "power3.out" });
        gsap.to(h.group.rotation, { y: 0, duration: 0.55, ease: "power3.out" });
        gsap.to(h.coverPivot.rotation, { y: 0, duration: 0.45, ease: "power3.out" });
      }
      setBusy(false);
      setActive(null);
    };
    window.addEventListener("shelf:back", back);
    return () => window.removeEventListener("shelf:back", back);
  }, [busy, active]);

  const dpr = useMemo<[number, number]>(() => [1, 2], []);

  return (
    <Canvas
      className="shelf-canvas"
      shadows
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 17, position: [0, 0, 6] }}
      onCreated={({ camera, gl }) => {
        camRef.current = camera;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.06;
      }}
      /* the plate is the ground truth for where everything sits, so the canvas
         is laid out over it by the same cover maths and never independently */
      style={{ touchAction: "pan-y" }}
    >
      <Rig locked={busy} reduce={reduce} />
      <Lights />

      <group>
        {books.map((p, i) => (
          <Book
            key={p.slug}
            project={p}
            index={i}
            baseY={FLOOR}
            active={active === p.slug}
            busy={busy}
            onHover={onHover}
            onOpen={open}
            register={register}
          />
        ))}

        {/* the books have to land on the photographed shelf, not float over
            it: a soft contact shadow is the one thing that sells it */}
        <ContactShadows
          position={[0, FLOOR + 0.002, 0.1]}
          scale={2.6}
          resolution={512}
          blur={2.4}
          opacity={0.42}
          far={0.8}
          color="#6b4f33"
          frames={busy ? Infinity : 1}
        />
      </group>
    </Canvas>
  );
}

export { FRAME };
