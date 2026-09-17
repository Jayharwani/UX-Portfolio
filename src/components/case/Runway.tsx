import { useRef, useState } from "react";
import { useScene } from "./useScene";

/* --------------------------------------------------------------------------
   THE RUNWAY — Headroom's signature, CASES.md §3.

   Headroom's whole claim is that the bank balance is the wrong number. The
   page can assert that, or it can run the subtraction in front of the reader
   and let them watch the number they trust turn into the number that is true.

   Scroll drives it: $2,500 is the balance, $770 of bills slides across it, and
   what is left is $1,730 — the only figure the product shows. Every number
   here is the case study's own; none of them were invented for the effect, and
   the per-bill split is deliberately not shown because the source never gave
   one and a case study is not the place to make one up.

   The figure is written straight into the DOM rather than held in state. At
   sixty frames a second a re-render per frame to retype four characters is
   waste, and React is not needed to own a number nobody else reads.
   -------------------------------------------------------------------------- */

const BALANCE = 2500;
const BILLS = 770;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function Runway() {
  const out = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  const scene = useScene<HTMLDivElement>((p) => {
    /* the subtraction happens across the middle of the scene's travel, so it
       is finished well before the section leaves and the reader is looking at
       a settled number rather than one still moving */
    const k = Math.min(1, Math.max(0, (p - 0.28) / 0.34));
    const eased = 1 - Math.pow(1 - k, 3);
    if (out.current) out.current.textContent = money(BALANCE - BILLS * eased);
    setDone((d) => (d === k >= 1 ? d : k >= 1));
  });

  return (
    <div className="hr-runway" ref={scene}>
      <div className="hr-row">
        <span className="mono lbl">BANK BALANCE</span>
        <span className="mono val">{money(BALANCE)}</span>
        <span className="mono hint">WHAT THE APP SHOWS YOU</span>
      </div>
      <div className="hr-bar">
        <i className="base" />
        <i className="bills">
          <span className="mono">RENT · PHONE · SUBSCRIPTIONS &minus;{money(BILLS)}</span>
        </i>
      </div>

      <div className={`hr-row out${done ? " settled" : ""}`}>
        <span className="mono lbl">SAFE TO SPEND</span>
        <span className="mono val big" ref={out}>
          {money(BALANCE)}
        </span>
      </div>
      <p className="hr-note mono">
        THE ONLY NUMBER HEADROOM SHOWS
      </p>
    </div>
  );
}
