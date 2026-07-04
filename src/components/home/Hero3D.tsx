import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

/* ──────────────────────────────────────────────────────────────────────────
   Hero 3D signature. One distorted icosahedron in the slate palette with a
   soft accent rim light. Slow ambient drift, eases toward the pointer.
   Lazy-loaded; desktop only (the page renders a static orb on mobile).
   ────────────────────────────────────────────────────────────────────────── */

function Blob({ frozen }: { frozen: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || frozen) return;
    // slow ambient drift
    g.rotation.y += delta * 0.08;
    // ease toward the pointer, gently
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.x += (py * 0.35 - g.rotation.x) * 0.04;
    g.rotation.z += (px * 0.2 - g.rotation.z) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.55, 24]} />
        <MeshDistortMaterial
          color="#232C3D"
          metalness={0.62}
          roughness={0.34}
          distort={frozen ? 0 : 0.34}
          speed={frozen ? 0 : 1.4}
        />
      </mesh>
    </group>
  );
}

export default function Hero3D({ frozen = false }: { frozen?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={frozen ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 40 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* dim cool key light */}
      <directionalLight position={[4, 5, 6]} intensity={0.7} color="#E8ECF3" />
      {/* accent rim light from behind-right */}
      <pointLight position={[-5, 2, -4]} intensity={14} color="#5B8CFF" />
      <pointLight position={[5, -3, -2]} intensity={5} color="#5B8CFF" />
      <ambientLight intensity={0.18} />
      <Blob frozen={frozen} />
    </Canvas>
  );
}
