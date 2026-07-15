import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

export type CardAction =
  | { readonly kind: 'external'; readonly text: string; readonly url: string }
  | {
      readonly kind: 'button';
      readonly text: string;
      readonly onClick: () => void;
    };

interface CardTemplateProps {
  readonly img?: string | null;
  readonly title?: string;
  readonly text?: string;
  readonly content?: React.ReactNode;
  readonly classGiven?: string;
  readonly links?: ReadonlyArray<CardAction>;
}

const CardTemplate = (props: CardTemplateProps): React.ReactElement => {
  const { img, title, text, content, classGiven, links } = props;

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
    if (img) {
      return (
        <CardMedia
          className="media-area"
          image={img}
          title={title}
          role={title ? 'img' : undefined}
          aria-label={title}
          aria-hidden={title ? undefined : true}
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
