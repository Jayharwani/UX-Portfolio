import { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/* --------------------------------------------------------------------------
   THE TWO PROPS THAT ARE SCANNED RATHER THAN BUILT.

   A rangefinder camera and a thrown vase are objects whose whole appeal is in
   the parts that are hard to describe: the knurling on a wind-on lever, the
   wobble in a hand-thrown rim. Those do not come out of primitives, and they
   are the two props on this shelf that say something about the person whose
   shelf it is. Everything else here is still geometry I wrote, because a
   cylinder is a cylinder and 400 kB is 400 kB.

   Poly Haven, CC0, optimised through gltf-transform: the camera went from
   2.44 MB to 388 kB and the vase from 750 kB to 108 kB, at 512px textures and
   a third of the triangles. At the size they appear on screen -- a camera
   about 90px wide -- none of what was thrown away is visible.

   SCALE. Poly Haven ships in metres and this scene is in decimetres-ish: a
   hardback is 24cm and H is 1.16, so one unit is about 20cm and a metre is
   about five units. The scales below start from that and are then tuned by
   eye, because "a camera the right size" is a judgement, not a conversion.
   -------------------------------------------------------------------------- */

const CAMERA_URL = "/shelf/models/camera.glb";
const VASE_URL = "/shelf/models/vase.glb";

const withMeshopt = (loader: { setMeshoptDecoder: (d: unknown) => void }) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

function useModel(url: string) {
  const { scene } = useGLTF(url, true, true, withMeshopt as never);
  /* clone, so two placements of one model never share a transform, and so
     unmounting this scene cannot mutate drei's cached original */
  return useMemo(() => scene.clone(true), [scene]);
}

function dressed(root: THREE.Object3D, tweak?: (m: THREE.MeshStandardMaterial) => void) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mesh.material = mats.map((m) => {
      const c = (m as THREE.MeshStandardMaterial).clone();
      tweak?.(c);
      return c;
    }) as unknown as THREE.Material;
    if (!Array.isArray(mesh.material)) return;
    if ((mesh.material as THREE.Material[]).length === 1) mesh.material = (mesh.material as THREE.Material[])[0];
  });
  return root;
}

type Placed = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export function FilmCamera({ scale = 4.4, ...rest }: Placed) {
  const model = useModel(CAMERA_URL);
  useLayoutEffect(() => {
    /* The spec lets Poly Haven props keep their own textures and asks only
       that they stop competing with the books. A third off the saturation is
       enough: the camera stays a black-and-chrome object and never pulls the
       eye off four lit spines. */
    dressed(model, (m) => {
      if (m.color) m.color.offsetHSL(0, -0.3, 0);
      m.envMapIntensity = 1.1;
    });
  }, [model]);
  return <primitive object={model} scale={scale} {...rest} />;
}

export function StonewareVase({ scale = 3.2, ...rest }: Placed) {
  const model = useModel(VASE_URL);
  useLayoutEffect(() => {
    /* A white glazed vase under the key is brighter than four lit books, and
       the one rule this scene has is that the books are the brightest thing
       in it. The glaze keeps its texture and loses a third of its value. */
    dressed(model, (m) => {
      if (m.color) m.color.multiplyScalar(0.62);
      m.envMapIntensity = 0.8;
    });
  }, [model]);
  return <primitive object={model} scale={scale} {...rest} />;
}

useGLTF.preload(CAMERA_URL, true, true, withMeshopt as never);
useGLTF.preload(VASE_URL, true, true, withMeshopt as never);
