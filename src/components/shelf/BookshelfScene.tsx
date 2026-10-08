import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
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

const DEG = Math.PI / 180;
const books = layout(PROJECTS);

/* The value meter is how the look is tuned: dark share, mean luma and clipped
   share, read off the finished frame. It is gated on DEV so it never reaches
   the bundle, which also means acceptance numbers for a production build come
   from screenshots of that build rather than from here. */
const ValueMeter = import.meta.env.DEV ? lazy(() => import("./dev/ValueMeter")) : null;
const BOOK_Y = SHELF.tiers[SHELF.bookTier];

/* Where the camera rests. Kept as a direction and a distance rather than a
   point, because the framing is tuned by moving in and out along one line and
   a raw XYZ makes that three edits that have to agree.

   The distance is not a guess. The reference frames about 2.2 units of height
   at the books, which at fov 26 puts the camera 4.7 units out; 5.4 keeps a
   little more of the shelving in shot without shrinking the books back into
   the furniture, which is what the first pass did at 11. */
const TARGET = new THREE.Vector3(-0.78, 0.46, 0.12);
const DIR = new THREE.Vector3(-0.59, 0.457, 0.661).normalize();
const DIST = 6.5;

/* ── the rig ──────────────────────────────────────────────────────────────
   OrbitControls owns the camera, so the hand-held float is applied to the
   ROOM instead. Nudging the camera directly would fight the controls for the
   same three numbers every frame and lose; rotating the world by half a
   degree is indistinguishable on screen and has one owner. */
function Rig({ locked, reduce, room }: { locked: boolean; reduce: boolean; room: React.RefObject<THREE.Group | null> }) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* A narrow window sees less of the run, so it has to stand further back or
     the books fall out of frame. Framing by aspect rather than by a fixed
     distance is why this holds from 1280 to 2560. */
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 26;
    const aspect = size.width / size.height;
    const pull = THREE.MathUtils.clamp(1.78 / aspect, 0.94, 1.5);
    cam.position.copy(TARGET).addScaledVector(DIR, DIST * pull);
    cam.lookAt(TARGET);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, dt) => {
    const g = room.current;
    if (!g) return;
    t.current += dt;
    if (reduce || locked) {
      const k = 1 - Math.pow(0.02, dt);
      g.rotation.y += (0 - g.rotation.y) * k;
      g.rotation.x += (0 - g.rotation.x) * k;
      return;
    }
    /* cursor, plus a slow drift so the scene is alive when nothing moves */
    const driftY = Math.sin(t.current * 0.31) * 0.12 * DEG;
    const driftX = Math.cos(t.current * 0.24) * 0.09 * DEG;
    const k = 1 - Math.pow(0.004, dt);
    g.rotation.y += (-pointer.current.x * 0.85 * DEG + driftY - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.5 * DEG + driftX - g.rotation.x) * k;
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
  const controls = useRef<React.ElementRef<typeof OrbitControls> | null>(null);
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
      if (controls.current) controls.current.enabled = false;

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
        const c = controls.current;
        const home = TARGET.clone().addScaledVector(DIR, cam.position.distanceTo(TARGET));
        gsap.to(cam.position, {
          x: home.x,
          y: home.y,
          z: home.z,
          duration: 0.65,
          ease: "power3.out",
          onUpdate: () => cam.lookAt(TARGET),
          onComplete: () => {
            if (c) {
              c.enabled = true;
              c.update();
            }
          },
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
        <Shelving />
        <Decor />

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
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.55} />
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

      {/* A gaze, not a turntable. The limits are tight enough that a reader
          can look around the room and never find the back of it. */}
      <OrbitControls
        ref={controls}
        makeDefault
        target={TARGET}
        enablePan={false}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.3}
        zoomSpeed={0.45}
        minDistance={4.6}
        maxDistance={8.4}
        minPolarAngle={56 * DEG}
        maxPolarAngle={71 * DEG}
        minAzimuthAngle={-54 * DEG}
        maxAzimuthAngle={-29 * DEG}
      />
    </Canvas>
  );
}
