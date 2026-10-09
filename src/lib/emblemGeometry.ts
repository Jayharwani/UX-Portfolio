import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* --------------------------------------------------------------------------
   SVG TO SOLID.

   The emblems are generated as a single evenodd path each (see
   scripts/emblems/specs.mjs), so SVGLoader.createShapes resolves the holes
   into real Shape holes and ExtrudeGeometry carves them. No CSG, no boolean
   union, no extra dependency.

   Output is normalised to one unit wide whatever the artboard, so the stage
   can frame every emblem with the same camera.
   -------------------------------------------------------------------------- */

/** depth, bevel thickness and bevel size as fractions of the artboard width */
const DEPTH = 0.16;
const BEVEL_T = 0.02;
const BEVEL_S = 0.015;

export function emblemGeometry(svg: string): THREE.BufferGeometry {
  const art = Number(/viewBox="0 0 ([\d.]+)/.exec(svg)?.[1] ?? 24);
  const { paths } = new SVGLoader().parse(svg);
  const shapes = paths.flatMap((p) => SVGLoader.createShapes(p));
  if (!shapes.length) throw new Error("emblemGeometry: the SVG produced no shapes");

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: art * DEPTH,
    bevelEnabled: true,
    bevelThickness: art * BEVEL_T,
    bevelSize: art * BEVEL_S,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geo.center();

  /* SVG's y grows downward, so the glyph arrives upside down. Negating y AND
     z together is a 180 degree turn about X, which rights the glyph and keeps
     the triangle winding intact. Negating y alone would mirror it, inverting
     every face normal, and the cel shader would light the back of the solid. */
  geo.scale(1 / art, -1 / art, -1 / art);
  geo.computeBoundingSphere();
  return geo;
}

/** A smooth-normal copy for the inverted-hull keyline.
 *
 *  ExtrudeGeometry splits vertices at every hard edge so the faces shade flat,
 *  which is right for the solid and wrong for the outline: pushing split
 *  vertices along their own face normals tears the hull open at each corner.
 *  Welding them first gives one averaged normal per corner and a continuous
 *  shell. */
export function hullGeometry(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = geo.clone();
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  const merged = mergeVertices(g);
  merged.computeVertexNormals();
  g.dispose();
  return merged;
}
