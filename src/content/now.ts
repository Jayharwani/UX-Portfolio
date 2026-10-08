/* --------------------------------------------------------------------------
   NOW. What Jay is working on, newest first.

   The section hides itself when the newest entry is more than 45 days old, or
   when site.nowEnabled is false. Stale content costs more than no content, and
   there is no empty state and no "coming soon" (HOMEPAGE_REDESIGN.md §6.6).

   The array is empty rather than seeded, because a seeded entry needs a date
   and a date nobody gave me would be invented. Empty means the section does
   not render at all, which is the correct behaviour today. The note below is
   what stops a production build until there are real entries.
   -------------------------------------------------------------------------- */

export interface NowEntry {
  /** ISO date, YYYY-MM-DD */
  date: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

export const nowNote = "[FILL: three to five dated entries for Now, newest first]";

export const now: NowEntry[] = [];

/** §6.6: hidden when the newest entry is older than this */
export const NOW_STALE_DAYS = 45;

/**
 * Whether the section should render at all.
 *
 * A pure function of the entries and a reference time, so the rule can be
 * tested rather than inspected: §6.6 says 45 days, which means 44 days old
 * still shows and 46 does not.
 */
export function nowIsFresh(entries: NowEntry[], ref: number = Date.now()): boolean {
  if (!entries.length) return false;
  const newest = Math.max(...entries.map((e) => new Date(e.date).getTime()));
  if (!Number.isFinite(newest)) return false;
  return ref - newest < NOW_STALE_DAYS * 86_400_000;
}
