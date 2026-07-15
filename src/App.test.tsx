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
  default: ({
    expanded,
    onExpandedChange,
  }: {
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
  }) => (
    <div>
      <div>StockTwits content</div>
      <button onClick={() => onExpandedChange(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'} StockTwits Feed demonstration
      </button>
    </div>
  ),
}));
vi.mock('./Components/Stocktwits/StockTwits.codeview', () => ({
  default: () => <div>StockTwits source code</div>,
}));
vi.mock('./Components/XKCD/xkcd', () => ({
  default: ({
    expanded,
    onExpandedChange,
  }: {
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
  }) => (
    <div>
      <div>XKCD content</div>
      <button onClick={() => onExpandedChange(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'} XKCD Slideshow demonstration
      </button>
    </div>
  ),
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
  default: ({
    title,
    expanded,
    onExpandedChange,
  }: {
    title: string;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
  }) => (
    <section
      className={`portal-card${expanded ? ' portal-card-expanded' : ''}`}
    >
      {expanded ? (
        <button onClick={() => onExpandedChange(false)}>
          Collapse {title} demonstration
        </button>
      ) : (
        <>
          <h2>Interactive demonstration</h2>
          <button onClick={() => onExpandedChange(true)}>
            Expand {title} demonstration
          </button>
        </>
      )}
      <div>{title} content</div>
    </section>
  ),
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
    expect(container.querySelector('.page-heading')).toBeNull();
    const homeHeading = screen.getByRole('heading', {
      level: 1,
      name: 'Adair Daniels',
    });
    expect(homeHeading).toHaveClass('visually-hidden');
    expect(homeHeading).not.toHaveFocus();
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
      const heading = screen.getByRole('heading', { level: 1, name: title });
      if (path === '/') expect(heading).toHaveClass('visually-hidden');
      else expect(heading).toBeVisible();
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
    const { container } = render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    const homeScreen = container.querySelector('.app-screen');
    expect(homeScreen).toBeInTheDocument();
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
    expect(container.querySelector('.app-screen')).not.toBe(homeScreen);
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

  it('gives hosted demonstrations an immersive view below the header', () => {
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
    const { container } = render(
      <MemoryRouter initialEntries={['/poketable']}>
        <ApplicationShell />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'PokeTable' })
    ).toBeVisible();
    expect(container.querySelector('.site-footer')).toBeInTheDocument();
    expect(
      screen.getByRole('switch', { name: 'Code View' })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Expand PokeTable demonstration',
      })
    );

    expect(
      screen.getByRole('button', {
        name: 'Collapse PokeTable demonstration',
      })
    ).toBeVisible();
    expect(container.querySelector('.page-heading')).toBeNull();
    expect(container.querySelector('.portal-card')).toHaveClass(
      'portal-card-expanded'
    );
    expect(container.querySelector('.app-content')).toHaveClass(
      'app-content-demo-expanded'
    );
    expect(container.querySelector('.site-footer')).toBeNull();
    expect(screen.queryByRole('switch', { name: 'Code View' })).toBeNull();
    expect(document.documentElement).toHaveClass('demo-expanded');
    expect(document.body).toHaveClass('demo-expanded');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Collapse PokeTable demonstration',
      })
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'PokeTable' })
    ).toBeVisible();
    expect(container.querySelector('.site-footer')).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('demo-expanded');
    expect(document.body).not.toHaveClass('demo-expanded');
  });

  it('returns history navigation to the standard demonstration view', async () => {
    render(
      <MemoryRouter initialEntries={['/poketable']}>
        <HistoryControls />
        <ApplicationShell />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Expand PokeTable demonstration',
      })
    );
    expect(document.documentElement).toHaveClass('demo-expanded');

    fireEvent.click(
      within(openNavigation()).getByRole('link', { name: 'Selected Work' })
    );
    expect(await screen.findByText('Portfolio content')).toBeVisible();
    expect(document.documentElement).not.toHaveClass('demo-expanded');

    fireEvent.click(
      screen.getByRole('button', { name: 'Browser Back', hidden: true })
    );
    expect(await screen.findByText('PokeTable content')).toBeVisible();
    expect(
      await screen.findByRole('button', {
        name: 'Expand PokeTable demonstration',
      })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', {
        name: 'Collapse PokeTable demonstration',
      })
    ).toBeNull();
  });

  it.each([
    ['/stock', 'StockTwits Feed'],
    ['/xkcd', 'XKCD Slideshow'],
  ])('expands the %s demonstration through the shared shell', (path, title) => {
    const { container } = render(
      <MemoryRouter initialEntries={[path]}>
        <ApplicationShell />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: `Expand ${title} demonstration`,
      })
    );

    expect(
      screen.getByRole('button', {
        name: `Collapse ${title} demonstration`,
      })
    ).toBeVisible();
    expect(container.querySelector('.page-heading')).toBeNull();
    expect(container.querySelector('.app-content')).toHaveClass(
      'app-content-demo-expanded'
    );
    expect(container.querySelector('.site-footer')).toBeNull();
    expect(document.documentElement).toHaveClass('demo-expanded');

    fireEvent.click(
      screen.getByRole('button', {
        name: `Collapse ${title} demonstration`,
      })
    );
    expect(
      screen.getByRole('heading', { level: 1, name: title })
    ).toBeVisible();
    expect(container.querySelector('.site-footer')).toBeInTheDocument();
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
    const { container } = render(
      <MemoryRouter>
        <ApplicationShell />
      </MemoryRouter>
    );
    await screen.findByText('Home content');
    const liveScreen = container.querySelector('.app-screen');
    const navigation = openNavigation();
    fireEvent.click(
      within(navigation).getByRole('switch', { name: 'Code View' })
    );
    expect(await screen.findByText('Home source code')).toBeVisible();
    expect(container.querySelector('.app-screen')).not.toBe(liveScreen);
    fireEvent.click(
      within(navigation).getByRole('link', { name: 'Selected Work' })
    );
    expect(await screen.findByText('Portfolio source code')).toBeVisible();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Open navigation' })
      ).toHaveAttribute('aria-expanded', 'false')
    );
    const reopenedNavigation = openNavigation();
    expect(
      within(reopenedNavigation).getByRole('switch', { name: 'Code View' })
    ).toBeChecked();
  });
});
