import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadScreen from './LoadScreen';

it('renders an accessible loading image', () => {
  render(<LoadScreen />);
  expect(screen.getByRole('img', { name: 'Loading Logo' })).toBeVisible();
});
