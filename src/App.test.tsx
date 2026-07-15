import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationShell } from './App';

vi.mock('@mui/material/Slide', () => ({
  default: ({
    children,
    in: shown,
  }: {
    children: React.ReactNode;
    in: boolean;
  }) => (shown ? <>{children}</> : null),
}));
vi.mock('./Components/Home/Home', () => ({
  default: () => <div>Home content</div>,
}));
vi.mock('./Components/Home/Home.codeview', () => ({
  default: () => <div>Home source code</div>,
}));
vi.mock('./Components/Stocktwits/Stocktwits', () => ({
  default: () => <div>StockTwits content</div>,
}));
vi.mock('./Components/Stocktwits/StockTwits.codeview', () => ({
  default: () => <div>StockTwits source code</div>,
}));
vi.mock('./Components/XKCD/xkcd', () => ({
  default: () => <div>XKCD content</div>,
}));
vi.mock('./Components/XKCD/xkcd.codeview', () => ({
  default: () => <div>XKCD source code</div>,
}));
vi.mock('./Components/Portfolio/Portfolio', () => ({
  default: () => <div>Portfolio content</div>,
}));
vi.mock('./Components/Portfolio/Portfolio.codeview', () => ({
  default: () => <div>Portfolio source code</div>,
}));
vi.mock('./Components/Library/Library', () => ({
  default: () => <div>Library content</div>,
}));
vi.mock('./Components/Library/Library.codeview', () => ({
  default: () => <div>Library source code</div>,
}));
vi.mock('./Components/Library/Portal/Portal', () => ({
  default: ({ title }: { title: string }) => <div>{title} content</div>,
}));
vi.mock('./Components/Library/Portal/Portal.codeview', () => ({
  default: () => <div>Portal source code</div>,
}));

const routes = [
  ['/', 'Adair Daniels', 'Home content'],
  ['/poketable', 'PokeTable', 'PokeTable content'],
  ['/robotBattle', 'Robot Battle Arena', 'Robot Battle Arena content'],
  ['/stock', 'StockTwits Feed', 'StockTwits content'],
  ['/xkcd', 'XKCD Slideshow', 'XKCD content'],
  ['/portfolio', 'Portfolio', 'Portfolio content'],
  ['/library', 'Library', 'Library content'],
];

const HistoryControls = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => {
          void navigate(-1);
        }}
      >
        Browser Back
      </button>
      <button
        onClick={() => {
          void navigate(1);
        }}
      >
        Browser Forward
      </button>
    </>
  );
};

describe('Application shell', () => {
  it('transitions from the loading treatment to Home content', async () => {
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );

    expect(screen.getByRole('img', { name: 'Loading Logo' })).toBeVisible();
    expect(await screen.findByText('Home content')).toBeVisible();
  });

  it.each(routes)(
    'derives direct route %s title and content',
    async (path, title, content) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <ApplicationShell />
        </MemoryRouter>
      );
      expect(screen.getByRole('heading', { name: title })).toBeVisible();
      expect(await screen.findByText(content)).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: 'menu' }));
      const current = screen.getByRole('link', {
        name: new RegExp(path === '/' ? 'Home' : title),
      });
      expect(current).toHaveAttribute('aria-current', 'page');
    }
  );

  it('falls unknown paths back to synchronized Home state', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <ApplicationShell />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Adair Daniels' })
    ).toBeVisible();
    expect(await screen.findByText('Home content')).toBeVisible();
  });

  it('opens and closes the menu through overlay and route selection', async () => {
    const { container } = render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
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
    expect(await screen.findByText('Portfolio content')).toBeVisible();
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  it('synchronizes browser Back and Forward navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HistoryControls />
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    fireEvent.click(screen.getByRole('link', { name: /Portfolio/ }));
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
    await screen.findByText('Portfolio content');
    fireEvent.click(screen.getByRole('button', { name: 'Browser Back' }));
    expect(
      screen.getByRole('heading', { name: 'Adair Daniels' })
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Browser Forward' }));
    expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  });

  it('persists Code View while navigating', async () => {
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    fireEvent.click(screen.getByRole('switch', { name: 'Code View' }));
    expect(await screen.findByText('Home source code')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    fireEvent.click(screen.getByRole('link', { name: /Portfolio/ }));
    expect(await screen.findByText('Portfolio source code')).toBeVisible();
    expect(screen.getByRole('switch', { name: 'Code View' })).toBeChecked();
  });
});
