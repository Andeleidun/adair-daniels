export type RemoteErrorCategory =
  'network' | 'http' | 'proxy' | 'parse' | 'schema' | 'aborted';

export type RemoteFeatureName = 'stock-twits-live-feed' | 'xkcd-slideshow';

export interface AllOriginsOptions {
  readonly signal?: AbortSignal;
  readonly requestName: RemoteFeatureName;
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isHttpsUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' && url.username === '' && url.password === ''
    );
  } catch {
    return false;
  }
};

const isAbortError = (error: unknown, signal?: AbortSignal): boolean =>
  signal?.aborted === true || (isRecord(error) && error.name === 'AbortError');

const abortedRequest = (): RemoteRequestError =>
  new RemoteRequestError('aborted', 'The request was cancelled.');

const isHttpStatus = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 100 &&
  value <= 599;

const upstreamStatus = (
  envelope: Record<string, unknown>
): number | undefined => {
  const status = envelope.status;
  if (status !== undefined) {
    if (isRecord(status) && isHttpStatus(status.http_code)) {
      return status.http_code;
    }
    throw new RemoteRequestError(
      'proxy',
      'The remote-data proxy returned invalid status metadata.'
    );
  }
  if (envelope.statusCode !== undefined) {
    if (isHttpStatus(envelope.statusCode)) {
      return envelope.statusCode;
    }
    throw new RemoteRequestError(
      'proxy',
      'The remote-data proxy returned invalid status metadata.'
    );
  }
  return undefined;
};

export const fetchAllOriginsJson = async (
  targetUrl: string,
  options: AllOriginsOptions
): Promise<unknown> => {
  if (!isHttpsUrl(targetUrl)) {
    throw new RemoteRequestError(
      'schema',
      'The remote service URL must use HTTPS.'
    );
  }
  if (options.signal?.aborted) {
    throw abortedRequest();
  }

  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
      {
        signal: options.signal,
        headers: { 'X-Requested-With': options.requestName },
      }
    );
    if (options.signal?.aborted) {
      throw abortedRequest();
    }

    if (!response.ok) {
      throw new RemoteRequestError(
        'proxy',
        'The remote-data proxy could not complete the request.',
        response.status
      );
    }

    let envelope: unknown;
    try {
      envelope = await response.json();
    } catch (error) {
      if (isAbortError(error, options.signal)) {
        throw abortedRequest();
      }
      throw new RemoteRequestError(
        'parse',
        'The remote-data proxy returned an unreadable response.'
      );
    }
    if (options.signal?.aborted) {
      throw abortedRequest();
    }

    if (!isRecord(envelope)) {
      throw new RemoteRequestError(
        'proxy',
        'The remote-data proxy returned an invalid response.'
      );
    }

    const status = upstreamStatus(envelope);
    if (status !== undefined && (status < 200 || status >= 300)) {
      throw new RemoteRequestError(
        'http',
        status === 404
          ? 'The requested remote resource was not found.'
          : 'The remote service could not complete the request.',
        status
      );
    }

    if (typeof envelope.contents !== 'string') {
      throw new RemoteRequestError(
        'proxy',
        'The remote-data proxy response was incomplete.'
      );
    }
    if (options.signal?.aborted) {
      throw abortedRequest();
    }

    try {
      return JSON.parse(envelope.contents);
    } catch {
      throw new RemoteRequestError(
        'parse',
        'The remote service returned unreadable data.'
      );
    }
  } catch (error) {
    if (error instanceof RemoteRequestError) {
      throw error;
    }
    if (isAbortError(error, options.signal)) {
      throw abortedRequest();
    }
    throw new RemoteRequestError(
      'network',
      'The remote service could not be reached.'
    );
  }
};
