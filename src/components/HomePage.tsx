import { Hero } from "./Hero";
import { ApproachStrip } from "./ApproachStrip";
import { CaseStudies } from "./CaseStudies";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

export function HomePage() {
  return (
    <>
      <ScrollProgress />
      <main>
        <Hero />
        <ApproachStrip />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}
