import React from 'react';
import { render, screen } from '@testing-library/react';
import PortfolioViewer from './Portfolio.codeview';

jest.mock(
  '!!raw-loader!./Portfolio',
  () => 'CURRENT PORTFOLIO EXECUTABLE SOURCE',
  { virtual: true }
);

it('renders the raw executable Portfolio source', () => {
  render(<PortfolioViewer />);

  expect(screen.getByLabelText('Source code')).toHaveTextContent(
    'CURRENT PORTFOLIO EXECUTABLE SOURCE'
  );
});
