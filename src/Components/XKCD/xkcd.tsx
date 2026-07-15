/*
  This page demonstrates live API content with bounded parallel requests,
  cancellation, validation, and recoverable navigation failures.
*/
import React, { useEffect, useRef, useState } from 'react';
import './xkcd.css';
import CardTemplate from '../Library/Card';
import LoadScreen from '../Library/LoadScreen';
import Button from '@mui/material/Button';
import { fetchComicBatch, fetchCurrentComic, XkcdSlot } from './xkcdApi';
import { RemoteRequestError } from '../../Services/remoteData';
import DemoExpansionButton, {
  DemoExpansionOptions,
  useDemoExpansionState,
} from '../Library/DemoExpansionButton';

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
          <img
            src={slot.img}
            alt={slot.alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </figure>
      }
      classGiven="card panel-card"
    />
  );
};

type LoadStatus = 'loading' | 'success' | 'error';

const XKCD = ({
  expanded,
  onExpandedChange,
}: DemoExpansionOptions): React.ReactElement => {
  const [slots, setSlots] = useState<ReadonlyArray<XkcdSlot>>([]);
  const [index, setIndex] = useState(1);
  const [latest, setLatest] = useState(0);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState('');
  const [retryIndex, setRetryIndex] = useState(1);
  const controllerRef = useRef<AbortController | null>(null);
  const requestVersionRef = useRef(0);
  const initialRequestRef = useRef<() => void>(() => undefined);
  const finalIndex = latest > 0 ? Math.floor((latest - 1) / 3) * 3 + 1 : 1;
  const { isExpanded, setExpanded } = useDemoExpansionState({
    expanded,
    onExpandedChange,
  });

  const beginRequest = () => {
    controllerRef.current?.abort();
    requestVersionRef.current += 1;
    const nextController = new AbortController();
    controllerRef.current = nextController;
    return { version: requestVersionRef.current, controller: nextController };
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
      if (request.version !== requestVersionRef.current) {
        return;
      }
      setLatest(current.num);
      setIndex(1);
      setRetryIndex(1);
      setSlots(nextSlots);
      setStatus('success');
    } catch (requestError) {
      if (
        request.version === requestVersionRef.current &&
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
      if (request.version !== requestVersionRef.current) {
        return;
      }
      setSlots(nextSlots);
      setIndex(clamped);
      setStatus('success');
    } catch (requestError) {
      if (
        request.version === requestVersionRef.current &&
        !isAborted(requestError)
      ) {
        setStatus('error');
        setError('That XKCD batch could not be loaded.');
      }
    }
  };

  useEffect(() => {
    initialRequestRef.current = () => {
      void loadInitial();
    };
  });

  useEffect(() => {
    const loadingTimer = window.setTimeout(
      () => initialRequestRef.current(),
      0
    );
    return () => {
      window.clearTimeout(loadingTimer);
      requestVersionRef.current += 1;
      controllerRef.current?.abort();
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
    <div
      className={`xkcd${isExpanded ? ' demo-expanded-view xkcd-expanded' : ''}`}
      aria-busy={loading}
    >
      <section
        className={`xkcd-intro${isExpanded ? ' xkcd-intro-expanded' : ''}`}
        aria-labelledby="comic-browser-title"
      >
        <div className={isExpanded ? 'visually-hidden' : 'xkcd-intro-copy'}>
          <h2 id="comic-browser-title">Browse XKCD in groups of three</h2>
          <p>
            Comics are loaded through AllOrigins from XKCD. Navigation requests
            are cancellable, and unavailable comic positions remain visible.
          </p>
        </div>
        <DemoExpansionButton
          title="XKCD Slideshow"
          expanded={isExpanded}
          onExpandedChange={setExpanded}
        />
      </section>
      {slots.length === 0 && loading ? <LoadScreen /> : null}
      {slots.length > 0 ? (
        <section className="slideshow" aria-label="XKCD comics">
          {slots.map((slot) => (
            <Panel slot={slot} key={slot.num} />
          ))}
        </section>
      ) : null}
      {slots.length > 0 ? (
        <p
          className="comic-range"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading
            ? 'Loading comics…'
            : `Showing comics ${slots[0].num} through ${slots[slots.length - 1].num}.`}
        </p>
      ) : null}
      {error ? (
        <section className="xkcd-error" role="alert">
          <p>{error}</p>
          <Button onClick={retry} variant="contained">
            Retry
          </Button>
        </section>
      ) : null}
      <footer className="xkcd-footer">
        <nav aria-label="Comic navigation">
          <Button
            onClick={() => void loadBatch(1)}
            disabled={loading || latest === 0 || index === 1}
            variant="contained"
          >
            First
          </Button>
          <Button
            onClick={() => void loadBatch(index - 3)}
            disabled={loading || latest === 0 || index === 1}
            variant="contained"
          >
            Previous
          </Button>
          <Button
            onClick={() => void loadBatch(index + 3)}
            disabled={loading || latest === 0 || index === finalIndex}
            variant="contained"
          >
            Next
          </Button>
          <Button
            onClick={() => void loadBatch(finalIndex)}
            disabled={loading || latest === 0 || index === finalIndex}
            variant="contained"
          >
            Last
          </Button>
        </nav>
        <section className="credit">
          <p>
            Sincere thanks to{' '}
            <a
              href="https://xkcd.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Randall Munroe over at XKCD
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>{' '}
            for making such an awesome webcomic.
          </p>
        </section>
      </footer>
    </div>
  );
};

export default XKCD;
