/*
  This component uses lazy-loaded iframes for separately hosted demonstrations
  while keeping a direct fallback available throughout loading.
*/
import React, { useEffect, useId, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SiteIcon from '../SiteIcon';
import DemoExpansionButton, {
  DemoExpansionOptions,
  useDemoExpansionState,
} from '../DemoExpansionButton';
import './Portal.css';

interface Props extends DemoExpansionOptions {
  readonly url: string;
  readonly title: string;
}

const loadingTimeout = 10000;

const PortalFrame = ({
  url,
  title,
  expanded,
  onExpandedChange,
}: Props): React.ReactElement => {
  const [loaded, setLoaded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const headingId = useId();
  const { isExpanded, setExpanded } = useDemoExpansionState({
    expanded,
    onExpandedChange,
  });

  useEffect(() => {
    if (loaded) {
      return undefined;
    }
    const timer = window.setTimeout(() => setWaiting(true), loadingTimeout);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  return (
    <section
      className={`portal-card${isExpanded ? ' portal-card-expanded' : ''}`}
      aria-label={isExpanded ? `${title} expanded demonstration` : undefined}
      aria-labelledby={isExpanded ? undefined : headingId}
    >
      <div className="portal-toolbar">
        {!isExpanded ? (
          <div>
            <h2 id={headingId}>Interactive demonstration</h2>
            <p>
              This project is hosted separately. If the embedded version is slow
              or unavailable, open it directly in a new tab.
            </p>
          </div>
        ) : null}
        <div className="portal-actions">
          {!isExpanded ? (
            <Button
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              endIcon={<SiteIcon name="external" />}
            >
              Open {title}
              <span className="visually-hidden"> in a new tab</span>
            </Button>
          ) : null}
          <DemoExpansionButton
            title={title}
            expanded={isExpanded}
            onExpandedChange={setExpanded}
          />
        </div>
      </div>
      <div
        className={`portal-frame${isExpanded ? ' portal-frame-expanded' : ''}`}
        aria-busy={!loaded && !waiting}
      >
        {!loaded ? (
          <div className="portal-loading">
            <div
              className="portal-loading-status"
              role="status"
              aria-live="polite"
            >
              {!waiting ? <CircularProgress aria-hidden="true" /> : null}
              <p>
                {waiting
                  ? `${title} is still loading. You can open it directly instead.`
                  : `Loading ${title}`}
              </p>
            </div>
            {waiting && isExpanded ? (
              <Button
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<SiteIcon name="external" />}
              >
                Open {title}
                <span className="visually-hidden"> in a new tab</span>
              </Button>
            ) : null}
          </div>
        ) : null}
        <iframe
          src={url}
          loading="lazy"
          className={`portal${isExpanded ? ' portal-expanded' : ''}`}
          title={title}
          referrerPolicy="no-referrer"
          onLoad={() => {
            setLoaded(true);
            setWaiting(false);
          }}
        />
      </div>
    </section>
  );
};

const Portal = (props: Props): React.ReactElement => (
  <PortalFrame key={props.url} {...props} />
);

export default Portal;
