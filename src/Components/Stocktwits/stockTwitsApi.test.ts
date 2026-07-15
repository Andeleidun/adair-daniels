import {
  fetchAllOriginsJson,
  RemoteRequestError,
} from '../../Services/remoteData';
import {
  fetchStockSymbol,
  fetchStockSymbols,
  normalizeSymbols,
} from './stockTwitsApi';
import { stockFeed, stockMessage } from '../../testUtils/remoteFixtures';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../Services/remoteData', async () => {
  const actual = await vi.importActual<
    typeof import('../../Services/remoteData')
  >('../../Services/remoteData');
  return { ...actual, fetchAllOriginsJson: vi.fn() };
});

const remote = vi.mocked(fetchAllOriginsJson);
const insecureAvatarMessage = stockMessage(2);

describe('StockTwits adapter', () => {
  beforeEach(() => {
    remote.mockReset();
  });

  it('normalizes, de-duplicates, and validates bounded symbol input', () => {
    expect(normalizeSymbols(' aapl, msft, AAPL, brk.b ')).toEqual({
      valid: true,
      symbols: ['AAPL', 'MSFT', 'BRK.B'],
    });
    expect(normalizeSymbols(' , ')).toMatchObject({ valid: false });
    expect(normalizeSymbols('AAPL, BAD SYMBOL')).toMatchObject({
      valid: false,
    });
    expect(normalizeSymbols('., -.-')).toMatchObject({ valid: false });
    expect(normalizeSymbols('1,2,3,4,5,6,7,8,9,10,11')).toMatchObject({
      valid: false,
    });
    expect(normalizeSymbols('1,2,3,4,5,6,7,8,9,10')).toMatchObject({
      valid: true,
    });
  });

  it('validates and maps every rendered message field', async () => {
    remote.mockResolvedValue(stockFeed([stockMessage()]));
    await expect(fetchStockSymbol('AAPL')).resolves.toEqual({
      symbol: 'AAPL',
      messages: [
        {
          id: 1,
          body: 'Synthetic market update',
          user: {
            name: 'Sample User',
            username: 'sample1',
            avatarUrl: 'https://example.test/avatar-1.png',
          },
        },
      ],
    });
    expect(remote).toHaveBeenCalledWith(
      'https://api.stocktwits.com/api/2/streams/symbol/AAPL.json',
      expect.objectContaining({ requestName: 'stock-twits-live-feed' })
    );
  });

  it('accepts a valid empty feed', async () => {
    remote.mockResolvedValue(stockFeed([]));

    await expect(fetchStockSymbol('EMPTY')).resolves.toEqual({
      symbol: 'EMPTY',
      messages: [],
    });
  });

  it('loads symbols sequentially and collects partial failures', async () => {
    let activeRequests = 0;
    let maximumActiveRequests = 0;
    remote.mockImplementation(async (url: string) => {
      activeRequests += 1;
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests);
      await Promise.resolve();
      activeRequests -= 1;
      if (url.includes('/MSFT.json')) {
        throw new RemoteRequestError('network', 'offline');
      }
      return stockFeed([stockMessage()]);
    });

    await expect(fetchStockSymbols(['AAPL', 'MSFT'])).resolves.toMatchObject({
      feeds: [{ symbol: 'AAPL' }],
      failedSymbols: ['MSFT'],
    });
    expect(maximumActiveRequests).toBe(1);
  });

  it('stops a sequential search when cancellation is reported', async () => {
    remote.mockRejectedValue(
      new RemoteRequestError('aborted', 'The request was cancelled.')
    );

    await expect(fetchStockSymbols(['AAPL', 'MSFT'])).rejects.toMatchObject({
      category: 'aborted',
    });
    expect(remote).toHaveBeenCalledTimes(1);
  });

  it.each([
    [stockFeed([{}])],
    [
      stockFeed([
        stockMessage(1),
        {
          ...insecureAvatarMessage,
          user: {
            ...insecureAvatarMessage.user,
            avatar_url_ssl: 'http://example.test/avatar.png',
          },
        },
      ]),
    ],
    [{ response: { status: 200 }, messages: 'invalid' }],
    [{ response: { status: 400 }, error: { message: 'private remote body' } }],
    [stockFeed([{ ...stockMessage(1), id: 1.5 }])],
    [stockFeed([stockMessage(1), stockMessage(1)])],
    [{ messages: [stockMessage(1)] }],
    [stockFeed([stockMessage(1)], 503)],
    [{ response: { status: '200' }, messages: [stockMessage(1)] }],
  ])('rejects invalid or API-error envelopes', async (value) => {
    remote.mockResolvedValue(value);
    await expect(fetchStockSymbol('AAPL')).rejects.toBeDefined();
  });
});
