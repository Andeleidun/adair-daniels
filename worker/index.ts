import type {
  RemoteErrorContract,
  StockTwitsFeedContract,
  StockTwitsMessageContract,
  XkcdBatchContract,
  XkcdComicContract,
  XkcdInitialContract,
  XkcdSlotContract,
} from '../src/Services/remoteContracts';

interface WorkerCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void;
}

interface WorkerDependencies {
  readonly fetch: typeof fetch;
  readonly cache?: WorkerCache;
}

class UpstreamError extends Error {
  readonly kind: 'failure' | 'timeout' | 'size';

  constructor(kind: 'failure' | 'timeout' | 'size') {
    super(kind);
    this.kind = kind;
  }
}

const productionOrigin = 'https://adairdaniels.com';
const upstreamTimeout = 8000;
const maximumUpstreamBytes = 512 * 1024;
const xkcdOrigin = 'https://xkcd.com';
const stockTwitsOrigin = 'https://api.stocktwits.com';
const symbolPattern = /^[A-Z0-9.-]{1,16}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAllowedOrigin = (origin: string | null): origin is string => {
  if (origin === productionOrigin) return true;
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
      url.username === '' &&
      url.password === '' &&
      url.pathname === '/'
    );
  } catch {
    return false;
  }
};

const corsHeaders = (origin: string | null): Headers => {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    Vary: 'Origin',
  });
  if (isAllowedOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }
  return headers;
};

const withCors = (response: Response, origin: string | null): Response => {
  const headers = new Headers(response.headers);
  corsHeaders(origin).forEach((value, name) => headers.set(name, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const json = (body: unknown, status = 200, maxAge = 0): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control':
        maxAge > 0
          ? `public, max-age=${maxAge}, s-maxage=${maxAge}`
          : 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });

const errorResponse = (error: string, status: number): Response =>
  json({ error } satisfies RemoteErrorContract, status);

const readLimitedJson = async (response: Response): Promise<unknown> => {
  const declaredLength = Number(response.headers.get('content-length'));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumUpstreamBytes
  ) {
    throw new UpstreamError('size');
  }
  if (!response.body) throw new UpstreamError('failure');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > maximumUpstreamBytes) {
        void reader.cancel();
        throw new UpstreamError('size');
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new UpstreamError('failure');
  }
};

const fetchUpstream = async (
  url: string,
  fetchImplementation: typeof fetch
): Promise<{ readonly response: Response; readonly value?: unknown }> => {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, upstreamTimeout);
  try {
    const response = await fetchImplementation(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (response.status === 404) return { response };
    if (!response.ok) throw new UpstreamError('failure');
    return { response, value: await readLimitedJson(response) };
  } catch (error) {
    if (error instanceof UpstreamError) throw error;
    throw new UpstreamError(timedOut ? 'timeout' : 'failure');
  } finally {
    clearTimeout(timer);
  }
};

const isSafeImage = (value: unknown, hostname: string): value is string => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === hostname &&
      url.port === '' &&
      url.username === '' &&
      url.password === ''
    );
  } catch {
    return false;
  }
};

const parseComic = (value: unknown, expected?: number): XkcdComicContract => {
  if (
    !isRecord(value) ||
    typeof value.num !== 'number' ||
    !Number.isInteger(value.num) ||
    value.num < 1 ||
    (expected !== undefined && value.num !== expected) ||
    typeof value.title !== 'string' ||
    !isSafeImage(value.img, 'imgs.xkcd.com') ||
    typeof value.alt !== 'string'
  ) {
    throw new UpstreamError('failure');
  }
  return {
    kind: 'comic',
    num: value.num,
    title: value.title,
    img: value.img,
    alt: value.alt,
  };
};

const fetchComicSlot = async (
  number: number,
  fetchImplementation: typeof fetch
): Promise<XkcdSlotContract> => {
  const result = await fetchUpstream(
    `${xkcdOrigin}/${number}/info.0.json`,
    fetchImplementation
  );
  return result.response.status === 404
    ? { kind: 'unavailable', num: number }
    : parseComic(result.value, number);
};

const initialXkcd = async (
  fetchImplementation: typeof fetch
): Promise<XkcdInitialContract> => {
  const current = await fetchUpstream(
    `${xkcdOrigin}/info.0.json`,
    fetchImplementation
  );
  if (current.response.status === 404) throw new UpstreamError('failure');
  const latest = parseComic(current.value);
  const count = Math.min(3, latest.num);
  const slots = await Promise.all(
    Array.from({ length: count }, (_value, index) =>
      fetchComicSlot(index + 1, fetchImplementation)
    )
  );
  return { latest: latest.num, slots };
};

const batchXkcd = async (
  start: number,
  count: number,
  fetchImplementation: typeof fetch
): Promise<XkcdBatchContract> => ({
  start,
  slots: await Promise.all(
    Array.from({ length: count }, (_value, index) =>
      fetchComicSlot(start + index, fetchImplementation)
    )
  ),
});

const parseStockMessage = (value: unknown): StockTwitsMessageContract => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    !Number.isInteger(value.id) ||
    value.id < 1 ||
    typeof value.body !== 'string' ||
    !isRecord(value.user) ||
    typeof value.user.name !== 'string' ||
    typeof value.user.username !== 'string' ||
    !isSafeImage(value.user.avatar_url_ssl, 'avatars.stocktwits.com')
  ) {
    throw new UpstreamError('failure');
  }
  return {
    id: value.id,
    body: value.body,
    user: {
      name: value.user.name,
      username: value.user.username,
      avatarUrl: value.user.avatar_url_ssl,
    },
  };
};

const stockFeed = async (
  symbol: string,
  fetchImplementation: typeof fetch
): Promise<StockTwitsFeedContract> => {
  const result = await fetchUpstream(
    `${stockTwitsOrigin}/api/2/streams/symbol/${encodeURIComponent(symbol)}.json`,
    fetchImplementation
  );
  if (
    result.response.status === 404 ||
    !isRecord(result.value) ||
    !isRecord(result.value.response) ||
    result.value.response.status !== 200 ||
    !Array.isArray(result.value.messages)
  ) {
    throw new UpstreamError('failure');
  }
  const messages = result.value.messages.map(parseStockMessage);
  if (new Set(messages.map((message) => message.id)).size !== messages.length) {
    throw new UpstreamError('failure');
  }
  return { symbol, messages };
};

const cached = async (
  cacheKey: string,
  maxAge: number,
  dependencies: WorkerDependencies,
  context: WorkerContext,
  load: () => Promise<unknown>
): Promise<Response> => {
  const key = new Request(`https://worker-cache.invalid${cacheKey}`);
  const match = await dependencies.cache?.match(key);
  if (match) return match;
  const response = json(await load(), 200, maxAge);
  if (dependencies.cache) {
    context.waitUntil(dependencies.cache.put(key, response.clone()));
  }
  return response;
};

const route = async (
  request: Request,
  dependencies: WorkerDependencies,
  context: WorkerContext
): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname === '/v1/xkcd/initial' && url.search === '') {
    return cached('/v1/xkcd/initial', 300, dependencies, context, () =>
      initialXkcd(dependencies.fetch)
    );
  }
  if (url.pathname === '/v1/xkcd/batch') {
    if (
      url.searchParams.getAll('start').length !== 1 ||
      url.searchParams.getAll('count').length !== 1 ||
      [...url.searchParams.keys()].some(
        (key) => key !== 'start' && key !== 'count'
      )
    ) {
      return errorResponse('Invalid XKCD batch request.', 400);
    }
    const startText = url.searchParams.get('start') || '';
    const countText = url.searchParams.get('count') || '';
    if (!/^\d+$/.test(startText) || !/^[1-3]$/.test(countText)) {
      return errorResponse('Invalid XKCD batch request.', 400);
    }
    const start = Number(startText);
    const count = Number(countText);
    if (!Number.isSafeInteger(start) || start < 1) {
      return errorResponse('Invalid XKCD batch request.', 400);
    }
    return cached(
      `/v1/xkcd/batch?start=${start}&count=${count}`,
      86400,
      dependencies,
      context,
      () => batchXkcd(start, count, dependencies.fetch)
    );
  }
  const stockMatch = /^\/v1\/stocktwits\/([^/]+)$/.exec(url.pathname);
  if (stockMatch && url.search === '') {
    let symbol: string;
    try {
      symbol = decodeURIComponent(stockMatch[1]).toUpperCase();
    } catch {
      return errorResponse('Invalid stock symbol.', 400);
    }
    if (!symbolPattern.test(symbol) || !/[A-Z0-9]/.test(symbol)) {
      return errorResponse('Invalid stock symbol.', 400);
    }
    return cached(
      `/v1/stocktwits/${encodeURIComponent(symbol)}`,
      60,
      dependencies,
      context,
      () => stockFeed(symbol, dependencies.fetch)
    );
  }
  return errorResponse('Route not found.', 404);
};

export const createWorker = (dependencies: WorkerDependencies) => ({
  async fetch(request: Request, context: WorkerContext): Promise<Response> {
    const origin = request.headers.get('Origin');
    if (!isAllowedOrigin(origin)) {
      return withCors(errorResponse('Origin not allowed.', 403), origin);
    }
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), origin);
    }
    if (request.method !== 'GET') {
      return withCors(errorResponse('Method not allowed.', 405), origin);
    }
    try {
      return withCors(await route(request, dependencies, context), origin);
    } catch (error) {
      if (error instanceof UpstreamError) {
        const status = error.kind === 'timeout' ? 504 : 502;
        return withCors(
          errorResponse(
            status === 504
              ? 'The upstream service timed out.'
              : 'The upstream service could not complete the request.',
            status
          ),
          origin
        );
      }
      return withCors(
        errorResponse('The request could not be completed.', 500),
        origin
      );
    }
  },
});

const defaultCache = (): WorkerCache | undefined => {
  const value = (
    globalThis as typeof globalThis & {
      caches?: { readonly default?: WorkerCache };
    }
  ).caches;
  return value?.default;
};

export default {
  fetch(request: Request, _environment: unknown, context: WorkerContext) {
    return createWorker({ fetch, cache: defaultCache() }).fetch(
      request,
      context
    );
  },
};
