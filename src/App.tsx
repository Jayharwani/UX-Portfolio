import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
/* The previous homepage lives on in HomePage.tsx, unimported. Nothing
   references it, so it and everything it pulled in — the particle canvas,
   the WebGL hero, matter-js — tree-shake out of the bundle entirely, and it
   is one import away if this direction is ever reversed. */
import { ScrollToTop } from "./components/ScrollToTop";

/* Case-study pages split into their own chunks so the homepage loads light */
const SignalCasePage = lazy(() => import("./components/SignalCasePage").then((m) => ({ default: m.SignalCasePage })));
const BumperCasePage = lazy(() => import("./components/BumperCasePage").then((m) => ({ default: m.BumperCasePage })));
const HeadroomPage = lazy(() => import("./components/HeadroomPage").then((m) => ({ default: m.HeadroomPage })));
const FrictionPage = lazy(() => import("./components/FrictionPage").then((m) => ({ default: m.FrictionPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then((m) => ({ default: m.AboutPage })));

/* A preview of the 3D case-study cards, on their own route so they can be
   looked at without committing the homepage to them. Lazy, so nothing about
   them reaches the homepage bundle until they are actually wired in. */
/* scratch route for the Friction dot engine; not linked, not indexed */
const DotsLab = lazy(() => import("./components/DotsLab").then((m) => ({ default: m.DotsLab })));

const CardsPreview = lazy(() =>
  import("./components/projects/CaseStudiesSection").then((m) => ({ default: m.CaseStudiesSection }))
);

/* The bookshelf. It IS the homepage now; HomeV2 and Home are both still in
   components/, one import away, and in git if this is ever reversed. Lazy so
   that the three.js chunk it reaches for is never on the critical path. */
const HomeShelf = lazy(() => import("./components/HomeShelf").then((m) => ({ default: m.HomeShelf })));

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
      <div className="min-h-screen antialiased">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomeShelf />} />
            <Route path="/signal" element={<SignalCasePage />} />
            <Route path="/bumper" element={<BumperCasePage />} />
            <Route path="/headroom" element={<HeadroomPage />} />
            <Route path="/friction" element={<FrictionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cards" element={<CardsPreview />} />
            <Route path="/dots" element={<DotsLab />} />
            {/* /chronoweave was indexed before the project was removed, and an
                unmatched path rendered nothing at all. Anything unknown goes
                home rather than to a blank page. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
