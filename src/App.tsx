import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
/* Two superseded homepages live on unimported: HomePage.tsx (v3, with its own
   legacy-v3.css) and Home.tsx. Nothing references either, so they and
   everything they pull in tree-shake out of the bundle entirely, and each is
   one import away if a direction is ever reversed. */
import { ScrollToTop } from "./components/ScrollToTop";

/* Case-study pages split into their own chunks so the homepage loads light */
const SignalCasePage = lazy(() => import("./components/SignalCasePage").then((m) => ({ default: m.SignalCasePage })));
const BumperCasePage = lazy(() => import("./components/BumperCasePage").then((m) => ({ default: m.BumperCasePage })));
const HeadroomPage = lazy(() => import("./components/HeadroomPage").then((m) => ({ default: m.HeadroomPage })));
const FrictionPage = lazy(() => import("./components/FrictionPage").then((m) => ({ default: m.FrictionPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then((m) => ({ default: m.AboutPage })));

/* scratch route for the Friction dot engine; not linked, not indexed */
const DotsLab = lazy(() => import("./components/DotsLab").then((m) => ({ default: m.DotsLab })));

const CardsPreview = lazy(() =>
  import("./components/projects/CaseStudiesSection").then((m) => ({ default: m.CaseStudiesSection }))
);

/* v5, the white build. HomeV2 and its dark chrome are gone from the tree:
   the canvas field, the side rail and the title sequence were deleted with it
   (HOMEPAGE_REDESIGN.md §11.2). */
const HomeV5 = lazy(() => import("./components/HomeV5").then((m) => ({ default: m.HomeV5 })));

/* The paper the whole site now sits on. Each case study still paints its own
   ground in its own scope and sets the body colour in an effect, so none of
   them shows through to this. */
function RouteFallback() {
  return <div style={{ minHeight: "100svh", background: "var(--paper)" }} />;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomeV5 />} />
          <Route path="/signal" element={<SignalCasePage />} />
          <Route path="/bumper" element={<BumperCasePage />} />
          <Route path="/headroom" element={<HeadroomPage />} />
          <Route path="/friction" element={<FrictionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cards" element={<CardsPreview />} />
          <Route path="/dots" element={<DotsLab />} />
          {/* /chronoweave was indexed before the project was removed, and an
              unmatched path rendered nothing at all. Anything unknown goes
              home rather than to a blank page. Phase 9 replaces this with a
              real 404 that answers with a 404. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
