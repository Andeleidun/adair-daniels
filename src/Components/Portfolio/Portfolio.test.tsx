import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Portfolio from './Portfolio';

describe('Portfolio', () => {
  it('preserves controls, current slide, swiping, and both wrap directions', () => {
    const { container } = render(<Portfolio />);
    const carousel = screen.getByRole('region', {
      name: 'Portfolio screenshots',
    });
    const slides = container.querySelector('.portfolio-slides');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    expect(
      screen.getByRole('heading', {
        name: 'Keto Mate - Home, Angular and Ionic App',
      })
    ).toBeVisible();
    expect(slides).toHaveAttribute('data-interval', '10000');
    expect(slides).toHaveAttribute('data-autoplay', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }));
    expect(slides).toHaveAttribute('data-autoplay', 'false');
    expect(
      screen.getByRole('button', { name: 'Resume slideshow' })
    ).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(
      screen.getByRole('heading', { name: 'MyLifter - eCommerce Site' })
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.getByRole('heading', {
        name: 'Keto Mate - Home, Angular and Ionic App',
      })
    ).toBeVisible();
    expect(slides).not.toBeNull();
    if (slides) {
      fireEvent.touchStart(slides, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 100 }] });
    }
    expect(
      screen.getByRole('heading', { name: 'Keto Mate - Store Listing' })
    ).toBeVisible();
  });

  it('advances once after the ten-second autoplay interval', () => {
    vi.useFakeTimers();
    render(<Portfolio />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(
      screen.getByRole('heading', { name: 'Keto Mate - Store Listing' })
    ).toBeVisible();
  });

  it('starts paused when reduced motion is preferred', () => {
    const matchMediaDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'matchMedia'
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    try {
      render(<Portfolio />);
      expect(document.querySelector('.portfolio-slides')).toHaveAttribute(
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
