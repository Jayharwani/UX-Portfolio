import { useEffect, useRef, useState } from "react";

const LIVE = "https://headroom-opal.vercel.app/";

/* --------------------------------------------------------------------------
   THE LIVE APP, EMBEDDED.

   The strongest evidence on the page: not a picture of the product, the
   product. The app sends no X-Frame-Options and no frame-ancestors, so it
   frames cleanly — checked before building this rather than after.

   It does not load until it is nearly on screen. An iframe in the markup is
   a second document, its own network waterfall and its own main thread, and
   there is no reason for any of that to compete with the top of the page.

   If it fails to frame — a header could change tomorrow — the screenshot
   stays underneath and the caption still points at the real thing.
   -------------------------------------------------------------------------- */

export function Embed() {
  const box = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="embed" ref={box}>
      <div className="frame">
        <div className="screen">
          {/* the poster, and the fallback if framing is ever refused */}
          <img
            src="/headroom/today-healthy.png"
            alt="Headroom's home screen"
            width={446}
            height={1000}
            loading="lazy"
            decoding="async"
            className={ready ? "hidden" : undefined}
          />
          {load ? (
            <iframe
              src={LIVE}
              title="Headroom, running. The live app, embedded."
              loading="lazy"
              onLoad={() => setReady(true)}
            />
          ) : null}
        </div>
      </div>
      <div className="say">
        <p className="what">
          This is the real app, running here. Tap through it &mdash; it&rsquo;s the same build
          that&rsquo;s live.
        </p>
        <a className="btn ghost" href={LIVE} target="_blank" rel="noopener noreferrer">
          Open it full size <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
    </div>
  );
}
