import { fetchAllOriginsJson, RemoteRequestError } from '../../Services/remoteData';
import { fetchComic, fetchComicBatch, fetchCurrentComic } from './xkcdApi';
import { xkcdComic } from '../../testUtils/remoteFixtures';

jest.mock('../../Services/remoteData', () => {
  const actual = jest.requireActual('../../Services/remoteData');
  return { ...actual, fetchAllOriginsJson: jest.fn() };
});

const remote = fetchAllOriginsJson as jest.MockedFunction<
  typeof fetchAllOriginsJson
>;

describe('XKCD adapter', () => {
  beforeEach(() => remote.mockReset());

  it('uses HTTPS endpoints and validates current and numbered comics', async () => {
    remote.mockResolvedValueOnce(xkcdComic(20)).mockResolvedValueOnce(xkcdComic(3));
    await expect(fetchCurrentComic()).resolves.toMatchObject({ num: 20 });
    await expect(fetchComic(3)).resolves.toMatchObject({ num: 3 });
    expect(remote.mock.calls[0][0]).toBe('https://xkcd.com/info.0.json');
    expect(remote.mock.calls[1][0]).toBe('https://xkcd.com/3/info.0.json');
  });

  it(
    'loads at most three positions and allows a genuine short final batch',
    async () => {
      remote.mockImplementation((url: string) => {
        const number = Number(url.split('/')[3]);
        return Promise.resolve(xkcdComic(number));
      });
      await expect(fetchComicBatch(4, 6)).resolves.toHaveLength(3);
      await expect(fetchComicBatch(6, 6)).resolves.toHaveLength(1);
    }
  );

  it('maps only definitive 404s to unavailable slots', async () => {
    remote.mockRejectedValueOnce(
      new RemoteRequestError('http', 'not found', 404)
    );
    await expect(fetchComic(404)).resolves.toEqual({
      kind: 'unavailable',
      num: 404,
    });
    remote.mockRejectedValueOnce(new RemoteRequestError('network', 'offline'));
    await expect(fetchComic(5)).rejects.toMatchObject({ category: 'network' });
  });

  it('rejects malformed comic fields', async () => {
    remote.mockResolvedValue({ num: 1, title: 'Incomplete' });
    await expect(fetchComic(1)).rejects.toMatchObject({ category: 'schema' });
    remote.mockResolvedValue({
      ...xkcdComic(1),
      img: 'http://example.test/comic.png',
    });
    await expect(fetchComic(1)).rejects.toMatchObject({ category: 'schema' });
    remote.mockResolvedValue(xkcdComic(2));
    await expect(fetchComic(1)).rejects.toMatchObject({ category: 'schema' });
  });
});
