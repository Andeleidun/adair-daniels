export type RemoteErrorCategory =
  | 'network'
  | 'http'
  | 'parse'
  | 'schema'
  | 'aborted'
  | 'timeout'
  | 'size'
  | 'configuration';

export interface RemoteOptions {
  readonly signal?: AbortSignal;
}

export class RemoteRequestError extends Error {
  readonly category: RemoteErrorCategory;
  readonly status?: number;

  constructor(category: RemoteErrorCategory, message: string, status?: number) {
    super(message);
    this.name = 'RemoteRequestError';
    this.category = category;
    this.status = status;
    Object.setPrototypeOf(this, RemoteRequestError.prototype);
  }
}

const clientTimeout = 12000;
const maximumResponseBytes = 1024 * 1024;
const localWorkerOrigin = 'http://127.0.0.1:8787';

const configuredOrigin = (): string =>
  import.meta.env.VITE_REMOTE_API_ORIGIN || localWorkerOrigin;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isAllowedHttpsUrl = (
  value: unknown,
  hostname: string
): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
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

const requestUrl = (endpoint: string): string => {
  if (!endpoint.startsWith('/v1/') || endpoint.includes('#')) {
    throw new RemoteRequestError(
      'configuration',
      'The remote endpoint is not configured correctly.'
    );
  }
  try {
    const origin = new URL(configuredOrigin());
    const local =
      origin.protocol === 'http:' &&
      (origin.hostname === 'localhost' || origin.hostname === '127.0.0.1');
    if (
      origin.username !== '' ||
      origin.password !== '' ||
      origin.pathname !== '/' ||
      origin.search !== '' ||
      origin.hash !== '' ||
      (!local &&
        (origin.protocol !== 'https:' ||
          !origin.hostname.endsWith('.workers.dev')))
    ) {
      throw new Error('invalid origin');
    }
    const url = new URL(endpoint, origin);
    if (!url.pathname.startsWith('/v1/')) {
      throw new RemoteRequestError(
        'configuration',
        'The remote endpoint is not configured correctly.'
      );
    }
    return url.toString();
  } catch (error) {
    if (error instanceof RemoteRequestError) {
      throw error;
    }
    throw new RemoteRequestError(
      'configuration',
      'The remote service is not configured correctly.'
    );
  }
};

const abortedRequest = (): RemoteRequestError =>
  new RemoteRequestError('aborted', 'The request was cancelled.');

const readResponse = async (
  response: Response,
  signal: AbortSignal
): Promise<string> => {
  const declaredLength = Number(response.headers.get('content-length'));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumResponseBytes
  ) {
    throw new RemoteRequestError(
      'size',
      'The remote service returned too much data.'
    );
  }
  if (!response.body) {
    return '';
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let text = '';
  try {
    while (true) {
      if (signal.aborted) {
        throw abortedRequest();
      }
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }
      length += chunk.value.byteLength;
      if (length > maximumResponseBytes) {
        void reader.cancel();
        throw new RemoteRequestError(
          'size',
          'The remote service returned too much data.'
        );
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
};

export const fetchRemoteJson = async (
  endpoint: string,
  options: RemoteOptions = {}
): Promise<unknown> => {
  if (options.signal?.aborted) {
    throw abortedRequest();
  }

  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener('abort', abortFromCaller, { once: true });
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, clientTimeout);

  try {
    const response = await fetch(requestUrl(endpoint), {
      signal: controller.signal,
    });
    if (options.signal?.aborted) {
      throw abortedRequest();
    }
    if (!response.ok) {
      throw new RemoteRequestError(
        'http',
        'The remote service could not complete the request.',
        response.status
      );
    }
    const text = await readResponse(response, controller.signal);
    if (options.signal?.aborted) {
      throw abortedRequest();
    }
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new RemoteRequestError(
        'parse',
        'The remote service returned unreadable data.'
      );
    }
  } catch (error) {
    if (error instanceof RemoteRequestError) {
      if (timedOut && error.category === 'aborted') {
        throw new RemoteRequestError(
          'timeout',
          'The remote service took too long to respond.'
        );
      }
      throw error;
    }
    if (timedOut) {
      throw new RemoteRequestError(
        'timeout',
        'The remote service took too long to respond.'
      );
    }
    if (options.signal?.aborted || controller.signal.aborted) {
      throw abortedRequest();
    }
    if (isRecord(error) && error.name === 'AbortError') {
      throw abortedRequest();
    }
    throw new RemoteRequestError(
      'network',
      'The remote service could not be reached.'
    );
  } finally {
    window.clearTimeout(timer);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
};
