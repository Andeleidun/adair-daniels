import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApplicationShell } from './App';

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
  ['/', 'Adair Daniels', 'Home', 'Home content'],
  ['/portfolio', 'Selected Work', 'Selected Work', 'Portfolio content'],
  ['/library', 'Component Library', 'Component Library', 'Library content'],
  ['/poketable', 'PokeTable', 'PokeTable', 'PokeTable content'],
  [
    '/robotBattle',
    'Robot Battle Arena',
    'Robot Battle Arena',
    'Robot Battle Arena content',
  ],
  ['/stock', 'StockTwits Feed', 'StockTwits Feed', 'StockTwits content'],
  ['/xkcd', 'XKCD Slideshow', 'XKCD Slideshow', 'XKCD content'],
];

const HistoryControls = (): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => void navigate(-1)}>Browser Back</button>
      <button onClick={() => void navigate(1)}>Browser Forward</button>
    </>
  );
};

const openNavigation = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  return screen.getByRole('navigation', { name: 'Main navigation' });
};

describe('Application shell', () => {
  afterEach(() => {
    document.head
      .querySelectorAll('[data-test-route-metadata]')
      .forEach((element) => element.remove());
  });

  it('renders Home immediately without displacing initial focus', async () => {
    const { container } = render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Skip to main content' })
    ).toHaveAttribute('href', '#main-content');
    expect(await screen.findByText('Home content')).toBeVisible();
    await waitFor(() =>
      expect(document.title).toContain('Senior Frontend Engineer')
    );
    expect(container.querySelector('.page-kicker')).toBeNull();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Adair Daniels' })
    ).not.toHaveFocus();
  });

  it('keeps canonical and social URLs aligned with the active route', async () => {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.dataset.testRouteMetadata = 'true';
    const openGraphUrl = document.createElement('meta');
    openGraphUrl.setAttribute('property', 'og:url');
    openGraphUrl.dataset.testRouteMetadata = 'true';
    document.head.append(canonical, openGraphUrl);

    render(
      <MemoryRouter initialEntries={['/portfolio']}>
        <ApplicationShell />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(canonical).toHaveAttribute(
        'href',
        'https://adairdaniels.com/portfolio'
      )
    );
    expect(openGraphUrl).toHaveAttribute(
      'content',
      'https://adairdaniels.com/portfolio'
    );
  });

  it.each(routes)(
    'derives direct route %s title, content, and navigation state',
    async (path, title, navName, content) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <ApplicationShell />
        </MemoryRouter>
      );
      expect(
        screen.getByRole('heading', { level: 1, name: title })
      ).toBeVisible();
      expect(await screen.findByText(content)).toBeVisible();
      const navigation = openNavigation();
      expect(
        within(navigation).getByRole('link', { name: navName })
      ).toHaveAttribute('aria-current', 'page');
    }
  );

  it('renders a recoverable Not Found route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/unknown']}>
        <ApplicationShell />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'This page could not be found' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(container.querySelector('.page-kicker')).toBeNull();
    expect(within(openNavigation()).queryByRole('switch')).toBeNull();
  });

  it('opens and closes navigation through its controls and route selection', async () => {
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    const menu = screen.getByRole('button', { name: 'Open navigation' });
    const navigation = openNavigation();
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(
      within(navigation).getByRole('button', { name: 'Close navigation' })
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Open navigation' })
      ).toHaveAttribute('aria-expanded', 'false')
    );
    await waitFor(() => expect(menu).toHaveFocus());

    const reopened = openNavigation();
    fireEvent.click(
      within(reopened).getByRole('link', { name: 'Selected Work' })
    );
    expect(await screen.findByText('Portfolio content')).toBeVisible();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Open navigation' })
      ).toHaveAttribute('aria-expanded', 'false')
    );
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: 'Selected Work' })
      ).toHaveFocus()
    );
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Selected Work' })
    ).toHaveFocus();
  });

  it('keeps a single Code View control when the desktop drawer is open', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })
    );
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );

    openNavigation();
    expect(screen.getAllByRole('switch', { name: 'Code View' })).toHaveLength(
      1
    );
  });

  it('places Code View in temporary navigation on narrow screens', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })
    );
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );

    expect(screen.queryByRole('switch', { name: 'Code View' })).toBeNull();
    const navigation = openNavigation();
    const codeView = within(navigation).getByRole('switch', {
      name: 'Code View',
    });
    expect(screen.getAllByRole('switch', { name: 'Code View' })).toHaveLength(
      1
    );
    fireEvent.click(codeView);
    expect(codeView).toBeChecked();
  });

  it('synchronizes browser Back and Forward navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HistoryControls />
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    fireEvent.click(
      within(openNavigation()).getByRole('link', { name: 'Selected Work' })
    );
    expect(await screen.findByText('Portfolio content')).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', { name: 'Browser Back', hidden: true })
    );
    expect(await screen.findByText('Home content')).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', { name: 'Browser Forward', hidden: true })
    );
    expect(await screen.findByText('Portfolio content')).toBeVisible();
  });

  it('persists Code View while navigating', async () => {
    render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    const navigation = openNavigation();
    fireEvent.click(
      within(navigation).getByRole('switch', { name: 'Code View' })
    );
    expect(await screen.findByText('Home source code')).toBeVisible();
    fireEvent.click(
      within(navigation).getByRole('link', { name: 'Selected Work' })
    );
    expect(await screen.findByText('Portfolio source code')).toBeVisible();
    expect(
      within(navigation).getByRole('switch', {
        name: 'Code View',
        hidden: true,
      })
    ).toBeChecked();
  });
});
