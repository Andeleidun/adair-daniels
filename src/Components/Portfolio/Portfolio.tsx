/*
    This page presents portfolio screenshots in an accessible carousel with
    bounded autoplay, touch navigation, and reduced-motion support.
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

import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';

const autoplayInterval = 10000;
const swipeThreshold = 40;

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
  private autoplayTimer: number | undefined;
  private touchStartX: number | null = null;

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

  componentDidMount(): void {
    this.scheduleAutoplay();
  }

  componentDidUpdate(
    _previousProps: PortfolioProps,
    previousState: State
  ): void {
    if (
      previousState.autoplay !== this.state.autoplay ||
      previousState.activeSlide !== this.state.activeSlide
    ) {
      this.scheduleAutoplay();
    }
  }

  componentWillUnmount(): void {
    this.clearAutoplay();
  }

  private readonly clearAutoplay = (): void => {
    if (this.autoplayTimer !== undefined) {
      window.clearTimeout(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  };

  private readonly scheduleAutoplay = (): void => {
    this.clearAutoplay();
    if (this.state.autoplay) {
      this.autoplayTimer = window.setTimeout(
        () => this.moveBy(1),
        autoplayInterval
      );
    }
  };

  private readonly moveBy = (offset: number): void => {
    this.setState((state) => ({
      activeSlide:
        (state.activeSlide + offset + this.portfolioSlides.length) %
        this.portfolioSlides.length,
    }));
  };

  private readonly handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ): void => {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  };

  private readonly handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ): void => {
    const end = event.changedTouches[0]?.clientX;
    if (this.touchStartX === null || end === undefined) {
      this.touchStartX = null;
      return;
    }
    const distance = end - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(distance) >= swipeThreshold) {
      this.moveBy(distance > 0 ? -1 : 1);
    }
  };

  portfolioDisplay(): React.ReactElement {
    const maxSlides = this.portfolioSlides.length;

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
          aria-pressed={this.state.autoplay}
        >
          {this.state.autoplay ? 'Pause slideshow' : 'Resume slideshow'}
        </Button>
        <div
          className="portfolio-slides"
          data-autoplay={this.state.autoplay}
          data-interval={autoplayInterval}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
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
        </div>
        <MobileStepper
          steps={maxSlides}
          position="static"
          activeStep={this.state.activeSlide}
          backButton={
            <Button
              onClick={() => this.moveBy(-1)}
              variant="contained"
              startIcon={previousIcon}
              aria-label="Previous"
            >
              Previous
            </Button>
          }
          nextButton={
            <Button
              onClick={() => this.moveBy(1)}
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
