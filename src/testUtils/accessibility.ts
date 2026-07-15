import axe from 'axe-core';
import { expect } from 'vitest';

export const expectNoAccessibilityViolations = async (
  container: HTMLElement
): Promise<void> => {
  const results = await axe.run(container, {
    iframes: false,
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
    rules: {
      // jsdom does not perform layout, so contrast remains a rendered check.
      'color-contrast': { enabled: false },
    },
  });
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(' ')),
  }));
  expect(violations).toEqual([]);
};
