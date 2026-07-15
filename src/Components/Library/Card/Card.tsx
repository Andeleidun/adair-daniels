import React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export type CardAction =
  | { readonly kind: 'external'; readonly text: string; readonly url: string }
  | {
      readonly kind: 'button';
      readonly text: string;
      readonly onClick: () => void;
    };

interface CardTemplateProps {
  readonly media?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
    readonly loading?: 'eager' | 'lazy';
  };
  readonly title?: string;
  readonly text?: string;
  readonly content?: React.ReactNode;
  readonly classGiven?: string;
  readonly links?: ReadonlyArray<CardAction>;
}

const CardTemplate = (props: CardTemplateProps): React.ReactElement => {
  const { media, title, text, content, classGiven, links } = props;

  const generateLinks = () => {
    if (links && links.length > 0) {
      return (
        <CardActions className="card-buttons">
          {links.map((link) =>
            link.kind === 'external' ? (
              <Button
                className="card-button"
                component="a"
                fullWidth
                href={link.url}
                key={`${link.kind}-${link.text}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </Button>
            ) : (
              <Button
                className="card-button"
                fullWidth
                key={`${link.kind}-${link.text}`}
                onClick={link.onClick}
              >
                {link.text}
              </Button>
            )
          )}
        </CardActions>
      );
    }
    return null;
  };

  const generateMedia = () => {
    if (media) {
      return (
        <img
          className="media-area"
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={media.loading ?? 'lazy'}
          decoding="async"
        />
      );
    }
  };

  const generateContent = () => {
    return (
      <>
        {title ? <h2>{title}</h2> : null}
        {text ? <p>{text}</p> : null}
        {content}
      </>
    );
  };

  return (
    <Card className={classGiven}>
      {generateMedia()}
      <CardContent>{generateContent()}</CardContent>
      {generateLinks()}
    </Card>
  );
};

export default CardTemplate;
