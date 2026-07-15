import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import StockViewer from './StockTwits.codeview';

vi.mock('./Stocktwits.tsx?raw', () => ({
  default: 'STOCK COMPONENT SOURCE',
}));
vi.mock('./stockTwitsApi.ts?raw', () => ({
  default: 'STOCK ADAPTER SOURCE',
}));
vi.mock('../../Services/remoteData.ts?raw', () => ({
  default: 'SHARED TRANSPORT SOURCE',
}));

it('includes the StockTwits component, adapter, and shared transport', () => {
  render(<StockViewer />);
  const source = screen.getByLabelText('Source code');

  expect(source).toHaveTextContent('// StockTwits component');
  expect(source).toHaveTextContent('STOCK COMPONENT SOURCE');
  expect(source).toHaveTextContent('STOCK ADAPTER SOURCE');
  expect(source).toHaveTextContent('SHARED TRANSPORT SOURCE');
});
