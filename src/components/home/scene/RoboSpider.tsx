import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────────
   The robo-spider.

   Built from primitives rather than a GLTF, deliberately. A downloaded model
   would be another network request, another decode, and — more to the point —
   almost every free spider model is anatomically detailed, which is the exact
   opposite of the brief. "EVE from Wall-E in spider form" means SOFT and
   FEW-PARTS: a rounded body, no mandibles, no texture, one glowing eye. Detail
   is what makes a spider unsettling, so there is none.

   Three things do the charm, and none of them is the modelling:

   · The eye. One emissive sphere in the accent colour, and it is the only
     saturated thing in the scene. It tracks the cursor.
   · The hang. It descends on a thread and sways on a damped pendulum, so it
     is never quite still and never repeats.
   · The legs. Eight, thin, angled — enough to say "spider" and stop. They
     flex slightly with the sway rather than staying rigid, which is what
     stops it reading as a hanging ornament.

   It faces the cursor. It never retreats from it. That single rule is the
   whole difference between a companion and an infestation.
   ────────────────────────────────────────────────────────────────────────── */

interface Props {
  /** anchor point of the thread, world units */
  anchor: [number, number, number];
  /** resting length of the dragline */
  drop: number;
  interactive: boolean;
}

export default function RoboSpider({ anchor, drop, interactive }: Props) {
  const rigRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const threadRef = useRef<THREE.Mesh>(null);
  const legsRef = useRef<THREE.Group>(null);

  /* pendulum state, kept out of React so no frame ever triggers a render */
  const s = useRef({ a: 0.2, av: 0, len: 0, yaw: 0, yawTarget: 0, t: 0 });

  /* Eight legs. Angles are hand-varied rather than evenly divided: perfectly
     radial legs read as a clock face, and the asymmetry is most of what makes
     it look like a creature rather than a fixture. */
  const legs = useMemo(
    () =>
      [-58, -26, 24, 56, 122, 154, 204, 236].map((deg, i) => ({
        rot: (deg * Math.PI) / 180,
        len: 0.2 + (i % 3) * 0.018,
        drop: 0.055 + (i % 2) * 0.02,
      })),
    []
  );

  useFrame((state, delta) => {
    const rig = rigRef.current;
    const body = bodyRef.current;
    if (!rig || !body) return;
    const dt = Math.min(delta, 0.05);
    const st = s.current;
    st.t += dt;

    /* the descent, eased at the end so it settles rather than stopping */
    const target = drop;
    st.len += (target - st.len) * Math.min(1, dt * 1.1);

    if (interactive) {
      /* damped pendulum, plus a wandering breeze. A sine loop would repeat
         identically and read as a GIF inside four seconds; this never repeats
         exactly and settles when nothing disturbs it. */
      const L = Math.max(0.4, st.len);
      const wind = Math.sin(st.t * 0.41) * 0.00075 + Math.sin(st.t * 0.13 + 1.1) * 0.0005;
      st.av += (-(1.6 / L) * Math.sin(st.a) + wind);
      st.av *= 0.994;
      st.a += st.av;
    } else {
      st.a += (0 - st.a) * 0.08;
    }

    const px = anchor[0] + Math.sin(st.a) * st.len;
    const py = anchor[1] - Math.cos(st.a) * st.len;
    rig.position.set(px, py, anchor[2]);
    /* the body leans into the swing, the way a hanging weight does */
    rig.rotation.z = -st.a * 0.55;

    /* the thread: a thin cylinder from the anchor to the body. Scaled and
       re-aimed rather than rebuilt, so no geometry is allocated per frame. */
    const thread = threadRef.current;
    if (thread) {
      const dx = px - anchor[0];
      const dy = py - anchor[1];
      const len = Math.hypot(dx, dy);
      thread.position.set(anchor[0] + dx / 2, anchor[1] + dy / 2, anchor[2]);
      thread.scale.set(1, len, 1);
      thread.rotation.z = Math.atan2(dy, dx) + Math.PI / 2;
    }

    if (interactive) {
      /* face the cursor: yaw toward it, clamped so it reads as a glance
         rather than a head spin. Toward, never away. */
      const wx = state.pointer.x * state.viewport.width * 0.5;
      const wy = state.pointer.y * state.viewport.height * 0.5;
      const d = Math.hypot(wx - px, wy - py);
      st.yawTarget = d < 4.5 ? Math.max(-0.6, Math.min(0.6, (wx - px) * 0.22)) : 0;
      /* and it drifts a little toward you, because you disturbed the air */
      if (d < 4.5) st.av += Math.sign(wx - px) * 0.00022;
    } else {
      st.yawTarget = 0;
    }
    st.yaw += (st.yawTarget - st.yaw) * 0.055;
    body.rotation.y = st.yaw;
    body.rotation.x = Math.sin(st.t * 0.9) * 0.03; // a 1px-scale bob

    /* legs flex with the swing, so it is not a rigid ornament on a string */
    const lg = legsRef.current;
    if (lg) {
      for (let i = 0; i < lg.children.length; i++) {
        const c = lg.children[i];
        c.rotation.x = Math.sin(st.t * 1.3 + i * 0.8) * 0.05 + st.av * 6;
      }
    }

    /* the eye pulses very slightly: alive, not blinking */
    const eye = eyeRef.current;
    if (eye) {
      const m = eye.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2.1 + Math.sin(st.t * 1.6) * 0.35;
    }
  });

  return (
    <group>
      {/* dragline */}
      <mesh ref={threadRef}>
        <cylinderGeometry args={[0.0035, 0.0035, 1, 4]} />
        <meshBasicMaterial color="#8FB0FF" transparent opacity={0.42} />
      </mesh>

      <group ref={rigRef} position={anchor}>
        <group ref={bodyRef}>
          {/* abdomen: the big rounded one, slightly squashed so it reads soft */}
          <mesh position={[0, -0.045, 0]} scale={[1, 0.88, 0.92]} castShadow>
            <sphereGeometry args={[0.115, 24, 20]} />
            <meshStandardMaterial color="#EEF2F8" metalness={0.55} roughness={0.28} />
          </mesh>
          {/* head */}
          <mesh position={[0, 0.075, 0.012]} castShadow>
            <sphereGeometry args={[0.072, 20, 16]} />
            <meshStandardMaterial color="#F6F8FC" metalness={0.5} roughness={0.24} />
          </mesh>
          {/* the eye — the only saturated thing in the scene */}
          <mesh ref={eyeRef} position={[0, 0.082, 0.068]}>
            <sphereGeometry args={[0.028, 16, 14]} />
            <meshStandardMaterial
              color="#5B8CFF"
              emissive="#5B8CFF"
              emissiveIntensity={2.1}
              toneMapped={false}
            />
          </mesh>

          <group ref={legsRef}>
            {legs.map((l, i) => (
              <group key={i} rotation={[0, 0, l.rot]}>
                <mesh position={[l.len * 0.5, -l.drop * 0.4, 0]} rotation={[0, 0, -0.5]}>
                  <cylinderGeometry args={[0.0075, 0.005, l.len, 6]} />
                  <meshStandardMaterial color="#C9D4E6" metalness={0.7} roughness={0.35} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
