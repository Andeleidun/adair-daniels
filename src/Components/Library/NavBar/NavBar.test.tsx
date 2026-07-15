import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

describe('NavBar', () => {
  it('renders routes, current state, and callbacks', () => {
    const navigate = jest.fn();
    const toggleCode = jest.fn();
    render(
      <MemoryRouter>
        <NavBar
          pages={[
            { text: 'Home', route: '/', icon: 'home' },
            { text: 'Portfolio', route: '/portfolio', icon: 'compare' },
          ]}
          activeRoute="/portfolio"
          navClick={navigate}
          codeView={false}
          toggleCodeView={toggleCode}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'id',
      'app-navigation'
    );
    const portfolio = screen.getByRole('link', { name: 'Portfolio' });
    expect(portfolio).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(portfolio.parentElement?.tagName).toBe('LI');
    expect(screen.queryByRole('button', { name: 'Portfolio' })).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Code View' }));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(toggleCode).toHaveBeenCalledTimes(1);
  });
});
