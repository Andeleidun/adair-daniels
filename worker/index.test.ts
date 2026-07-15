import { createWorker } from './index';
import { afterEach, describe, expect, it, vi } from 'vitest';

const origin = 'https://adairdaniels.com';
const comic = (num: number) => ({
  num,
  title: `Comic ${num}`,
  img: `https://imgs.xkcd.com/comics/${num}.png`,
  alt: `Alternative ${num}`,
});
const stockMessage = (id = 1) => ({
  id,
  body: 'Public update',
  user: {
    name: 'Sample User',
    username: 'sample',
    avatar_url_ssl: `https://avatars.stocktwits.com/production/${id}.png`,
    private_field: 'not forwarded',
  },
});

const requestUrl = (input: string | URL | Request): string => {
  if (typeof input === 'string') return input;
  return input instanceof Request ? input.url : input.toString();
};

const request = (path: string, init: RequestInit = {}) =>
  new Request(`https://api.example.test${path}`, {
    ...init,
    headers: { Origin: origin, ...init.headers },
  });

const context = () => ({
  pending: [] as Array<Promise<unknown>>,
  waitUntil(promise: Promise<unknown>) {
    this.pending.push(promise);
  },
});

const run = (
  fetchImplementation: typeof fetch,
  target: Request,
  cache?: {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
  }
) =>
  createWorker({ fetch: fetchImplementation, cache }).fetch(target, context());

describe('remote API Worker', () => {
  afterEach(() => vi.useRealTimers());

  it.each([origin, 'http://localhost:5173', 'https://127.0.0.1:4173'])(
    'reflects an allowed origin on success and diagnostics: %s',
    async (allowed) => {
      const fetchMock = vi.fn((url: string | URL | Request) => {
        const text = requestUrl(url);
        const value =
          text === 'https://xkcd.com/info.0.json'
            ? comic(3)
            : comic(Number(text.split('/')[3]));
        return Promise.resolve(new Response(JSON.stringify(value)));
      }) as typeof fetch;
      const initial = await run(
        fetchMock,
        new Request('https://api.example.test/v1/xkcd/initial', {
          headers: { Origin: allowed },
        })
      );
      expect(initial.status).toBe(200);
      expect(initial.headers.get('Access-Control-Allow-Origin')).toBe(allowed);
      expect(initial.headers.get('Vary')).toBe('Origin');

      const options = await run(
        fetchMock,
        new Request('https://api.example.test/v1/xkcd/initial', {
          method: 'OPTIONS',
          headers: { Origin: allowed },
        })
      );
      expect(options.status).toBe(204);
      expect(options.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, OPTIONS'
      );
    }
  );

  it('rejects other origins and methods with sanitized CORS-enabled errors', async () => {
    const fetchMock = vi.fn() as unknown as typeof fetch;
    const rejected = await run(
      fetchMock,
      new Request('https://api.example.test/v1/xkcd/initial', {
        headers: { Origin: 'https://evil.example' },
      })
    );
    expect(rejected.status).toBe(403);
    expect(rejected.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(rejected.headers.get('Vary')).toBe('Origin');

    const method = await run(
      fetchMock,
      request('/v1/xkcd/initial', { method: 'POST' })
    );
    expect(method.status).toBe(405);
    expect(method.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loads initial XKCD in four bounded calls and preserves unavailable positions', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const url = requestUrl(input);
      if (url === 'https://xkcd.com/info.0.json') {
        return Promise.resolve(new Response(JSON.stringify(comic(10))));
      }
      const number = Number(url.split('/')[3]);
      return Promise.resolve(
        number === 2
          ? new Response(null, { status: 404 })
          : new Response(JSON.stringify(comic(number)))
      );
    }) as typeof fetch;
    const response = await run(fetchMock, request('/v1/xkcd/initial'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      latest: 10,
      slots: [
        expect.objectContaining({ kind: 'comic', num: 1 }),
        { kind: 'unavailable', num: 2 },
        expect.objectContaining({ kind: 'comic', num: 3 }),
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(response.headers.get('Cache-Control')).toContain('max-age=300');
  });

  it('validates batch bounds and makes no more than three numbered calls', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const number = Number(requestUrl(input).split('/')[3]);
      return Promise.resolve(new Response(JSON.stringify(comic(number))));
    }) as typeof fetch;
    const response = await run(
      fetchMock,
      request('/v1/xkcd/batch?start=4&count=3')
    );
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(response.headers.get('Cache-Control')).toContain('max-age=86400');

    for (const path of [
      '/v1/xkcd/batch?start=0&count=3',
      '/v1/xkcd/batch?start=1&count=4',
      '/v1/xkcd/batch?start=1&start=2&count=1',
      '/v1/xkcd/batch?start=1&count=2&url=https://evil.example',
    ]) {
      const invalid = await run(fetchMock, request(path));
      expect(invalid.status).toBe(400);
      expect(invalid.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    }
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('sanitizes a valid StockTwits feed and validates symbols', async () => {
    let upstreamUrl = '';
    let upstreamOptions: RequestInit | undefined;
    const fetchMock = vi.fn(
      (input: string | URL | Request, options?: RequestInit) => {
        upstreamUrl = requestUrl(input);
        upstreamOptions = options;
        return Promise.resolve(
          new Response(
            JSON.stringify({
              response: { status: 200 },
              messages: [stockMessage()],
            })
          )
        );
      }
    ) as typeof fetch;
    const response = await run(fetchMock, request('/v1/stocktwits/aapl'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      symbol: 'AAPL',
      messages: [
        {
          id: 1,
          body: 'Public update',
          user: {
            name: 'Sample User',
            username: 'sample',
            avatarUrl: 'https://avatars.stocktwits.com/production/1.png',
          },
        },
      ],
    });
    expect(upstreamUrl).toBe(
      'https://api.stocktwits.com/api/2/streams/symbol/AAPL.json'
    );
    expect(upstreamOptions?.signal).toBeInstanceOf(AbortSignal);
    expect(response.headers.get('Cache-Control')).toContain('max-age=60');

    const invalid = await run(
      fetchMock,
      request('/v1/stocktwits/INVALID_SYMBOL')
    );
    expect(invalid.status).toBe(400);
  });

  it.each([429, 500])(
    'maps upstream status %s to a CORS-enabled 502',
    async (status) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValue(new Response('private', { status })) as typeof fetch;
      const response = await run(fetchMock, request('/v1/stocktwits/AAPL'));
      expect(response.status).toBe(502);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
      expect(await response.text()).not.toContain('private');
    }
  );

  it('rejects upstream images on non-default ports', async () => {
    const unsafe = {
      ...comic(3),
      img: 'https://imgs.xkcd.com:444/comics/3.png',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(unsafe))) as typeof fetch;
    const response = await run(fetchMock, request('/v1/xkcd/initial'));
    expect(response.status).toBe(502);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
  });

  it('maps timeout to 504 and oversized upstream content to 502', async () => {
    vi.useFakeTimers();
    const stalled = vi.fn(
      (_input: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError'))
          );
        })
    ) as typeof fetch;
    const timedOut = run(stalled, request('/v1/stocktwits/AAPL'));
    await vi.advanceTimersByTimeAsync(8000);
    expect((await timedOut).status).toBe(504);

    const oversized = vi.fn().mockResolvedValue(
      new Response('x', {
        headers: { 'Content-Length': String(512 * 1024 + 1) },
      })
    ) as typeof fetch;
    expect((await run(oversized, request('/v1/stocktwits/AAPL'))).status).toBe(
      502
    );

    const streamedOversized = vi.fn().mockResolvedValue(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new Uint8Array(512 * 1024));
            controller.enqueue(new Uint8Array(1));
            controller.close();
          },
        })
      )
    ) as typeof fetch;
    const streamedResponse = await run(
      streamedOversized,
      request('/v1/stocktwits/AAPL')
    );
    expect(streamedResponse.status).toBe(502);
    expect(streamedResponse.headers.get('Access-Control-Allow-Origin')).toBe(
      origin
    );
  });

  it('does not expose an arbitrary forwarding route', async () => {
    const fetchMock = vi.fn() as unknown as typeof fetch;
    const response = await run(
      fetchMock,
      request('/v1/proxy?url=https://example.test/private')
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a sanitized CORS-enabled response for internal failures', async () => {
    const cache = {
      match: vi.fn().mockRejectedValue(new Error('private cache details')),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const response = await run(vi.fn(), request('/v1/xkcd/initial'), cache);
    expect(response.status).toBe(500);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(await response.text()).not.toContain('private');
  });

  it('serves a cached base response while reflecting each request origin', async () => {
    const values = new Map<string, Response>();
    const cache = {
      match(target: Request) {
        return Promise.resolve(values.get(target.url)?.clone());
      },
      put(target: Request, response: Response) {
        values.set(target.url, response.clone());
        return Promise.resolve();
      },
    };
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const number = Number(requestUrl(input).split('/')[3]);
      return Promise.resolve(new Response(JSON.stringify(comic(number))));
    }) as typeof fetch;
    const first = await run(
      fetchMock,
      request('/v1/xkcd/batch?start=1&count=1'),
      cache
    );
    await Promise.resolve();
    const second = await run(
      fetchMock,
      new Request('https://api.example.test/v1/xkcd/batch?count=1&start=1', {
        headers: { Origin: 'http://localhost:5173' },
      }),
      cache
    );
    expect(first.status).toBe(200);
    expect(second.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:5173'
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const stockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          response: { status: 200 },
          messages: [stockMessage()],
        })
      )
    ) as typeof fetch;
    expect(
      (await run(stockFetch, request('/v1/stocktwits/aapl'), cache)).status
    ).toBe(200);
    expect(
      (await run(stockFetch, request('/v1/stocktwits/AAPL'), cache)).status
    ).toBe(200);
    expect(stockFetch).toHaveBeenCalledTimes(1);
  });
});
