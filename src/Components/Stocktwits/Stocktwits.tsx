/*
  This page demonstrates a bounded, refreshable StockTwits symbol feed. Remote
  responses are validated before they reach the presentation components.
*/
import React, { useEffect, useRef, useState } from 'react';
import './StockTwits.css';

import CardTemplate from '../Library/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  fetchStockSymbols,
  normalizeSymbols,
  StockSymbolFeed,
} from './stockTwitsApi';
import { RemoteRequestError } from '../../Services/remoteData';

type ViewStatus =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'success'
  | 'empty'
  | 'error';

const StockTwits = (): React.ReactElement => {
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
  const controller = useRef<AbortController | null>(null);
  const requestVersion = useRef(0);
  const requestInProgress = useRef(false);
  const elapsedMinutes = useRef(0);
  const refreshRequest = useRef<() => void>(() => undefined);

  const isEmpty = (nextFeeds: ReadonlyArray<StockSymbolFeed>) =>
    nextFeeds.every((feed) => feed.messages.length === 0);

  const warningFor = (symbols: ReadonlyArray<string>) =>
    symbols.length > 0
      ? `Some symbols could not be loaded: ${symbols.join(', ')}.`
      : '';

  const runManualSearch = async (symbols: ReadonlyArray<string>) => {
    controller.current?.abort();
    requestVersion.current += 1;
    const version = requestVersion.current;
    const nextController = new AbortController();
    controller.current = nextController;
    requestInProgress.current = true;
    elapsedMinutes.current = 0;
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
      if (version !== requestVersion.current) {
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
        version === requestVersion.current &&
        !(
          requestError instanceof RemoteRequestError &&
          requestError.category === 'aborted'
        )
      ) {
        setStatus('error');
        setError('StockTwits could not complete the search.');
      }
    } finally {
      if (version === requestVersion.current) {
        requestInProgress.current = false;
      }
    }
  };

  const refresh = async () => {
    if (requestInProgress.current || submittedSymbols.length === 0) {
      return;
    }
    requestInProgress.current = true;
    const version = requestVersion.current;
    const nextController = new AbortController();
    controller.current = nextController;
    setStatus('refreshing');
    setWarning('');

    try {
      const result = await fetchStockSymbols(
        submittedSymbols,
        nextController.signal
      );
      if (version !== requestVersion.current) {
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
        elapsedMinutes.current = 0;
        setCountdown(5);
      }
    } catch (requestError) {
      if (
        version === requestVersion.current &&
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
      if (version === requestVersion.current) {
        requestInProgress.current = false;
      }
    }
  };
  refreshRequest.current = () => {
    void refresh();
  };

  useEffect(() => {
    if (!polling) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      elapsedMinutes.current += 1;
      const remaining = Math.max(0, 5 - elapsedMinutes.current);
      setCountdown(remaining);
      if (elapsedMinutes.current >= 5) {
        refreshRequest.current();
      }
    }, 60000);
    return () => window.clearInterval(interval);
  }, [polling]);

  useEffect(
    () => () => {
      requestVersion.current += 1;
      controller.current?.abort();
    },
    []
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeSymbols(input);
    if (!normalized.valid) {
      controller.current?.abort();
      controller.current = null;
      requestVersion.current += 1;
      requestInProgress.current = false;
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
    <main className="app-stocktwits">
      <section className="search" aria-label="Stock symbol search">
        <form onSubmit={submit}>
          <TextField
            className="stock-input"
            id="stock-symbols"
            label="Input stock symbols (separate with a comma)"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            error={status === 'error' && error !== ''}
            helperText={status === 'error' ? error : undefined}
            FormHelperTextProps={{ role: 'alert' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <br />
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
    </main>
  );
};

export default StockTwits;
