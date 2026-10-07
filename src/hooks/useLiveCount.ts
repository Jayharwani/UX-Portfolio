import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   A PREVIEW THAT COUNTS THE REAL THING.

   §6.3.6: where a project publishes a public JSON endpoint, the frame shows
   the live number. Signal does. Its map writes events.json on every refresh,
   with CORS open and a ten minute cache, so the count in the preview is the
   count on the map rather than a figure typed in once and left to rot.

   The rules it has to keep: fetch once, when the frame is near the viewport,
   with a 2s timeout; never a spinner inside a frame; and on any failure keep
   the dated reading from content. A number that is quietly a month old and
   says so is better than a frame that admits it is loading.
   -------------------------------------------------------------------------- */

const WEEK = 7 * 86_400_000;

/** events starting within seven days of the file's own generatedAt */
function countThisWeek(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const d = data as { generatedAt?: string; events?: { start?: string }[] };
  if (!Array.isArray(d.events)) return null;
  const from = d.generatedAt ? new Date(d.generatedAt).getTime() : Date.now();
  if (!Number.isFinite(from)) return null;
  const n = d.events.filter((e) => {
    const t = e.start ? new Date(e.start).getTime() : NaN;
    return Number.isFinite(t) && t >= from && t - from < WEEK;
  }).length;
  return n > 0 ? n : null;
}

export function useLiveCount(url: string | undefined, near: boolean): number | null {
  const [live, setLive] = useState<number | null>(null);

  useEffect(() => {
    if (!url || !near || live !== null) return;
    const ac = new AbortController();
    const timer = window.setTimeout(() => ac.abort(), 2000);

    fetch(url, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setLive(countThisWeek(d)))
      .catch(() => {
        /* offline, slow, moved, or malformed: the content value stands */
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [url, near, live]);

  return live;
}
