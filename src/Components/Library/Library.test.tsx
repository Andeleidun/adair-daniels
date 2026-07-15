import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Library from './Library';

jest.mock('./App.codeview', () => 'ApplicationShell source');
jest.mock('./Card/Card.codeview', () => 'CardAction source');
jest.mock('./Header/Header.codeview', () => 'HeaderProps source');
jest.mock('./NavBar/NavBar.codeview', () => 'NavBarProps source');

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
