/*
  This component uses lazy-loaded iframes for separately hosted demonstrations
  while keeping a direct fallback available throughout loading.
*/
import React, { useEffect, useId, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SiteIcon from '../SiteIcon';
import './Portal.css';

interface Props {
  readonly url: string;
  readonly title: string;
}

const loadingTimeout = 10000;

const PortalFrame = ({ url, title }: Props): React.ReactElement => {
  const [loaded, setLoaded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const headingId = useId();

  useEffect(() => {
    if (loaded) {
      return undefined;
    }
    const timer = window.setTimeout(() => setWaiting(true), loadingTimeout);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  return (
    <section className="portal-card" aria-labelledby={headingId}>
      <div className="portal-toolbar">
        <div>
          <h2 id={headingId}>Interactive demonstration</h2>
          <p>
            This project is hosted separately. If the embedded version is slow
            or unavailable, open it directly in a new tab.
          </p>
        </div>
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
      </div>
      <div className="portal-frame" aria-busy={!loaded && !waiting}>
        {!loaded ? (
          <div className="portal-loading" role="status" aria-live="polite">
            {!waiting ? <CircularProgress aria-hidden="true" /> : null}
            <p>
              {waiting
                ? `${title} is still loading. You can open it directly instead.`
                : `Loading ${title}`}
            </p>
          </div>
        ) : null}
        <iframe
          src={url}
          loading="lazy"
          className="portal"
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
