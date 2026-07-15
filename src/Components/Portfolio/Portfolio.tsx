/*
  This page presents existing portfolio screenshots as grouped, manually
  controlled project galleries.
*/
import React, { useState } from 'react';
import './Portfolio.css';

import {
  agechart,
  experiencechart,
  genderchart,
  ketomate10k,
  kmactive,
  kmadvanced,
  kmbodyfat,
  kmfaq,
  kmhome,
  kmintro,
  kmmenu,
  kmresults,
  metricmedia,
  metricmediaspeed,
  mylifter,
  phoenixstone,
  phoenixstonespeed,
  vanderhall,
} from '../../Resources/images/index';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SiteIcon from '../Library/SiteIcon';

export interface PortfolioImage {
  readonly title: string;
  readonly img: string;
  readonly alt: string;
}

export interface PortfolioProject {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly featured: boolean;
  readonly images: ReadonlyArray<PortfolioImage>;
}

export const portfolioProjects: ReadonlyArray<PortfolioProject> = [
  {
    id: 'keto-mate',
    title: 'Keto Mate',
    summary:
      'An Angular and Ionic hybrid mobile diet tool with calculators, results, activity settings, and educational content.',
    featured: true,
    images: [
      {
        title: 'Home, Angular and Ionic App',
        img: kmhome,
        alt: "Screenshot of Keto Mate's home screen. Keto Mate is a diet tool built using Angular and Ionic to create a hybrid mobile app with native functionality.",
      },
      {
        title: 'Navigation Menu',
        img: kmmenu,
        alt: "Screenshot of Keto Mate's navigation menu with links to calculators, the FAQ, introductory content, and the user's profile.",
      },
      {
        title: 'Store Listing',
        img: ketomate10k,
        alt: "Screenshot of Keto Mate's store listing.",
      },
      {
        title: 'Active',
        img: kmactive,
        alt: "Screenshot of Keto Mate's activity selection screen.",
      },
      {
        title: 'Results',
        img: kmresults,
        alt: "Screenshot of Keto Mate's results screen.",
      },
      {
        title: 'Advanced',
        img: kmadvanced,
        alt: "Screenshot of Keto Mate's advanced calculator, which can accept values such as IDEE from a doctor.",
      },
      {
        title: 'Body Fat',
        img: kmbodyfat,
        alt: "Screenshot of Keto Mate's body fat calculator, which uses the US Navy method.",
      },
      {
        title: 'FAQ',
        img: kmfaq,
        alt: "Screenshot of Keto Mate's FAQ, which answers frequently asked questions about the keto diet.",
      },
      {
        title: 'Intro',
        img: kmintro,
        alt: "Screenshot of Keto Mate's intro to the keto diet.",
      },
    ],
  },
  {
    id: 'metric-media',
    title: 'Metric Media',
    summary:
      'A web experience with PowerBI reporting backed by live Azure data, supported by performance testing.',
    featured: true,
    images: [
      {
        title: 'Age Chart using PowerBI',
        img: agechart,
        alt: 'PowerBI chart showing the ages of users of Metric Media phone charging kiosks. PowerBI data was retrieved live from an Azure server.',
      },
      {
        title: 'Experience Chart',
        img: experiencechart,
        alt: 'PowerBI chart showing the engagement level of users of Metric Media phone charging kiosks.',
      },
      {
        title: 'Gender Chart',
        img: genderchart,
        alt: 'PowerBI chart showing the gender of users of Metric Media phone charging kiosks.',
      },
      {
        title: 'Main Site',
        img: metricmedia,
        alt: 'Main site for Metric Media.',
      },
      {
        title: 'Speed Test',
        img: metricmediaspeed,
        alt: 'Speed test for the Metric Media main site.',
      },
    ],
  },
  {
    id: 'phoenix-stone',
    title: 'Phoenix Stone',
    summary:
      'An ecommerce platform using WooCommerce, a custom ordering tool, and an Instagram feed.',
    featured: false,
    images: [
      {
        title: 'eCommerce Site',
        img: phoenixstone,
        alt: 'Ecommerce platform for artist Lady Phoenix Stone, using WooCommerce, a custom ordering tool, and an Instagram feed.',
      },
      {
        title: 'Speed Test',
        img: phoenixstonespeed,
        alt: 'Speed test for the Lady Phoenix Stone ecommerce site.',
      },
    ],
  },
  {
    id: 'vanderhall',
    title: 'Vanderhall',
    summary:
      'An ecommerce platform hosting subdealer sites and customizable purchase options.',
    featured: false,
    images: [
      {
        title: 'eCommerce Site',
        img: vanderhall,
        alt: 'Ecommerce platform for Vanderhall auto maker, hosting an array of subdealer sites and customizable purchase options.',
      },
    ],
  },
  {
    id: 'mylifter',
    title: 'MyLifter',
    summary: 'An ecommerce platform for MyLifter garage tools.',
    featured: false,
    images: [
      {
        title: 'eCommerce Site',
        img: mylifter,
        alt: 'Ecommerce platform for MyLifter garage tools.',
      },
    ],
  },
];

interface ProjectGalleryProps {
  readonly project: PortfolioProject;
}

const ProjectGallery = ({
  project,
}: ProjectGalleryProps): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeImage = project.images[activeIndex];
  const multipleImages = project.images.length > 1;
  const imageDescriptionId = `${project.id}-image-description`;

  const move = (offset: number) => {
    setActiveIndex(
      (current) =>
        (current + offset + project.images.length) % project.images.length
    );
  };

  return (
    <article
      className={
        project.featured ? 'project-card project-featured' : 'project-card'
      }
      aria-labelledby={`${project.id}-title`}
    >
      <div className="project-heading">
        <p className="section-kicker">
          {project.featured ? 'Featured project' : 'Additional project'}
        </p>
        <h2 id={`${project.id}-title`}>{project.title}</h2>
        <p>{project.summary}</p>
      </div>

      <figure className="project-figure">
        <button
          className="project-image-button"
          type="button"
          onClick={() => setDialogOpen(true)}
          aria-label={`Open ${activeImage.title} full size`}
          aria-describedby={imageDescriptionId}
        >
          <img
            src={activeImage.img}
            alt={activeImage.alt}
            loading={project.featured && activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </button>
        <figcaption>
          <strong>{activeImage.title}</strong>
          <span>
            Image {activeIndex + 1} of {project.images.length}
          </span>
        </figcaption>
        <p className="visually-hidden" id={imageDescriptionId}>
          {activeImage.alt}
        </p>
      </figure>

      {multipleImages ? (
        <div className="gallery-controls">
          <div className="gallery-buttons">
            <Button
              aria-label={`Previous ${project.title} image`}
              onClick={() => move(-1)}
            >
              Previous image
            </Button>
            <Button
              aria-label={`Next ${project.title} image`}
              onClick={() => move(1)}
            >
              Next image
            </Button>
          </div>
          <div
            className="gallery-thumbnails"
            aria-label={`${project.title} images`}
          >
            {project.images.map((image, index) => (
              <button
                type="button"
                key={image.title}
                className="thumbnail-button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${image.title}`}
                aria-pressed={activeIndex === index}
              >
                <img src={image.img} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {activeImage.title}, image {activeIndex + 1} of {project.images.length}
      </p>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby={`${project.id}-dialog-title`}
      >
        <DialogTitle
          className="portfolio-dialog-title"
          id={`${project.id}-dialog-title`}
        >
          {project.title}: {activeImage.title}
          <IconButton
            className="dialog-close"
            aria-label="Close full-size image"
            onClick={() => setDialogOpen(false)}
          >
            <SiteIcon name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="portfolio-dialog-content">
          <img src={activeImage.img} alt={activeImage.alt} />
          <p
            className="visually-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeImage.title}, full-size image {activeIndex + 1} of{' '}
            {project.images.length}
          </p>
          {multipleImages ? (
            <div className="dialog-navigation">
              <Button
                aria-label={`Previous ${project.title} full-size image`}
                onClick={() => move(-1)}
              >
                Previous image
              </Button>
              <span>
                {activeIndex + 1} of {project.images.length}
              </span>
              <Button
                aria-label={`Next ${project.title} full-size image`}
                onClick={() => move(1)}
              >
                Next image
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </article>
  );
};

const Portfolio = (): React.ReactElement => (
  <div className="app-portfolio">
    <div className="portfolio-projects">
      {portfolioProjects.map((project) => (
        <ProjectGallery project={project} key={project.id} />
      ))}
    </div>
  </div>
);

export default Portfolio;
