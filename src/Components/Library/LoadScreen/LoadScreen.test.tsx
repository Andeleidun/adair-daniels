import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import LoadScreen from './LoadScreen';

it('renders a compact accessible loading status', () => {
  render(<LoadScreen />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading content');
});
