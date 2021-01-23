import React from 'react';
import { render } from '@testing-library/react';
import Library from './Library';

describe('Header', () => {
  it('should render correctly', () => {
    const component = render(<Library />);
  });
});