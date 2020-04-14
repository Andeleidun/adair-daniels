import React from 'react';
import './Home.css';

import CardTemplate from '../Library/Card';
import headshot from '../../Resources/images/self/headshot.jpg';
import ketomate from '../../Resources/images/logos/ketomate.png';
import hp from '../../Resources/images/logos/hp.png';
import HomeData from './Home.json';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

interface Props {};

class Home extends React.Component <Props> {
  homeData = HomeData.homeData;

  formatContent(contentSet:any) {
    let formattedContent = [];
    for (let content of contentSet) {
      if (content.title) {
        formattedContent.push(
          <h3>{content.title}</h3>
        )
      }
      if (content.linkset) {
        let image;
        switch (content.linkset.img) {
          case "ketomate":
            image = ketomate;
            break;
          case "hp":
            image = hp;
            break;
          default:
            break;
        }
        formattedContent.push( 
          <ListItem key={content.linkset.title} className="linkset">
            <a href={content.linkset.url} target="_blank">
              <div>
                <img src={image} />
                <h3>{content.linkset.title}</h3>
              </div>
            </a>
            <p>{content.linkset.text}</p>
          </ListItem>
        )
      }
      formattedContent.push(
        <ListItem key={content.text}>
          <ListItemText primary={content.text} />
        </ListItem>
      );
    }
    return (
      <List>
        {formattedContent}
      </List>
    );
  }

  generateContent() {
    let contentArray = [];
    let formattedArray = [];
    for (let [key, value] of Object.entries(this.homeData)) {
      contentArray.push(value);
    }
    for (let content of contentArray) {
      let media;
      switch (content.media) {
        case "headshot":
          media = headshot;
          break;
        default:
          media = null;
          break;
      }
      formattedArray.push(
        <CardTemplate
          title={content.title}
          img={media}
          content={this.formatContent(content.content)}
          classGiven={content.classes}
          links={content.links}
        />
      );
    }
    return (formattedArray);
  }

  render() {
    return (
      <main className="app-home">
        {this.generateContent()}
      </main>
    );
  }
}

export default Home;
