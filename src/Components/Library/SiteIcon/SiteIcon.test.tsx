import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import SiteIcon, { SiteIconName } from './SiteIcon';

const iconNames: ReadonlyArray<SiteIconName> = [
  'code',
  'collapse',
  'close',
  'expand',
  'external',
  'home',
  'library',
  'menu',
  'portfolio',
  'robot',
  'stock',
  'table',
  'xkcd',
];

it('renders every supported icon as unique decorative vector artwork', () => {
  const { container, rerender } = render(
    <SiteIcon name={iconNames[0]} fontSize="small" />
  );
  const paths = new Set<string>();

  iconNames.forEach((name) => {
    rerender(<SiteIcon name={name} fontSize="small" />);
    const icon = container.querySelector('svg');
    const path = icon?.querySelector('path');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(icon).toHaveClass('MuiSvgIcon-fontSizeSmall');
    expect(path).toHaveAttribute('d');
    paths.add(path?.getAttribute('d') ?? '');
  });

  expect(paths.size).toBe(iconNames.length);
});
