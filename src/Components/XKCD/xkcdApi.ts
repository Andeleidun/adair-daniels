import {
  fetchAllOriginsJson,
  isHttpsUrl,
  RemoteRequestError,
} from '../../Services/remoteData';

export interface XkcdComic {
  readonly kind: 'comic';
  readonly num: number;
  readonly title: string;
  readonly img: string;
  readonly alt: string;
}

export interface XkcdUnavailableSlot {
  readonly kind: 'unavailable';
  readonly num: number;
}

export type XkcdSlot = XkcdComic | XkcdUnavailableSlot;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseComic = (value: unknown): XkcdComic => {
  if (
    !isRecord(value) ||
    typeof value.num !== 'number' ||
    !Number.isInteger(value.num) ||
    value.num < 1 ||
    typeof value.title !== 'string' ||
    !isHttpsUrl(value.img) ||
    typeof value.alt !== 'string'
  ) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  return {
    kind: 'comic',
    num: value.num,
    title: value.title,
    img: value.img,
    alt: value.alt,
  };
};

export const fetchCurrentComic = async (
  signal?: AbortSignal
): Promise<XkcdComic> =>
  parseComic(
    await fetchAllOriginsJson('https://xkcd.com/info.0.json', {
      signal,
      requestName: 'xkcd-slideshow',
    })
  );

export const fetchComic = async (
  number: number,
  signal?: AbortSignal
): Promise<XkcdSlot> => {
  try {
    const comic = parseComic(
      await fetchAllOriginsJson(`https://xkcd.com/${number}/info.0.json`, {
        signal,
        requestName: 'xkcd-slideshow',
      })
    );
    if (comic.num !== number) {
      throw new RemoteRequestError(
        'schema',
        'XKCD returned a comic for the wrong position.'
      );
    }
    return comic;
  } catch (error) {
    if (
      error instanceof RemoteRequestError &&
      error.category === 'http' &&
      error.status === 404
    ) {
      return { kind: 'unavailable', num: number };
    }
    throw error;
  }
};

export const fetchComicBatch = (
  start: number,
  latest: number,
  signal?: AbortSignal
): Promise<ReadonlyArray<XkcdSlot>> => {
  const count = Math.min(3, latest - start + 1);
  const numbers = Array.from(
    { length: count },
    (_value, index) => start + index
  );
  return Promise.all(numbers.map((number) => fetchComic(number, signal)));
};
