import { Hero } from "./Hero";
import { CaseStudies } from "./CaseStudies";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

export function HomePage() {
  return (
    <>
      <ScrollProgress />
      <main>
        <Hero />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}
