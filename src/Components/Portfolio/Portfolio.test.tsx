import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Portfolio, { portfolioProjects } from './Portfolio';

describe('Portfolio', () => {
  it('groups all existing screenshots into manually controlled projects', () => {
    render(<Portfolio />);
    expect(portfolioProjects).toHaveLength(5);
    expect(
      portfolioProjects.reduce(
        (count, project) => count + project.images.length,
        0
      )
    ).toBe(18);
    expect(screen.getByRole('heading', { name: 'Keto Mate' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Metric Media' })).toBeVisible();
    expect(screen.queryByText(/Explore project screenshots/)).toBeNull();
    expect(screen.queryByText(/Pause slideshow/i)).toBeNull();

    const ketoMate = screen
      .getByRole('heading', { name: 'Keto Mate' })
      .closest('article');
    expect(ketoMate).not.toBeNull();
    if (!ketoMate) return;
    fireEvent.click(
      within(ketoMate).getByRole('button', { name: 'Show Navigation Menu' })
    );
    expect(
      within(ketoMate).getByRole('button', { name: 'Show Navigation Menu' })
    ).toHaveAttribute('aria-pressed', 'true');
    expect(within(ketoMate).getByText('Navigation Menu')).toBeVisible();

    fireEvent.click(
      within(ketoMate).getByRole('button', {
        name: 'Previous Keto Mate image',
      })
    );
    expect(
      within(ketoMate).getByText('Home, Angular and Ionic App')
    ).toBeVisible();
  });

  it('opens a focus-managed full-size dialog and closes it', async () => {
    render(<Portfolio />);
    const openImage = screen.getByRole('button', {
      name: 'Open Home, Angular and Ionic App full size',
    });
    expect(openImage).toHaveAccessibleDescription(/Keto Mate's home screen/);
    fireEvent.click(openImage);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'Keto Mate: Home, Angular and Ionic App',
      })
    ).toBeVisible();
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'Home, Angular and Ionic App, full-size image 1 of 9'
    );
    fireEvent.click(
      within(dialog).getByRole('button', {
        name: 'Next Keto Mate full-size image',
      })
    );
    expect(
      within(dialog).getByRole('heading', {
        name: 'Keto Mate: Navigation Menu',
      })
    ).toBeVisible();
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'Navigation Menu, full-size image 2 of 9'
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Close full-size image' })
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
