import type { Accent } from "../styles/tokens";
import type { MockupKey } from "./mockups";

/* --------------------------------------------------------------------------
   THE FOUR ISSUES.

   Moved out of the ITEMS array that lived inside Work.tsx, because the cover,
   the chapter tabs, the evidence strip in the hero and the preloader all need
   the same four rows and none of them should own them.

   EVERY LINE HERE IS QUOTED, NOT WRITTEN. The hooks come from the copy already
   on the site; the three panel sentences are drawn from each case study's own
   page. No number appears here that is not already published on the page the
   cover opens, which is the only way a cover can make a claim at all.

   Order is the issue order and the tab order: 01 to 04.
   -------------------------------------------------------------------------- */

export type Issue = {
  key: MockupKey;
  no: "01" | "02" | "03" | "04";
  title: string;
  tag: string;
  year: string;
  href: string;
  accent: Accent;
  /** the running thing, not the write-up about it */
  live: { href: string; label: string };
  hook: string;
  /** the problem, what was built, where it landed */
  panels: [string, string, string];
};

export const ISSUES: Issue[] = [
  {
    key: "friction",
    no: "01",
    title: "Friction",
    tag: "Review mining · Astro",
    year: "2026",
    href: "/friction",
    accent: "friction",
    live: { href: "https://jayharwani.github.io/friction/", label: "OPEN SITE" },
    hook: "Ten thousand app reviews, sifted to the complaints that repeat.",
    panels: [
      "Ten thousand reviews a week, and the complaints that matter are buried in the noise.",
      "Dots falling through narrowing bands: ten thousand, then three thousand, then one hundred and fifty.",
      "Twenty-five dots lit at the end: the problems people keep running into.",
    ],
  },
  {
    key: "headroom",
    no: "02",
    title: "Headroom",
    tag: "Local-first finance · React",
    year: "2026",
    href: "/headroom",
    accent: "headroom",
    live: { href: "https://headroom-opal.vercel.app", label: "OPEN APP" },
    hook: "Can I spend this, right now?",
    panels: [
      "Your balance lies. It counts money that is already committed.",
      "Headroom subtracts what is coming, so you know what is safe to spend right now.",
      "One number, not categories. It runs in the browser and nothing is uploaded.",
    ],
  },
  {
    key: "signal",
    no: "03",
    title: "Signal",
    tag: "Live event map · MapLibre",
    year: "2026",
    href: "/signal",
    accent: "signal",
    live: { href: "https://jayharwani.github.io/dmv-map/", label: "OPEN MAP" },
    hook: "A live map of DMV tech events.",
    panels: [
      "Tech, design and AI events across DC, Northern Virginia and Baltimore, scattered across sources.",
      "A searchable map, with a layer that shows which ones you can actually make.",
      "A scheduled pipeline republishes every few hours. No backend, no recurring cost.",
    ],
  },
  {
    key: "bumper",
    no: "04",
    title: "Bumper",
    tag: "Behavioural · Extension",
    year: "2026",
    href: "/bumper",
    accent: "bumper",
    live: {
      href: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb",
      label: "CHROME STORE",
    },
    hook: "Catches impulse buys before you regret them.",
    panels: [
      "Every competing extension helps you spend more efficiently. None help you pause.",
      "One question before checkout, scaled to the amount. No blocking, and no guilt.",
      "Live on the Chrome Web Store, where $279 reads as 45% closer to Tokyo.",
    ],
  },
];
