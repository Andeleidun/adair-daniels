import {
  fetchAllOriginsJson,
  isHttpsUrl,
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
  const symbols = input
    .split(',')
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(
      (symbol, index, all) => symbol !== '' && all.indexOf(symbol) === index
    );

  if (symbols.length === 0) {
    return { valid: false, message: 'Enter at least one stock symbol.' };
  }
  if (symbols.length > 10) {
    return { valid: false, message: 'Enter no more than 10 stock symbols.' };
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
    value.id < 1
  ) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  if (typeof value.body !== 'string' || !isRecord(value.user)) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  const user = value.user;
  if (
    typeof user.name !== 'string' ||
    typeof user.username !== 'string' ||
    !isHttpsUrl(user.avatar_url_ssl)
  ) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  return {
    id: value.id,
    body: value.body,
    user: {
      name: user.name,
      username: user.username,
      avatarUrl: user.avatar_url_ssl,
    },
  };
};

export const fetchStockSymbol = async (
  symbol: string,
  signal?: AbortSignal
): Promise<StockSymbolFeed> => {
  const value = await fetchAllOriginsJson(
    `https://api.stocktwits.com/api/2/streams/symbol/${encodeURIComponent(
      symbol
    )}.json`,
    { signal, requestName: 'stock-twits-live-feed' }
  );
  if (!isRecord(value)) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  if (value.error !== undefined || value.errors !== undefined) {
    throw new RemoteRequestError(
      'http',
      'StockTwits could not complete the symbol request.'
    );
  }
  if (
    !isRecord(value.response) ||
    typeof value.response.status !== 'number' ||
    !Number.isInteger(value.response.status)
  ) {
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');
  }
  if (value.response.status < 200 || value.response.status >= 300) {
    throw new RemoteRequestError(
      'http',
      'StockTwits could not complete the symbol request.',
      value.response.status
    );
  }
  if (!Array.isArray(value.messages)) {
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
  const feeds: StockSymbolFeed[] = [];
  const failedSymbols: string[] = [];
  for (const symbol of symbols) {
    try {
      feeds.push(await fetchStockSymbol(symbol, signal));
    } catch (error) {
      if (error instanceof RemoteRequestError && error.category === 'aborted') {
        throw error;
      }
      failedSymbols.push(symbol);
    }
  }
  return { feeds, failedSymbols };
};
