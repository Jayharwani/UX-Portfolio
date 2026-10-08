import { useEffect } from "react";
import { head } from "../content/home";
import { Contact } from "./v5/Contact";
import { Header } from "./v5/Header";
import { Hero } from "./v5/Hero";
import { About, Footer, LiveRegion, MoreWork, Now } from "./v5/Sections";
import { Showcase } from "./v5/Showcase";
import "../styles/home.css";
import "../styles/sections.css";

/* --------------------------------------------------------------------------
   THE HOMEPAGE.

   Every section the page has, in the order §5.1 sets: who, then proof, then
   range, then the person, then what is happening now, then how to reach him.
   Each section owns its own content and its own motion; this file owns the
   landmarks and the order, and nothing else.

   The Phase 1 skeleton that stood here is gone. It had done its job, which
   was to prove the tokens and the content model before any of it was
   designed.

   After this the page is complete on its own. What is left is the route morph
   into the case studies, and work that is not the homepage at all.
   -------------------------------------------------------------------------- */

export function HomeV5() {
  useEffect(() => {
    document.title = head.title;
  }, []);

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <Header />

      <main id="content" className="shell">
        <Hero />
        <Showcase />
        <MoreWork />
        <About />
        <Now />
        <Contact />
      </main>

      <Footer />
      <LiveRegion />
    </>
  );
}

export default HomeV5;
