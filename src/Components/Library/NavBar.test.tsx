import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './NavBar';

describe('NavBar', () => {
  it('should render correctly', () => {
    const component = render(<NavBar />);
  });
});