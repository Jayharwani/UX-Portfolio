import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { PROJECTS } from "./shelf/shelf";
import { OverlayHUD } from "./shelf/OverlayHUD";
import "../styles/shelf.css";

/* --------------------------------------------------------------------------
   THE HOMEPAGE.

   A room of shelving, built in WebGL, with four books on the middle board and
   an HTML index underneath that is the page whether or not any of the rest
   arrives.

   THREE THINGS DECIDE WHICH VERSION A READER GETS, and none of them is a user
   agent string:

     no WebGL            the index, and nothing else
     a narrow screen     a swipe carousel of the four books
     reduced motion      the room, with no drift and no cinematic open

   The scene is a lazy chunk, so a phone and a crawler never download three.js
   at all.
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
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Jay Harwani, product designer who writes the front end";

    const narrow = window.matchMedia("(max-width: 860px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => {
      setReduce(motion.matches);
      /* Core count is a blunt instrument, but it is the only capability the
         platform will actually tell you about, and it separates a four-core
         ultrabook from a laptop that can afford a shadow map and four
         full-screen passes. Reduced motion takes the cheap path too: someone
         who has asked for less movement is not well served by film grain. */
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

  /* the scene fires this when a book opens, so the HUD can offer a way out */
  useEffect(() => {
    const on = () => setBusy(true);
    window.addEventListener("shelf:opening", on);
    return () => window.removeEventListener("shelf:opening", on);
  }, []);

  const back = useCallback(() => {
    window.dispatchEvent(new Event("shelf:back"));
    setBusy(false);
  }, []);

  return (
    <div className="shelf" data-mode={mode} data-busy={busy ? "" : undefined}>
      <div className="shelf-stage">
        {mode === "scene" ? (
          <Suspense fallback={null}>
            <BookshelfScene onHover={setHovered} reduce={reduce} lite={lite} />
          </Suspense>
        ) : null}

        {mode === "carousel" ? (
          <Suspense fallback={null}>
            <MobileShelf projects={PROJECTS} />
          </Suspense>
        ) : null}
      </div>

      <OverlayHUD hovered={hovered} busy={busy} onBack={back} />

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
