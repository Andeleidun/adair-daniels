import React from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../Library/CodeView.css';

import CardTemplate from '../Library/Card';

require('prismjs/components/prism-jsx');

interface Props {};

interface State {
    code: string,
    readonly: boolean
};

const code = `
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
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

interface Props {};

interface State {
  experienceIndex: number;
  educationIndex: number;
};

class Home extends React.Component <Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      experienceIndex: 0,
      educationIndex: 0,
    };
  }
  homeData = HomeData.homeData;
  experienceLength:number = 0;
  educationLength:number = 0;

  generateGroupSet(groupSet:any[]) {
    let groupSetContent:any[] = [];
    for (let group of groupSet) {
      let groupContent:any[] = [];
      let groupClass:string = '';
      console.log(group);
      for (let item of group.group) {
        if (item.title) {
          groupContent.push(
            <div className="title">
              <h3>{item.title}</h3>
            </div>
          );
        }
        if (item.dates) {
          groupContent.push(
            <ListItem key={item.dates} className="dates">
              <ListItemText primary={item.dates} />
            </ListItem>
          );
        }
        if (item.classes) {
          groupClass = item.classes;
        }
        if (item.description) {
          groupContent.push(
            <ListItem key={item.description} className="description">
              <ListItemText primary={item.description} />
            </ListItem>
          );
        }
        if (item.jobTitle) {
          groupContent.push(
            <ListItem key={item.jobTitle} className="job-title">
              <ListItemText primary={item.jobTitle} />
            </ListItem>
          );
        }
        if (item.text) {
          groupContent.push(
            <ListItem key={item.text} className="group-text">
              <ListItemIcon>
                <span className="material-icons">
                  layers
                </span>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        }
        if (item.skills) {
          let skills:any[] = [];
          for (let skill of item.skills) {
            skills.push(
              <Chip
                size="small"
                label={skill}
                className="skill"
              />
            );
          }
          groupContent.push(
            <div className="skills">
              {skills}
            </div>
          );
        }
      }
      groupSetContent.push(
        <div className={groupClass}>
          {groupContent}
        </div>
      )
    }
    return(groupSetContent);
  }

  navigate(input: string, title: string) {
    const step:number = 1;
    const baseIndex:number = 0;
    let newState:number = 1;
    let operation:string = input+title;

    console.log(operation, input, title);
    
    switch(operation) {
      case 'previousExperience':
        newState = this.state.experienceIndex - step;
        if ( newState < baseIndex ) {
          newState = this.experienceLength;
        }
        this.setState({
          experienceIndex: newState
        });
        break;
      case 'previousEducation':
        newState = this.state.educationIndex - step;
        if ( newState < baseIndex ) {
          newState = this.educationLength;
        }
        this.setState({
          educationIndex: newState
        });
        break;
      case 'nextExperience':
        newState = this.state.experienceIndex + step;
        if ( newState > this.experienceLength ) {
          newState = baseIndex;
        }
        this.setState({
          experienceIndex: newState
        });
        break;
      case 'nextEducation':
        newState = this.state.educationIndex + step;
        if ( newState > this.educationLength ) {
          newState = baseIndex;
        }
        this.setState({
          educationIndex: newState
        });
        break;
      default:
        console.log("Navigation error.");
    }
  }

  formatContent(contentSet:any) {
    let formattedContent:any[] = [];
    let title:string = contentSet.title;
    let contentGroup:any[] = contentSet.content;
    for (let content of contentGroup) {
      if (content.title) {
        formattedContent.push(
          <h3>{title}</h3>
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
            image = undefined;
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
      if (content.skillset) {
        formattedContent.push(
          <Box component="fieldset" mb={3} borderColor="transparent">
            <h3>{content.skillset.title}</h3>
            <Rating name="read-only" value={content.skillset.value} readOnly />
            <p>{content.skillset.text}</p>
          </Box>
        )
      }
      if (content.groupSet) {
        let generatedGroupSet:any[];
        let groupSetLength:number = 0;
        let groupSetContent:any;
        let previousIcon = (
          <span className="material-icons">
            navigate_before
          </span>
        );
        let nextIcon = (
          <span className="material-icons">
            navigate_next
          </span>
        );
        generatedGroupSet = this.generateGroupSet(content.groupSet);
        groupSetLength = generatedGroupSet.length;
        if (title === "Experience") {
          this.experienceLength = groupSetLength - 1;
          groupSetContent = generatedGroupSet[this.state.experienceIndex];
        }
        if (title === "Education") {
          this.educationLength = groupSetLength - 1;
          groupSetContent = generatedGroupSet[this.state.educationIndex];
        }
        formattedContent.push(
          <div className="group-set">
            <div className="group-set-content">
              {groupSetContent}
            </div>
            <div className="group-set-nav">
              <div>
                <Button 
                  variant="contained"
                  startIcon={previousIcon}
                  onClick={() => this.navigate("previous", title)}
                >
                  Previous
                </Button>
              </div>
              <div>
                <Button 
                  variant="contained"
                  endIcon={nextIcon}
                  onClick={() => this.navigate("next", title)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        );
      }
      if (content.text) {
        formattedContent.push(
          <ListItem key={content.text}>
            <ListItemText primary={content.text} />
          </ListItem>
        );
      }
    }
    return (
      <List>
        {formattedContent}
      </List>
    );
  }

  generateContent() {
    let contentArray:any[] = [];
    let formattedArray:any[] = [];
    for (let [key, value] of Object.entries(this.homeData)) {
      contentArray.push(value);
    }
    for (let content of contentArray) {
      let media:any;
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
          content={this.formatContent(content)}
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
`

class HomeViewer extends React.Component <Props, State> {

    state = {
        code,
        readonly: true,
      };

    render() {
        let viewer = (
            <Viewer
                value={this.state.code}
                highlight={code => highlight(code, languages.js)}
                padding={10}
                style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                }}
            />);
    return (
        <main className="app-code-viewer">
            <CardTemplate
                content={viewer}
                classGiven="card"
            />
        </main>
    );
    }
}

export default HomeViewer;
