/*
  This page demonstrates React's capacity for generating content from provided
  data. All public resume content remains owned by Home.json.
*/
import React, { ReactElement, useState } from 'react';
import './Home.css';

import CardTemplate, { CardAction } from '../Library/Card';
import {
  headshot,
  ketomate,
  hp,
  nike,
  aws,
} from '../../Resources/images/index';
import HomeData from './Home.json';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

interface ExternalLink {
  readonly url: string;
  readonly text: string;
}

interface LinkSet {
  readonly url: string;
  readonly title: string;
  readonly img: string;
  readonly text: string;
}

interface TechnicalSkillGroup {
  readonly title: string;
  readonly skills: ReadonlyArray<string>;
}

type GroupItem =
  | { readonly classes: string }
  | { readonly title: string }
  | { readonly dates: string }
  | { readonly description: string }
  | { readonly jobTitle: string }
  | { readonly text: string }
  | { readonly skills: ReadonlyArray<string> };

interface GroupSet {
  readonly group: ReadonlyArray<GroupItem>;
}

type ContentItem =
  | { readonly text: string }
  | { readonly linkset: LinkSet }
  | { readonly skillGroup: TechnicalSkillGroup }
  | { readonly groupSet: ReadonlyArray<GroupSet> };

interface CardContent {
  readonly title: string;
  readonly media: string;
  readonly content: ReadonlyArray<ContentItem>;
  readonly links?: ReadonlyArray<ExternalLink>;
  readonly classes: string;
}

interface HomeDataSet {
  readonly career: CardContent;
  readonly highlights: CardContent;
  readonly skills: CardContent;
  readonly experience: CardContent;
  readonly education: CardContent;
}

const homeData: HomeDataSet = HomeData.homeData;
const homeCardKeys: ReadonlyArray<keyof HomeDataSet> = [
  'career',
  'highlights',
  'skills',
  'experience',
  'education',
];
const contentImages = { ketomate, hp, nike, aws };
type ImageKey = keyof typeof contentImages;

const isImageKey = (key: string): key is ImageKey => key in contentImages;
const imageForKey = (key: string): string | undefined =>
  isImageKey(key) ? contentImages[key] : undefined;

const Home = (): ReactElement => {
  const [experienceIndex, setExperienceIndex] = useState(0);
  const [educationIndex, setEducationIndex] = useState(0);

  const generateGroupSet = (groupSet: ReadonlyArray<GroupSet>) =>
    groupSet.map((group, groupIndex) => {
      let groupClass = '';
      const groupContent: ReactElement[] = [];

      group.group.forEach((item, itemIndex) => {
        const itemKey = `${groupIndex}-${itemIndex}`;
        if ('classes' in item) {
          groupClass = item.classes;
        }
        if ('title' in item) {
          groupContent.push(
            <div className="title" key={`${itemKey}-title`}>
              <h3>{item.title}</h3>
            </div>
          );
        }
        if ('dates' in item) {
          groupContent.push(
            <ListItem
              component="div"
              key={`${itemKey}-dates`}
              className="dates"
            >
              <ListItemText primary={item.dates} />
            </ListItem>
          );
        }
        if ('description' in item) {
          groupContent.push(
            <ListItem
              component="div"
              key={`${itemKey}-description`}
              className="description"
            >
              <ListItemText primary={item.description} />
            </ListItem>
          );
        }
        if ('jobTitle' in item) {
          groupContent.push(
            <ListItem
              component="div"
              key={`${itemKey}-job`}
              className="job-title"
            >
              <ListItemText primary={item.jobTitle} />
            </ListItem>
          );
        }
        if ('text' in item) {
          groupContent.push(
            <ListItem
              component="div"
              key={`${itemKey}-text`}
              className="group-text"
            >
              <ListItemIcon>
                <span className="material-icons" aria-hidden="true">
                  layers
                </span>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        }
        if ('skills' in item) {
          groupContent.push(
            <div className="skills" key={`${itemKey}-skills`}>
              {item.skills.map((skill) => (
                <Chip
                  size="small"
                  label={skill}
                  className="skill"
                  key={`${groupIndex}-${skill}`}
                />
              ))}
            </div>
          );
        }
      });

      return (
        <div className={groupClass} key={`${groupClass}-${groupIndex}`}>
          {groupContent}
        </div>
      );
    });

  const formatContent = (contentSet: CardContent): ReactElement => {
    const formattedContent: ReactElement[] = [];
    const title = contentSet.title;

    contentSet.content.forEach((content, index) => {
      const contentKey = `${title}-${index}`;
      if ('linkset' in content) {
        formattedContent.push(
          <ListItem
            component="div"
            key={`${contentKey}-link`}
            className="linkset"
          >
            <a
              href={content.linkset.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <img
                  src={imageForKey(content.linkset.img)}
                  alt={content.linkset.title}
                />
                <h3>{content.linkset.title}</h3>
              </div>
            </a>
            <p>{content.linkset.text}</p>
          </ListItem>
        );
      }
      if ('skillGroup' in content) {
        const headingId = `technical-skill-${content.skillGroup.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}`;
        formattedContent.push(
          <ListItem
            component="section"
            className="technical-skill-group"
            key={`${contentKey}-skill`}
            aria-labelledby={headingId}
          >
            <h3 id={headingId}>{content.skillGroup.title}</h3>
            <ul
              className="technical-skill-list"
              aria-label={`${content.skillGroup.title} skills`}
            >
              {content.skillGroup.skills.map((skill) => (
                <li key={skill}>
                  <Chip
                    size="small"
                    label={skill}
                    className="technical-skill"
                  />
                </li>
              ))}
            </ul>
          </ListItem>
        );
      }
      if ('groupSet' in content) {
        const generatedGroups = generateGroupSet(content.groupSet);
        const isExperience = title === 'Experience';
        const activeIndex = isExperience ? experienceIndex : educationIndex;
        const setIndex = isExperience
          ? setExperienceIndex
          : setEducationIndex;
        const lastIndex = generatedGroups.length - 1;
        const previous = () =>
          setIndex(activeIndex === 0 ? lastIndex : activeIndex - 1);
        const next = () =>
          setIndex(activeIndex === lastIndex ? 0 : activeIndex + 1);

        formattedContent.push(
          <div className="group-set" key={`${contentKey}-groups`}>
            <div className="group-set-content">
              {generatedGroups[activeIndex]}
            </div>
            <div className="group-set-nav">
              <div>
                <Button
                  variant="contained"
                  startIcon={
                    <span className="material-icons" aria-hidden="true">
                      navigate_before
                    </span>
                  }
                  onClick={previous}
                  aria-label={`Previous ${title}`}
                >
                  Previous
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  endIcon={
                    <span className="material-icons" aria-hidden="true">
                      navigate_next
                    </span>
                  }
                  onClick={next}
                  aria-label={`Next ${title}`}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        );
      }
      if ('text' in content) {
        formattedContent.push(
          <ListItem component="div" key={`${contentKey}-text`}>
            <ListItemText primary={content.text} />
          </ListItem>
        );
      }
    });

    return <List component="div">{formattedContent}</List>;
  };

  const cards = homeCardKeys.map((key) => {
    const content = homeData[key];
    const links: ReadonlyArray<CardAction> | undefined = content.links
      ? content.links.map((link) => ({ kind: 'external', ...link }))
      : undefined;

    return (
      <CardTemplate
        title={content.title}
        img={content.media === 'headshot' ? headshot : null}
        content={formatContent(content)}
        classGiven={content.classes}
        links={links}
        key={key}
      />
    );
  });

  return <main className="app-home">{cards}</main>;
};

export default Home;
