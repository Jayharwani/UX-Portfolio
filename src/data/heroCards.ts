/**
 * Hero product card: content for the four shipped products.
 *
 * Layout and behaviour are specified in HERO_REDESIGN_SPEC.md (sections 7 to 11).
 * This file holds the copy, the code text and the overlay targets, so the
 * component stays free of hard-coded content.
 *
 * Coordinates are base card pixels (card is 460 x 624, content padding 34).
 *
 * SAMPLE DATA: fields listed in `sample` are illustrative. Jay confirms or
 * replaces them before shipping. Everything else comes from the live site's
 * own copy (the project list in the home page code).
 */

export type ProductKey = 'headroom' | 'friction' | 'bumper';
export type Region = 'number' | 'module' | 'list' | 'cta';

/** Site accent tokens on .v2.rs. Never hard-code the hex in components. */
export const ACCENT_VAR: Record<ProductKey, string> = {
  headroom: 'var(--accent-headroom)', // #8ED09C
  friction: 'var(--accent-friction)', // #F7A792
  bumper: 'var(--accent-bumper)', //     #E0B771
};

/** The same accents as hex, for canvas and WebGL code that cannot read CSS variables. */
export const ACCENT_HEX: Record<ProductKey, string> = {
  headroom: '#8ED09C',
  friction: '#F7A792',
  bumper: '#E0B771',
};

/* A DOT IS ANY OF THE KEYS OR THE BLUE. Headroom's middle row is blue, and
   it is the design overlay's blue rather than a project's — the three dots in
   that list only have to be three different colours, and two of them being
   the same would make the list look like it had two of something. */
export type Dot = ProductKey | 'paper' | 'select';

export interface Row {
  dot: Dot;
  /** 0 to 1, multiplies the dot colour */
  dotAlpha?: number;
  name: string;
  /** small mono text after the name, e.g. a date or time */
  meta?: string;
  /** right-aligned value, tabular figures */
  value: string;
}

export type Module =
  | { kind: 'progress'; left: string; right: string; strong?: string; value: number }
  | { kind: 'funnel'; steps: { label: string; width: number; alpha: number }[] };

export interface HeroCard {
  key: ProductKey;
  name: string;
  /** frame label above the card, in the card plane */
  frame: string;
  /** icon strokes, 20 x 20 viewBox, stroked in var(--void), width 2.4, round caps and joins */
  icon: string[];
  pill: string;
  label: string;
  number: { prefix?: string; value: number };
  sub: string;
  module: Module;
  /** top of the list band; 384 unless the module is taller */
  listTop: number;
  list?: Row[];
  /** Bumper only: a question card in place of the list */
  question?: { text: string; note: string };
  cta: { primary: string; secondary?: string };
  /** design-tool overlay target, base card pixels */
  select: { box: [number, number, number, number]; name: string; size: string; sizeAt: 'below' | 'top-right' };
  /** one line for screen readers */
  srLabel: string;
  /** lens snippets, lens-relative (section 8.2). Max 22 characters per line, max 8 lines. */
  snippets: Record<Region, string>;
  /** full listing for the code face, card-registered (section 7.5). Max 44 characters per line, max 21 lines. */
  listing: string;
  /** which parts are sample data that Jay must confirm */
  sample: string[];
}

export const HERO_CARDS: HeroCard[] = [
  {
    key: 'headroom',
    name: 'Headroom',
    frame: 'Headroom / Home · 460 × 624',
    icon: ['M3 14A7 7 0 0 1 17 14', 'M10 14L13.6 8.6'],
    pill: 'TODAY ▾',
    label: 'SAFE TO SPEND TODAY',
    number: { prefix: '$', value: 142 },
    sub: 'after rent, bills and your savings goal',
    module: { kind: 'progress', left: 'This week', strong: '$310', right: 'left of $560', value: 0.55 },
    listTop: 384,
    list: [
      { dot: 'friction', name: 'Rent', meta: 'NOV 1', value: '−$1,250' },
      { dot: 'select', name: 'Phone bill', meta: 'NOV 3', value: '−$45' },
      { dot: 'bumper', name: 'Savings goal', meta: 'FRI', value: '−$40' },
    ],
    cta: { primary: 'Can I spend this?' },
    select: { box: [34, 540, 392, 56], name: 'Button / Primary', size: '392 × 56', sizeAt: 'below' },
    srLabel: 'Preview of Headroom, one of four shipped products. It shows one number: what is safe to spend today.',
    snippets: {
      number: [
        '  // one clear thing',
        '<SafeToSpend',
        '  period="today"',
        '  amount={142}',
        '  after={["rent",',
        '    "bills", "goal"]}',
        '/>',
        '<WeekBar left={310} />',
      ].join('\n'),
      module: [
        '  // this week',
        '<WeekBar',
        '  left={310}',
        '  of={560}',
        '/>',
      ].join('\n'),
      list: [
        '  // what is coming',
        '<List>',
        '  {bills.map(b =>',
        '    <BillRow {...b} />',
        '  )}',
        '</List>',
      ].join('\n'),
      cta: [
        '  // the question',
        '<Button',
        '  onClick={check}',
        '>',
        '  Can I spend this?',
        '</Button>',
      ].join('\n'),
    },
    listing: [
      'export function Home() {',
      '  const { safe, week, bills } = useBudget();',
      '  return (',
      '    <Screen title="Headroom">',
      '      <SafeToSpend',
      '        period="today"',
      '        amount={safe}  // 142',
      '        after={["rent", "bills", "goal"]}',
      '      />',
      '      <WeekBar left={week.left} />',
      '      <List>',
      '        {bills.map(b =>',
      '          <BillRow {...b} />',
      '        )}',
      '      </List>',
      '      <Button onClick={check}>',
      '        Can I spend this?',
      '      </Button>',
      '    </Screen>',
      '  );',
      '}',
    ].join('\n'),
    sample: ['number', 'module', 'list', 'listing'],
  },
  {
    key: 'friction',
    name: 'Friction',
    frame: 'Friction / Patterns · 460 × 624',
    icon: ['M3 4H17L11.5 10.5V16L8.5 14.5V10.5Z'],
    pill: 'THIS WEEK ▾',
    label: 'COMPLAINTS THAT REPEAT',
    number: { value: 150 },
    sub: 'out of 10,000 app reviews this week',
    module: {
      kind: 'funnel',
      steps: [
        { label: '10,000 REVIEWS', width: 1, alpha: 0.35 },
        { label: '3,000', width: 0.62, alpha: 0.6 },
        { label: '150', width: 0.24, alpha: 1 },
      ],
    },
    listTop: 400,
    list: [
      { dot: 'friction', dotAlpha: 1, name: 'Can’t cancel the subscription', value: '412' },
      { dot: 'friction', dotAlpha: 0.7, name: 'Login loops after update', value: '318' },
      { dot: 'friction', dotAlpha: 0.45, name: 'Ads between every level', value: '201' },
    ],
    cta: { primary: 'See the patterns' },
    select: { box: [34, 400, 392, 46], name: 'List item / Pattern', size: '392 × 46', sizeAt: 'top-right' },
    srLabel: 'Preview of Friction, one of four shipped products. It sifts 10,000 app reviews down to the complaints that repeat.',
    snippets: {
      number: [
        '  // signal, not noise',
        '<RepeatCount',
        '  from={10_000}',
        '  to={150}',
        '  window="week"',
        '/>',
        '<Funnel steps={3} />',
      ].join('\n'),
      module: [
        '  // the funnel',
        '<Funnel steps={[',
        '  10_000,',
        '  3_000,',
        '  150,',
        ']} />',
      ].join('\n'),
      list: [
        '  // what repeats',
        '{repeats.map(r =>',
        '  <PatternRow',
        '    text={r.text}',
        '    count={r.count}',
        '  />',
        ')}',
      ].join('\n'),
      cta: [
        '  // the evidence',
        '<a class="cta"',
        '  href="/patterns">',
        '  See the patterns',
        '</a>',
      ].join('\n'),
    },
    listing: [
      '---',
      'import { getReviews } from "../lib/store";',
      'const reviews = await getReviews("week");',
      'const repeats = cluster(reviews)',
      '  .filter(c => c.count > 1);     // 150',
      '---',
      '<Screen title="Friction">',
      '  <RepeatCount',
      '    of={reviews.length}',
      '    count={repeats.length}',
      '  />',
      '  <Funnel steps={[10_000, 3_000, 150]} />',
      '  <ul class="patterns">',
      '    {repeats.slice(0, 3).map(r =>',
      '      <PatternRow {...r} />',
      '    )}',
      '  </ul>',
      '  <a class="cta" href="/patterns">',
      '    See the patterns',
      '  </a>',
      '</Screen>',
    ].join('\n'),
    sample: ['list', 'listing'],
  },
  {
    key: 'bumper',
    name: 'Bumper',
    frame: 'Bumper / Checkout · 460 × 624',
    icon: ['M10 2.5L16 5V10C16 13.6 13.4 16.4 10 17.5C6.6 16.4 4 13.6 4 10V5Z'],
    pill: 'AT CHECKOUT',
    label: 'BEFORE YOU BUY',
    number: { prefix: '$', value: 279 },
    sub: 'reads as 45% closer to Tokyo',
    module: { kind: 'progress', left: 'Tokyo trip', right: '45%', value: 0.45 },
    listTop: 384,
    question: { text: 'Worth 45% of Tokyo?', note: 'ONE QUESTION, SCALED TO THE AMOUNT' },
    cta: { primary: 'Not now', secondary: 'Buy it' },
    select: { box: [34, 540, 232, 56], name: 'Button / Primary', size: '232 × 56', sizeAt: 'below' },
    srLabel: 'Preview of Bumper, one of four shipped products. It asks one question before checkout, scaled to the amount.',
    snippets: {
      number: [
        '  // one question',
        'showPrompt({',
        '  amount: 279,',
        '  line: closer(',
        '    279, goal),',
        '  scale: "amount",',
        '});',
      ].join('\n'),
      module: [
        '  // no guilt',
        'renderGoal({',
        '  name: "Tokyo",',
        '  share: 0.45,',
        '});',
      ].join('\n'),
      list: [
        '  // scaled to $279',
        'const question =',
        '  scaleQuestion(279);',
        'ask(question);',
      ].join('\n'),
      cta: [
        '  // no blocking',
        'actions: [',
        '  "Not now",',
        '  "Buy it",',
        '],',
      ].join('\n'),
    },
    listing: [
      'export async function atCheckout() {',
      '  const goal = await storage.get("goal");',
      '  const total = readCartTotal(document);',
      '  if (total < goal.minimum) return;',
      '',
      '  showPrompt({',
      '    amount: total,                 // 279',
      '    line: closer(total, goal),     // 45%',
      '    progress: total / goal.amount,',
      '    question: scaleQuestion(total),',
      '    actions: [',
      '      { label: "Not now", primary: true },',
      '      { label: "Buy it" },',
      '    ],',
      '  });',
      '}',
    ].join('\n'),
    sample: ['question', 'cta', 'listing'],
  },
];

/* -------------------------------------------------------------------------- */
/* Syntax colouring                                                            */
/* -------------------------------------------------------------------------- */

export type Tok = 'kw' | 'tg' | 'at' | 'st' | 'nu' | 'pu' | 'cm' | 'id' | 'sp';

/**
 * Token colours, all from the locked palette (section 5.1).
 * `sp` is whitespace and renders as plain text.
 */
export const TOKEN_COLOR: Record<Exclude<Tok, 'sp'>, string> = {
  kw: 'var(--accent-friction)', //  keyword
  tg: 'var(--accent-headroom)', //  component or element tag
  at: 'var(--accent-bumper)', //    attribute or object key
  st: 'var(--accent-healthy)', //   string
  nu: 'var(--select)', //           number
  pu: 'rgb(238 241 245 / .42)', //  punctuation
  cm: 'rgb(238 241 245 / .34)', //  comment
  id: 'rgb(238 241 245 / .82)', //  plain identifier
};

const KEYWORD = /^(?:export|function|async|const|let|return|await|if|import|from|new|true|false)\b/;

/** Splits one line of code into coloured tokens. Small on purpose: no highlighting library. */
export function tokenize(line: string): [Tok, string][] {
  const out: [Tok, string][] = [];
  const push = (t: Tok, s: string) => {
    const last = out[out.length - 1];
    if (last && last[0] === t) last[1] += s;
    else out.push([t, s]);
  };
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    let m: RegExpMatchArray | null;
    if ((m = rest.match(/^\/\/.*/))) {
      push('cm', m[0]);
      break;
    }
    if ((m = rest.match(/^\s+/))) push('sp', m[0]);
    else if ((m = rest.match(/^(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/))) push('st', m[0]);
    else if ((m = rest.match(/^\d[\d_]*(?:\.\d+)?/))) push('nu', m[0]);
    else if ((m = rest.match(/^(<\/?)([A-Za-z][\w.]*)/))) {
      push('pu', m[1]);
      push('tg', m[2]);
    } else if ((m = rest.match(KEYWORD))) push('kw', m[0]);
    else if ((m = rest.match(/^[A-Za-z_$][\w$-]*(?==)/))) push('at', m[0]); // JSX attribute
    else if ((m = rest.match(/^[A-Za-z_$][\w$]*(?=:)/))) push('at', m[0]); //  object key
    else if ((m = rest.match(/^[A-Za-z_$][\w$]*/))) push('id', m[0]);
    else push('pu', rest[0]);
    i += m ? m[0].length : 1;
  }
  return out;
}

/** Number of characters per line and lines per block allowed by the layout. */
export const LIMITS = {
  snippet: { cols: 22, rows: 8 },
  listing: { cols: 44, rows: 21 },
} as const;
