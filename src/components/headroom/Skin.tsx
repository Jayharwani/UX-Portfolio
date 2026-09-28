/* --------------------------------------------------------------------------
   THE SIX SKINS.

   One phone-shaped swatch per version. Five are reconstructions drawn from
   the version notes rather than screenshots — the originals were not kept —
   and they are labelled as such wherever they appear. The sixth is the real
   capture, because that one shipped.

   Each is characterised by the single thing its note complains about: the
   neon glass panel, the purple mesh, three accents fighting, a screen buried
   in charts, a layout behaving like a web page.
   -------------------------------------------------------------------------- */

/** the tangle of charts nobody could read */
function Charts() {
  return (
    <svg viewBox="0 0 160 250" preserveAspectRatio="none" aria-hidden="true"
         style={{ position: "absolute", inset: "12% 8% 10%", width: "84%", height: "78%" }}>
      {[0, 1, 2, 3].map((r) => (
        <g key={r} transform={`translate(0 ${r * 60})`}>
          <rect x="0" y="0" width="160" height="48" rx="5" fill="#fff" stroke="#e4e7e4" />
          <polyline
            points="8,38 26,22 44,30 62,12 80,26 98,16 116,32 134,20 152,28"
            fill="none"
            stroke={["#0e9e6b", "#e0a13a", "#d2574f", "#4a7fd0"][r]}
            strokeWidth="1.6"
          />
          <polyline
            points="8,30 26,34 44,18 62,28 80,20 98,34 116,22 134,30 152,16"
            fill="none"
            stroke="#b9c0bb"
            strokeWidth="1.1"
            strokeDasharray="3 3"
          />
        </g>
      ))}
    </svg>
  );
}

/** the version that behaved like a web page */
function WebPage() {
  return (
    <div style={{ position: "absolute", inset: 0, padding: "9%", display: "grid", gap: "7%", alignContent: "start" }} aria-hidden="true">
      <div style={{ display: "flex", gap: "6%", alignItems: "center" }}>
        <div style={{ width: "22%", height: 7, borderRadius: 3, background: "#10160f" }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ width: 16, height: 5, borderRadius: 3, background: "#c9cfca" }} />
          ))}
        </div>
      </div>
      <div style={{ height: 10, borderRadius: 4, background: "#10160f", width: "86%" }} />
      <div style={{ height: 10, borderRadius: 4, background: "#10160f", width: "58%" }} />
      <div style={{ height: 6, borderRadius: 3, background: "#d6dbd7", width: "92%" }} />
      <div style={{ height: 6, borderRadius: 3, background: "#d6dbd7", width: "80%" }} />
      <div style={{ display: "flex", gap: "5%", marginTop: "4%" }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ flex: 1, height: 44, borderRadius: 6, border: "1px solid #e4e7e4" }} />
        ))}
      </div>
      <div style={{ height: 22, width: "44%", borderRadius: 4, background: "#0a7a52", marginTop: "4%" }} />
    </div>
  );
}

export function Skin({ n }: { n: number }) {
  if (n === 6) {
    return (
      <div className="skin skin-6">
        <img
          src="/headroom/today-healthy.png"
          alt="The version that shipped: one number, safe to spend, on white with a single emerald accent"
          width={446}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  return (
    <div
      className={`skin skin-${n}`}
      role="img"
      aria-label={
        [
          "Reconstruction of the first version: neon gradients behind a frosted glass panel",
          "Reconstruction of the second version: a purple and pink mesh gradient",
          "Reconstruction of the third version: dark ink carrying three competing accent colours",
          "Reconstruction of the fourth version: four stacked forecast charts filling the screen",
          "Reconstruction of the fifth version: a layout laid out like a web page, with a nav bar and three columns",
        ][n - 1]
      }
    >
      {n === 4 ? <Charts /> : null}
      {n === 5 ? <WebPage /> : null}
    </div>
  );
}
