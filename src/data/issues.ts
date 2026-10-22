import type { Accent } from "../styles/tokens";

/* --------------------------------------------------------------------------
   THE FIVE ISSUES.

   Moved out of the ITEMS array that lived inside Work.tsx, because the cover,
   the chapter tabs, the evidence strip in the hero and the preloader all need
   the same rows and none of them should own them.

   EVERY LINE HERE IS QUOTED, NOT WRITTEN. The hooks come from the copy already
   on the site; the three panel sentences are drawn from each case study's own
   page. No number appears here that is not already published on the page the
   cover opens, which is the only way a cover can make a claim at all.

   THE KEY IS ITS OWN TYPE NOW, not MockupKey. The two were the same four
   strings for as long as the work section rendered a mockup per project, and
   a fifth issue with no mockup is what finally separated them. src/data/
   mockups.ts still owns its own four and is unaffected.

   A CASE STUDY MAY LIVE OFF THIS SITE. Four of them are routes here; Healthy
   Switch's is published with the prototype it belongs to, so `href` is an
   absolute URL and the chapter opens it in a new tab. That is decided from
   the URL itself rather than from a flag, because a flag that disagrees with
   its href is a bug waiting and the href already knows.

   Order is the issue order and the tab order: 01 to 05.
   -------------------------------------------------------------------------- */

export type IssueKey = "healthy" | "friction" | "headroom" | "signal" | "bumper";

export type Issue = {
  key: IssueKey;
  no: "01" | "02" | "03" | "04" | "05";
  title: string;
  tag: string;
  year: string;
  /** a route on this site, or an absolute URL if the write-up lives elsewhere */
  href: string;
  accent: Accent;
  /** the running thing, not the write-up about it */
  live: { href: string; label: string };
  hook: string;
  /** the problem, what was built, where it landed */
  panels: [string, string, string];
};

/** true when the case study is published somewhere other than this site */
export const isOffsite = (href: string): boolean => /^https?:\/\//.test(href);

export const ISSUES: Issue[] = [
  {
    key: "healthy",
    no: "01",
    title: "Healthy Switch",
    /* NOT "DoorDash concept, unaffiliated": that is 38 characters of mono at
       0.14em and it broke after the separator on a 390 phone, leaving "React"
       alone on a line. The hook above already names the product, so the tag
       does not have to. */
    tag: "Concept, unaffiliated · React",
    year: "2026",
    href: "https://healthy-switch.vercel.app/case-study/",
    accent: "healthy",
    live: { href: "https://healthy-switch.vercel.app/", label: "OPEN PROTOTYPE" },
    hook: "Eat better on DoorDash without giving up the craving.",
    panels: [
      "Menus say vegetarian. They do not say what is in the food.",
      "One toggle. Every dish shows what is in it, and the swap comes off the restaurant's own menu.",
      "Six days, two of them spent on an idea that two restaurant visits killed.",
    ],
  },
  {
    key: "friction",
    no: "02",
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
    no: "03",
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
    no: "04",
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
    no: "05",
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
