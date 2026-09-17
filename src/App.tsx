import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
/* The previous homepage lives on in HomePage.tsx, unimported. Nothing
   references it, so it and everything it pulled in — the particle canvas,
   the WebGL hero, matter-js — tree-shake out of the bundle entirely, and it
   is one import away if this direction is ever reversed. */
import { Home } from "./components/Home";
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

/* The handoff design, built at /v2 until it is ready to replace /. Lazy, so
   its canvas engine never reaches the current homepage's bundle. */
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
            <Route path="/" element={<Home />} />
            <Route path="/signal" element={<SignalCasePage />} />
            <Route path="/bumper" element={<BumperCasePage />} />
            <Route path="/chronoweave" element={<ChronoWeavePage />} />
            <Route path="/headroom" element={<HeadroomPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cards" element={<CardsPreview />} />
            <Route path="/v2" element={<HomeV2 />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
