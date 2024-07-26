import React from 'react';
import { render } from '@testing-library/react';
import Portal from './Portal';

describe('Portal', () => {
  it('should render correctly', () => {
    const component = render(
      <Portal
        url="https://andeleidun.github.io/robot-arena/"
        title="Robot Battle Arena"
      />
    );
  });
});
