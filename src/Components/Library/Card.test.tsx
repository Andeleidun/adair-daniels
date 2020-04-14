import React from 'react';
import { render } from '@testing-library/react';
import Card from './Card';

describe('Header', () => {
  it('should render correctly', () => {
    const component = render(<Card />);
  });
});