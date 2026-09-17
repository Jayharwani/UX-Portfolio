export type Project = {
  key: string;
  index: string;
  title: string;
  tag: string;
  href: string;
  /** rgb triple, drives --accent and the canvas lights */
  accent: [number, number, number];
};

export const PROJECTS: Project[] = [
  { key: 'headroom',    index: '01', title: 'Headroom',    tag: 'Local-first finance · React',  href: '/headroom',    accent: [95, 216, 164] },
  { key: 'signal',      index: '02', title: 'Signal',      tag: 'Live event map · MapLibre',    href: '/signal',      accent: [95, 211, 216] },
  { key: 'chronoweave', index: '03', title: 'ChronoWeave', tag: 'ADHD time blindness · Mobile', href: '/chronoweave', accent: [139, 123, 232] },
  { key: 'bumper',      index: '04', title: 'Bumper',      tag: 'Behavioural · Extension',      href: '/bumper',      accent: [233, 197, 139] },
];

export const CONTACT = {
  email: 'harwanijay9498@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jay-harwani',
  linkedinLabel: 'in/jay-harwani',
};

export const CREDITS: [string, string][] = [
  ['DESIGN',   'Product, interaction, systems'],
  ['BUILD',    'React, TypeScript, React Native'],
  ['RESEARCH', 'MS Human-Centered Computing'],
  ['BASED',    'Baltimore, will relocate'],
];

export const ROUTE = {
  from: 'Ahmedabad',
  to: 'Baltimore',
  /** verified great-circle distance, km */
  km: 12382,
  path: 'M 96 336 C 236 268, 372 176, 664 128',
  viewBox: { w: 760, h: 420 },
};
