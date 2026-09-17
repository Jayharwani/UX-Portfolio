import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
/* The previous homepage lives on in HomePage.tsx, unimported. Nothing
   references it, so it and everything it pulled in — the particle canvas,
   the WebGL hero, matter-js — tree-shake out of the bundle entirely, and it
   is one import away if this direction is ever reversed. */
import { ScrollToTop } from "./components/ScrollToTop";

/* Case-study pages split into their own chunks so the homepage loads light */
const SignalCasePage = lazy(() => import("./components/SignalCasePage").then((m) => ({ default: m.SignalCasePage })));
const BumperCasePage = lazy(() => import("./components/BumperCasePage").then((m) => ({ default: m.BumperCasePage })));
const ChronoWeavePage = lazy(() => import("./components/ChronoWeavePage").then((m) => ({ default: m.ChronoWeavePage })));
const HeadroomPage = lazy(() => import("./components/HeadroomPage").then((m) => ({ default: m.HeadroomPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then((m) => ({ default: m.AboutPage })));

/* A preview of the 3D case-study cards, on their own route so they can be
   looked at without committing the homepage to them. Lazy, so nothing about
   them reaches the homepage bundle until they are actually wired in. */
const CardsPreview = lazy(() =>
  import("./components/projects/CaseStudiesSection").then((m) => ({ default: m.CaseStudiesSection }))
);

/* The handoff design. It IS the homepage now; the previous one is still in
   components/Home.tsx, one import away, and in git if this is ever reversed. */
const HomeV2 = lazy(() => import("./components/HomeV2").then((m) => ({ default: m.HomeV2 })));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0E16" }}>
      <span
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: 12,
          letterSpacing: "0.12em",
          color: "#6A7488",
          textTransform: "uppercase",
        }}
      >
        loading…
      </span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen antialiased" style={{ backgroundColor: "#0A0E16" }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomeV2 />} />
            <Route path="/signal" element={<SignalCasePage />} />
            <Route path="/bumper" element={<BumperCasePage />} />
            <Route path="/chronoweave" element={<ChronoWeavePage />} />
            <Route path="/headroom" element={<HeadroomPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cards" element={<CardsPreview />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
