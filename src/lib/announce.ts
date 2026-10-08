/* --------------------------------------------------------------------------
   ONE POLITE LIVE REGION, FOR THE WHOLE PAGE.

   §10.3 asks for exactly one. Two regions on a page is a well known way to get
   an announcement read twice or not at all, so the region is rendered once in
   the page shell and anything that needs to say something calls announce().

   The message is cleared a beat later. A live region that still holds last
   week's text will read it again the next time anything near it changes.
   -------------------------------------------------------------------------- */

type Listener = (message: string) => void;

let listener: Listener | null = null;
let clear: number | undefined;

/** called by the single <LiveRegion /> in the page shell */
export function subscribe(fn: Listener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function announce(message: string) {
  if (!listener) return;
  /* the same string twice in a row is not a change, so a screen reader would
     say nothing the second time: blank it first */
  listener("");
  window.clearTimeout(clear);
  window.setTimeout(() => listener?.(message), 50);
  clear = window.setTimeout(() => listener?.(""), 4000);
}
