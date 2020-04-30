import React from 'react';
import { render } from '@testing-library/react';
import StockTwits from './Stocktwits';

describe('StockTwits', () => {
  it('should render correctly', () => {
    const component = render(<StockTwits />);
  });
});