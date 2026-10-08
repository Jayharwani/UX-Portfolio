import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/* --------------------------------------------------------------------------
   TILED PBR MAPS, ONE SURFACE AT A TIME.

   useTexture caches by URL, so every surface asking for the walnut gets the
   same Texture object back. Setting .repeat on it would set it for all of
   them. Each call site clones instead; a clone shares the GPU image, so it
   costs a few bytes rather than another upload.

   COLOUR SPACE IS NOT COSMETIC. The diffuse map is authored in sRGB and the
   normal and roughness maps are raw numbers. Tag a roughness map as sRGB and
   the renderer gamma-decodes it, which quietly makes every surface smoother
   than it should be; tag a diffuse map as linear and the wood goes pale.

   The key set is fixed per call site, so the memo depends on the resolved
   textures themselves rather than on the object literal, which is new on
   every render.
   -------------------------------------------------------------------------- */

export type MapSet = { map?: string; normalMap?: string; roughnessMap?: string };

export function useTiledMaps(urls: MapSet, repeat: [number, number], offset: [number, number] = [0, 0]) {
  const keys = useMemo(() => Object.keys(urls) as (keyof MapSet)[], [urls.map, urls.normalMap, urls.roughnessMap]);
  const source = useTexture(urls as Record<string, string>) as unknown as Record<string, THREE.Texture>;
  const a = source[keys[0] as string];
  const b = keys[1] ? source[keys[1] as string] : undefined;
  const c = keys[2] ? source[keys[2] as string] : undefined;

  const maps = useMemo(() => {
    const out: Record<string, THREE.Texture> = {};
    for (const key of keys) {
      const src = source[key as string];
      if (!src) continue;
      const t = src.clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
      t.offset.set(offset[0], offset[1]);
      t.anisotropy = 8;
      t.colorSpace = key === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
      out[key as string] = t;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, repeat[0], repeat[1], offset[0], offset[1]]);

  useEffect(() => () => Object.values(maps).forEach((t) => t.dispose()), [maps]);
  return maps as { map?: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture };
}

export const TEX = {
  walnut: {
    map: "/shelf/tex/walnut_diff_2k.webp",
    normalMap: "/shelf/tex/walnut_nor_gl_2k.webp",
    roughnessMap: "/shelf/tex/walnut_rough_1k.webp",
  },
  plaster: {
    normalMap: "/shelf/tex/plaster_nor_gl_1k.webp",
    roughnessMap: "/shelf/tex/plaster_rough_512.webp",
  },
  linen: {
    normalMap: "/shelf/tex/linen_nor_gl_1k.webp",
    roughnessMap: "/shelf/tex/linen_rough_512.webp",
  },
} as const;

/** warm the cache before the first frame, so nothing pops in */
export function preloadShelfTextures() {
  useTexture.preload(Object.values(TEX.walnut));
  useTexture.preload(Object.values(TEX.plaster));
  useTexture.preload(Object.values(TEX.linen));
}
