import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Sparkles } from "@react-three/drei";
import { ShelfPostHigh, ShelfPostLow, ShelfPostMedium } from "./ShelfPost";
import { useNavigate } from "react-router";
import gsap from "gsap";
import * as THREE from "three";
import { Book, DEPTH, type BookHandle } from "./Book";
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

/* HDR, so the brightest motes clear the bloom threshold */
const MOTE = new THREE.Color(shelfPalette.mote).multiplyScalar(2);

/* WHERE THE CARD GOES, worked out once per hover instead of every frame.
   drei's <Html> would do this continuously and mount a DOM portal inside the
   canvas; the card only needs to move when the hover changes or the window
   resizes, and the spec says so explicitly. */
function CardAnchor({ slug }: { slug: string | null }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!slug) {
      window.dispatchEvent(new CustomEvent("shelf:card", { detail: null }));
      return;
    }
    const b = books.find((x) => x.slug === slug);
    if (!b) return;
    /* The card clears the WHOLE RUN, not just the hovered book. Anchored to
       one spine it sat on top of its neighbours, which satisfies the letter of
       "never covers the book" and misses the point: the run is one object to
       the eye. Vertically it still tracks the book being pointed at. */
    const px = (v: THREE.Vector3) => ((v.project(camera).x * 0.5 + 0.5) * size.width);
    const first = books[0];
    const last = books[books.length - 1];
    const z = DEPTH / 2 + 0.05;
    const edges = [
      px(new THREE.Vector3(first.x - first.thickness / 2, BOOK_Y + 0.5, z)),
      px(new THREE.Vector3(last.x + last.thickness / 2, BOOK_Y + 0.5, z)),
    ];
    const mid = new THREE.Vector3(b.x, BOOK_Y + b.height * 0.62, z).project(camera);
    window.dispatchEvent(
      new CustomEvent("shelf:card", {
        detail: {
          left: Math.min(...edges),
          right: Math.max(...edges),
          y: (0.5 - mid.y * 0.5) * size.height,
          w: size.width,
          h: size.height,
        },
      })
    );
  }, [slug, camera, size]);
  return null;
}

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

const DESKTOP = { fov: FOV, yaw: YAW, dist: DIST };
/* 860 to 1023: the scene still runs, but the run has to fill more of a
   narrower frame, so the lens opens and the yaw comes off. Below 860 the page
   serves the carousel instead and never loads any of this. */
const TABLET = { fov: 32, yaw: -10 * DEG, dist: 3.98 };

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
    const aspect = size.width / size.height;
    /* A tablet sees less of the run, so it takes a wider lens and less yaw:
       at 17 degrees on a 900px-wide window the fourth spine starts to hide
       behind the third. */
    const preset = size.width >= 1024 ? DESKTOP : TABLET;
    cam.fov = preset.fov;
    const dir = new THREE.Vector3(
      Math.sin(preset.yaw) * Math.cos(PITCH),
      Math.sin(PITCH),
      Math.cos(preset.yaw) * Math.cos(PITCH)
    );
    const pull = THREE.MathUtils.clamp(1.6 / aspect, 0.94, 1.5);
    cam.position.copy(TARGET).addScaledVector(dir, preset.dist * pull);
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
  focused = null,
}: {
  onHover: (slug: string | null) => void;
  reduce: boolean;
  /** the slug whose list item has keyboard focus, if any */
  focused?: string | null;
  /** a machine that cannot afford the shadow map and the extra passes */
  lite?: boolean;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [tier, setTier] = useState<"high" | "medium" | "low">(lite ? "low" : "high");
  const [dpr, setDpr] = useState(lite ? 1 : 2);
  /* the post tier only steps once resolution has nothing left to give */
  const dprFloor = useRef(false);
  const handles = useRef(new Map<string, BookHandle>());
  const camRef = useRef<THREE.Camera | null>(null);
  const room = useRef<THREE.Group>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const fallback = useRef<number | undefined>(undefined);

  useEffect(() => {
    dprFloor.current = dpr <= 1;
  }, [dpr]);

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

      const book = books.find((b) => b.slug === slug);
      const href = book?.href ?? "/";

      setBusy(true);
      setActive(slug);
      setTip(null);
      window.dispatchEvent(new CustomEvent("shelf:opening", { detail: { exit: book?.exit } }));
      onHover(null);
      document.body.style.cursor = "";

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

      /* Spec 10.1: out 60% of its depth, turned to face the reader, cover
         swinging on the spine hinge; the DOM overlay starts fading at 250ms
         and the route changes at 600. The route change is an explicit last
         beat rather than an onComplete, because it is the thing the whole
         sequence exists to do and should not be a property of a timeline a
         later edit can drop. The guard and the fallback mean a dropped frame
         or a backgrounded tab still land the reader on the case study. */
      const t = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.current = t;
      t.to(h.group.position, { z: DEPTH * 0.6, duration: 0.4 }, 0)
        .to(h.group.rotation, { y: -62 * DEG, duration: 0.4 }, 0)
        .to(h.coverPivot.rotation, { y: -108 * DEG, duration: 0.42, ease: "power2.inOut" }, 0.18)
        .to(cam.position, { z: cam.position.z - 0.9, duration: 0.6, onUpdate: () => cam.lookAt(TARGET) }, 0)
        .call(go, undefined, 0.6);

      fallback.current = window.setTimeout(go, 1100);
    },
    [busy, navigate, onHover, reduce]
  );


  return (
    <Canvas
      className="shelf-canvas"
      /* The shadow map is the single most expensive thing in the scene: it
         re-draws every caster a second time. On a machine with four cores or
         fewer the room keeps its form from the hemisphere light and loses
         only the cast shadows, which is a far better trade than a room that
         stutters. */
      shadows={!lite}
      dpr={[1, dpr]}
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
      {/* QUALITY COMES DOWN, NEVER BACK UP. Resolution first, because dropping
          from 2x to 1.25x is invisible next to losing ambient occlusion; the
          post tier only steps after resolution has run out of room, and only
          once. It never climbs again during a visit: changing tier recompiles
          shaders, and a hitch every time the frame rate wobbles is worse than
          the quality the hitch was buying. */}
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => {
          setDpr((d) => (d > 1.5 ? 1.5 : d > 1.25 ? 1.25 : 1));
          setTier((t) => (dprFloor.current && t === "high" ? "medium" : t === "medium" && dprFloor.current ? "low" : t));
        }}
        onIncline={() => setDpr((d) => Math.min(2, d + 0.25))}
        onFallback={() => {
          setTier("low");
          setDpr(1);
        }}
      />

      <color attach="background" args={[shelfPalette.fog]} />
      <fogExp2 attach="fog" args={[shelfPalette.fog, 0.035]} />
      <Rig locked={busy} reduce={reduce} room={room} />
      <CardAnchor slug={busy ? null : tip} />
      <ShelfLights bulb={BULB} focus={BOOKS_CENTER} highTier={!lite} />
      {ValueMeter ? (
        <Suspense fallback={null}>
          <ValueMeter />
        </Suspense>
      ) : null}

      <group ref={room}>
        {/* useTexture suspends, so the room needs a boundary inside the Canvas.
            The group itself stays outside it, because Rig holds a ref to it. */}
        <Suspense fallback={null}>
          <Shelving />
          <Decor />
        </Suspense>

        {/* A few motes of light, drifting in the lamp's cone. They are the
            only thing in the scene that moves on its own, which is why there
            are so few: a room where everything drifts is a screensaver. The
            colour is scaled past 1 so the brightest of them catch the bloom,
            and they are placed between the camera and the books rather than
            behind, because dust is only visible when it is lit from the side
            and in front of something dark.

            The box sits to the RIGHT of the run, inside the lamp's cone and
            clear of the spines: a mote crossing a title is a smudge on the one
            thing that has to stay readable. Thirty-six of them at size 2.2
            read as snow across the whole frame; eighteen at 1.1 read as a
            room with air in it. */}
        {tier !== "low" && !reduce ? (
          <Sparkles
            count={tier === "high" ? 18 : 8}
            scale={[1.5, 1.0, 0.7]}
            position={[0.15, 0.78, 0.75]}
            size={1.1}
            speed={0.16}
            opacity={0.55}
            noise={0.5}
            color={MOTE}
          />
        ) : null}

        {books.map((p, i) => (
          <Book
            key={p.slug}
            project={p}
            index={i}
            baseY={BOOK_Y}
            active={active === p.slug}
            busy={busy}
            forced={focused === p.slug}
            onHover={hover}
            onOpen={open}
            register={register}
          />
        ))}

      </group>

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
      {tier === "high" ? <ShelfPostHigh focus={BOOKS_CENTER} /> : null}
      {tier === "medium" ? <ShelfPostMedium /> : null}
      {tier === "low" ? <ShelfPostLow /> : null}

    </Canvas>
  );
}
