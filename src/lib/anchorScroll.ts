/* --------------------------------------------------------------------------
   SMOOTH, BUT ONLY FOR THE THING IT IS FOR.

   §8.1 allows `scroll-behavior: smooth` for in-page anchor jumps and nothing
   else. Declared on `html` it applies to every programmatic scroll on the
   site, including the one <ScrollRestoration /> makes on Back, which turned
   a restore into a visible 360ms journey up the page that then stopped short.

   So the document scrolls instantly by default and this turns smooth on for
   the length of a jump. Native anchor behaviour is untouched: the browser
   still moves focus and sets :target, it just animates getting there.
   -------------------------------------------------------------------------- */

let off: number | undefined;

export function enableAnchorSmoothing() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as HTMLElement | null)?.closest?.("a");
    if (!a) return;
    const href = a.getAttribute("href");
    /* same document, and an actual fragment: "#" alone goes to the top but
       has no target to animate toward */
    if (!href || href.length < 2 || !href.startsWith("#")) return;

    document.documentElement.setAttribute("data-anchor", "");
    window.clearTimeout(off);
    off = window.setTimeout(() => document.documentElement.removeAttribute("data-anchor"), 1200);
  };

  document.addEventListener("click", onClick, true);
  return () => {
    document.removeEventListener("click", onClick, true);
    window.clearTimeout(off);
    document.documentElement.removeAttribute("data-anchor");
  };
}
