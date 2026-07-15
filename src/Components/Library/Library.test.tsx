import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Library from './Library';

vi.mock('./App.codeview', () => ({ default: 'ApplicationShell source' }));
vi.mock('./Card/Card.codeview', () => ({ default: 'CardAction source' }));
vi.mock('./Header/Header.codeview', () => ({ default: 'HeaderProps source' }));
vi.mock('./NavBar/NavBar.codeview', () => ({ default: 'NavBarProps source' }));

describe('Library', () => {
  it('defaults to App source and selects every supported component', () => {
    render(<Library />);
    const source = screen.getByLabelText('Source code');
    expect(source.textContent).toContain('ApplicationShell');

    fireEvent.click(screen.getByRole('button', { name: 'Card' }));
    expect(source.textContent).toContain('CardAction');
    fireEvent.click(screen.getByRole('button', { name: 'Header' }));
    expect(source.textContent).toContain('HeaderProps');
    fireEvent.click(screen.getByRole('button', { name: 'Nav Bar' }));
    expect(source.textContent).toContain('NavBarProps');
  });
});
