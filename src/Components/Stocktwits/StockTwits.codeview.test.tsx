import React from 'react';
import { render, screen } from '@testing-library/react';
import StockViewer from './StockTwits.codeview';

jest.mock('!!raw-loader!./Stocktwits', () => 'STOCK COMPONENT SOURCE', {
  virtual: true,
});
jest.mock('!!raw-loader!./stockTwitsApi', () => 'STOCK ADAPTER SOURCE', {
  virtual: true,
});
jest.mock(
  '!!raw-loader!../../Services/remoteData',
  () => 'SHARED TRANSPORT SOURCE',
  { virtual: true }
);

it('includes the StockTwits component, adapter, and shared transport', () => {
  render(<StockViewer />);
  const source = screen.getByLabelText('Source code');

  expect(source).toHaveTextContent('// StockTwits component');
  expect(source).toHaveTextContent('STOCK COMPONENT SOURCE');
  expect(source).toHaveTextContent('STOCK ADAPTER SOURCE');
  expect(source).toHaveTextContent('SHARED TRANSPORT SOURCE');
});
