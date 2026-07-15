import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Home from './Home/Home';
import Portfolio from './Portfolio/Portfolio';
import Library from './Library/Library';
import Portal from './Library/Portal/Portal';
import StockTwits from './Stocktwits/Stocktwits';
import { fetchStockSymbols } from './Stocktwits/stockTwitsApi';
import XKCD from './XKCD/xkcd';
import { fetchInitialComics, XkcdComic } from './XKCD/xkcdApi';
import { ApplicationShell } from '../App';
import { expectNoAccessibilityViolations } from '../testUtils/accessibility';

vi.mock('./Library/App.codeview', () => ({
  default: 'ApplicationShell source',
}));
vi.mock('./Library/Card/Card.codeview', () => ({
  default: 'CardAction source',
}));
vi.mock('./Library/Header/Header.codeview', () => ({
  default: 'HeaderProps source',
}));
vi.mock('./Library/NavBar/NavBar.codeview', () => ({
  default: 'NavBarProps source',
}));
vi.mock('./Library/SiteIcon/SiteIcon.codeview', () => ({
  default: 'SiteIconName source',
}));
vi.mock('./Stocktwits/stockTwitsApi', async () => {
  const actual = await vi.importActual<
    typeof import('./Stocktwits/stockTwitsApi')
  >('./Stocktwits/stockTwitsApi');
  return { ...actual, fetchStockSymbols: vi.fn() };
});
vi.mock('./XKCD/xkcdApi', async () => {
  const actual =
    await vi.importActual<typeof import('./XKCD/xkcdApi')>('./XKCD/xkcdApi');
  return {
    ...actual,
    fetchInitialComics: vi.fn(),
  };
});

describe('representative page accessibility', () => {
  it('has no automated violations in the application shell', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/unknown']}>
        <ApplicationShell />
      </MemoryRouter>
    );
    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations on the professional profile', async () => {
    const { container } = render(
      <MemoryRouter>
        <main>
          <h1>Adair Daniels</h1>
          <Home />
        </main>
      </MemoryRouter>
    );
    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations in selected work', async () => {
    const { container } = render(
      <main>
        <h1>Selected Work</h1>
        <Portfolio />
      </main>
    );
    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations in the library and portal', async () => {
    const { container } = render(
      <main>
        <h1>Engineering demonstrations</h1>
        <Library />
        <Portal url="https://example.test/demo" title="Example demo" />
      </main>
    );
    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations in an expanded engineering demo', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/poketable']}>
        <ApplicationShell />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Expand PokeTable demonstration',
      })
    );
    expect(
      screen.getByRole('button', {
        name: 'Collapse PokeTable demonstration',
      })
    ).toHaveFocus();

    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations in populated StockTwits results', async () => {
    vi.mocked(fetchStockSymbols).mockResolvedValue({
      feeds: [
        {
          symbol: 'AAPL',
          messages: [
            {
              id: 1,
              body: 'Synthetic market update',
              user: {
                name: 'Synthetic User',
                username: 'synthetic',
                avatarUrl:
                  'https://avatars.stocktwits.com/production/avatar.png',
              },
            },
          ],
        },
      ],
      failedSymbols: [],
    });
    const { container } = render(
      <main>
        <h1>StockTwits Feed</h1>
        <StockTwits />
      </main>
    );
    fireEvent.change(screen.getByLabelText('Stock symbols'), {
      target: { value: 'AAPL' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByText('Synthetic market update');

    await expectNoAccessibilityViolations(container);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Expand StockTwits Feed demonstration',
      })
    );
    await expectNoAccessibilityViolations(container);
  });

  it('has no automated violations in populated XKCD results', async () => {
    const comic: XkcdComic = {
      kind: 'comic',
      num: 1,
      title: 'Synthetic comic',
      img: 'https://imgs.xkcd.com/comics/comic.png',
      alt: 'Synthetic comic description',
    };
    vi.mocked(fetchInitialComics).mockResolvedValue({
      latest: comic.num,
      slots: [comic],
    });
    const { container } = render(
      <main>
        <h1>XKCD Slideshow</h1>
        <XKCD />
      </main>
    );
    await screen.findByRole('heading', { name: 'Synthetic comic' });

    await expectNoAccessibilityViolations(container);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Expand XKCD Slideshow demonstration',
      })
    );
    await expectNoAccessibilityViolations(container);
  });
});
