import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import PortfolioViewer from './Portfolio.codeview';

vi.mock('./Portfolio.tsx?raw', () => ({
  default: 'CURRENT PORTFOLIO EXECUTABLE SOURCE',
}));

it('renders the raw executable Portfolio source', () => {
  render(<PortfolioViewer />);

  expect(screen.getByLabelText('Source code')).toHaveTextContent(
    'CURRENT PORTFOLIO EXECUTABLE SOURCE'
  );
});
