import { getPerfTier } from "../../home/perfTier";

/* --------------------------------------------------------------------------
   HOW LONG THE INTRO IS, DECIDED ONCE.

   An intro spends a first-time visitor's attention before they have seen
   anything, so the cost has to be honest. Four rules keep it so:

     - the content is in the DOM and painted at full opacity underneath it;
     - any input at all skips it;
     - it never plays twice in one session;
     - a visitor who saw the full one in the last month gets 700ms, not 3.2s.

   Reduced motion gets nothing, which is not a degraded experience here: it is
   the page, immediately.

   Storage can throw outright in a locked-down browser, and a visitor whose
   browser refuses localStorage should still see the site rather than an
   exception. Both reads are wrapped and both failures mean "treat this as a
   first visit".
   -------------------------------------------------------------------------- */

export type Mode = "none" | "short" | "lite" | "full";

export const SEEN_KEY = "jh.intro.v1";
export const SESSION_KEY = "jh.home.session";
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export const LENGTH: Record<Mode, number> = { none: 0, short: 700, lite: 2400, full: 3200 };

export function chooseMode(): Mode {
  if (typeof window === "undefined") return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";

  try {
    if (sessionStorage.getItem(SESSION_KEY)) return "none";
    const seen = Number(localStorage.getItem(SEEN_KEY));
    if (seen > 0 && Date.now() - seen < MONTH_MS) return "short";
  } catch {
    /* storage blocked: treat it as a first visit */
  }

  const capable =
    window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches &&
    getPerfTier() === "full" &&
    typeof WebGL2RenderingContext !== "undefined";

  return capable ? "full" : "lite";
}

export function remember(mode: Mode): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    if (mode === "full" || mode === "lite") localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    /* nothing to do: the worst case is the intro plays again next visit */
  }
}

export function forget(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SEEN_KEY);
  } catch {
    /* ignore */
  }
}
