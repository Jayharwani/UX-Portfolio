import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "./components/ScrollToTop";

/* Case-study pages split into their own chunks so the homepage loads light */
const SignalCasePage = lazy(() => import("./components/SignalCasePage").then((m) => ({ default: m.SignalCasePage })));
const BumperCasePage = lazy(() => import("./components/BumperCasePage").then((m) => ({ default: m.BumperCasePage })));
const HeadroomPage = lazy(() => import("./components/HeadroomPage").then((m) => ({ default: m.HeadroomPage })));
const FrictionPage = lazy(() => import("./components/FrictionPage").then((m) => ({ default: m.FrictionPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then((m) => ({ default: m.AboutPage })));

/* The homepage. */
const HomeResolve = lazy(() => import("./components/HomeResolve").then((m) => ({ default: m.HomeResolve })));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#05070C" }}>
      <span
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: 12,
          letterSpacing: "0.12em",
          color: "#7D89A0",
          textTransform: "uppercase",
        }}
      >
        loading
      </span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen antialiased" style={{ backgroundColor: "#05070C" }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomeResolve />} />
            <Route path="/signal" element={<SignalCasePage />} />
            <Route path="/bumper" element={<BumperCasePage />} />
            <Route path="/headroom" element={<HeadroomPage />} />
            <Route path="/friction" element={<FrictionPage />} />
            <Route path="/about" element={<AboutPage />} />
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
