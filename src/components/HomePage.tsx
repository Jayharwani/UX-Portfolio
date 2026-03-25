import { Hero } from "./Hero";
import { CaseStudies } from "./CaseStudies";
import { Footer } from "./Footer";
import { CursorGlow } from "./CursorGlow";
import { ScrollProgress } from "./ScrollProgress";

export function HomePage() {
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <main>
        <Hero />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}
