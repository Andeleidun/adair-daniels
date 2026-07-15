import {
  fetchRemoteJson,
  isAllowedHttpsUrl,
  RemoteRequestError,
} from '../../Services/remoteData';

export interface StockTwitsUser {
  readonly name: string;
  readonly username: string;
  readonly avatarUrl: string;
}

export interface StockTwitsMessage {
  readonly id: number;
  readonly body: string;
  readonly user: StockTwitsUser;
}

export interface StockSymbolFeed {
  readonly symbol: string;
  readonly messages: ReadonlyArray<StockTwitsMessage>;
}

export interface StockSearchResult {
  readonly feeds: ReadonlyArray<StockSymbolFeed>;
  readonly failedSymbols: ReadonlyArray<string>;
}

export type SymbolInputResult =
  | { readonly valid: true; readonly symbols: ReadonlyArray<string> }
  | { readonly valid: false; readonly message: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const normalizeSymbols = (input: string): SymbolInputResult => {
  if (input.length > 200) {
    return { valid: false, message: 'Enter no more than 200 characters.' };
  }
  const seen = new Set<string>();
  const symbols: string[] = [];
  for (const part of input.split(',')) {
    const symbol = part.trim().toUpperCase();
    if (symbol !== '' && !seen.has(symbol)) {
      seen.add(symbol);
      symbols.push(symbol);
    }
  }

  if (symbols.length === 0) {
    return { valid: false, message: 'Enter at least one stock symbol.' };
  }
  if (symbols.length > 10) {
    return { valid: false, message: 'Enter no more than 10 stock symbols.' };
  }
  if (symbols.some((symbol) => symbol.length > 16)) {
    return {
      valid: false,
      message: 'Stock symbols may not exceed 16 characters.',
    };
  }
  if (
    symbols.some(
      (symbol) => !/^[A-Z0-9.-]+$/.test(symbol) || !/[A-Z0-9]/.test(symbol)
    )
  ) {
    return {
      valid: false,
      message:
        'Symbols must include a letter or number and may also contain periods and hyphens.',
    };
  }
  return { valid: true, symbols };
};

const parseMessage = (value: unknown): StockTwitsMessage => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    !Number.isInteger(value.id) ||
    value.id < 1 ||
    typeof value.body !== 'string' ||
    !isRecord(value.user) ||
    typeof value.user.name !== 'string' ||
    typeof value.user.username !== 'string' ||
    !isAllowedHttpsUrl(value.user.avatarUrl, 'avatars.stocktwits.com')
  ) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  return {
    id: value.id,
    body: value.body,
    user: {
      name: value.user.name,
      username: value.user.username,
      avatarUrl: value.user.avatarUrl,
    },
  };
};

export const fetchStockSymbol = async (
  symbol: string,
  signal?: AbortSignal
): Promise<StockSymbolFeed> => {
  const value = await fetchRemoteJson(
    `/v1/stocktwits/${encodeURIComponent(symbol)}`,
    { signal }
  );
  if (
    !isRecord(value) ||
    value.symbol !== symbol ||
    !Array.isArray(value.messages)
  ) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  const messages = value.messages.map(parseMessage);
  if (new Set(messages.map((message) => message.id)).size !== messages.length) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  return { symbol, messages };
};

export const fetchStockSymbols = async (
  symbols: ReadonlyArray<string>,
  signal?: AbortSignal
): Promise<StockSearchResult> => {
  const results = Array.from(
    { length: symbols.length },
    (): StockSymbolFeed | undefined => undefined
  );
  const failed = new Set<number>();
  let nextIndex = 0;

  const run = async () => {
    while (nextIndex < symbols.length) {
      if (signal?.aborted) {
        throw new RemoteRequestError('aborted', 'The request was cancelled.');
      }
      const index = nextIndex;
      nextIndex += 1;
      try {
        results[index] = await fetchStockSymbol(symbols[index], signal);
      } catch (error) {
        if (
          error instanceof RemoteRequestError &&
          error.category === 'aborted'
        ) {
          throw error;
        }
        failed.add(index);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(3, symbols.length) }, () => run())
  );
  return {
    feeds: results.filter(
      (feed): feed is StockSymbolFeed => feed !== undefined
    ),
    failedSymbols: symbols.filter((_symbol, index) => failed.has(index)),
  };
};
