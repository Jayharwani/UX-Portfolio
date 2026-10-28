import { ACCENT_VAR, type HeroCard, type Module, type Row } from "../../../data/heroCards";

/* --------------------------------------------------------------------------
   THE PRODUCT SCREEN ON THE CARD.

   Every value here comes from heroCards.ts. Nothing is typed into this file:
   the card has to be able to become four different products without a
   component knowing which one it is.

   THE BANDS ARE ABSOLUTE AND THEY HAVE TO BE. The card is one 460 × 624
   plane that the fit scales whole, so a flow layout would reflow at every
   scale and the lens — whose regions are fixed bands of card space — would
   stop pointing at what it claims to. Absolute bands make the geometry a
   constant the lens can trust.

   Every element carries data-hc-el so the switch transition can stagger them
   without the transition knowing what any of them are.
   -------------------------------------------------------------------------- */

function Dot({ row }: { row: Row }) {
  const colour = row.dot === "paper" ? "var(--paper)" : ACCENT_VAR[row.dot];
  return <span className="hc-dot" style={{ background: colour, opacity: row.dotAlpha ?? 1 }} />;
}

function ModuleBand({ mod }: { mod: Module }) {
  if (mod.kind === "progress") {
    return (
      <>
        <div className="hc-mod-row">
          <span>{mod.left}</span>
          <span>
            {mod.strong && <b>{mod.strong}</b>} {mod.right}
          </span>
        </div>
        <div className="hc-bar">
          <i style={{ width: `${mod.value * 100}%` }} />
        </div>
      </>
    );
  }
  if (mod.kind === "funnel") {
    return (
      <div className="hc-funnel">
        {mod.steps.map((s, i) => (
          /* the label sits inside its own bar, right-aligned, so the three
             numbers read as one shrinking column rather than as a legend */
          <i key={i} style={{ width: `${s.width * 100}%`, opacity: s.alpha }}>
            {s.label}
          </i>
        ))}
      </div>
    );
  }
  return (
    <div className="hc-map">
      {mod.outOfReach.map(([x, y], i) => (
        <span key={`f${i}`} className="hc-pin hc-pin--far" style={{ left: `${x * 100}%`, top: `${y * 100}%` }} />
      ))}
      {mod.reachable.map(([x, y], i) => (
        <span key={`n${i}`} className="hc-pin hc-pin--near" style={{ left: `${x * 100}%`, top: `${y * 100}%` }} />
      ))}
      <span className="hc-pin hc-pin--you" style={{ left: `${mod.you[0] * 100}%`, top: `${mod.you[1] * 100}%` }} />
    </div>
  );
}

export function CardUI({ card }: { card: HeroCard }) {
  return (
    <div className="hc-ui-inner">
      <div className="hc-appbar" data-hc-el>
        <span className="hc-icon">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            {card.icon.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
        </span>
        <span className="hc-appname">{card.name}</span>
        <span className="hc-pill">{card.pill}</span>
      </div>

      <div className="hc-label" data-hc-el>
        {card.label}
      </div>

      <div className="hc-number" data-hc-el>
        {card.number.prefix && <span className="hc-prefix">{card.number.prefix}</span>}
        <span data-hc-count>{card.number.value.toLocaleString("en-US")}</span>
      </div>

      <div className="hc-sub" data-hc-el>
        {card.sub}
      </div>

      <div className="hc-module" data-hc-el>
        <ModuleBand mod={card.module} />
      </div>

      {card.list && (
        <div className="hc-list" style={{ top: card.listTop }} data-hc-el>
          {card.list.map((row, i) => (
            <div key={i} className="hc-row">
              <Dot row={row} />
              <span className="hc-name">{row.name}</span>
              {row.meta && <span className="hc-meta">{row.meta}</span>}
              <span className="hc-value">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {card.question && (
        <div className="hc-question" data-hc-el>
          <div className="hc-q-text">{card.question.text}</div>
          <div className="hc-q-note">{card.question.note}</div>
        </div>
      )}

      <div className={`hc-cta${card.cta.secondary ? " hc-cta--pair" : ""}`} data-hc-el>
        <span className="hc-btn hc-btn--primary">{card.cta.primary}</span>
        {/* neither button is the wrong one. That is Bumper's whole principle:
            one question, no blocking and no guilt. */}
        {card.cta.secondary && <span className="hc-btn hc-btn--ghost">{card.cta.secondary}</span>}
      </div>
    </div>
  );
}
