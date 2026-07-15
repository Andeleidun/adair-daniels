/*
    This page shows the strength available in React's component
    libraries such as Material UI and React-Swipeable-Views,
    which carry strong functionality encompassed in a single
    importable component.
*/
import React from 'react';
import './Portfolio.css';

import CardTemplate from '../Library/Card';

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
  kmresults,
  metricmedia,
  metricmediaspeed,
  mylifter,
  phoenixstone,
  phoenixstonespeed,
  vanderhall,
} from '../../Resources/images/index';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

type PortfolioProps = Record<string, never>;

interface State {
  activeSlide: number;
  autoplay: boolean;
}

interface PortfolioSlide {
  readonly title: string;
  readonly img: string;
  readonly label: string;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class Portfolio extends React.Component<PortfolioProps, State> {
  constructor(props: PortfolioProps) {
    super(props);
    this.state = {
      activeSlide: 0,
      autoplay: !prefersReducedMotion(),
    };
  }

  readonly portfolioSlides: ReadonlyArray<PortfolioSlide> = [
    {
      title: 'Keto Mate - Home, Angular and Ionic App',
      img: kmhome,
      label:
        "Screenshot of Keto Mate's home screen. Keto Mate is a diet tool built using Angular and Ionic to create a hybrid mobile app with native functionality.",
    },
    {
      title: 'Keto Mate - Store Listing',
      img: ketomate10k,
      label: "Screenshot of Keto Mate's store listing.",
    },
    {
      title: 'Keto Mate - Active',
      img: kmactive,
      label: "Screenshot of Keto Mate's activity selection screen",
    },
    {
      title: 'Keto Mate - Results',
      img: kmresults,
      label: "Screenshot of Keto Mate's results screen.",
    },
    {
      title: 'Keto Mate - Advanced',
      img: kmadvanced,
      label:
        "Screenshot of Keto Mate's advanced calculator, which can accept values such as IDEE from a doctor.",
    },
    {
      title: 'Keto Mate - Body Fat',
      img: kmbodyfat,
      label:
        "Screenshot of Keto Mate's body fat calculator, which uses the US Navy method.",
    },
    {
      title: 'Keto Mate - FAQ',
      img: kmfaq,
      label:
        "Screenshot of Keto Mate's FAQ, which answers frequently asked questions about the keto diet.",
    },
    {
      title: 'Keto Mate - Intro',
      img: kmintro,
      label: "Screenshot of Keto Mate's intro to the keto diet.",
    },
    {
      title: 'Age Chart - Metric Media, using PowerBI',
      img: agechart,
      label:
        'PowerBI Chart showing the ages of users of Metric Media phone charging kiosks. PowerBI data was retrieved live from an Azure server.',
    },
    {
      title: 'Experience Chart - Metric Media',
      img: experiencechart,
      label:
        'PowerBI Chart showing the engagement level of users of Metric Media phone charging kiosks.',
    },
    {
      title: 'Gender Chart - Metric Media',
      img: genderchart,
      label:
        'PowerBI Chart showing the gender of users of Metric Media phone charging kiosks.',
    },
    {
      title: 'Metric Media - Main Site',
      img: metricmedia,
      label: 'Main site for Metric Media.',
    },
    {
      title: 'Metric Media - Speed Test',
      img: metricmediaspeed,
      label: 'Speed test for Metric Media main site.',
    },
    {
      title: 'Phoenix Stone - eCommerce Site',
      img: phoenixstone,
      label:
        'eCommerce platform for artist Lady Phoenix Stone, using tools like WooCommerce, a custom ordering tool, and an instagram feed.',
    },
    {
      title: 'Phoenix Stone - Speed Test',
      img: phoenixstonespeed,
      label: 'Speed test for Lady Phoenix Stone eCommerce site.',
    },
    {
      title: 'Vanderhall - eCommerce Site',
      img: vanderhall,
      label:
        'eCommerce platform for Vanderhall auto maker, hosting an array of subdealer sites and customizable purchase options.',
    },
    {
      title: 'MyLifter - eCommerce Site',
      img: mylifter,
      label: 'eCommerce platform for MyLifter garage tools.',
    },
  ];

  portfolioDisplay(): React.ReactElement {
    const maxSlides = this.portfolioSlides.length;

    const handleNext = () => {
      if (this.state.activeSlide === maxSlides - 1) {
        this.setState({ activeSlide: 0 });
      } else {
        this.setState({ activeSlide: this.state.activeSlide + 1 });
      }
    };

    const handleBack = () => {
      if (this.state.activeSlide === 0) {
        this.setState({ activeSlide: maxSlides - 1 });
      } else {
        this.setState({ activeSlide: this.state.activeSlide - 1 });
      }
    };

    const handleSlideChange = (slide: number) => {
      this.setState({ activeSlide: slide });
    };

    const toggleAutoplay = () => {
      this.setState((state) => ({ autoplay: !state.autoplay }));
    };

    const previousIcon = (
      <span className="material-icons" aria-hidden="true">
        navigate_before
      </span>
    );

    const nextIcon = (
      <span className="material-icons" aria-hidden="true">
        navigate_next
      </span>
    );

    return (
      <div
        className="portfolio-display"
        role="region"
        aria-roledescription="carousel"
        aria-label="Portfolio screenshots"
      >
        <h2 className="portfolio-title" aria-live="polite">
          {this.portfolioSlides[this.state.activeSlide].title}
        </h2>
        <Button
          className="autoplay-button"
          onClick={toggleAutoplay}
          variant="contained"
          aria-pressed={!this.state.autoplay}
        >
          {this.state.autoplay ? 'Pause slideshow' : 'Resume slideshow'}
        </Button>
        <AutoPlaySwipeableViews
          axis="x"
          autoplay={this.state.autoplay}
          index={this.state.activeSlide}
          onChangeIndex={handleSlideChange}
          interval={10000}
        >
          {this.portfolioSlides.map((slide, index) => (
            <div
              key={slide.label}
              className="slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${maxSlides}`}
              aria-hidden={index !== this.state.activeSlide}
            >
              <div className="slide-image">
                <img src={slide.img} alt={slide.label} />
              </div>
              {slide.label}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSlides}
          position="static"
          activeStep={this.state.activeSlide}
          backButton={
            <Button
              onClick={handleBack}
              variant="contained"
              startIcon={previousIcon}
              aria-label="Previous"
            >
              Previous
            </Button>
          }
          nextButton={
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={nextIcon}
              aria-label="Next"
            >
              Next
            </Button>
          }
        />
      </div>
    );
  }

  render(): React.ReactElement {
    return (
      <main className="app-portfolio">
        <CardTemplate
          content={this.portfolioDisplay()}
          classGiven="portfolio-card"
        />
      </main>
    );
  }
}

export default Portfolio;
