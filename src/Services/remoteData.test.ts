import {
  fetchAllOriginsJson,
  RemoteRequestError,
} from './remoteData';
import { proxyEnvelope } from '../testUtils/remoteFixtures';

const response = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, json: jest.fn().mockResolvedValue(body) });

describe('fetchAllOriginsJson', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('encodes the complete HTTPS target and sends the feature header', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      response(proxyEnvelope({ value: 'safe' }))
    );
    global.fetch = fetchMock;
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
    [
      'proxy',
      () => response({ contents: '{}', status: { http_code: '200' } }),
    ],
    ['parse', () => response({ contents: '{not json' })],
  ])('classifies %s failures without exposing bodies', async (category, makeValue) => {
    global.fetch = jest.fn().mockResolvedValue(makeValue());
    const promise = fetchAllOriginsJson('https://example.test/secret', {
      requestName: 'stock-twits-live-feed',
    });
    await expect(promise).rejects.toMatchObject({ category });
    await promise.catch((error: RemoteRequestError) => {
      expect(error.message).not.toContain('{not json');
      expect(error.message).not.toContain('secret');
    });
  });

  it('preserves a definitive upstream 404 status', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(response(proxyEnvelope({ private: 'body' }, 404)));
    await expect(
      fetchAllOriginsJson('https://example.test/missing', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'http', status: 404 });
  });

  it('classifies malformed proxy JSON and cancellation', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(response({}, true, 200));
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error('bad envelope')),
    });
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'parse' });

    const controller = new AbortController();
    controller.abort();
    (global.fetch as jest.Mock).mockRejectedValueOnce({ name: 'AbortError' });
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: controller.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });

    const envelopeController = new AbortController();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockImplementation(() => {
        envelopeController.abort();
        return Promise.reject({ name: 'AbortError' });
      }),
    });
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
    global.fetch = jest.fn();
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: cancelled.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });
    expect(global.fetch).not.toHaveBeenCalled();

    const duringResponse = new AbortController();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockImplementation(() => {
        duringResponse.abort();
        return Promise.resolve(proxyEnvelope({ value: 'ignored' }));
      }),
    });
    await expect(
      fetchAllOriginsJson('https://example.test/data', {
        requestName: 'xkcd-slideshow',
        signal: duringResponse.signal,
      })
    ).rejects.toMatchObject({ category: 'aborted' });
  });

  it('classifies request rejection as a safe network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('private details'));
    const request = fetchAllOriginsJson('https://example.test/data', {
      requestName: 'stock-twits-live-feed',
    });
    await expect(request).rejects.toMatchObject({ category: 'network' });
    await request.catch((error: RemoteRequestError) => {
      expect(error.message).not.toContain('private details');
    });
  });

  it('rejects non-HTTPS targets before requesting', async () => {
    global.fetch = jest.fn();
    await expect(
      fetchAllOriginsJson('http://example.test/data', {
        requestName: 'xkcd-slideshow',
      })
    ).rejects.toMatchObject({ category: 'schema' });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
