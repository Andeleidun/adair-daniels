import { fetchRemoteJson } from '../../Services/remoteData';
import { fetchComicBatch, fetchInitialComics } from './xkcdApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../Services/remoteData', async () => {
  const actual = await vi.importActual<
    typeof import('../../Services/remoteData')
  >('../../Services/remoteData');
  return { ...actual, fetchRemoteJson: vi.fn() };
});

const remote = vi.mocked(fetchRemoteJson);
const comic = (num: number) => ({
  kind: 'comic',
  num,
  title: `Comic ${num}`,
  img: `https://imgs.xkcd.com/comics/${num}.png`,
  alt: `Alternative ${num}`,
});

describe('XKCD adapter', () => {
  beforeEach(() => {
    remote.mockReset();
  });

  it('loads and validates initial metadata and positions in one request', async () => {
    remote.mockResolvedValue({
      latest: 20,
      slots: [comic(1), comic(2), comic(3)],
    });
    await expect(fetchInitialComics()).resolves.toMatchObject({ latest: 20 });
    expect(remote).toHaveBeenCalledWith('/v1/xkcd/initial', {
      signal: undefined,
    });
  });

  it('loads at most three positions and preserves unavailable slots', async () => {
    remote.mockResolvedValue({
      start: 4,
      slots: [comic(4), { kind: 'unavailable', num: 5 }, comic(6)],
    });
    await expect(fetchComicBatch(4, 6)).resolves.toEqual([
      expect.objectContaining({ num: 4 }),
      { kind: 'unavailable', num: 5 },
      expect.objectContaining({ num: 6 }),
    ]);
    expect(remote).toHaveBeenCalledWith('/v1/xkcd/batch?start=4&count=3', {
      signal: undefined,
    });
  });

  it('rejects wrong positions, unsafe images, and invalid ranges', async () => {
    remote.mockResolvedValue({ start: 1, slots: [comic(2)] });
    await expect(fetchComicBatch(1, 1)).rejects.toMatchObject({
      category: 'schema',
    });
    remote.mockResolvedValue({
      start: 1,
      slots: [{ ...comic(1), img: 'https://example.test/1.png' }],
    });
    await expect(fetchComicBatch(1, 1)).rejects.toMatchObject({
      category: 'schema',
    });
    remote.mockResolvedValue({
      start: 1,
      slots: [{ ...comic(1), img: 'https://imgs.xkcd.com:444/comics/1.png' }],
    });
    await expect(fetchComicBatch(1, 1)).rejects.toMatchObject({
      category: 'schema',
    });
    await expect(fetchComicBatch(0, 10)).rejects.toMatchObject({
      category: 'schema',
    });
  });
});
