import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

interface Props {
  img?: any;
  title?: string;
  text?: string;
  content?: any;
  onClick?: any;
  classGiven?: any;
  links?: any;
};

interface State {
  loading: boolean;
};

class CardTemplate extends React.Component <Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  generateLinks() {
    if (this.props.links) {
      let generatedLinks = [];
      for (let link of this.props.links) {
        generatedLinks.push(
          <a href={link.url} target="_blank">
            <Button className="card-button">
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

  generateMedia() {
    if(this.props.img) {
      return(
        <CardMedia
          className="media-area"
          image={this.props.img}
          title={this.props.title}
        />
      );
    }
  }

  generateContent() {
    let content = [];
    if (this.props.title) {
      content.push(
        <h2>
          {this.props.title}
        </h2>
      );
    }
    if (this.props.text) {
      content.push(
        <p>
          {this.props.text}
        </p>
      );
    }
    if (this.props.content) {
      content.push(this.props.content);
    }
    return(content);
  }

  render() {
    return (
      <Card className={this.props.classGiven}>
        {this.generateMedia()}
        <CardContent>
          {this.generateContent()}
        </CardContent>
        {this.generateLinks()}
      </Card>
    );
  }
}

export default CardTemplate;
