import { Header } from "./Header";
import { Hero } from "./Hero";
import { CaseStudies } from "./CaseStudies";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}