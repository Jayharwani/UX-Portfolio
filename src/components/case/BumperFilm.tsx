import { Explainer, type Scene } from "./Explainer";

/* --------------------------------------------------------------------------
   BUMPER, IN THIRTY SECONDS.

   Five shots, in the product's own interface rather than in illustration: a
   checkout that pressures, the pause that interrupts it, the trade it offers,
   the choice, and what happened. Every figure is the case study's own.

   The script is written to be read aloud, which is a different job from
   being read. Short clauses, numbers spelled the way a person says them
   ("thirty seconds", "seventy-three percent"), and no sentence that needs a
   comma to survive.
   -------------------------------------------------------------------------- */

const SCENES: Scene[] = [
  { at: 0, line: "One-click checkouts are built to beat your judgement." },
  { at: 7, line: "The impulse window is under thirty seconds." },
  {
    at: 13,
    line: "Bumper spends those thirty seconds differently. It blurs the urgency and shows what the money could fund instead.",
  },
  { at: 21, line: "Not a number. A trip." },
  { at: 25, line: "Seventy-three percent chose the goal. It is live on the Chrome Web Store." },
];

/** the still frame: the checkout, before anything happens */
function Poster() {
  return (
    <div className="bf-shot bf-store">
      <div className="bf-rowtop">
        <span className="mono">shop.example.com</span>
      </div>
      <div className="bf-prod">
        <div className="bf-img" aria-hidden="true" />
        <div className="bf-meta">
          <b>Sony WH-1000XM5</b>
          <span className="bf-price mono">$302.39</span>
          <span className="bf-urg mono">ONLY 2 LEFT IN STOCK</span>
          <span className="bf-buy mono">BUY NOW</span>
        </div>
      </div>
    </div>
  );
}

export function BumperFilm({ compact }: { compact?: boolean } = {}) {
  return (
    <Explainer
      compact={compact}
      scenes={SCENES}
      duration={30}
      label="A thirty-second explanation of Bumper, in the product's own interface."
      poster={<Poster />}
    >
      {/* 01 — the checkout, pressuring */}
      <div className="bf-shot bf-store" data-shot="0">
        <div className="bf-rowtop">
          <span className="mono">shop.example.com</span>
        </div>
        <div className="bf-prod">
          <div className="bf-img" aria-hidden="true" />
          <div className="bf-meta">
            <b>Sony WH-1000XM5</b>
            <span className="bf-price mono">$302.39</span>
            <span className="bf-urg mono">ONLY 2 LEFT IN STOCK</span>
            <span className="bf-buy mono">BUY NOW</span>
          </div>
        </div>
        <i className="bf-cursor" aria-hidden="true" />
      </div>

      {/* 02 — the window */}
      <div className="bf-shot bf-window" data-shot="1">
        <b className="mono bf-count">30</b>
        <span className="mono">SECONDS</span>
        <i className="bf-ring" aria-hidden="true" />
      </div>

      {/* 03 — the trade */}
      <div className="bf-shot bf-trade" data-shot="2">
        <div className="bf-side">
          <span className="mono k">THIS PURCHASE</span>
          <b>$302</b>
          <span className="mono n">INSTANT</span>
        </div>
        <span className="bf-or mono">OR</span>
        <div className="bf-side bf-dream">
          <span className="mono k">JAIPUR, INDIA</span>
          <b>$2,800</b>
          <span className="mono n">42% SAVED</span>
          <i className="bf-bar" aria-hidden="true">
            <em />
          </i>
        </div>
      </div>

      {/* 04 — the choice */}
      <div className="bf-shot bf-choice" data-shot="3">
        <span className="bf-btn bf-save mono">SAVE FOR JAIPUR</span>
        <span className="bf-btn mono">CONTINUE TO PURCHASE</span>
      </div>

      {/* 05 — what happened */}
      <div className="bf-shot bf-out" data-shot="4">
        <b>73%</b>
        <span>chose the goal over the impulse</span>
        <span className="mono bf-store-tag">LIVE ON THE CHROME WEB STORE</span>
      </div>
    </Explainer>
  );
}
