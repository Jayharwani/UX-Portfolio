import { Suspense } from "react";
import { HomeV5 } from "./components/HomeV5";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router";

/* --------------------------------------------------------------------------
   ROUTES.

   DATA MODE, NOT <BrowserRouter>. Two things need it: the `viewTransition`
   prop that gives a clicked frame continuity into its case study, and
   <ScrollRestoration />, which puts a reader back exactly where they left
   when they press Back (§7.5, §8.6). Neither exists outside a data router.

   ScrollToTop went with the migration. It scrolled to the top on every path
   change, which is the opposite of restoring a position, and the two would
   have fought on every Back.

   Two superseded homepages live on unimported: HomePage.tsx (v3, with its own
   legacy-v3.css) and Home.tsx. Nothing references either, so they and
   everything they pull in tree-shake out of the bundle entirely.
   -------------------------------------------------------------------------- */

/* ROUTE-LEVEL `lazy`, NOT React.lazy. The difference is the ordering on Back.
   React.lazy leaves the router thinking the navigation is done while React is
   still suspended, so <ScrollRestoration /> restores against a document that
   is still the 100svh fallback and the position clamps: leaving the homepage
   at 2425px came back to 1687px and the wrong project. A route's own `lazy`
   resolves the module before the navigation completes, so the page is its
   full height by the time anything restores. */
const route = (
  path: string,
  load: () => Promise<Record<string, unknown>>,
  name: string
) => ({
  path,
  lazy: async () => ({ Component: (await load())[name] as React.ComponentType }),
});

/* The paper the whole site sits on. Each case study paints its own ground in
   its own scope and sets the body colour in an effect, so none shows through. */
function RouteFallback() {
  return <div style={{ minHeight: "100svh", background: "var(--paper)" }} />;
}

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    /* The first route a visitor lands on is lazy, so the router needs
       something to render while its module arrives. Without it, every page
       logged "No `HydrateFallback` element provided to render during initial
       hydration", and rule 2 is that production logs nothing. */
    HydrateFallback: RouteFallback,
    children: [
      /* eager: the entry route, and one module hop off the LCP path */
      { index: true, path: "/", element: <HomeV5 /> },
      route("/signal", () => import("./components/SignalCasePage"), "SignalCasePage"),
      route("/bumper", () => import("./components/BumperCasePage"), "BumperCasePage"),
      route("/headroom", () => import("./components/HeadroomPage"), "HeadroomPage"),
      route("/friction", () => import("./components/FrictionPage"), "FrictionPage"),
      route("/about", () => import("./components/AboutPage"), "AboutPage"),
      route("/cards", () => import("./components/projects/CaseStudiesSection"), "CaseStudiesSection"),
      /* scratch route for the Friction dot engine; not linked, not indexed */
      route("/dots", () => import("./components/DotsLab"), "DotsLab"),
      /* /chronoweave was indexed before the project was removed, and an
         unmatched path rendered nothing at all. Anything unknown goes home
         rather than to a blank page. Phase 9 replaces this with a real 404
         that answers with a 404. */
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
