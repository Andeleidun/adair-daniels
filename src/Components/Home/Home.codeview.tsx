import React, { useState } from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../Library/CodeView.css';

import CardTemplate from '../Library/Card';

require('prismjs/components/prism-jsx');

const code = `
/*
  This page demonstrates React's strong capacity for generating content from provided data. 
  Aside from a singular primary 'main' component, no static content exists on this page.
  Instead, all content is generated based upon the information in Home.json.
  I used this strategy at HP, combined with retriving said data from an API (demonstrated in the XKCD page),
  to progressively load and submit information for their B2B Printer Sales Contract System.
  The kind of strong typing displayed in this page is extremely important for an enterprise platform.
*/
import React, {useState, useEffect} from 'react';
import './Home.scss';

import CardTemplate from '../Library/Card';
import {headshot, ketomate, hp} from '../../Resources/images/index';
import HomeData from './Home.json';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

interface Links {
  url: string;
  text: string;
}

interface LinkSet {
  url: string;
  title: string;
  img: string;
  text: string;
}

interface SkillSet {
  title: string;
  value: number;
  text: string;
}

interface Group {
  classes?: string;
  title?: string;
  dates?: string;
  description?: string;
  jobTitle?: string;
  text?: string;
  skills?: string[];
}

interface GroupSet {
  group: Group[];
}

interface Content {
  text?: string;
  linkset?: LinkSet;
  skillset?: SkillSet;
  groupSet?: GroupSet[];
}

interface CardContent {
  title: string;
  media: string;
  content: Content[];
  links?: string | Links[];
  classes: string;
}

/* 
  This interface is the combination of all types above, checking for specifically
  known data to be present, as well as requring that any unknown data follow
  the CardContent format.
*/
interface DataSet {
  career: CardContent;
  highlights: CardContent;
  skills: CardContent;
  experience: CardContent;
  education: CardContent;
  [paramName: string]: CardContent;
}

const Home = () => {
    const [experienceIndex, setExperienceIndex] = useState(0);
    const [educationIndex, setEducationIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const homeData: DataSet = HomeData.homeData;
    let experienceLength: number = 0;
    let educationLength: number = 0;

    useEffect(() => {
      if (loading) {
        setLoading(false);
      }
    }, [])
    
    /* 
      This function demonstrates handling multiple navigable elements for a single
      view with a single function.
    */

    const navigate = (input: string, title: string) => {
      const step: number = 1;
      const baseIndex: number = 0;
      let newState: number = 1;
      let operation: string = input+title;

      switch(operation) {
        case 'previousExperience':
          newState = experienceIndex - step;
          if ( newState < baseIndex ) {
            newState = experienceLength;
          }
          setExperienceIndex(newState);
          break;
        case 'previousEducation':
          newState = educationIndex - step;
          if ( newState < baseIndex ) {
            newState = educationLength;
          }
          setEducationIndex(newState);
          break;
        case 'nextExperience':
          newState = experienceIndex + step;
          if ( newState > experienceLength ) {
            newState = baseIndex;
          }
          setExperienceIndex(newState);
          break;
        case 'nextEducation':
          newState = educationIndex + step;
          if ( newState > educationLength ) {
            newState = baseIndex;
          }
          setEducationIndex(newState);
          break;
        default:
          console.log("Navigation error.");
      }
    }

  
    /* 
      This function generates content for specifically an array of type GroupSet.
      This is a good example of factoring out a function for a specific task.
    */

  const generateGroupSet = (groupSet:GroupSet[]) => {
    let groupSetContent:any[] = [];
    for (let group of groupSet) {
      let groupContent:any[] = [];
      let groupClass:string = '';
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

    /* 
      This function handles specifically the generation of content for the inside
      of the cards within the page.
    */
  const formatContent = (contentSet:CardContent) => {
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
            <a href={content.linkset.url} target="_blank" rel="noopener noreferrer">
              <div>
                <img src={image} alt={content.linkset.title} />
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
        generatedGroupSet = generateGroupSet(content.groupSet);
        groupSetLength = generatedGroupSet.length;
        if (title === "Experience") {
          experienceLength = groupSetLength - 1;
          groupSetContent = generatedGroupSet[experienceIndex];
        }
        if (title === "Education") {
          educationLength = groupSetLength - 1;
          groupSetContent = generatedGroupSet[educationIndex];
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
                  onClick={() => navigate("previous", title)}
                >
                  Previous
                </Button>
              </div>
              <div>
                <Button 
                  variant="contained"
                  endIcon={nextIcon}
                  onClick={() => navigate("next", title)}
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

  /* 
    This function handles the generation of cards on this page, as well as
    through factored out functions the generation of all content inside
    the cards, leaving it the sole function called to create content
    on an otherwise empty page.
  */
  const generateContent = () => {
    let contentArray:any[] = [];
    let formattedArray:any[] = [];
    for (let [key, value] of Object.entries(homeData)) {
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
          content={formatContent(content)}
          classGiven={content.classes}
          links={content.links}
        />
      );
    }
    return (formattedArray);
  }
  
  return (
    <main className="app-home">
      {generateContent()}
    </main>
  );

}

export default Home;
`;

const HomeViewer = () => {
  const [codeState] = useState(code);

  let viewer = (
    <Viewer
      value={codeState}
      highlight={(value) => highlight(value, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );
  return (
    <main className="app-code-viewer">
      <CardTemplate content={viewer} classGiven="card" />
    </main>
  );
};

export default HomeViewer;
