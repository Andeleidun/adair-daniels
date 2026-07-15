/*
  This page demonstrates React's capacity for generating content from provided
  data. All public resume content remains owned by Home.json.
*/
import React, { ReactElement, useMemo, useState } from 'react';
import './Home.css';

import { headshot, hp, nike, aws } from '../../Resources/images/index';
import HomeData from './Home.json';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

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

interface ResumeEntry {
  readonly id: string;
  readonly title: string;
  readonly dates: string;
  readonly description: string;
  readonly jobTitle: string;
  readonly highlights: ReadonlyArray<string>;
  readonly skills: ReadonlyArray<string>;
}

const homeData: HomeDataSet = HomeData.homeData;
const contentImages = { hp, nike, aws };
type ImageKey = keyof typeof contentImages;

const imageForKey = (key: string): string | undefined =>
  key in contentImages ? contentImages[key as ImageKey] : undefined;

const textContent = (content: ReadonlyArray<ContentItem>): string[] =>
  content.flatMap((item) => ('text' in item ? [item.text] : []));

const linkContent = (content: ReadonlyArray<ContentItem>): LinkSet[] =>
  content.flatMap((item) => ('linkset' in item ? [item.linkset] : []));

const skillContent = (
  content: ReadonlyArray<ContentItem>
): TechnicalSkillGroup[] =>
  content.flatMap((item) => ('skillGroup' in item ? [item.skillGroup] : []));

const groupsContent = (content: ReadonlyArray<ContentItem>): GroupSet[] =>
  content.flatMap((item) => ('groupSet' in item ? item.groupSet : []));

const valueFor = (
  group: GroupSet,
  key: 'title' | 'dates' | 'description' | 'jobTitle'
): string => {
  for (const item of group.group) {
    if (key in item) {
      const value = item[key as keyof typeof item];
      if (typeof value === 'string') return value;
    }
  }
  return '';
};

const resumeEntry = (group: GroupSet): ResumeEntry => {
  const title = valueFor(group, 'title');
  const dates = valueFor(group, 'dates');
  return {
    id: `${title}-${dates}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    dates,
    description: valueFor(group, 'description'),
    jobTitle: valueFor(group, 'jobTitle'),
    highlights: group.group.flatMap((item) =>
      'text' in item ? [item.text] : []
    ),
    skills: group.group.flatMap((item) =>
      'skills' in item ? item.skills : []
    ),
  };
};

const ExternalNotice = (): ReactElement => (
  <span className="visually-hidden"> (opens in a new tab)</span>
);

const Home = (): ReactElement => {
  const experience = useMemo(
    () => groupsContent(homeData.experience.content).map(resumeEntry),
    []
  );
  const education = useMemo(
    () => groupsContent(homeData.education.content).map(resumeEntry),
    []
  );
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set(experience.slice(0, 3).map((entry) => entry.id))
  );
  const careerParagraphs = textContent(homeData.career.content);
  const setEntryOpen = (id: string, open: boolean) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="app-home">
      <section className="home-hero" aria-labelledby="professional-title">
        <img
          className="home-headshot"
          src={headshot}
          alt="Adair Daniels"
          width="500"
          height="500"
          fetchPriority="high"
        />
        <div className="hero-copy">
          <p className="section-kicker">Professional profile</p>
          <h2 id="professional-title">{homeData.career.title}</h2>
          <p className="hero-lead">{careerParagraphs[0]}</p>
          {careerParagraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="hero-actions" aria-label="Professional actions">
            {homeData.career.links?.map((link) => (
              <Button
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                key={link.url}
              >
                {link.text}
                <ExternalNotice />
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="highlights-title">
        <div className="section-heading">
          <p className="section-kicker">Professional highlights</p>
          <h2 id="highlights-title">{homeData.highlights.title}</h2>
        </div>
        <div className="employer-grid">
          {linkContent(homeData.highlights.content).map((highlight) => (
            <article className="employer-card" key={highlight.url}>
              <img
                src={imageForKey(highlight.img)}
                alt=""
                width="150"
                height="150"
                loading="lazy"
                decoding="async"
              />
              <h3>{highlight.title}</h3>
              <p>{highlight.text}</p>
              <a href={highlight.url} target="_blank" rel="noopener noreferrer">
                Visit {highlight.title}
                <ExternalNotice />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="skills-title">
        <div className="section-heading">
          <p className="section-kicker">Capabilities</p>
          <h2 id="skills-title">{homeData.skills.title}</h2>
        </div>
        <div className="skills-grid">
          {skillContent(homeData.skills.content).map((group) => (
            <section className="skill-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul aria-label={`${group.title} skills`}>
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Chip label={skill} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="experience-title">
        <div className="section-heading timeline-heading">
          <div>
            <p className="section-kicker">Career history</p>
            <h2 id="experience-title">{homeData.experience.title}</h2>
          </div>
          <div className="timeline-actions">
            <Button
              onClick={() =>
                setExpanded(new Set(experience.map((entry) => entry.id)))
              }
            >
              Expand all
            </Button>
            <Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
          </div>
        </div>
        <div className="experience-timeline">
          {experience.map((entry) => (
            <details
              className="timeline-entry"
              key={entry.id}
              open={expanded.has(entry.id)}
              onToggle={(event) =>
                setEntryOpen(entry.id, event.currentTarget.open)
              }
            >
              <summary>
                <span className="timeline-summary">
                  <span>
                    <strong>{entry.title}</strong>
                    <span className="timeline-role">{entry.jobTitle}</span>
                  </span>
                  <span className="timeline-date">{entry.dates}</span>
                </span>
              </summary>
              <div className="timeline-content">
                {entry.description ? <p>{entry.description}</p> : null}
                {entry.highlights.length > 0 ? (
                  <ul>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
                {entry.skills.length > 0 ? (
                  <ul
                    className="timeline-skills"
                    aria-label={`${entry.title} skills`}
                  >
                    {entry.skills.map((skill) => (
                      <li key={skill}>
                        <Chip size="small" label={skill} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="education-title">
        <div className="section-heading">
          <p className="section-kicker">Education and continued learning</p>
          <h2 id="education-title">{homeData.education.title}</h2>
        </div>
        <div className="education-grid">
          {education.map((entry) => (
            <article className="education-card" key={entry.id}>
              <h3>{entry.title}</h3>
              <p className="timeline-date">{entry.dates}</p>
              {entry.description ? <p>{entry.description}</p> : null}
              {entry.jobTitle ? (
                <p className="timeline-role">{entry.jobTitle}</p>
              ) : null}
              {entry.highlights.length > 0 ? (
                <ul>
                  {entry.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              {entry.skills.length > 0 ? (
                <ul
                  className="timeline-skills"
                  aria-label={`${entry.title} skills`}
                >
                  {entry.skills.map((skill) => (
                    <li key={skill}>
                      <Chip size="small" label={skill} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
