/*
  This page demonstrates live API content with bounded parallel requests,
  cancellation, validation, and recoverable navigation failures.
*/
import React, { useEffect, useRef, useState } from 'react';
import './xkcd.css';
import { reactLogo } from '../../Resources/images/index';
import CardTemplate from '../Library/Card';
import {
  fetchComicBatch,
  fetchCurrentComic,
  XkcdSlot,
} from './xkcdApi';
import { RemoteRequestError } from '../../Services/remoteData';

interface PanelProps {
  readonly slot: XkcdSlot;
}

export const Panel = ({ slot }: PanelProps): React.ReactElement => {
  if (slot.kind === 'unavailable') {
    return (
      <div className="unavailable-comic" role="status">
        Comic #{slot.num} unavailable
      </div>
    );
  }
  return (
    <CardTemplate
      title={slot.title}
      content={
        <figure>
          <img src={slot.img} alt={slot.alt} />
        </figure>
      }
      classGiven="card panel-card"
    />
  );
};

type LoadStatus = 'loading' | 'success' | 'error';

const XKCD = (): React.ReactElement => {
  const [slots, setSlots] = useState<ReadonlyArray<XkcdSlot>>([]);
  const [index, setIndex] = useState(1);
  const [latest, setLatest] = useState(0);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState('');
  const [retryIndex, setRetryIndex] = useState(1);
  const controller = useRef<AbortController | null>(null);
  const requestVersion = useRef(0);
  const finalIndex = Math.max(1, latest - 2);

  const beginRequest = () => {
    controller.current?.abort();
    requestVersion.current += 1;
    const nextController = new AbortController();
    controller.current = nextController;
    return { version: requestVersion.current, controller: nextController };
  };

  const isAborted = (requestError: unknown) =>
    requestError instanceof RemoteRequestError &&
    requestError.category === 'aborted';

  const loadInitial = async () => {
    const request = beginRequest();
    setStatus('loading');
    setError('');
    setRetryIndex(1);
    try {
      const current = await fetchCurrentComic(request.controller.signal);
      const nextSlots = await fetchComicBatch(
        1,
        current.num,
        request.controller.signal
      );
      if (request.version !== requestVersion.current) {
        return;
      }
      setLatest(current.num);
      setIndex(1);
      setRetryIndex(1);
      setSlots(nextSlots);
      setStatus('success');
    } catch (requestError) {
      if (
        request.version === requestVersion.current &&
        !isAborted(requestError)
      ) {
        setStatus('error');
        setError('XKCD comics could not be loaded.');
      }
    }
  };

  const loadBatch = async (target: number) => {
    const clamped = Math.max(1, Math.min(target, finalIndex));
    const request = beginRequest();
    setStatus('loading');
    setError('');
    setRetryIndex(clamped);
    try {
      const nextSlots = await fetchComicBatch(
        clamped,
        latest,
        request.controller.signal
      );
      if (request.version !== requestVersion.current) {
        return;
      }
      setSlots(nextSlots);
      setIndex(clamped);
      setStatus('success');
    } catch (requestError) {
      if (
        request.version === requestVersion.current &&
        !isAborted(requestError)
      ) {
        setStatus('error');
        setError('That XKCD batch could not be loaded.');
      }
    }
  };

  useEffect(() => {
    void loadInitial();
    return () => {
      requestVersion.current += 1;
      controller.current?.abort();
    };
  }, []);

  const loading = status === 'loading';
  const retry = () => {
    if (latest === 0) {
      void loadInitial();
    } else {
      void loadBatch(retryIndex);
    }
  };

  return (
    <div className="xkcd" aria-busy={loading}>
      {slots.length === 0 && loading ? (
        <img src={reactLogo} className="loading-logo" alt="Loading comics" />
      ) : null}
      {slots.length > 0 ? (
        <main className="slideshow" aria-live="polite">
          {slots.map((slot) => (
            <Panel slot={slot} key={slot.num} />
          ))}
        </main>
      ) : null}
      {error ? (
        <section className="xkcd-error" role="alert">
          <p>{error}</p>
          <button onClick={retry}>Retry</button>
        </section>
      ) : null}
      <footer className="xkcd-footer">
        <nav aria-label="Comic navigation">
          <button
            onClick={() => void loadBatch(1)}
            disabled={loading || latest === 0 || index === 1}
          >
            First
          </button>
          <button
            onClick={() => void loadBatch(index - 3)}
            disabled={loading || latest === 0 || index === 1}
          >
            Previous
          </button>
          <button
            onClick={() => void loadBatch(index + 3)}
            disabled={loading || latest === 0 || index === finalIndex}
          >
            Next
          </button>
          <button
            onClick={() => void loadBatch(finalIndex)}
            disabled={loading || latest === 0 || index === finalIndex}
          >
            Last
          </button>
        </nav>
        <section className="credit">
          <p>
            Sincere thanks to{' '}
            <a href="https://xkcd.com">Randall Munroe over at XKCD</a> for
            making such an awesome webcomic.
          </p>
        </section>
      </footer>
    </div>
  );
};

export default XKCD;
