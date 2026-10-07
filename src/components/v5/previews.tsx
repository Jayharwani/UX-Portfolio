import type { ReactNode } from "react";
import type { FlagshipProject } from "../../content/home";
import { Block, T } from "./LiveFrame";

/* --------------------------------------------------------------------------
   THE FOUR SCREENS.

   Each is the first screen of its case study, with that case study's own
   numbers, in that product's own light UI. Nothing here is invented: Friction
   reads 9,994 because section 02 of /friction says 9,994; Headroom reads
   $1,730 because $2,500 less rent $650 and wifi $120 is what the running app
   shows and what the /headroom hero counts to; Signal counts the real
   events.json; Bumper's prompt and buttons are its own words.

   Bumper's cart carries no total. The v4 preview showed $89.00, which is a
   number nobody measured, and a checkout needs a price about as much as the
   point needs decoration.

   Every component takes `wire` and renders itself as its own wireframe, so
   the spec state and the shipped state are one tree (see LiveFrame).
   -------------------------------------------------------------------------- */

/** the figure a screen leads with, in the DOM at its final value (§6.3.6) */
function Figure({
  wire,
  value,
  prefix,
  label,
}: {
  wire: boolean;
  value: string;
  prefix?: string;
  label: string;
}) {
  return (
    <div className="pv-figure">
      {wire ? (
        <i className="pv-bar pv-bar--big" style={{ width: "52%" }} />
      ) : (
        <strong className="pv-num tnum" data-spec="type">
          {prefix ? <small>{prefix}</small> : null}
          {value}
        </strong>
      )}
      <T wire={wire} w={44} className="pv-cap">
        {label}
      </T>
    </div>
  );
}

function Head({ wire, left, right }: { wire: boolean; left: string; right?: ReactNode }) {
  return (
    <div className="pv-head" data-spec="gap">
      <T wire={wire} w={38} className="pv-eyebrow">
        {left}
      </T>
      {right ? <span className="pv-live">{wire ? null : right}</span> : null}
    </div>
  );
}

/* ── Friction ─────────────────────────────────────────────────────────────
   The weekly scan. One bar per complaint group; the three marked ones are
   what survives to the model. */

const BARS = [92, 74, 86, 58, 96, 68, 80, 64, 90, 52, 76, 88];
const KEPT = new Set([1, 5, 9]);

function Friction({ wire, figure }: PreviewProps) {
  return (
    <div className="pv pv--friction" data-spec="padding">
      <Head wire={wire} left="Last scan" right={<><i className="pv-dot" />Weekly</>} />
      <Figure wire={wire} value={figure} label="public reviews read" />
      <div className="pv-bars" data-spec="gap">
        {BARS.map((w, i) => (
          <i key={i} className={KEPT.has(i) ? "on" : undefined} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="pv-foot">
        {wire ? (
          <i className="pv-bar" style={{ width: "34%" }} />
        ) : (
          <>
            <b className="tnum">150</b>
            <T wire={wire}>to the model</T>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Headroom ─────────────────────────────────────────────────────────────
   The home screen: what is safe to spend, and the two bills that made it
   smaller than the balance. */

const BILLS = [
  ["Rent", "$650"],
  ["Wifi", "$120"],
];

function Headroom({ wire, figure }: PreviewProps) {
  return (
    <div className="pv pv--headroom" data-spec="padding">
      <Head wire={wire} left="Safe to spend" right={<><i className="pv-dot" />On track</>} />
      <Figure wire={wire} value={figure} prefix="$" label="4 days until payday" />
      {/* The bills sit under the figure, which is the order the running app
          uses: the number, then what made it smaller than the balance. They
          were pinned to the foot of the screen at first, and a 9/19.5 frame
          put a void through the middle of the phone. */}
      <T wire={wire} w={52} className="pv-sub">
        Coming up before payday
      </T>
      {/* No target annotation on a bill row. §6.3.6 measures the element as
          drawn, and a row that is 17px in a 270px preview would put "Target
          17" on screen: true of the picture, false about the product, and
          read as a failure either way. */}
      <div className="pv-bills" data-spec="gap">
        {BILLS.map(([name, amt]) => (
          <div className="pv-bill" key={name}>
            <T wire={wire} w={46}>
              {name}
            </T>
            {wire ? (
              <i className="pv-bar pv-bar--r" style={{ width: "22%" }} />
            ) : (
              <span className="tnum">{amt}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Signal ───────────────────────────────────────────────────────────────
   The map, with this week's count. The figure is the live one when the fetch
   lands and the dated reading from content when it does not. */

const PINS = [
  [24, 44],
  [41, 62],
  [33, 31],
  [68, 71],
  [76, 54],
  [50, 38],
];

function Signal({ wire, figure }: PreviewProps) {
  return (
    <div className="pv pv--signal">
      <div className="pv-map">
        <Block wire={wire} className="pv-land pv-land--a" />
        <Block wire={wire} className="pv-land pv-land--b" />
        {PINS.map(([x, y], i) => (
          <i key={i} className="pv-pin" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
      <div className="pv-chip" data-spec="padding">
        {wire ? (
          <i className="pv-bar" style={{ width: "70%" }} />
        ) : (
          <>
            <i className="pv-dot" />
            <b className="tnum" data-spec="type">
              {figure}
            </b>{" "}
            events this week
          </>
        )}
      </div>
    </div>
  );
}

/* ── Bumper ───────────────────────────────────────────────────────────────
   A checkout, and the one question the extension puts in front of it. */

function Bumper({ wire }: PreviewProps) {
  return (
    <div className="pv pv--bumper">
      <div className="pv-cart" data-spec="padding">
        <Block wire={wire} className="pv-thumb" />
        <div className="pv-lines">
          <T wire={wire} w={72} />
          <T wire={wire} w={44} />
        </div>
      </div>
      <div className="pv-sheet" data-spec="padding">
        <T wire={wire} w={26} className="pv-eyebrow">
          Bumper
        </T>
        <p className="pv-ask">
          {wire ? (
            <>
              <i className="pv-bar" style={{ width: "92%" }} />
              <i className="pv-bar" style={{ width: "58%" }} />
            </>
          ) : (
            "Wait. Do you need this, or do you want it?"
          )}
        </p>
        <div className="pv-btns" data-spec="target">
          <span className="pv-btn pv-btn--a">{wire ? null : "Sleep on it"}</span>
          <span className="pv-btn pv-btn--b">{wire ? null : "Buy anyway"}</span>
        </div>
      </div>
    </div>
  );
}

interface PreviewProps {
  wire: boolean;
  /** already formatted, and already the final value in the DOM */
  figure: string;
}

const BY_SLUG: Record<FlagshipProject["slug"], (p: PreviewProps) => ReactNode> = {
  friction: Friction,
  headroom: Headroom,
  signal: Signal,
  bumper: Bumper,
};

export function Preview({
  slug,
  wire,
  figure,
}: {
  slug: FlagshipProject["slug"];
  wire: boolean;
  figure: string;
}) {
  const C = BY_SLUG[slug];
  return <C wire={wire} figure={figure} />;
}
