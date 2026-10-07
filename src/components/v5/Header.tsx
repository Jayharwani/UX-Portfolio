import { useEffect, useRef } from "react";
import { nav, site } from "../../content/home";
import { useCurrentSection } from "../../hooks/useCurrentSection";
import { useScrolled } from "../../hooks/useScrolled";

/* --------------------------------------------------------------------------
   THE HEADER — identity at every scroll position.

   v4 had no header at all: the name appeared once, in a 16.5px line at 52%
   opacity, two thirds of the way down the hero. A recruiter giving the page
   ten seconds on a phone never saw whose portfolio it was.

   The indicator under the current link moves with transform only, never left
   or width, so it animates on the compositor. It is a 1px bar scaled to the
   link's measured width, which is why scaleX can give it an exact size.
   -------------------------------------------------------------------------- */

/** module scope: a fresh array each render would rebuild the observer (§6.1) */
const SECTION_IDS = nav
  .filter((n) => n.href.startsWith("#"))
  .map((n) => n.href.slice(1)) as readonly string[];

export function Header() {
  const { sentinel, scrolled } = useScrolled();
  const current = useCurrentSection(SECTION_IDS);
  const list = useRef<HTMLUListElement>(null);

  /* Place the indicator from the live geometry of the active link, so it stays
     right through a font swap, a resize and the three nav widths. */
  useEffect(() => {
    const ul = list.current;
    if (!ul) return;

    const place = () => {
      const link = ul.querySelector<HTMLElement>('a[aria-current="true"]');
      if (!link) {
        ul.style.setProperty("--ind-w", "0");
        return;
      }
      ul.style.setProperty("--ind-x", `${link.offsetLeft}px`);
      ul.style.setProperty("--ind-w", String(link.offsetWidth));
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(ul);
    document.fonts?.ready.then(place).catch(() => {});
    return () => ro.disconnect();
  }, [current]);

  return (
    <>
      <div className="top-sentinel" ref={sentinel} aria-hidden="true" />
      <header className="hdr" data-scrolled={scrolled || undefined}>
        <div className="hdr-row shell">
          {/* The header is on the homepage only until Phase 8 shares it with
              the case studies, where this becomes a link to "/". */}
          <a className="hdr-brand" href="#top">
            {site.name}
          </a>

          <nav aria-label="Primary">
            <ul ref={list}>
              {nav.map((item) => {
                const id = item.href.startsWith("#") ? item.href.slice(1) : null;
                const active = id !== null && id === current;
                return (
                  <li key={item.href} data-item={item.label.toLowerCase()}>
                    <a
                      href={item.href}
                      aria-current={active ? "true" : undefined}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : null)}
                    >
                      {item.label}
                      {item.external ? (
                        <span className="visually-hidden"> (PDF, opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
              <li className="ind" aria-hidden="true" />
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
