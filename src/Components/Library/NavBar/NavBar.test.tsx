import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import NavBar from './NavBar';

describe('NavBar', () => {
  it('renders routes, current state, and callbacks', () => {
    const navigate = vi.fn();
    const toggleCode = vi.fn();
    render(
      <MemoryRouter>
        <NavBar
          pages={[
            {
              text: 'Home',
              route: '/',
              icon: 'home',
              navGroup: 'profile',
            },
            {
              text: 'Portfolio',
              route: '/portfolio',
              icon: 'portfolio',
              navGroup: 'profile',
            },
          ]}
          activeRoute="/portfolio"
          navClick={navigate}
          codeView={false}
          codeViewAvailable
          toggleCodeView={toggleCode}
        />
      </MemoryRouter>
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    });
    expect(navigation).toHaveAttribute('id', 'app-navigation');
    expect(screen.getByRole('list')).toContainElement(
      screen.getByRole('link', { name: 'Home' })
    );
    const portfolio = screen.getByRole('link', { name: 'Portfolio' });
    expect(portfolio).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('button', { name: 'Portfolio' })).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Code View' }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(toggleCode).toHaveBeenCalledTimes(1);
  });
});
