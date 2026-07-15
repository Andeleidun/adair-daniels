import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { ApplicationShell } from './App';

jest.mock('@material-ui/core/Slide', () =>
  ({ children, in: shown }: { children: React.ReactNode; in: boolean }) =>
    shown ? <>{children}</> : null
);
jest.mock('./Components/Home/Home', () => () => <div>Home content</div>);
jest.mock('./Components/Home/Home.codeview', () => () => (
  <div>Home source code</div>
));
jest.mock('./Components/Stocktwits/Stocktwits', () => () => (
  <div>StockTwits content</div>
));
jest.mock('./Components/Stocktwits/StockTwits.codeview', () => () => (
  <div>StockTwits source code</div>
));
jest.mock('./Components/XKCD/xkcd', () => () => <div>XKCD content</div>);
jest.mock('./Components/XKCD/xkcd.codeview', () => () => (
  <div>XKCD source code</div>
));
jest.mock('./Components/Portfolio/Portfolio', () => () => (
  <div>Portfolio content</div>
));
jest.mock('./Components/Portfolio/Portfolio.codeview', () => () => (
  <div>Portfolio source code</div>
));
jest.mock('./Components/Library/Library', () => () => (
  <div>Library content</div>
));
jest.mock('./Components/Library/Library.codeview', () => () => (
  <div>Library source code</div>
));
jest.mock('./Components/Library/Portal/Portal', () =>
  ({ title }: { title: string }) => <div>{title} content</div>
);
jest.mock('./Components/Library/Portal/Portal.codeview', () => () => (
  <div>Portal source code</div>
));

const routes = [
  ['/', 'Adair Daniels', 'Home content'],
  ['/poketable', 'PokeTable', 'PokeTable content'],
  ['/robotBattle', 'Robot Battle Arena', 'Robot Battle Arena content'],
  ['/stock', 'StockTwits Feed', 'StockTwits content'],
  ['/xkcd', 'XKCD Slideshow', 'XKCD content'],
  ['/portfolio', 'Portfolio', 'Portfolio content'],
  ['/library', 'Library', 'Library content'],
];

describe('Application shell', () => {
  it.each(routes)('derives direct route %s title and content', (path, title, content) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <ApplicationShell />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: title })).toBeVisible();
    expect(screen.getByText(content)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    const current = screen.getByRole('link', {
      name: new RegExp(path === '/' ? 'Home' : title),
    });
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('falls unknown paths back to synchronized Home state', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <ApplicationShell />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Adair Daniels' })).toBeVisible();
    expect(screen.getByText('Home content')).toBeVisible();
  });

  it('opens and closes the menu through overlay and route selection', () => {
    const { container } = render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    const menu = screen.getByRole('button', { name: 'menu' });
    fireEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    const overlay = container.querySelector('.app-overlay-mobile');
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(menu).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menu);
    fireEvent.click(screen.getByRole('link', { name: /Portfolio/ }));
    expect(screen.getByText('Portfolio content')).toBeVisible();
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  it('synchronizes browser Back and Forward navigation', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router history={history}>
        <ApplicationShell />
      </Router>
    );
    act(() => history.push('/portfolio'));
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
    act(() => history.goBack());
    expect(screen.getByRole('heading', { name: 'Adair Daniels' })).toBeVisible();
    act(() => history.goForward());
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  });

  it('persists Code View while navigating', () => {
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Code View' }));
    expect(screen.getByText('Home source code')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    fireEvent.click(screen.getByRole('link', { name: /Portfolio/ }));
    expect(screen.getByText('Portfolio source code')).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Code View' })).toBeChecked();
  });
});
