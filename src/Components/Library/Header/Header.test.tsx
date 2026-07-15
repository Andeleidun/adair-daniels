import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('reports menu state and toggles available Code View', () => {
    const toggleMenu = vi.fn();
    const toggleCode = vi.fn();
    render(
      <Header
        currentPage={{ title: 'Portfolio', codeView: <div /> }}
        codeView={false}
        menuOpen={false}
        onClick={toggleMenu}
        toggleCodeView={toggleCode}
      />
    );

    const menu = screen.getByRole('button', { name: 'menu' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveAttribute('aria-controls', 'app-navigation');
    fireEvent.click(menu);
    fireEvent.click(screen.getByRole('switch', { name: 'Code View' }));
    expect(toggleMenu).toHaveBeenCalledTimes(1);
    expect(toggleCode).toHaveBeenCalledTimes(1);
  });

  it('hides Code View when the page does not provide it', () => {
    render(
      <Header
        currentPage={{ title: 'Plain page' }}
        codeView={false}
        menuOpen
        onClick={vi.fn()}
        toggleCodeView={vi.fn()}
      />
    );
    expect(screen.queryByRole('switch', { name: 'Code View' })).toBeNull();
  });
});
