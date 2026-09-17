import { useRef } from "react";
import { useScene } from "./useScene";

/* --------------------------------------------------------------------------
   THE PAUSE — Bumper's signature, CASES.md §3.

   Bumper puts thirty seconds between an impulse and a purchase. So the page
   puts one between the reader and its own conclusion: the panel pins, the
   countdown runs on scroll, the urgency strip behind it goes out of focus,
   and only when the clock reaches zero do the two choices arrive.

   IT IS STICKY, NOT A SCROLL TRAP. The product's first design principle is
   positive friction — "the pause should slow you down, not stop you… no
   blocking, no guilt" — and a page that hijacks the wheel to make that point
   would be arguing against itself. Scroll never stops working. The content
   holds; the reader does not.

   The panel is the real intervention, copy and figures included: $302.39
   against a $2,800 Jaipur fund standing at $1,180. Nothing here is invented
   to make the scene land.
   -------------------------------------------------------------------------- */

const SECONDS = 30;

export function Pause() {
  const clock = useRef<HTMLSpanElement>(null);

  const ref = useScene<HTMLDivElement>((p) => {
    /* the countdown occupies the middle of the travel, so it starts once the
       panel is actually pinned and finishes before it releases */
    const k = Math.min(1, Math.max(0, (p - 0.2) / 0.5));
    if (clock.current) {
      clock.current.textContent = `${Math.max(0, Math.ceil(SECONDS * (1 - k)))}s`;
    }
  });

  return (
    <div className="bp-pause" ref={ref}>
      <div className="stick">
        {/* what the pause is covering: the manipulation the case study names */}
        <div className="urgency" aria-hidden="true">
          <span className="mono">ONLY 2 LEFT IN STOCK!</span>
          <span className="mono">30% OFF — ENDS TONIGHT</span>
          <span className="mono">ORDER SOON TO SECURE THIS DEAL</span>
        </div>

        <div className="panel">
          <div className="head">
            <span className="mono brand">BUMPER</span>
            <span className="mono sub">MINDFUL SPENDING</span>
          </div>

          <h3>Before you checkout&hellip;</h3>
          <p>
            You&rsquo;re about to spend $302.39. What if this could bring you closer to something
            more meaningful?
          </p>

          <div className="compare">
            <div className="side">
              <span className="mono k">THIS PURCHASE</span>
              <b>Sony Headphones</b>
              <span className="amt mono">$302</span>
              <span className="mono note">INSTANT GRATIFICATION</span>
            </div>
            <div className="side dream">
              <span className="mono k">OR SAVE FOR</span>
              <b>Jaipur, India</b>
              <span className="amt mono">$1,180 / $2,800</span>
              <span className="mono note">ADD $302 AND YOU&rsquo;RE AT 53%</span>
              <i className="bar">
                <em />
              </i>
            </div>
          </div>

          <p className="pull">&ldquo;The best things in life aren&rsquo;t things.&rdquo;</p>

          <div className="choices">
            <span className="btn primary">Save for Jaipur</span>
            <span className="btn">Continue to purchase</span>
          </div>

          <p className="mono timer">
            TAKE YOUR TIME &middot; <span ref={clock}>30s</span> TO REFLECT
          </p>
        </div>
      </div>
    </div>
  );
}
