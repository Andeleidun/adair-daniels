import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Library from './Library';

vi.mock('./App.codeview', () => ({ default: 'ApplicationShell source' }));
vi.mock('./Card/Card.codeview', () => ({ default: 'CardAction source' }));
vi.mock('./Header/Header.codeview', () => ({ default: 'HeaderProps source' }));
vi.mock('./NavBar/NavBar.codeview', () => ({ default: 'NavBarProps source' }));
vi.mock('./SiteIcon/SiteIcon.codeview', () => ({
  default: 'SiteIconName source',
}));

describe('Library', () => {
  it('defaults to App source and selects every shared component', () => {
    const { container } = render(<Library />);
    expect(screen.getByLabelText('App shell source code')).toHaveTextContent(
      'ApplicationShell'
    );
    expect(screen.getByRole('tab', { name: 'App shell' })).toHaveAttribute(
      'aria-controls',
      'component-panel-0'
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'component-tab-0'
    );
    screen.getAllByRole('tab').forEach((tab) => {
      const panelId = tab.getAttribute('aria-controls');
      expect(panelId).not.toBeNull();
      expect(container.querySelector(`#${panelId}`)).not.toBeNull();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Card' }));
    expect(screen.getByLabelText('Card source code')).toHaveTextContent(
      'CardAction'
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Header' }));
    expect(screen.getByLabelText('Header source code')).toHaveTextContent(
      'HeaderProps'
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Navigation' }));
    expect(screen.getByLabelText('Navigation source code')).toHaveTextContent(
      'NavBarProps'
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Site icon' }));
    expect(screen.getByLabelText('Site icon source code')).toHaveTextContent(
      'SiteIconName'
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'component-tab-4'
    );
  });
});
