/* --------------------------------------------------------------------------
   THE LOCKED PALETTE.  docs/HOMEPAGE_SHELF_WALNUT.md section 3.4.

   These are BASE COLOURS, not rendered ones. The spec's value ladder describes
   what the final frame should measure; a material's albedo is what it looks
   like before any light reaches it, and in a room this dark it has to be
   brighter than its rendered target. Pasting a sampled pixel from the
   reference in here as an albedo is the fastest way to a muddy, flat scene.

   Do not add colours. If something needs a new hue, it is almost certainly
   the lighting that is wrong.
   -------------------------------------------------------------------------- */

export const shelfPalette = {
  /* the room */
  wall: "#1F2833",
  wallWarm: "#2A211B",
  /* multiplier on the walnut veneer map. Phase 2 puts a texture under this;
     until then the boards carry the average a walnut board should have before
     lighting, which is much darker than the tint itself. */
  walnutTint: "#8C7262",
  walnutFlat: "#3A2A20",

  /* the books */
  clothFriction: "#9B4A2C",
  clothHeadroom: "#55663F",
  clothSignal: "#2D3B5E",
  clothBumper: "#C18E3A",
  paper: "#E8DDC8",
  foil: "#D3B57A",
  inkOnOchre: "#2A2118",

  /* the props */
  brass: "#C2A06A",
  stoneware: "#A89C8E",
  eucalyptus: "#7D8E7A",
  ivy: "#3F5A34",

  /* light */
  lampWarm: "#FFB46B",
  fillCool: "#9DB2D6",
  skyFill: "#24324A",
  groundFill: "#2A1C12",
  rim: "#B9C7DE",
  shadeGlow: "#FFC98A",
  bulb: "#FFC98A",
  mote: "#FFD7A1",
  fog: "#0E1218",
} as const;

/** lightened 25%, for the sheen on bookcloth */
export function sheenOf(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.25);
  return (
    "#" +
    [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}
