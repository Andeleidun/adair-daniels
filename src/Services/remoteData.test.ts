import { fetchRemoteJson, RemoteRequestError } from './remoteData';
import { afterEach, describe, expect, it, vi } from 'vitest';

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('fetchRemoteJson', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('requests only a configured Worker endpoint without custom headers', async () => {
    let requested: URL | RequestInfo | undefined;
    let requestOptions: RequestInit | undefined;
    const fetchMock = vi.fn(
      (input: URL | RequestInfo, options?: RequestInit) => {
        requested = input;
        requestOptions = options;
        return Promise.resolve(jsonResponse({ safe: true }));
      }
    );
    globalThis.fetch = fetchMock;

    await expect(fetchRemoteJson('/v1/xkcd/initial')).resolves.toEqual({
      safe: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestOptions?.signal).toBeInstanceOf(AbortSignal);
    if (typeof requested !== 'string') {
      throw new Error('Expected a string request URL.');
    }
    expect(new URL(requested).pathname).toBe('/v1/xkcd/initial');
    expect(requested).not.toContain('allorigins.win');
  });

  it.each([400, 429, 502, 504])(
    'classifies Worker status %s without exposing its body',
    async (status) => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(jsonResponse({ private: 'details' }, status));
      const request = fetchRemoteJson('/v1/xkcd/initial');
      await expect(request).rejects.toMatchObject({
        category: 'http',
        status,
      });
      await request.catch((error: RemoteRequestError) => {
        expect(error.message).not.toContain('details');
      });
    }
  );

  it('rejects a response whose declared size exceeds the limit', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('x', {
        headers: { 'Content-Length': String(1024 * 1024 + 1) },
      })
    );
    await expect(fetchRemoteJson('/v1/xkcd/initial')).rejects.toMatchObject({
      category: 'size',
    });
  });

  it('enforces the response limit while streaming without a length header', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new Uint8Array(1024 * 1024));
            controller.enqueue(new Uint8Array(1));
            controller.close();
          },
        })
      )
    );
    await expect(fetchRemoteJson('/v1/xkcd/initial')).rejects.toMatchObject({
      category: 'size',
    });
  });

  it('distinguishes caller cancellation from the request timeout', async () => {
    const pendingFetch = vi.fn(
      (_url: URL | RequestInfo, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('aborted', 'AbortError'));
          });
        })
    );
    globalThis.fetch = pendingFetch;
    const caller = new AbortController();
    const cancelled = fetchRemoteJson('/v1/xkcd/initial', {
      signal: caller.signal,
    });
    caller.abort();
    await expect(cancelled).rejects.toMatchObject({ category: 'aborted' });

    vi.useFakeTimers();
    const timedOut = fetchRemoteJson('/v1/xkcd/initial');
    const timeoutResult = expect(timedOut).rejects.toMatchObject({
      category: 'timeout',
    });
    await vi.advanceTimersByTimeAsync(12000);
    await timeoutResult;
  });

  it('cleans up caller listeners and rejects unsafe endpoint input', async () => {
    const caller = new AbortController();
    const add = vi.spyOn(caller.signal, 'addEventListener');
    const remove = vi.spyOn(caller.signal, 'removeEventListener');
    const clearTimeout = vi.spyOn(window, 'clearTimeout');
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse({ value: 1 }));
    await fetchRemoteJson('/v1/xkcd/initial', { signal: caller.signal });
    expect(add).toHaveBeenCalledWith('abort', expect.any(Function), {
      once: true,
    });
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    await expect(
      fetchRemoteJson('https://example.test/secret')
    ).rejects.toMatchObject({
      category: 'configuration',
    });
    await expect(fetchRemoteJson('/v1/%2e%2e/private')).rejects.toMatchObject({
      category: 'configuration',
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('returns sanitized parse and network errors', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('{private'));
    await expect(fetchRemoteJson('/v1/xkcd/initial')).rejects.toMatchObject({
      category: 'parse',
    });
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('private network'));
    const request = fetchRemoteJson('/v1/xkcd/initial');
    await expect(request).rejects.toMatchObject({ category: 'network' });
    await request.catch((error: RemoteRequestError) => {
      expect(error.message).not.toContain('private');
    });
  });
});
