import {
  fetchAllOriginsJson,
  isHttpsUrl,
  RemoteRequestError,
} from './remoteData';
import { proxyEnvelope } from '../testUtils/remoteFixtures';
import { afterEach, describe, expect, it, vi } from 'vitest';

const response = (body: unknown, ok = true, status = 200): Response => {
  const value = new Response(null, {
    status: ok ? status : Math.max(status, 400),
  });
  vi.spyOn(value, 'json').mockResolvedValue(body);
  return value;
};

describe('fetchAllOriginsJson', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('encodes the complete HTTPS target and sends the feature header', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(response(proxyEnvelope({ value: 'safe' })));
    globalThis.fetch = fetchMock;
    const target = 'https://example.test/path?a=one two&b=$';

    await expect(
      fetchAllOriginsJson(target, {
        requestName: 'stock-twits-live-feed',
      })
    ).resolves.toEqual({ value: 'safe' });
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
      expect.objectContaining({
        headers: { 'X-Requested-With': 'stock-twits-live-feed' },
      })
    );
  });

  it.each([
    ['proxy', () => response({}, false, 503)],
    ['http', () => response(proxyEnvelope({}, 500))],
    ['http', () => response({ contents: '{}', statusCode: 500 })],
    ['proxy', () => response({ status: { http_code: 200 } })],
    ['proxy', () => response({ contents: '{}', status: { http_code: '200' } })],
    ['parse', () => response({ contents: '{not json' })],
  ])(
    'classifies %s failures without exposing bodies',
    async (category, makeValue) => {
      globalThis.fetch = vi.fn().mockResolvedValue(makeValue());
      const promise = fetchAllOriginsJson('https://example.test/secret', {
        requestName: 'stock-twits-live-feed',
      });
      await expect(promise).rejects.toMatchObject({ category });
      await promise.catch((error: RemoteRequestError) => {
        expect(error.message).not.toContain('{not json');
        expect(error.message).not.toContain('secret');
      });
    }
  );

  it('preserves a definitive upstream 404 status', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(response(proxyEnvelope({ private: 'body' }, 404)));
    await expect(
      fetchAllOriginsJson('https://example.test/missing', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'http', status: 404 });
  });

  it('classifies malformed proxy JSON and cancellation', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response({}, true, 200));
    const malformedEnvelope = response({});
    vi.spyOn(malformedEnvelope, 'json').mockRejectedValue(
      new Error('bad envelope')
    );
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(malformedEnvelope);
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'parse' });

    const controller = new AbortController();
    controller.abort();
    const requestAbortError = new Error('Request aborted');
    requestAbortError.name = 'AbortError';
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(requestAbortError);
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: controller.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });

    const envelopeController = new AbortController();
    const cancelledEnvelope = response({});
    vi.spyOn(cancelledEnvelope, 'json').mockImplementation(() => {
      envelopeController.abort();
      const envelopeAbortError = new Error('Response parsing aborted');
      envelopeAbortError.name = 'AbortError';
      return Promise.reject(envelopeAbortError);
    });
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(cancelledEnvelope);
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: envelopeController.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });
  });

  it('honors cancellation before a request and after a response resolves', async () => {
    const cancelled = new AbortController();
    cancelled.abort();
    globalThis.fetch = vi.fn();
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: cancelled.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });
    expect(globalThis.fetch).not.toHaveBeenCalled();

    const duringResponse = new AbortController();
    const interruptedResponse = response({});
    vi.spyOn(interruptedResponse, 'json').mockImplementation(() => {
      duringResponse.abort();
      return Promise.resolve(proxyEnvelope({ value: 'ignored' }));
    });
    globalThis.fetch = vi.fn().mockResolvedValue(interruptedResponse);
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: duringResponse.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });
  });

  it('classifies request rejection as a safe network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('private details'));
    const request = fetchAllOriginsJson('https://example.test/data', {
      requestName: 'stock-twits-live-feed',
    });
    await expect(request).rejects.toMatchObject({ category: 'network' });
    await request.catch((error: RemoteRequestError) => {
      expect(error.message).not.toContain('private details');
    });
  });

  it('rejects unsafe targets before requesting', async () => {
    globalThis.fetch = vi.fn();
    await expect(
      fetchAllOriginsJson('http://example.test/data', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'schema' });
    await expect(
      fetchAllOriginsJson('https://user:password@example.test/data', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'schema' });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(isHttpsUrl('https://example.test/data')).toBe(true);
    expect(isHttpsUrl('https://user:password@example.test/data')).toBe(false);
  });
});
