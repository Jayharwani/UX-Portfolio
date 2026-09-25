import { useReveal } from "./useScene";

/* --------------------------------------------------------------------------
   THE DEAD END — §02's artifact.

   A DRAWING, NOT A SCREENSHOT, and deliberately so. There is no capture of
   this moment: the registration never succeeded, so nothing was recorded and
   nothing exists in the repository to recover. Simulating Reddit's interface
   and presenting it as a captured artifact would be inventing evidence on a
   page whose fourth section is about refusing to fake a permalink.

   So this is drawn in the case study's own vocabulary instead — abstracted
   field rows, one gate, one annotation ring. It depicts what happened and
   does not pretend to be a photograph of it.

   The form itself is abstracted on purpose: what matters is that everything
   above the gate completed and the gate never did.
   -------------------------------------------------------------------------- */

const FIELDS = [
  { label: "name", w: 196 },
  { label: "description", w: 244 },
  { label: "redirect uri", w: 168 },
];

export function DeadEnd() {
  const [ref, seen] = useReveal<HTMLDivElement>(0.2);

  return (
    <div className={`fr-dead2${seen ? " in" : ""}`} ref={ref}>
      <svg viewBox="0 0 720 400" role="img" aria-labelledby="fr-de-t fr-de-d">
        <title id="fr-de-t">Reddit&rsquo;s app registration, blocked at the CAPTCHA</title>
        <desc id="fr-de-d">
          A diagram of the create-application form. The name, description and redirect URI fields
          are complete. The CAPTCHA below them never passed, so the create button stayed
          unavailable and no credentials were ever issued.
        </desc>

        {/* the panel */}
        <rect className="panel" x="1" y="1" width="718" height="398" rx="10" />

        <text className="hd" x="34" y="46">
          CREATE APPLICATION
        </text>
        <line className="rule" x1="34" y1="66" x2="686" y2="66" />

        {/* the fields that completed */}
        {FIELDS.map((f, i) => {
          const y = 104 + i * 46;
          return (
            <g key={f.label}>
              <text className="lbl" x="34" y={y + 4}>
                {f.label}
              </text>
              <rect className="bar done" x="196" y={y - 11} width={f.w} height="15" rx="3" />
              <path className="tick" d={`M ${196 + f.w + 18} ${y - 4} l 5 6 l 10 -13`} />
            </g>
          );
        })}

        <line className="rule" x1="34" y1="266" x2="686" y2="266" />

        {/* the gate */}
        <g className="gate">
          <rect className="box" x="34" y="290" width="268" height="54" rx="6" />
          <rect className="check" x="56" y="308" width="18" height="18" rx="3" />
          <text className="gt" x="90" y="322">
            I&rsquo;m not a robot
          </text>
          {/* the annotation: one ring, one leader, one label */}
          <rect className="ring" x="24" y="280" width="288" height="74" rx="10" />
          <path className="lead" d="M 318 317 L 392 317" />
          <circle className="dot" cx="396" cy="317" r="3.5" />
          <text className="note" x="410" y="313">
            never completed
          </text>
          <text className="note sub" x="410" y="329">
            no credentials
          </text>
        </g>

        {/* the button that stayed unavailable */}
        <rect className="cta" x="572" y="290" width="114" height="38" rx="5" />
        <text className="ctaT" x="629" y="313">
          create app
        </text>
      </svg>

      <p className="cap mono">
        Drawn, not captured. The registration never completed, so there is nothing to screenshot.
      </p>
    </div>
  );
}
