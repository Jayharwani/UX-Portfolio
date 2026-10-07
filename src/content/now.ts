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
