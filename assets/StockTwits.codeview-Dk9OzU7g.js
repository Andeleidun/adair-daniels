import"./rolldown-runtime-Bh1tDfsg.js";import{X as e,z as t}from"./ButtonBase-C6bbDwrF.js";import{t as n}from"./SourceViewer-ctJJIHNP.js";import{t as r}from"./Card-B-Vc2Yd5.js";import{t as i}from"./remoteData-Dsm-72yM.js";e();var a=`/*
  This page demonstrates a bounded, refreshable StockTwits symbol feed. Remote
  responses are validated before they reach the presentation components.
*/
import React, { useEffect, useRef, useState } from 'react';
import './StockTwits.css';

import CardTemplate from '../Library/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import {
  fetchStockSymbols,
  normalizeSymbols,
  StockSymbolFeed,
} from './stockTwitsApi';
import { RemoteRequestError } from '../../Services/remoteData';
import DemoExpansionButton, {
  DemoExpansionOptions,
  useDemoExpansionState,
} from '../Library/DemoExpansionButton';

type ViewStatus =
  'idle' | 'loading' | 'refreshing' | 'success' | 'empty' | 'error';

const StockTwits = ({
  expanded,
  onExpandedChange,
}: DemoExpansionOptions): React.ReactElement => {
  const [input, setInput] = useState('');
  const [feeds, setFeeds] = useState<ReadonlyArray<StockSymbolFeed>>([]);
  const [filters, setFilters] = useState<ReadonlyArray<string>>([]);
  const [submittedSymbols, setSubmittedSymbols] = useState<
    ReadonlyArray<string>
  >([]);
  const [status, setStatus] = useState<ViewStatus>('idle');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [polling, setPolling] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const controllerRef = useRef<AbortController | null>(null);
  const requestVersionRef = useRef(0);
  const requestInProgressRef = useRef(false);
  const refreshDeadlineRef = useRef(0);
  const refreshRequestRef = useRef<() => void>(() => undefined);
  const { isExpanded, setExpanded } = useDemoExpansionState({
    expanded,
    onExpandedChange,
  });

  const isEmpty = (nextFeeds: ReadonlyArray<StockSymbolFeed>) =>
    nextFeeds.every((feed) => feed.messages.length === 0);

  const warningFor = (symbols: ReadonlyArray<string>) =>
    symbols.length > 0
      ? \`Some symbols could not be loaded: \${symbols.join(', ')}.\`
      : '';

  const runManualSearch = async (symbols: ReadonlyArray<string>) => {
    controllerRef.current?.abort();
    requestVersionRef.current += 1;
    const version = requestVersionRef.current;
    const nextController = new AbortController();
    controllerRef.current = nextController;
    requestInProgressRef.current = true;
    refreshDeadlineRef.current = 0;
    setPolling(false);
    setCountdown(5);
    setFeeds([]);
    setFilters([]);
    setSubmittedSymbols(symbols);
    setWarning('');
    setError('');
    setStatus('loading');

    try {
      const result = await fetchStockSymbols(symbols, nextController.signal);
      if (version !== requestVersionRef.current) {
        return;
      }
      if (result.feeds.length === 0) {
        setStatus('error');
        setError(\`StockTwits could not load: \${symbols.join(', ')}.\`);
        return;
      }
      setFeeds(result.feeds);
      setWarning(warningFor(result.failedSymbols));
      setStatus(isEmpty(result.feeds) ? 'empty' : 'success');
      refreshDeadlineRef.current = Date.now() + 5 * 60000;
      setPolling(true);
    } catch (requestError) {
      if (
        version === requestVersionRef.current &&
        !(
          requestError instanceof RemoteRequestError &&
          requestError.category === 'aborted'
        )
      ) {
        setStatus('error');
        setError('StockTwits could not complete the search.');
      }
    } finally {
      if (version === requestVersionRef.current) {
        requestInProgressRef.current = false;
      }
    }
  };

  const refresh = async () => {
    if (requestInProgressRef.current || submittedSymbols.length === 0) {
      return;
    }
    requestInProgressRef.current = true;
    const version = requestVersionRef.current;
    const nextController = new AbortController();
    controllerRef.current = nextController;
    setStatus('refreshing');
    setWarning('');

    try {
      const result = await fetchStockSymbols(
        submittedSymbols,
        nextController.signal
      );
      if (version !== requestVersionRef.current) {
        return;
      }
      const refreshed = result.feeds.reduce(
        (map, feed) => map.set(feed.symbol, feed),
        new Map<string, StockSymbolFeed>()
      );
      const merged = feeds.map((feed) => refreshed.get(feed.symbol) || feed);
      result.feeds.forEach((feed) => {
        if (!merged.some((existing) => existing.symbol === feed.symbol)) {
          merged.push(feed);
        }
      });
      setFeeds(merged);
      setFilters((selected) =>
        selected.filter((symbol) =>
          merged.some((feed) => feed.symbol === symbol)
        )
      );
      setStatus(isEmpty(merged) ? 'empty' : 'success');
      setWarning(warningFor(result.failedSymbols));
      if (result.failedSymbols.length > 0) {
        setPolling(false);
      } else {
        refreshDeadlineRef.current = Date.now() + 5 * 60000;
        setCountdown(5);
      }
    } catch (requestError) {
      if (
        version === requestVersionRef.current &&
        !(
          requestError instanceof RemoteRequestError &&
          requestError.category === 'aborted'
        )
      ) {
        setStatus(isEmpty(feeds) ? 'empty' : 'success');
        setWarning(
          'Automatic refresh stopped because StockTwits was unavailable.'
        );
        setPolling(false);
      }
    } finally {
      if (version === requestVersionRef.current) {
        requestInProgressRef.current = false;
      }
    }
  };
  useEffect(() => {
    refreshRequestRef.current = () => {
      void refresh();
    };
  });

  useEffect(() => {
    if (!polling) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((refreshDeadlineRef.current - Date.now()) / 60000)
      );
      setCountdown(remaining);
      if (remaining === 0) {
        refreshRequestRef.current();
      }
    }, 60000);
    return () => window.clearInterval(interval);
  }, [polling]);

  useEffect(
    () => () => {
      requestVersionRef.current += 1;
      controllerRef.current?.abort();
    },
    []
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeSymbols(input);
    if (!normalized.valid) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      requestVersionRef.current += 1;
      requestInProgressRef.current = false;
      setPolling(false);
      setError(normalized.message);
      setWarning('');
      setStatus('error');
      return;
    }
    void runManualSearch(normalized.symbols);
  };

  const toggleFilter = (symbol: string) =>
    setFilters((selected) =>
      selected.includes(symbol)
        ? selected.filter((item) => item !== symbol)
        : [...selected, symbol]
    );

  const visibleFeeds =
    filters.length === 0
      ? feeds
      : feeds.filter((feed) => filters.includes(feed.symbol));
  const noVisibleMessages =
    feeds.length > 0 &&
    visibleFeeds.every((feed) => feed.messages.length === 0);
  const refreshLabel =
    status === 'refreshing'
      ? 'Refreshing StockTwits results. Next refresh in 0 minutes.'
      : \`Next refresh in \${countdown} minute\${countdown === 1 ? '' : 's'}.\`;

  return (
    <div
      className={\`app-stocktwits\${
        isExpanded ? ' demo-expanded-view app-stocktwits-expanded' : ''
      }\`}
    >
      <section
        className={\`stock-intro\${isExpanded ? ' stock-intro-expanded' : ''}\`}
        aria-labelledby="stock-search-title"
      >
        <div className={isExpanded ? 'visually-hidden' : 'stock-intro-copy'}>
          <h2 id="stock-search-title">Search public symbol feeds</h2>
          <p>
            Stock symbols are sent through a bounded StockTwits service. Results
            refresh every five minutes until a refresh fails or the page closes.
          </p>
        </div>
        <DemoExpansionButton
          title="StockTwits Feed"
          expanded={isExpanded}
          onExpandedChange={setExpanded}
        />
      </section>
      <section className="search" aria-label="Stock symbol search">
        <form onSubmit={submit}>
          <TextField
            className="stock-input"
            id="stock-symbols"
            label="Stock symbols"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            error={status === 'error' && error !== ''}
            helperText={
              status === 'error'
                ? error
                : 'Separate up to 10 symbols with commas, such as AAPL, MSFT.'
            }
            slotProps={{
              formHelperText: {
                role: status === 'error' && error !== '' ? 'alert' : undefined,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
          <Button className="search-button" variant="contained" type="submit">
            Search
          </Button>
        </form>
      </section>

      {status === 'loading' ? (
        <CircularProgress aria-label="Loading StockTwits results" />
      ) : null}
      {warning ? <p role="status">{warning}</p> : null}
      {polling ? (
        <p className="refresh-status" aria-live="polite">
          {refreshLabel}
        </p>
      ) : null}

      {feeds.length > 0 ? (
        <section className="content">
          <section className="chips" aria-label="Filter by symbol">
            {feeds.map((feed) => {
              const selected = filters.includes(feed.symbol);
              return (
                <Badge
                  badgeContent={feed.messages.length}
                  className="badge"
                  key={feed.symbol}
                  overlap="rectangular"
                >
                  <Chip
                    label={feed.symbol}
                    className={selected ? 'chip active-chip' : 'chip'}
                    onClick={() => toggleFilter(feed.symbol)}
                    aria-pressed={selected}
                  />
                </Badge>
              );
            })}
          </section>
          {noVisibleMessages ? (
            <p role="status">
              {filters.length > 0
                ? 'No messages were found for the selected symbols.'
                : 'No messages were found for these symbols.'}
            </p>
          ) : null}
          <section className="tweets" aria-label="StockTwits messages">
            {visibleFeeds.reduce<React.ReactElement[]>((messages, feed) => {
              feed.messages.forEach((message) => {
                messages.push(
                  <CardTemplate
                    key={\`\${feed.symbol}-\${message.id}\`}
                    classGiven="card"
                    content={
                      <article>
                        <figure className="picture">
                          <img
                            src={message.user.avatarUrl}
                            alt={\`\${message.user.name}'s avatar\`}
                            width="64"
                            height="64"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        </figure>
                        <p className="namearea">
                          <span className="name">{message.user.name}</span>{' '}
                          <span className="username">
                            @{message.user.username}
                          </span>
                        </p>
                        <p className="text">{message.body}</p>
                      </article>
                    }
                  />
                );
              });
              return messages;
            }, [])}
          </section>
        </section>
      ) : null}
    </div>
  );
};

export default StockTwits;
`,o=`import {
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
    \`/v1/stocktwits/\${encodeURIComponent(symbol)}\`,
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
`,s=t(),c=[`// StockTwits component`,a,``,`// StockTwits adapter`,o,``,`// Shared remote transport`,i].join(`
`),l=()=>(0,s.jsx)(`div`,{className:`app-code-viewer`,children:(0,s.jsx)(r,{content:(0,s.jsx)(n,{value:c}),classGiven:`card`})});export{l as default};