import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useNavigate } from "react-router";
import gsap from "gsap";
import * as THREE from "three";
import { Book, type BookHandle } from "./Book";
import { Shelving } from "./Shelving";
import { Decor } from "./props/Decor";
import { disposeProps } from "./props/shapes";
import { BOOKS_CENTER, BULB, PROJECTS, SHELF, layout } from "./shelf";
import { ShelfLights } from "./ShelfLights";
import { shelfPalette } from "./shelfPalette";
import { disposeTextures } from "./textures";
import { preloadShelfTextures } from "./materials/useTiledMaps";

/* --------------------------------------------------------------------------
   THE SCENE.

   A room, built. The camera looks down the shelving at an angle, which is the
   single decision the whole look rests on: boards running out of both sides of
   the frame on a diagonal read as a wall of shelving you are standing close
   to, and a long lens flattens it into the miniature the reference is.

   THE DIAGONAL RUNS UP TO THE RIGHT, so the camera sits on the LEFT of the
   run. The brief said [7, 6, 8]; from there the near end of the shelf is on
   the right and the boards slope down to the right, which is the mirror of
   the reference image. The image is the thing being matched, so the camera is
   on the other side.
   -------------------------------------------------------------------------- */

const books = layout(PROJECTS);

/* start the maps downloading as soon as the chunk evaluates, rather than when
   the first surface asks for them */
preloadShelfTextures();

/* The value meter is how the look is tuned: dark share, mean luma and clipped
   share, read off the finished frame. It is gated on DEV so it never reaches
   the bundle, which also means acceptance numbers for a production build come
   from screenshots of that build rather than from here. */
const ValueMeter = import.meta.env.DEV ? lazy(() => import("./dev/ValueMeter")) : null;
const BOOK_Y = SHELF.tiers[SHELF.bookTier];

/* THE DESKTOP FRAME.  Spec section 7.1, and pulled forward from Phase 5
   because Phase 3 grades the spine type at 11px and type size is a function
   of framing: at the old distance the titles measured 10.4px and no amount of
   typographic fiddling was going to fix a camera problem.

   Derived, not dialled in. fov 30 vertical is about a 45mm lens. The books run
   1.21 units wide and have to fill 24-30% of the frame, which fixes the
   distance at 5.24. The camera sits at the height of the books' tops and tilts
   down 7 degrees, which fixes the elevation. The target is then offset along
   screen-right so the run lands 38% from the left rather than dead centre.

   This is a calmer frame than the diagonal it replaces. The boards still
   recede, but 17 degrees of yaw reads as a still life rather than as a camera
   leaning around a corner. */
const DEG = Math.PI / 180;
const FOV = 30;
const YAW = -17 * DEG;
const PITCH = 7 * DEG;
const DIST = 5.24;

const DIR = new THREE.Vector3(
  Math.sin(YAW) * Math.cos(PITCH),
  Math.sin(PITCH),
  Math.cos(YAW) * Math.cos(PITCH)
);
const TARGET = new THREE.Vector3(-0.634, 0.52, 0.158);

/* ── the rig ──────────────────────────────────────────────────────────────
   OrbitControls owns the camera, so the hand-held float is applied to the
   ROOM instead. Nudging the camera directly would fight the controls for the
   same three numbers every frame and lose; rotating the world by half a
   degree is indistinguishable on screen and has one owner. */
function Rig({ locked, reduce, room }: { locked: boolean; reduce: boolean; room: React.RefObject<THREE.Group | null> }) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* A narrower window sees less of the run, so it stands further back. Framing
     by aspect rather than by a fixed distance is why the composition holds
     from 1280 to 2560. */
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = FOV;
    const aspect = size.width / size.height;
    const pull = THREE.MathUtils.clamp(1.6 / aspect, 0.94, 1.5);
    cam.position.copy(TARGET).addScaledVector(DIR, DIST * pull);
    cam.lookAt(TARGET);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  /* THE SCENE MOVES WHEN THE VISITOR MOVES, AND NOT OTHERWISE. No drift, no
     breathing, no orbit: the frame is art directed, and a composition that
     wanders is one nobody chose. The parallax is applied to the ROOM rather
     than the camera, so it can never fight the framing above for the same
     three numbers. A degree is plenty; it reads as depth, not as motion. */
  useFrame((_, dt) => {
    const g = room.current;
    if (!g) return;
    const k = 1 - Math.pow(0.06, dt * 60 * 0.0167);
    const amp = reduce || locked ? 0 : 1;
    g.rotation.y += (-pointer.current.x * 1.2 * DEG * amp - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.8 * DEG * amp - g.rotation.x) * k;
  });

  return null;
}

export function BookshelfScene({
  onHover,
  reduce,
  lite = false,
}: {
  onHover: (slug: string | null) => void;
  reduce: boolean;
  /** a machine that cannot afford the shadow map and the extra passes */
  lite?: boolean;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [reading, setReading] = useState<{ dark: number; mean: number; clipped: number } | null>(null);
  const handles = useRef(new Map<string, BookHandle>());
  const camRef = useRef<THREE.Camera | null>(null);
  const room = useRef<THREE.Group>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const fallback = useRef<number | undefined>(undefined);

  const register = useCallback((slug: string, h: BookHandle | null) => {
    if (h) handles.current.set(slug, h);
    else handles.current.delete(slug);
  }, []);

  useEffect(
    () => () => {
      tl.current?.kill();
      window.clearTimeout(fallback.current);
      disposeTextures();
      disposeProps();
    },
    []
  );

  const hover = useCallback(
    (slug: string | null) => {
      setTip(slug);
      onHover(slug);
    },
    [onHover]
  );

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
      setTip(null);
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

      /* Straight out in front of the book, a shade above its middle. 2.9 put
         the near plane inside it: at fov 26 that frames 1.34 units of height
         against a book 1.12 tall plus the cover swinging out past it, so the
         board ran off the top and the bottom at once. */
      const to = new THREE.Vector3(h.group.position.x - 0.42, BOOK_Y + 0.78, 3.7);
      const t = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.current = t;

      t.to(cam.position, { x: to.x, y: to.y, z: to.z, duration: 1.25, onUpdate: () => cam.lookAt(h.group.position.x, BOOK_Y + 0.56, 0.42) }, 0)
        .to(h.group.position, { z: 0.72, duration: 0.8 }, 0)
        .to(h.group.rotation, { y: -78 * DEG, duration: 1 }, 0.1)
        .to(h.coverPivot.rotation, { y: -120 * DEG, duration: 0.82, ease: "power2.inOut" }, 0.74)
        /* an explicit last beat rather than onComplete: the route change is
           the thing this whole sequence exists to do, and it should not be a
           property of the timeline that a later edit can drop. The guard and
           the fallback mean a dropped frame, a backgrounded tab or a killed
           tween still land the reader on the case study. */
        .call(go, undefined, 1.74);

      fallback.current = window.setTimeout(go, 2300);
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
        gsap.to(h.group.position, { z: 0, duration: 0.6, ease: "power3.out" });
        gsap.to(h.group.rotation, { y: 0, duration: 0.6, ease: "power3.out" });
        gsap.to(h.coverPivot.rotation, { y: 0, duration: 0.5, ease: "power3.out" });
        /* back to the framed position, along the same line it left on */
        const home = TARGET.clone().addScaledVector(DIR, cam.position.distanceTo(TARGET));
        gsap.to(cam.position, {
          x: home.x,
          y: home.y,
          z: home.z,
          duration: 0.65,
          ease: "power3.out",
          onUpdate: () => cam.lookAt(TARGET),
        });
      }
      setBusy(false);
      setActive(null);
    };
    window.addEventListener("shelf:back", back);
    return () => window.removeEventListener("shelf:back", back);
  }, [busy, active]);

  const dpr = useMemo<[number, number]>(() => [1, 2], []);
  const shown = tip ? books.find((b) => b.slug === tip) : null;
  const shownIndex = shown ? books.findIndex((b) => b.slug === shown.slug) : -1;

  return (
    <Canvas
      className="shelf-canvas"
      /* The shadow map is the single most expensive thing in the scene: it
         re-draws every caster a second time. On a machine with four cores or
         fewer the room keeps its form from the hemisphere light and loses
         only the cast shadows, which is a far better trade than a room that
         stutters. */
      shadows={!lite}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{
        fov: 26,
        near: 0.3,
        far: 60,
        position: [TARGET.x + DIR.x * DIST, TARGET.y + DIR.y * DIST, TARGET.z + DIR.z * DIST],
      }}
      onCreated={({ camera, gl }) => {
        camRef.current = camera;
        /* AgX here too, not just in the chain. The composer disables the
           renderer's tone mapping while it renders, so this value only shows
           up on a frame drawn WITHOUT the composer -- a poster capture, or the
           lite path. Matching them means those frames do not look like a
           different scene. */
        gl.toneMapping = THREE.AgXToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      {/* The background is the fog colour, so the wall does not end at a seam
          where geometry stops. fogExp2 rather than linear: the falloff a dark
          room has is exponential, and linear fog reads as a grey wash. */}
      <color attach="background" args={[shelfPalette.fog]} />
      <fogExp2 attach="fog" args={[shelfPalette.fog, 0.035]} />
      <Rig locked={busy} reduce={reduce} room={room} />
      <ShelfLights bulb={BULB} focus={BOOKS_CENTER} highTier={!lite} />
      {ValueMeter ? (
        <Suspense fallback={null}>
          <ValueMeter onReading={(r) => setReading(r)} />
        </Suspense>
      ) : null}

      <group ref={room}>
        {/* useTexture suspends, so the room needs a boundary inside the Canvas.
            The group itself stays outside it, because Rig holds a ref to it. */}
        <Suspense fallback={null}>
          <Shelving />
          <Decor />
        </Suspense>

        {books.map((p, i) => (
          <Book
            key={p.slug}
            project={p}
            index={i}
            baseY={BOOK_Y}
            active={active === p.slug}
            busy={busy}
            onHover={hover}
            onOpen={open}
            register={register}
          />
        ))}

        {/* the callout, anchored to the book rather than to the viewport, so
            it tracks when the room drifts and when the reader orbits */}
        {shown && !busy ? (
          <Html
            position={[shown.x + 0.62, BOOK_Y + shown.height * 0.72, 0.92]}
            center={false}
            zIndexRange={[8, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="shelf-tip">
              <p className="shelf-tip-n">
                {String(shownIndex + 1).padStart(2, "0")} <span>&mdash;</span> {shown.title.toUpperCase()}
              </p>
              <p className="shelf-tip-sub">{shown.blurb}</p>
            </div>
          </Html>
        ) : null}
      </group>

      {ValueMeter && reading ? (
        <Html position={BOOKS_CENTER} center={false} zIndexRange={[9, 0]} style={{ pointerEvents: "none" }}>
          <div className="shelf-meter">
            dark {(reading.dark * 100).toFixed(1)}% &middot; mean {reading.mean.toFixed(0)} &middot; clip{" "}
            {(reading.clipped * 100).toFixed(2)}%
          </div>
        </Html>
      ) : null}

      {/* ── the lens ──────────────────────────────────────────────────────
          What makes a miniature read as a miniature is depth of field. A real
          camera 40cm from a real shelf has the whole thing sharp; one 40cm
          from a doll's shelf has about two centimetres in focus, and the brain
          reads the blur as scale before it reads anything else. The focus
          sits on the books, so the near board and the far wall both go soft
          and the four spines are the only thing the eye can rest on.

          It is aimed at a WORLD POINT, not at a depth. focusDistance is
          normalised against the camera's far plane, so the first pass put
          0.0115 against a far of 1000 and focused eleven units out -- several
          metres behind the shelving -- which blurred the four books and left
          the empty wall sharp. target does the arithmetic from the same vector
          the camera already looks at, and cannot drift out of agreement
          with it.

          Everything here is deliberately under-done. Bloom at 0.12 is a
          suggestion of the lamp rather than a glow; grain at 0.025 is film,
          not snow. Both are the kind of effect that looks like craft at a
          tenth of the strength it takes to notice on its own. */}
      {lite ? null : (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <DepthOfField
            target={[TARGET.x, TARGET.y, TARGET.z]}
            focalLength={0.3}
            bokehScale={0.9}
            height={480}
          />
          {/* A threshold of 1 only works because the composer renders in half
              float: the one thing in the scene above 1 is the HDR bulb, so
              nothing else glows. */}
          <Bloom mipmapBlur levels={5} luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.55} />
          {/* THE EFFECT THAT WAS MISSING. @react-three/postprocessing sets
              gl.toneMapping to NoToneMapping for as long as the composer is
              mounted, so the ACES configured on the renderer never ran: the
              page shipped raw linear-to-sRGB, which is why 5.5% of its pixels
              were clipped and nothing had any shape. */}
          <ToneMapping mode={ToneMappingMode.AGX} />
          <Vignette offset={0.28} darkness={0.62} eskil={false} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
        </EffectComposer>
      )}

    </Canvas>
  );
}
