import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";e();var i=`/*\r
    This page presents portfolio screenshots in an accessible carousel with\r
    bounded autoplay, touch navigation, and reduced-motion support.\r
*/\r
import React from 'react';\r
import './Portfolio.css';\r
\r
import CardTemplate from '../Library/Card';\r
\r
import {\r
  agechart,\r
  experiencechart,\r
  genderchart,\r
  ketomate10k,\r
  kmactive,\r
  kmadvanced,\r
  kmbodyfat,\r
  kmfaq,\r
  kmhome,\r
  kmintro,\r
  kmresults,\r
  metricmedia,\r
  metricmediaspeed,\r
  mylifter,\r
  phoenixstone,\r
  phoenixstonespeed,\r
  vanderhall,\r
} from '../../Resources/images/index';\r
\r
import MobileStepper from '@mui/material/MobileStepper';\r
import Button from '@mui/material/Button';\r
\r
const autoplayInterval = 10000;\r
const swipeThreshold = 40;\r
\r
type PortfolioProps = Record<string, never>;\r
\r
interface State {\r
  activeSlide: number;\r
  autoplay: boolean;\r
}\r
\r
interface PortfolioSlide {\r
  readonly title: string;\r
  readonly img: string;\r
  readonly label: string;\r
}\r
\r
const prefersReducedMotion = (): boolean =>\r
  typeof window !== 'undefined' &&\r
  typeof window.matchMedia === 'function' &&\r
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;\r
\r
class Portfolio extends React.Component<PortfolioProps, State> {\r
  private autoplayTimer: number | undefined;\r
  private touchStartX: number | null = null;\r
\r
  constructor(props: PortfolioProps) {\r
    super(props);\r
    this.state = {\r
      activeSlide: 0,\r
      autoplay: !prefersReducedMotion(),\r
    };\r
  }\r
\r
  readonly portfolioSlides: ReadonlyArray<PortfolioSlide> = [\r
    {\r
      title: 'Keto Mate - Home, Angular and Ionic App',\r
      img: kmhome,\r
      label:\r
        "Screenshot of Keto Mate's home screen. Keto Mate is a diet tool built using Angular and Ionic to create a hybrid mobile app with native functionality.",\r
    },\r
    {\r
      title: 'Keto Mate - Store Listing',\r
      img: ketomate10k,\r
      label: "Screenshot of Keto Mate's store listing.",\r
    },\r
    {\r
      title: 'Keto Mate - Active',\r
      img: kmactive,\r
      label: "Screenshot of Keto Mate's activity selection screen",\r
    },\r
    {\r
      title: 'Keto Mate - Results',\r
      img: kmresults,\r
      label: "Screenshot of Keto Mate's results screen.",\r
    },\r
    {\r
      title: 'Keto Mate - Advanced',\r
      img: kmadvanced,\r
      label:\r
        "Screenshot of Keto Mate's advanced calculator, which can accept values such as IDEE from a doctor.",\r
    },\r
    {\r
      title: 'Keto Mate - Body Fat',\r
      img: kmbodyfat,\r
      label:\r
        "Screenshot of Keto Mate's body fat calculator, which uses the US Navy method.",\r
    },\r
    {\r
      title: 'Keto Mate - FAQ',\r
      img: kmfaq,\r
      label:\r
        "Screenshot of Keto Mate's FAQ, which answers frequently asked questions about the keto diet.",\r
    },\r
    {\r
      title: 'Keto Mate - Intro',\r
      img: kmintro,\r
      label: "Screenshot of Keto Mate's intro to the keto diet.",\r
    },\r
    {\r
      title: 'Age Chart - Metric Media, using PowerBI',\r
      img: agechart,\r
      label:\r
        'PowerBI Chart showing the ages of users of Metric Media phone charging kiosks. PowerBI data was retrieved live from an Azure server.',\r
    },\r
    {\r
      title: 'Experience Chart - Metric Media',\r
      img: experiencechart,\r
      label:\r
        'PowerBI Chart showing the engagement level of users of Metric Media phone charging kiosks.',\r
    },\r
    {\r
      title: 'Gender Chart - Metric Media',\r
      img: genderchart,\r
      label:\r
        'PowerBI Chart showing the gender of users of Metric Media phone charging kiosks.',\r
    },\r
    {\r
      title: 'Metric Media - Main Site',\r
      img: metricmedia,\r
      label: 'Main site for Metric Media.',\r
    },\r
    {\r
      title: 'Metric Media - Speed Test',\r
      img: metricmediaspeed,\r
      label: 'Speed test for Metric Media main site.',\r
    },\r
    {\r
      title: 'Phoenix Stone - eCommerce Site',\r
      img: phoenixstone,\r
      label:\r
        'eCommerce platform for artist Lady Phoenix Stone, using tools like WooCommerce, a custom ordering tool, and an instagram feed.',\r
    },\r
    {\r
      title: 'Phoenix Stone - Speed Test',\r
      img: phoenixstonespeed,\r
      label: 'Speed test for Lady Phoenix Stone eCommerce site.',\r
    },\r
    {\r
      title: 'Vanderhall - eCommerce Site',\r
      img: vanderhall,\r
      label:\r
        'eCommerce platform for Vanderhall auto maker, hosting an array of subdealer sites and customizable purchase options.',\r
    },\r
    {\r
      title: 'MyLifter - eCommerce Site',\r
      img: mylifter,\r
      label: 'eCommerce platform for MyLifter garage tools.',\r
    },\r
  ];\r
\r
  componentDidMount(): void {\r
    this.scheduleAutoplay();\r
  }\r
\r
  componentDidUpdate(\r
    _previousProps: PortfolioProps,\r
    previousState: State\r
  ): void {\r
    if (\r
      previousState.autoplay !== this.state.autoplay ||\r
      previousState.activeSlide !== this.state.activeSlide\r
    ) {\r
      this.scheduleAutoplay();\r
    }\r
  }\r
\r
  componentWillUnmount(): void {\r
    this.clearAutoplay();\r
  }\r
\r
  private readonly clearAutoplay = (): void => {\r
    if (this.autoplayTimer !== undefined) {\r
      window.clearTimeout(this.autoplayTimer);\r
      this.autoplayTimer = undefined;\r
    }\r
  };\r
\r
  private readonly scheduleAutoplay = (): void => {\r
    this.clearAutoplay();\r
    if (this.state.autoplay) {\r
      this.autoplayTimer = window.setTimeout(\r
        () => this.moveBy(1),\r
        autoplayInterval\r
      );\r
    }\r
  };\r
\r
  private readonly moveBy = (offset: number): void => {\r
    this.setState((state) => ({\r
      activeSlide:\r
        (state.activeSlide + offset + this.portfolioSlides.length) %\r
        this.portfolioSlides.length,\r
    }));\r
  };\r
\r
  private readonly handleTouchStart = (\r
    event: React.TouchEvent<HTMLDivElement>\r
  ): void => {\r
    this.touchStartX = event.touches[0]?.clientX ?? null;\r
  };\r
\r
  private readonly handleTouchEnd = (\r
    event: React.TouchEvent<HTMLDivElement>\r
  ): void => {\r
    const end = event.changedTouches[0]?.clientX;\r
    if (this.touchStartX === null || end === undefined) {\r
      this.touchStartX = null;\r
      return;\r
    }\r
    const distance = end - this.touchStartX;\r
    this.touchStartX = null;\r
    if (Math.abs(distance) >= swipeThreshold) {\r
      this.moveBy(distance > 0 ? -1 : 1);\r
    }\r
  };\r
\r
  portfolioDisplay(): React.ReactElement {\r
    const maxSlides = this.portfolioSlides.length;\r
\r
    const toggleAutoplay = () => {\r
      this.setState((state) => ({ autoplay: !state.autoplay }));\r
    };\r
\r
    const previousIcon = (\r
      <span className="material-icons" aria-hidden="true">\r
        navigate_before\r
      </span>\r
    );\r
\r
    const nextIcon = (\r
      <span className="material-icons" aria-hidden="true">\r
        navigate_next\r
      </span>\r
    );\r
\r
    return (\r
      <div\r
        className="portfolio-display"\r
        role="region"\r
        aria-roledescription="carousel"\r
        aria-label="Portfolio screenshots"\r
      >\r
        <h2 className="portfolio-title" aria-live="polite">\r
          {this.portfolioSlides[this.state.activeSlide].title}\r
        </h2>\r
        <Button\r
          className="autoplay-button"\r
          onClick={toggleAutoplay}\r
          variant="contained"\r
          aria-pressed={this.state.autoplay}\r
        >\r
          {this.state.autoplay ? 'Pause slideshow' : 'Resume slideshow'}\r
        </Button>\r
        <div\r
          className="portfolio-slides"\r
          data-autoplay={this.state.autoplay}\r
          data-interval={autoplayInterval}\r
          onTouchStart={this.handleTouchStart}\r
          onTouchEnd={this.handleTouchEnd}\r
        >\r
          {this.portfolioSlides.map((slide, index) => (\r
            <div\r
              key={slide.label}\r
              className="slide"\r
              role="group"\r
              aria-roledescription="slide"\r
              aria-label={\`\${index + 1} of \${maxSlides}\`}\r
              aria-hidden={index !== this.state.activeSlide}\r
            >\r
              <div className="slide-image">\r
                <img src={slide.img} alt={slide.label} />\r
              </div>\r
              {slide.label}\r
            </div>\r
          ))}\r
        </div>\r
        <MobileStepper\r
          steps={maxSlides}\r
          position="static"\r
          activeStep={this.state.activeSlide}\r
          backButton={\r
            <Button\r
              onClick={() => this.moveBy(-1)}\r
              variant="contained"\r
              startIcon={previousIcon}\r
              aria-label="Previous"\r
            >\r
              Previous\r
            </Button>\r
          }\r
          nextButton={\r
            <Button\r
              onClick={() => this.moveBy(1)}\r
              variant="contained"\r
              endIcon={nextIcon}\r
              aria-label="Next"\r
            >\r
              Next\r
            </Button>\r
          }\r
        />\r
      </div>\r
    );\r
  }\r
\r
  render(): React.ReactElement {\r
    return (\r
      <main className="app-portfolio">\r
        <CardTemplate\r
          content={this.portfolioDisplay()}\r
          classGiven="portfolio-card"\r
        />\r
      </main>\r
    );\r
  }\r
}\r
\r
export default Portfolio;\r
`,a=n(),o=()=>(0,a.jsx)(`main`,{className:`app-code-viewer`,children:(0,a.jsx)(t,{content:(0,a.jsx)(r,{value:i}),classGiven:`card`})});export{o as default};