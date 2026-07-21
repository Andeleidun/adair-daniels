import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Home from './Home';

describe('Home', () => {
  it('renders complete structured resume content and safe external links', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(container.querySelector('.app-home')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Senior Frontend Engineer' })
    ).toBeVisible();
    expect(screen.getByRole('img', { name: 'Adair Daniels' })).toBeVisible();
    expect(
      screen.getByText(/Senior Frontend Engineer with over 10 years/)
    ).toBeVisible();
    expect(
      screen.getByRole('list', { name: 'Languages & Frameworks skills' })
    ).toBeVisible();
    expect(container.querySelectorAll('.skill-group')).toHaveLength(5);
    expect(
      container.querySelectorAll('.skill-group .MuiChip-filled').length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.skill-group .MuiChip-outlined')
    ).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'Amazon / AWS' })).toBeVisible();
    const professionalProfile = screen.getByRole('region', {
      name: 'Senior Frontend Engineer',
    });
    const profileLinks = within(professionalProfile).getAllByRole('link');
    expect(profileLinks).toHaveLength(2);
    expect(profileLinks.map((link) => link.textContent)).toEqual([
      'LinkedIn (opens in a new tab)',
      'GitHub (opens in a new tab)',
    ]);
    const linkedIn = within(professionalProfile).getByRole('link', {
      name: /LinkedIn/,
    });
    expect(linkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/adairdaniels/'
    );
    expect(linkedIn).toHaveAttribute('target', '_blank');
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      within(professionalProfile).getByRole('link', { name: /GitHub/ })
    ).toHaveAttribute('href', 'https://github.com/andeleidun');
    expect(
      container.querySelectorAll('.experience-timeline details')
    ).toHaveLength(10);
    expect(container.querySelectorAll('.education-card')).toHaveLength(3);
    expect(screen.getByText('Mercor Intelligence')).toBeVisible();
    expect(screen.getByText('AI Code Evaluation Consultant')).toBeVisible();
    expect(screen.getAllByText('Adair Futures').length).toBeGreaterThan(0);
    expect(
      screen.queryByText('Consulting and technical leadership')
    ).toBeNull();
    expect(
      screen.queryByRole('link', { name: 'View selected work' })
    ).toBeNull();
    expect(screen.getByText('Server Sky')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Portland State University' })
    ).toBeVisible();
  });

  it('defaults the newest roles open and controls all disclosures', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(container.querySelectorAll('details[open]')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(container.querySelectorAll('details[open]')).toHaveLength(10);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
  });
});
