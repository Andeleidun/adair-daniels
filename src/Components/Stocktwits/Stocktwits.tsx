/*
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
  const elapsedMinutesRef = useRef(0);
  const refreshRequestRef = useRef<() => void>(() => undefined);
  const { isExpanded, setExpanded } = useDemoExpansionState({
    expanded,
    onExpandedChange,
  });

  const isEmpty = (nextFeeds: ReadonlyArray<StockSymbolFeed>) =>
    nextFeeds.every((feed) => feed.messages.length === 0);

  const warningFor = (symbols: ReadonlyArray<string>) =>
    symbols.length > 0
      ? `Some symbols could not be loaded: ${symbols.join(', ')}.`
      : '';

  const runManualSearch = async (symbols: ReadonlyArray<string>) => {
    controllerRef.current?.abort();
    requestVersionRef.current += 1;
    const version = requestVersionRef.current;
    const nextController = new AbortController();
    controllerRef.current = nextController;
    requestInProgressRef.current = true;
    elapsedMinutesRef.current = 0;
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
        setError(`StockTwits could not load: ${symbols.join(', ')}.`);
        return;
      }
      setFeeds(result.feeds);
      setWarning(warningFor(result.failedSymbols));
      setStatus(isEmpty(result.feeds) ? 'empty' : 'success');
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
        elapsedMinutesRef.current = 0;
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
      elapsedMinutesRef.current += 1;
      const remaining = Math.max(0, 5 - elapsedMinutesRef.current);
      setCountdown(remaining);
      if (elapsedMinutesRef.current >= 5) {
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
      : `Next refresh in ${countdown} minute${countdown === 1 ? '' : 's'}.`;

  return (
    <div
      className={`app-stocktwits${
        isExpanded ? ' demo-expanded-view app-stocktwits-expanded' : ''
      }`}
    >
      <section
        className={`stock-intro${isExpanded ? ' stock-intro-expanded' : ''}`}
        aria-labelledby="stock-search-title"
      >
        <div className={isExpanded ? 'visually-hidden' : 'stock-intro-copy'}>
          <h2 id="stock-search-title">Search public symbol feeds</h2>
          <p>
            Stock symbols are sent through the AllOrigins proxy to StockTwits.
            Results refresh every five minutes until a refresh fails or the page
            is closed.
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
                    key={`${feed.symbol}-${message.id}`}
                    classGiven="card"
                    content={
                      <article>
                        <figure className="picture">
                          <img
                            src={message.user.avatarUrl}
                            alt={`${message.user.name}'s avatar`}
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
