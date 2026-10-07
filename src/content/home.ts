/* --------------------------------------------------------------------------
   HOMEPAGE CONTENT. Every word on the page, and nothing about its layout.

   Components render this; they never hold copy. Editing a sentence here must
   never mean touching a component (HOMEPAGE_REDESIGN.md §9).

   A FILL marker is a fact nobody has yet. A VERIFY marker is a fact that
   exists but needs Jay's confirmation. Both render as a dashed blue chip in
   development and both stop a production build, so neither can ship by
   accident. scripts/check-content.mjs is the gate, and it reads the markers
   literally, so this paragraph does not spell either of them out.
   -------------------------------------------------------------------------- */

export type FrameKind = "browser" | "phone";

export interface FlagshipProject {
  slug: "friction" | "headroom" | "signal" | "bumper";
  name: string;
  /** one sentence, at most 12 words */
  problem: string;
  role: string;
  stack: string;
  year: number;
  /** a real result with a number, or a FILL marker until there is one */
  outcome: string;
  caseStudyHref: `/${string}`;
  liveHref: string;
  liveLabel: string;
  /** the project's own colour, at a ratio that clears 4.5:1 on paper */
  accent: string;
  frame: FrameKind;
  /** shown in the spec state; must be true */
  specNote: string;
  /** only where a public JSON endpoint exists */
  liveDataUrl?: string;
}

export interface IndexItem {
  name: string;
  /** at most 70 characters */
  description: string;
  kind: string;
  href?: string;
  year: number | string;
}

export interface Fact {
  term: string;
  value: string;
}

export const site = {
  name: "Jay Harwani",
  email: "harwanijay9498@gmail.com",
  linkedin: "https://www.linkedin.com/in/jay-harwani",
  resumeHref: "/resume.pdf",
  /* No such file exists yet. The header and the contact section both link to
     it, and Cloudflare's SPA fallback would answer the request with the
     homepage rather than a 404, so the link would look like it worked. */
  resumeNote: "[FILL: public resume PDF at public/resume.pdf, with no phone number or street address]",
  showGitHub: false,
  githubHref: "", // set together with showGitHub
  status: "Open to product design roles",
  location: "Baltimore, open to relocation",
  nowEnabled: true,
} as const;

export const head = {
  title: "Jay Harwani, product designer who writes the front end",
  description:
    "I design products and build them in React and TypeScript. Four are live. MS in Human-Centered Computing, UMBC. Open to product design roles.",
  ogDescription: "I design products and build them in React and TypeScript. Four are live.",
  ogImageAlt: "Designs it. Then ships it. Jay Harwani, product designer.",
} as const;

export const hero = {
  /* Two lines, and the accessible name is the two of them with one space
     between: "Designs it. Then ships it." Line 1 is the outline, line 2 fills
     with ink. */
  line1: "Designs it.",
  line2: "Then ships it.",
  subline:
    "I'm Jay Harwani, a product designer who writes the front end. Every project below is live, so you can use the work instead of reading about it.",
  primary: { label: "See the work", href: "#work" },
  secondary: { label: "Email me" },
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "/resume.pdf", external: true },
  { label: "Contact", href: "#contact" },
] as const;

/* --------------------------------------------------------------------------
   THE ACCENTS ARE DERIVED, NOT PICKED.

   Each project already owns a colour, but three of the four were tuned for a
   dark ground and collapse on paper: teal #3FB9A6 reads 2.41:1, cyan #5FD3D8
   1.78:1, gold #E9C58B 1.64:1. All three fail the 4.5:1 that §4.1 requires of
   an accent used for text.

   So each one is darkened at CONSTANT OKLCH HUE, holding as much chroma as the
   gamut allows at that lightness, until it clears 4.5:1. The same operation
   run on Headroom's dark mint #5FD8A4 returns hue 163 at 4.51:1, against the
   #0A7A52 that was sampled by hand off the running app at hue 162 and 5.36:1 ,
   the method reproduces a human's choice at the same hue, which is the reason
   to trust it for the other three. Headroom therefore keeps its sampled value.

   Friction lands at hue 181 and Signal at hue 199. Eighteen degrees apart is
   close, and on paper both read as a dark teal. They are never on screen at
   the same time, since the showcase shows one frame at a time, so this is
   worth a look in Phase 4 rather than a guess now.
   -------------------------------------------------------------------------- */

/** array order is page order */
export const flagship: FlagshipProject[] = [
  {
    slug: "friction",
    name: "Friction",
    problem: "App stores bury the complaints that keep coming back.",
    role: "Design and build",
    stack: "Astro",
    year: 2026,
    outcome: "[FILL: one real result with a number]",
    caseStudyHref: "/friction",
    liveHref: "https://jayharwani.github.io/friction/",
    liveLabel: "Open Friction",
    accent: "#008676", // from teal #3FB9A6, hue 181, 4.51:1 on paper
    frame: "browser",
    specNote:
      "[VERIFY: Reads public App Store and Google Play reviews every week and groups the complaints that repeat.]",
  },
  {
    slug: "headroom",
    name: "Headroom",
    problem: "Your bank balance is not what you can spend.",
    role: "Design and build",
    stack: "React PWA, local-first",
    year: 2026,
    outcome: "[FILL: one real result with a number]",
    caseStudyHref: "/headroom",
    liveHref: "https://headroom-opal.vercel.app/",
    liveLabel: "Open the app",
    accent: "#0A7A52", // sampled off the running app, hue 162, 5.36:1 on paper
    frame: "phone",
    specNote: "Safe to spend is your balance minus the bills due before payday.",
  },
  {
    slug: "signal",
    name: "Signal",
    problem: "DMV tech and design events, live on one map.",
    role: "Design and build",
    stack: "MapLibre",
    year: 2026,
    outcome: "[FILL: one real result with a number]",
    caseStudyHref: "/signal",
    liveHref: "https://jayharwani.github.io/dmv-map/",
    liveLabel: "Open the map",
    accent: "#008489", // from cyan #5FD3D8, hue 199, 4.51:1 on paper
    frame: "browser",
    specNote: "[FILL: how Signal collects its events, and how often they update]",
  },
  {
    slug: "bumper",
    name: "Bumper",
    problem: "A pause before the impulse buy.",
    role: "Design and build",
    stack: "Chrome extension",
    year: 2026,
    outcome: "[FILL: one real result with a number]",
    caseStudyHref: "/bumper",
    /* the ?utm_source=item-share-cb the old index carried is Google's own
       share tracking, not part of the listing's address */
    liveHref: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp",
    liveLabel: "Install from the Chrome Web Store",
    accent: "#927139", // from gold #E9C58B, hue 79, 4.51:1 on paper
    frame: "browser",
    specNote: "Asks one question at checkout before an impulse buy.",
  },
];

/* ChronoWeave is not here. It was removed from the site in 84ce7fa, along with
   its route, its assets and its sitemap entry, and it stays removed. */
export const moreWork: IndexItem[] = [
  {
    name: "Intent",
    description: "One productivity app, built in React Native and in Kotlin.",
    kind: "[FILL: case study, repository or private]",
    year: "[FILL]",
  },
  {
    name: "Welspun GCC dashboards",
    description: "Enterprise dashboards for [FILL: team or function]. Walkthrough on request.",
    kind: "Private work",
    year: "[FILL]",
  },
  {
    name: "UMBC Cards Lab",
    description: "A surveillance dashboard for military robot operators.",
    kind: "[FILL: case study, repository or private]",
    year: "[FILL]",
  },
];

export const about = {
  heading: "From Ahmedabad to Baltimore.",
  paragraphs: [
    "[VERIFY: I'm a product designer with about three years of professional experience and an MS in Human-Centered Computing from UMBC. I work from research to shipped code.]",
    "[VERIFY: I care more about judgment than output. I look for the real problem, design the smallest version that solves it, and build it myself in React and TypeScript, using AI tools like Claude Code and Cursor to move faster. I'm looking for a product design or design engineering role on a team building something people need.]",
  ],
  facts: [
    { term: "Design", value: "Product, interaction, systems" },
    { term: "Build", value: "React, TypeScript, React Native" },
    { term: "Research", value: "MS in Human-Centered Computing, UMBC" },
    { term: "Based", value: "Baltimore, open to relocation" },
  ] satisfies Fact[],
  route: {
    from: "Ahmedabad",
    to: "Baltimore",
    /* great-circle distance, carried over from v4 where it was verified */
    km: 12382,
  },
} as const;

export const contact = {
  heading: "Tell me what you're building.",
  /* keep only if it is true */
  reply: "[VERIFY: I usually reply within a day.]",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  copiedAnnouncement: "Email address copied",
  clipboardFallback: "Press Cmd+C or Ctrl+C to copy",
} as const;

export const footer = {
  owner: "Jay Harwani, 2026",
  specMode: "Spec mode",
} as const;

export const notFound = {
  heading: "This page does not exist.",
  link: "Go to the homepage",
} as const;
