import {
  fetchRemoteJson,
  isAllowedHttpsUrl,
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

export interface XkcdInitial {
  readonly latest: number;
  readonly slots: ReadonlyArray<XkcdSlot>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseSlot = (value: unknown, expected: number): XkcdSlot => {
  if (!isRecord(value) || value.num !== expected) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  if (value.kind === 'unavailable') {
    return { kind: 'unavailable', num: expected };
  }
  if (
    value.kind !== 'comic' ||
    typeof value.title !== 'string' ||
    !isAllowedHttpsUrl(value.img, 'imgs.xkcd.com') ||
    typeof value.alt !== 'string'
  ) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  return {
    kind: 'comic',
    num: expected,
    title: value.title,
    img: value.img,
    alt: value.alt,
  };
};

const parseSlots = (
  value: unknown,
  start: number,
  count: number
): ReadonlyArray<XkcdSlot> => {
  if (!Array.isArray(value) || value.length !== count) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  return value.map((slot, index) => parseSlot(slot, start + index));
};

export const fetchInitialComics = async (
  signal?: AbortSignal
): Promise<XkcdInitial> => {
  const value = await fetchRemoteJson('/v1/xkcd/initial', { signal });
  if (
    !isRecord(value) ||
    typeof value.latest !== 'number' ||
    !Number.isInteger(value.latest) ||
    value.latest < 1
  ) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  const count = Math.min(3, value.latest);
  return {
    latest: value.latest,
    slots: parseSlots(value.slots, 1, count),
  };
};

export const fetchComicBatch = async (
  start: number,
  latest: number,
  signal?: AbortSignal
): Promise<ReadonlyArray<XkcdSlot>> => {
  const count = Math.min(3, latest - start + 1);
  if (!Number.isSafeInteger(start) || start < 1 || count < 1) {
    throw new RemoteRequestError('schema', 'The XKCD range is invalid.');
  }
  const value = await fetchRemoteJson(
    `/v1/xkcd/batch?start=${start}&count=${count}`,
    { signal }
  );
  if (!isRecord(value) || value.start !== start) {
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');
  }
  return parseSlots(value.slots, start, count);
};
