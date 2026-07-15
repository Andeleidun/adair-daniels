export const stockMessage = (id = 1, body = 'Synthetic market update') => ({
  id,
  body,
  user: {
    name: 'Sample User',
    username: `sample${id}`,
    avatar_url_ssl: `https://example.test/avatar-${id}.png`,
  },
});

export const stockFeed = (
  messages: ReadonlyArray<unknown>,
  status = 200
) => ({
  response: { status },
  messages,
});

export const xkcdComic = (num: number) => ({
  num,
  title: `Synthetic Comic ${num}`,
  img: `https://example.test/comic-${num}.png`,
  alt: `Synthetic alternative text ${num}`,
});

export const proxyEnvelope = (
  contents: unknown,
  status = 200
): { contents: string; status: { http_code: number } } => ({
  contents: JSON.stringify(contents),
  status: { http_code: status },
});
