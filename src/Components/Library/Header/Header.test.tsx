import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('reports menu state and toggles available Code View', () => {
    const toggleMenu = vi.fn();
    const toggleCode = vi.fn();
    render(
      <MemoryRouter>
        <Header
          codeView={false}
          codeViewAvailable
          menuOpen={false}
          onClick={toggleMenu}
          toggleCodeView={toggleCode}
        />
      </MemoryRouter>
    );

    const menu = screen.getByRole('button', { name: 'Open navigation' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveAttribute('aria-controls', 'app-navigation');
    const brand = screen.getByRole('link', { name: 'Adair Daniels home' });
    expect(brand).toHaveAttribute('href', '/');
    expect(brand).toHaveTextContent('Adair Daniels');
    const monogram = brand.querySelector('img');
    expect(monogram).toHaveAttribute('src', '/ad-monogram.svg');
    expect(monogram).toHaveAttribute('alt', '');
    expect(monogram).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(menu);
    fireEvent.click(screen.getByRole('switch', { name: 'Code View' }));
    expect(toggleMenu).toHaveBeenCalledTimes(1);
    expect(toggleCode).toHaveBeenCalledTimes(1);
  });

  it('hides Code View when the page does not provide it', () => {
    render(
      <MemoryRouter>
        <Header
          codeView={false}
          codeViewAvailable={false}
          menuOpen
          onClick={vi.fn()}
          toggleCodeView={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.queryByRole('switch', { name: 'Code View' })).toBeNull();
  });
});
