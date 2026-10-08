import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { PROJECTS } from "./shelf/shelf";
import { OverlayHUD } from "./shelf/OverlayHUD";
import "../styles/shelf.css";

/* --------------------------------------------------------------------------
   THE HOMEPAGE.

   A poster paints first, the scene fades in over it, and an HTML index is the
   page whether or not any of the rest arrives.

   WHAT A READER GETS, and none of it decided by a user agent string:

     no WebGL, or the context is lost   the poster, and the list, visible
     a narrow screen                    a swipe carousel; three.js never loads
     reduced motion                     the room, with no drift and no sequence
     four cores or fewer                the room, without shadows or post

   THE POSTER IS THE LCP ELEMENT, which is the entire reason it exists: the
   scene chunk and its two megabytes of maps cannot paint in a second, and a
   dark empty rectangle for that second is a worse first impression than any
   amount of 3D is a good one. It is 33 kB of AVIF.

   fetchpriority is spelled in lowercase on purpose. React 18 does not know the
   camelCase prop and silently drops it, which is a hint you can read in the
   DOM and never see in the source.
   -------------------------------------------------------------------------- */

const BookshelfScene = lazy(() =>
  import("./shelf/BookshelfScene").then((m) => ({ default: m.BookshelfScene }))
);
const MobileShelf = lazy(() => import("./shelf/MobileShelf").then((m) => ({ default: m.MobileShelf })));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HomeShelf() {
  const [mode, setMode] = useState<"loading" | "scene" | "carousel" | "flat">("loading");
  const [reduce, setReduce] = useState(false);
  const [lite, setLite] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    document.title = "Jay Harwani, product designer who writes the front end";

    const narrow = window.matchMedia("(max-width: 860px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => {
      setReduce(motion.matches);
      /* Core count is a blunt instrument and the only capability the platform
         will actually admit to. It separates a four-core ultrabook from a
         laptop that can afford a shadow map and four full-screen passes.
         Reduced motion takes the cheap path too: someone who asked for less
         movement is not well served by film grain. */
      setLite((navigator.hardwareConcurrency ?? 8) <= 4 || motion.matches);
      if (!hasWebGL()) setMode("flat");
      else setMode(narrow.matches ? "carousel" : "scene");
    };
    decide();

    narrow.addEventListener("change", decide);
    motion.addEventListener("change", decide);
    return () => {
      narrow.removeEventListener("change", decide);
      motion.removeEventListener("change", decide);
    };
  }, []);

  /* A LOST CONTEXT IS NOT A CRASH, it is a laptop waking up or a driver being
     replaced, and it happens to real people. The poster is still there and the
     list is one keystroke away, so the page falls back to being a page. */
  useEffect(() => {
    const onLost = (e: Event) => {
      e.preventDefault();
      setMode("flat");
      setPainted(false);
    };
    const canvas = document.querySelector("canvas");
    canvas?.addEventListener("webglcontextlost", onLost);
    return () => canvas?.removeEventListener("webglcontextlost", onLost);
  }, [mode, painted]);

  useEffect(() => {
    const on = () => setBusy(true);
    window.addEventListener("shelf:opening", on);
    return () => window.removeEventListener("shelf:opening", on);
  }, []);

  /* Two frames, not one. The first frame after the scene mounts is the one
     where the compositor still has nothing to show, and fading the canvas in
     on it swaps a finished poster for an empty canvas. */
  const onReady = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setPainted(true)));
  }, []);

  return (
    <div className="shelf shelf-root" data-mode={mode} data-busy={busy ? "" : undefined}>
      <picture>
        <source media="(max-width: 1100px)" srcSet="/shelf/poster-1024.avif" />
        <img
          className="shelf-poster"
          src="/shelf/poster-1440.avif"
          width={1440}
          height={900}
          alt=""
          data-gone={painted ? "" : undefined}
          /* lowercase: React 18 drops the camelCase spelling */
          {...{ fetchpriority: "high" }}
          decoding="async"
        />
      </picture>

      <div className="shelf-stage" data-painted={painted ? "" : undefined}>
        {mode === "scene" ? (
          <Suspense fallback={null}>
            <BookshelfScene
              onHover={setHovered}
              reduce={reduce}
              lite={lite}
              focused={focused}
              onReady={onReady}
            />
          </Suspense>
        ) : null}

        {mode === "carousel" ? (
          <Suspense fallback={null}>
            <MobileShelf projects={PROJECTS} />
          </Suspense>
        ) : null}
      </div>

      <OverlayHUD hovered={hovered ?? focused} busy={busy} onFocusBook={setFocused} />

      {/* the room is decorative; this is the sentence a crawler and a screen
          reader get first */}
      <h1 className="visually-hidden">
        Jay Harwani, a product designer who writes the front end. Four projects, all live.
      </h1>

      <noscript>
        <div className="shelf-noscript">
          <p>Four projects:</p>
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link to={p.href}>{p.title}</Link>, {p.subtitle}
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}

export default HomeShelf;
