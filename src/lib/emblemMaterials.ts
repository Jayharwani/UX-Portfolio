import * as THREE from "three";

/* --------------------------------------------------------------------------
   CEL SHADING WITH A HALFTONE MID-TONE, AND AN INK KEYLINE.

   A physically based material would make the emblem look like a rendered
   object, which is the one thing this page is not: it is a print. So the
   lighting is three flat bands, the middle band breaks into a dot screen, and
   the whole solid carries a drawn edge.

   The halftone cell is measured in device pixels, deliberately. Screen-space
   dots are how a real screen behaves: they do not grow when the emblem is
   scaled up during the intro, they stay the size of the screen that printed
   them. World-space dots would swell with the object and read as texture.

   Nothing here is tone mapped. Blender is not involved, but the principle in
   the spec holds: the renderer runs flat, and both the plate colours and
   these tokens are already display-referred sRGB. Tone mapping them a second
   time washes the void grey.
   -------------------------------------------------------------------------- */

const VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;

const CEL = /* glsl */ `
  uniform vec3 uInk;      // paper: the lit band
  uniform vec3 uShade;    // void: the unlit band
  uniform vec3 uRim;      // the active accent
  uniform vec3 uLight;    // view space, normalised
  uniform float uCell;    // halftone cell, device px
  uniform float uFade;    // 0 to 1, multiplies the whole thing out
  varying vec3 vN;
  varying vec3 vV;

  void main() {
    vec3 n = normalize(vN);
    float ndl = max(dot(n, uLight), 0.0);

    // three bands, not a gradient. This is the whole look.
    float band = ndl > 0.66 ? 1.0 : (ndl > 0.30 ? 0.6 : 0.16);

    // a dot screen, only in the middle band, so the lit and unlit areas stay flat
    vec2 c = mod(gl_FragCoord.xy, uCell) - 0.5 * uCell;
    float r = (1.0 - ndl) * 0.6 * uCell;
    float dots = 1.0 - smoothstep(r - 0.8, r + 0.8, length(c));
    float mid = step(0.30, ndl) * step(ndl, 0.66);
    float tone = band - dots * mid * 0.3;

    // a thin accent rim where the surface turns away from the viewer
    float rim = pow(1.0 - max(dot(n, normalize(vV)), 0.0), 3.0);

    vec3 col = mix(uShade, uInk, tone) + uRim * rim * 0.5;
    gl_FragColor = vec4(col, uFade);
    #include <colorspace_fragment>
  }`;

export function celMaterial(
  ink: THREE.Color,
  shade: THREE.Color,
  rim: THREE.Color,
  cellDevicePx: number,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uInk: { value: ink },
      uShade: { value: shade },
      uRim: { value: rim },
      /* Mostly head-on, lifted up and right.
         The direction is not a taste decision, it is what decides which band
         each surface lands in. At (0.45, 0.65, 0.6) the front face reads 0.62,
         which is inside the mid band, so the dot screen covered the entire
         face and the mark looked like a texture rather than a solid. Pushed
         to 0.82 the face sits in the lit band and stays flat paper, and the
         halftone does what it is for: the bevels and the sides.

         Pushed further than the band edge needs, on purpose. The resting tilt
         puts the face at 0.698 against a 0.70 threshold, which is not a
         lighting choice, it is a coin toss that a two-degree change of pose
         would lose. The bands below were widened for the same reason. */
      uLight: { value: new THREE.Vector3(0.28, 0.36, 0.89).normalize() },
      uCell: { value: cellDevicePx },
      uFade: { value: 1 },
    },
    vertexShader: VERT,
    fragmentShader: CEL,
    transparent: true,
  });
}

/** The keyline: back faces pushed out along smooth normals and drawn in the
 *  accent, so the solid reads as drawn before it reads as built.
 *
 *  An inverted hull rather than a post-process edge pass, because the page
 *  must not own a second render target for one 320px canvas. */
export function hullMaterial(color: THREE.Color, thickness = 0.018): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uThickness: { value: thickness },
      uFade: { value: 1 },
    },
    vertexShader: /* glsl */ `
      uniform float uThickness;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uThickness, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uFade;
      void main() {
        gl_FragColor = vec4(uColor, uFade);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide,
    transparent: true,
  });
}
