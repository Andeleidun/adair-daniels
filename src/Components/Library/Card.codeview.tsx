const CardCode = `
import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const CardTemplate = (props) => {

  const {img, title, text, content, classGiven, links} = props;

  const generateLinks = () => {
    if (links) {
      let generatedLinks:any[] = [];
      for (let link of links) {
        generatedLinks.push(
          <a href={link.url ? link.url : null} onClick={link.onClick ? link.onClick : null} target="_blank" rel="noopener noreferrer">
            <Button className="card-button" fullWidth>
                {link.text}
            </Button>
          </a>
        );
      }
      return(
        <CardActions className="card-buttons">
          {generatedLinks}
        </CardActions>
      );
    }
  }

  const generateMedia = () => {
    if (img) {
      return(
        <CardMedia
          className="media-area"
          image={img}
          title={title}
        />
      );
    }
  }

  const generateContent = () => {
    let genContent:any[] = [];

    if (title) {
      genContent.push(
        <h2>
          {title}
        </h2>
      );
    }
    if (text) {
      genContent.push(
        <p>
          {text}
        </p>
      );
    }
    if (content) {
      genContent.push(content);
    }
    return(genContent);
  }

  return (
    <Card className={classGiven}>
      {generateMedia()}
      <CardContent>
        {generateContent()}
      </CardContent>
      {generateLinks()}
    </Card>
  );
}

export default CardTemplate;
`

export default CardCode;
