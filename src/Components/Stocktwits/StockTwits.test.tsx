import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import StockTwits from './Stocktwits';
import { fetchStockSymbols, StockSearchResult } from './stockTwitsApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./stockTwitsApi', async () => {
  const actual =
    await vi.importActual<typeof import('./stockTwitsApi')>('./stockTwitsApi');
  return { ...actual, fetchStockSymbols: vi.fn() };
});

const fetchSymbols = vi.mocked(fetchStockSymbols);
const result = (
  feeds: StockSearchResult['feeds'],
  failedSymbols: ReadonlyArray<string> = []
): StockSearchResult => ({ feeds, failedSymbols });
const feed = (symbol: string, id = 1) => ({
  symbol,
  messages: [
    {
      id,
      body: `${symbol} synthetic update`,
      user: {
        name: `${symbol} User`,
        username: `${symbol.toLowerCase()}user`,
        avatarUrl: `https://example.test/${symbol}.png`,
      },
    },
  ],
});

const submit = (value: string) => {
  fireEvent.change(screen.getByLabelText('Stock symbols'), {
    target: { value },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));
};

describe('StockTwits', () => {
  beforeEach(() => {
    fetchSymbols.mockReset();
  });

  it('expands from the introduction and restores the standard view', () => {
    const { container } = render(<StockTwits />);
    const expand = screen.getByRole('button', {
      name: 'Expand StockTwits Feed demonstration',
    });
    expect(expand.closest('.stock-intro')).toBeInTheDocument();

    fireEvent.click(expand);
    expect(container.querySelector('.app-stocktwits')).toHaveClass(
      'demo-expanded-view',
      'app-stocktwits-expanded'
    );
    expect(container.querySelector('.stock-intro')).toHaveClass(
      'stock-intro-expanded'
    );
    expect(
      screen.getByRole('button', {
        name: 'Collapse StockTwits Feed demonstration',
      })
    ).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(container.querySelector('.app-stocktwits')).not.toHaveClass(
      'demo-expanded-view'
    );
    expect(
      screen.getByRole('button', {
        name: 'Expand StockTwits Feed demonstration',
      })
    ).toHaveFocus();
  });

  it('submits normalized input by button and renders stable, filterable results', async () => {
    fetchSymbols.mockResolvedValue(result([feed('AAPL'), feed('MSFT', 2)]));
    render(<StockTwits />);
    submit(' aapl, msft, AAPL ');

    expect(await screen.findByText('AAPL synthetic update')).toBeVisible();
    expect(fetchSymbols).toHaveBeenCalledWith(
      ['AAPL', 'MSFT'],
      expect.anything()
    );
    expect(screen.getByText('Next refresh in 5 minutes.')).toBeVisible();
    const apple = screen.getByText('AAPL').closest('[role="button"]');
    expect(apple).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(apple as HTMLElement);
    expect(apple).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('MSFT synthetic update')).toBeNull();
    fireEvent.click(apple as HTMLElement);
    expect(screen.getByText('MSFT synthetic update')).toBeVisible();
    expect(
      screen.getByRole('img', { name: "AAPL User's avatar" })
    ).toBeVisible();
  });

  it('supports Enter, rejects invalid input accessibly, and bounds requests', async () => {
    fetchSymbols.mockResolvedValue(result([]));
    render(<StockTwits />);
    fireEvent.change(screen.getByLabelText('Stock symbols'), {
      target: { value: 'BAD SYMBOL' },
    });
    const form = screen.getByRole('button', { name: 'Search' }).closest('form');
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /must include a letter or number/
    );
    expect(fetchSymbols).not.toHaveBeenCalled();
  });

  it('renders empty, partial, and total-failure policies', async () => {
    fetchSymbols
      .mockResolvedValueOnce(result([{ symbol: 'EMPTY', messages: [] }]))
      .mockResolvedValueOnce(result([feed('AAPL')], ['FAIL']))
      .mockResolvedValueOnce(result([], ['FAIL']));
    render(<StockTwits />);

    submit('EMPTY');
    expect(await screen.findByText(/No messages were found/)).toBeVisible();
    submit('AAPL,FAIL');
    expect(await screen.findByRole('status')).toHaveTextContent('FAIL');
    expect(screen.getByText('AAPL synthetic update')).toBeVisible();
    submit('FAIL');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /could not load/
    );
    expect(screen.queryByText('AAPL synthetic update')).toBeNull();
  });

  it('announces an empty result after filtering to a symbol with no messages', async () => {
    fetchSymbols.mockResolvedValue(
      result([{ symbol: 'EMPTY', messages: [] }, feed('AAPL')])
    );
    render(<StockTwits />);
    submit('EMPTY,AAPL');
    expect(await screen.findByText('AAPL synthetic update')).toBeVisible();

    const empty = screen.getByText('EMPTY').closest('[role="button"]');
    expect(empty).not.toBeNull();
    fireEvent.click(empty as HTMLElement);

    expect(
      screen.getByText('No messages were found for the selected symbols.')
    ).toHaveAttribute('role', 'status');
    expect(screen.queryByText('AAPL synthetic update')).toBeNull();
  });

  it('refreshes once at five minutes, merges partial data, and stops polling', async () => {
    vi.useFakeTimers();
    fetchSymbols
      .mockResolvedValueOnce(result([feed('AAPL', 1), feed('MSFT', 2)]))
      .mockResolvedValueOnce(result([feed('AAPL', 3)], ['MSFT']));
    render(<StockTwits />);
    submit('AAPL,MSFT');
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByText('AAPL synthetic update')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Stock symbols'), {
      target: { value: 'TSLA' },
    });

    await act(async () => {
      vi.advanceTimersByTime(60000);
      await Promise.resolve();
    });
    expect(screen.getByText('Next refresh in 4 minutes.')).toBeVisible();

    await act(async () => {
      vi.advanceTimersByTime(4 * 60000);
      await Promise.resolve();
    });
    expect(fetchSymbols).toHaveBeenCalledTimes(2);
    expect(fetchSymbols.mock.calls[1][0]).toEqual(['AAPL', 'MSFT']);
    expect(screen.getByRole('status')).toHaveTextContent('MSFT');
    expect(screen.getByText('MSFT synthetic update')).toBeVisible();
    await act(async () => {
      vi.advanceTimersByTime(5 * 60000);
      await Promise.resolve();
    });
    expect(fetchSymbols).toHaveBeenCalledTimes(2);
  });

  it('prevents overlapping automatic refresh requests', async () => {
    vi.useFakeTimers();
    let resolveRefresh: (value: StockSearchResult) => void = () => undefined;
    fetchSymbols
      .mockResolvedValueOnce(result([feed('AAPL')]))
      .mockImplementationOnce(
        () =>
          new Promise<StockSearchResult>((resolve) => {
            resolveRefresh = resolve;
          })
      );
    render(<StockTwits />);
    submit('AAPL');
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByText('AAPL synthetic update')).toBeVisible();

    await act(async () => {
      vi.advanceTimersByTime(6 * 60000);
      await Promise.resolve();
    });
    expect(fetchSymbols).toHaveBeenCalledTimes(2);
    expect(
      screen.getByText(
        'Refreshing StockTwits results. Next refresh in 0 minutes.'
      )
    ).toBeVisible();

    await act(async () => {
      resolveRefresh(result([feed('AAPL', 2)]));
      await Promise.resolve();
    });
  });

  it('aborts superseded and unmounted searches and ignores stale completions', async () => {
    let resolveFirst: (value: StockSearchResult) => void = () => undefined;
    fetchSymbols
      .mockImplementationOnce(
        () =>
          new Promise<StockSearchResult>((resolve) => (resolveFirst = resolve))
      )
      .mockResolvedValueOnce(result([feed('MSFT')]));
    const { unmount } = render(<StockTwits />);
    submit('AAPL');
    const firstSignal = fetchSymbols.mock.calls[0][1] as AbortSignal;
    submit('MSFT');
    expect(firstSignal.aborted).toBe(true);
    expect(await screen.findByText('MSFT synthetic update')).toBeVisible();
    act(() => resolveFirst(result([feed('AAPL')])));
    expect(screen.queryByText('AAPL synthetic update')).toBeNull();
    const secondSignal = fetchSymbols.mock.calls[1][1] as AbortSignal;
    unmount();
    expect(secondSignal.aborted).toBe(true);
  });

  it('aborts an active request when a replacement submission is invalid', () => {
    let resolveSearch: (value: StockSearchResult) => void = () => undefined;
    fetchSymbols.mockImplementationOnce(
      () =>
        new Promise<StockSearchResult>((resolve) => {
          resolveSearch = resolve;
        })
    );
    render(<StockTwits />);
    submit('AAPL');
    const signal = fetchSymbols.mock.calls[0][1];

    submit('BAD SYMBOL');

    expect(signal).toBeDefined();
    expect(signal && signal.aborted).toBe(true);
    expect(screen.getByRole('alert')).toHaveTextContent(
      /must include a letter or number/
    );
    act(() => resolveSearch(result([feed('AAPL')])));
    expect(screen.queryByText('AAPL synthetic update')).toBeNull();
  });

  it('aborts an active search on unmount and ignores its late completion', async () => {
    let resolveSearch: (value: StockSearchResult) => void = () => undefined;
    fetchSymbols.mockImplementationOnce(
      () =>
        new Promise<StockSearchResult>((resolve) => {
          resolveSearch = resolve;
        })
    );
    const { unmount } = render(<StockTwits />);
    submit('AAPL');
    const signal = fetchSymbols.mock.calls[0][1] as AbortSignal;

    unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => {
      resolveSearch(result([feed('AAPL')]));
      await Promise.resolve();
    });
  });
});
