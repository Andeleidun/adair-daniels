import { fetchRemoteJson, RemoteRequestError } from '../../Services/remoteData';
import {
  fetchStockSymbol,
  fetchStockSymbols,
  normalizeSymbols,
} from './stockTwitsApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../Services/remoteData', async () => {
  const actual = await vi.importActual<
    typeof import('../../Services/remoteData')
  >('../../Services/remoteData');
  return { ...actual, fetchRemoteJson: vi.fn() };
});

const remote = vi.mocked(fetchRemoteJson);
const message = (id = 1) => ({
  id,
  body: 'Synthetic market update',
  user: {
    name: 'Sample User',
    username: `sample${id}`,
    avatarUrl: `https://avatars.stocktwits.com/production/${id}.png`,
  },
});
const feed = (symbol: string) => ({ symbol, messages: [message()] });

describe('StockTwits adapter', () => {
  beforeEach(() => {
    remote.mockReset();
  });

  it('normalizes in first-occurrence order and validates every input bound', () => {
    expect(normalizeSymbols(' aapl, msft, AAPL, brk.b ')).toEqual({
      valid: true,
      symbols: ['AAPL', 'MSFT', 'BRK.B'],
    });
    expect(normalizeSymbols(' , ')).toMatchObject({ valid: false });
    expect(normalizeSymbols('AAPL, BAD SYMBOL')).toMatchObject({
      valid: false,
    });
    expect(normalizeSymbols('A'.repeat(17))).toMatchObject({ valid: false });
    expect(normalizeSymbols('A'.repeat(201))).toMatchObject({ valid: false });
    expect(normalizeSymbols('1,2,3,4,5,6,7,8,9,10,11')).toMatchObject({
      valid: false,
    });
  });

  it('uses the symbol endpoint and validates every rendered field', async () => {
    remote.mockResolvedValue(feed('AAPL'));
    await expect(fetchStockSymbol('AAPL')).resolves.toMatchObject({
      symbol: 'AAPL',
    });
    expect(remote).toHaveBeenCalledWith('/v1/stocktwits/AAPL', {
      signal: undefined,
    });
    remote.mockResolvedValue({
      ...feed('AAPL'),
      messages: [
        {
          ...message(),
          user: { ...message().user, avatarUrl: 'https://example.test/a.png' },
        },
      ],
    });
    await expect(fetchStockSymbol('AAPL')).rejects.toMatchObject({
      category: 'schema',
    });
  });

  it('runs at fixed concurrency three with stable results and partial failures', async () => {
    let active = 0;
    let maximum = 0;
    remote.mockImplementation(async (endpoint: string) => {
      active += 1;
      maximum = Math.max(maximum, active);
      await Promise.resolve();
      active -= 1;
      const symbol = endpoint.split('/').at(-1) || '';
      if (symbol === 'MSFT') throw new RemoteRequestError('timeout', 'late');
      return feed(symbol);
    });
    await expect(
      fetchStockSymbols(['AAPL', 'MSFT', 'TSLA', 'GOOG'])
    ).resolves.toEqual({
      feeds: [
        expect.objectContaining({ symbol: 'AAPL' }),
        expect.objectContaining({ symbol: 'TSLA' }),
        expect.objectContaining({ symbol: 'GOOG' }),
      ],
      failedSymbols: ['MSFT'],
    });
    expect(maximum).toBe(3);
  });

  it('stops queued work on cancellation', async () => {
    const controller = new AbortController();
    remote.mockImplementation((_endpoint, options) => {
      controller.abort();
      return Promise.reject(
        new RemoteRequestError(
          options?.signal?.aborted ? 'aborted' : 'network',
          'cancelled'
        )
      );
    });
    await expect(
      fetchStockSymbols(['AAPL', 'MSFT', 'TSLA', 'GOOG'], controller.signal)
    ).rejects.toMatchObject({ category: 'aborted' });
    expect(remote.mock.calls.length).toBeLessThanOrEqual(3);
  });
});
