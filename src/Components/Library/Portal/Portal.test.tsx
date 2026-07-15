import React from 'react';
import { render, screen } from '@testing-library/react';
import Portal from './Portal';

it('preserves the portal source, title, and lazy loading', () => {
  render(
    <Portal
      url="https://andeleidun.github.io/robot-arena/"
      title="Robot Battle Arena"
    />
  );
  const frame = screen.getByTitle('Robot Battle Arena');
  expect(frame).toHaveAttribute(
    'src',
    'https://andeleidun.github.io/robot-arena/'
  );
  expect(frame).toHaveAttribute('loading', 'lazy');
});
