import { useEffect, useRef, type RefObject } from "react";
import { ACCENT_VAR, HERO_CARDS, type ProductKey } from "../../../data/heroCards";

/* --------------------------------------------------------------------------
   "FOUR SHIPPED".

   Real tabs, not styled divs: a tablist, arrow-key roving focus and a live
   panel, because this is the one part of the stage a keyboard or a screen
   reader can actually use. Everything else on the card is decoration and is
   hidden from them.

   THE PILL SLIDES AND THE LINE FILLS. The pill moving between tabs says the
   four are one control; the line filling over six and a half seconds says the
   card is about to change by itself, which is the difference between a
   carousel that surprises you and one that warns you.
   -------------------------------------------------------------------------- */

export function Tabs({
  active,
  onSelect,
  panelId,
  pager,
  rowRef,
}: {
  active: ProductKey;
  onSelect: (k: ProductKey) => void;
  panelId: string;
  /** one column, so the four names become four dots */
  pager: boolean;
  /** the stage places this; it is the only thing that knows where the card
   *  projects to, and the tabs hang off the card's bottom edge */
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const row = rowRef;
  const pill = useRef<HTMLSpanElement>(null);

  /* the pill is measured from the real tab, so it cannot drift out of step
     with the text when a font loads late or a label changes */
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const p = pill.current;
    if (!el || !p) return;
    p.style.width = `${el.offsetWidth}px`;
    p.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = HERO_CARDS.findIndex((c) => c.key === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % HERO_CARDS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + HERO_CARDS.length) % HERO_CARDS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = HERO_CARDS.length - 1;
    else return;
    e.preventDefault();
    onSelect(HERO_CARDS[next].key);
    row.current?.querySelector<HTMLElement>(`[data-tab="${HERO_CARDS[next].key}"]`)?.focus();
  };

  /* A PAGER, NOT A TAB ROW, WHEN THERE IS ONE COLUMN. Four names and their
     dots are 420 pixels wide; a 390 point screen has 342. Dots carry the
     same four states in 60, and they are still real tabs underneath — the
     accessible name comes from the label, not from the visible text. */
  if (pager) {
    return (
      <div className="hc-pager" role="tablist" aria-label="Shipped products" ref={row} onKeyDown={onKey}>
        {HERO_CARDS.map((c) => {
          const on = c.key === active;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              data-tab={c.key}
              className="hc-dot-tab"
              aria-selected={on}
              aria-label={c.name}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(c.key)}
              style={on ? { background: ACCENT_VAR[c.key] } : undefined}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="hc-tabs" role="tablist" aria-label="Shipped products" ref={row} onKeyDown={onKey}>
      <span className="hc-tab-pill" ref={pill} aria-hidden="true" />
      {HERO_CARDS.map((c) => {
        const on = c.key === active;
        return (
          <button
            key={c.key}
            type="button"
            role="tab"
            data-tab={c.key}
            className="hc-tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => onSelect(c.key)}
          >
            <i style={{ background: ACCENT_VAR[c.key] }} />
            {c.name}
            {on && <span className="hc-tab-line" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
