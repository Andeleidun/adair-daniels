import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Portfolio from './Portfolio';

jest.mock('react-swipeable-views', () =>
  ({ children }: { children: React.ReactNode }) => <div>{children}</div>
);
jest.mock('react-swipeable-views-utils', () => ({
  autoPlay: () => ({
    children,
    autoplay,
    interval,
    onChangeIndex,
  }: {
    children: React.ReactNode;
    autoplay: boolean;
    interval: number;
    onChangeIndex: (index: number) => void;
  }) => (
    <div
      data-testid="autoplay"
      data-autoplay={autoplay}
      data-interval={interval}
    >
      <button onClick={() => onChangeIndex(1)}>Mock index change</button>
      {children}
    </div>
  ),
}));

describe('Portfolio', () => {
  it('preserves controls, autoplay, current slide, and both wrap directions', () => {
    render(<Portfolio />);
    const carousel = screen.getByRole('region', {
      name: 'Portfolio screenshots',
    });
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    expect(
      screen.getByRole('heading', {
        name: 'Keto Mate - Home, Angular and Ionic App',
      })
    ).toBeVisible();
    expect(screen.getByTestId('autoplay')).toHaveAttribute(
      'data-interval',
      '10000'
    );
    expect(screen.getByTestId('autoplay')).toHaveAttribute(
      'data-autoplay',
      'true'
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Pause slideshow' })
    );
    expect(screen.getByTestId('autoplay')).toHaveAttribute(
      'data-autoplay',
      'false'
    );
    expect(
      screen.getByRole('button', { name: 'Resume slideshow' })
    ).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByRole('heading', { name: 'MyLifter - eCommerce Site' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByRole('heading', {
        name: 'Keto Mate - Home, Angular and Ionic App',
      })
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Mock index change' }));
    expect(screen.getByRole('heading', { name: 'Keto Mate - Store Listing' })).toBeVisible();
  });

  it('starts paused when reduced motion is preferred', () => {
    const matchMediaDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'matchMedia'
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });

    try {
      render(<Portfolio />);
      expect(screen.getByTestId('autoplay')).toHaveAttribute(
        'data-autoplay',
        'false'
      );
      expect(
        screen.getByRole('button', { name: 'Resume slideshow' })
      ).toBeVisible();
    } finally {
      if (matchMediaDescriptor) {
        Object.defineProperty(window, 'matchMedia', matchMediaDescriptor);
      } else {
        Reflect.deleteProperty(window, 'matchMedia');
      }
    }
  });
});
