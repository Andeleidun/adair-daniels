import React from 'react';
import { render } from '@testing-library/react';
import Portfolio from './Portfolio';

describe('Portfolio', () => {
  it('should render correctly', () => {
    const component = render(<Portfolio />);
  });
});