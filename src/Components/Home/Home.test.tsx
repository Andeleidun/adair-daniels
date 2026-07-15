import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders structured resume content and safe external links', () => {
    const { container } = render(<Home />);
    expect(
      screen.getByRole('heading', { name: 'Senior Frontend Engineer' })
    ).toBeVisible();
    expect(
      screen.getByText(/Senior Frontend Engineer with over 10 years/)
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Languages & Frameworks' })
    ).toBeVisible();
    expect(
      screen.getByRole('list', { name: 'Languages & Frameworks skills' })
    ).toBeVisible();
    expect(screen.getByText('TypeScript')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Accessibility' })
    ).toBeVisible();
    expect(container.querySelectorAll('.technical-skill-group')).toHaveLength(
      5
    );
    expect(screen.getByRole('img', { name: 'Amazon / AWS' })).toBeVisible();
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/adairdaniels/'
    );
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      container.querySelector('.highlights-card .MuiList-root')?.tagName
    ).toBe('DIV');
    expect(
      container.querySelector('.skills-card .MuiList-root')?.tagName
    ).toBe('DIV');
    expect(
      container.querySelector('.experience-card .MuiListItem-root')?.tagName
    ).toBe('DIV');
  });

  it('keeps Experience and Education navigation independent and wraps', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Adair Futures' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Portland State University' })
    ).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Next Experience' }));
    expect(
      screen.getByRole('heading', { name: 'Amazon / Collabera' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Portland State University' })
    ).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Previous Experience' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous Experience' }));
    expect(screen.getByRole('heading', { name: 'Server Sky' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Previous Education' }));
    expect(
      screen.getByRole('heading', { name: 'Continued Learning' })
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next Education' }));
    expect(
      screen.getByRole('heading', { name: 'Portland State University' })
    ).toBeVisible();
  });
});
