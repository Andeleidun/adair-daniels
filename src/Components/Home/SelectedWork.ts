export interface SelectedWorkItem {
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly technologies: ReadonlyArray<string>;
  readonly href?: string;
  readonly linkLabel?: string;
}

export const selectedWork: ReadonlyArray<SelectedWorkItem> = [
  {
    title: 'Valgaron World Codex',
    eyebrow: 'Complex React architecture',
    description:
      'A React 19 and TypeScript web/mobile workspace built around shared packages, complex editing workflows, undo/redo state, PWA verification, browser smoke tests, performance checks, and Android end-to-end testing.',
    technologies: [
      'React 19',
      'TypeScript',
      'Shared packages',
      'PWA',
      'Mobile E2E',
    ],
    href: 'https://github.com/Andeleidun/valgaron',
    linkLabel: 'View Valgaron on GitHub',
  },
  {
    title: 'Screen Reader Status Message',
    eyebrow: 'Reusable accessibility primitive',
    description:
      'A focused React pattern for announcing live application updates to assistive technology, reflecting the same accessibility concerns I addressed while working on reactive AWS QuickSight experiences.',
    technologies: ['React', 'Accessibility', 'Live regions', 'Vitest'],
    href: 'https://github.com/Andeleidun/statusMessage',
    linkLabel: 'View statusMessage on GitHub',
  },
  {
    title: 'Keto Mate React Native',
    eyebrow: 'Current mobile product modernization',
    description:
      'A private React Native and Expo modernization of a previously published Google Play application, with typed navigation, local persistence, accessibility checks, automated Android builds, and release-asset validation.',
    technologies: [
      'React Native',
      'Expo',
      'TypeScript',
      'Accessibility',
      'EAS',
    ],
  },
];
