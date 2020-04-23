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
import './Portfolio.scss';

import CardTemplate from '../Library/Card';

import 
    {
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
        vanderhall
    } from '../../Resources/images/index';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface Props {};

interface State {
    activeSlide: number;
    loading: boolean;
};

interface PortfolioSlides {
    title: string;
    img?: any;
    imgSet?: any[];
    label: string;
}

class Portfolio extends React.Component <Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
          activeSlide: 0,
          loading: true,
        };
      }

    portfolioSlides:PortfolioSlides[] = [
        {
            title: 'Keto Mate - Highlights, Angular and Ionic App',
            imgSet: [kmhome, ketomate10k],
            label: "Screenshots of Keto Mate's home screen and listing in the Google Play Store. Keto Mate is a diet tool built using Angular and Ionic to create a hybrid mobile app with native functionality."
        },
        {
            title: 'Keto Main - Main Process',
            imgSet: [kmactive, kmresults],
            label: "Screenshots of parts of Keto Mate's inital process, followed through from the home screen."
        },
        {
            title: 'Keto Mate - Additional Tools',
            imgSet: [kmadvanced, kmbodyfat],
            label: "Screenshots of Keto Mate's additional tools, the advanced calculator which can accept values such as an IDEE from a doctor, as well as the body fat calculator using the US Navy method."
        },
        {
            title: 'Keto Mate - Other',
            imgSet: [kmfaq, kmintro],
            label: "Screenshots of Keto Mate's other componenets."
        },
        {
            title: 'Age Chart - Metric Media, using PowerBI',
            img: agechart,
            label: 'PowerBI Chart showing the ages of users of Metric Media phone charging kiosks. PowerBI data was retrieved live from an Azure server.'
        },
        {
            title: 'Experience Chart - Metric Media',
            img: experiencechart,
            label: 'PowerBI Chart showing the engagement level of users of Metric Media phone charging kiosks.'
        },
        {
            title: 'Gender Chart - Metric Media',
            img: genderchart,
            label: 'PowerBI Chart showing the gender of users of Metric Media phone charging kiosks.'
        },
        {
            title: 'Metric Media - Main Site',
            img: metricmedia,
            label: 'Main site for Metric Media.'
        },
        {
            title: 'Metric Media - Speed Test',
            img: metricmediaspeed,
            label: 'Speed test for Metric Media main site.'
        },
        {
            title: 'Phoenix Stone - eCommerce Site',
            img: phoenixstone,
            label: 'eCommerce platform for artist Lady Phoenix Stone, using tools like WooCommerce, a custom ordering tool, and an instagram feed.'
        },
        {
            title: 'Phoenix Stone - Speed Test',
            img: phoenixstonespeed,
            label: 'Speed test for Lady Phoenix Stone eCommerce site.'
        },
        {
            title: 'Vanderhall - eCommerce Site',
            img: vanderhall,
            label: 'eCommerce platform for Vanderhall auto maker, hosting an array of subdealer sites and customizable purchase options.'
        },
        {
            title: 'MyLifter - eCommerce Site',
            img: mylifter,
            label: 'eCommerce platform for MyLifter garage tools.'
        },
    ]

    portfolioDisplay() {
        const maxSlides = this.portfolioSlides.length;

        const handleNext = () => {
            if (this.state.activeSlide === maxSlides - 1) {
                this.setState({ activeSlide: 0});
            } else {
                this.setState({ activeSlide: this.state.activeSlide + 1});
            }
          };
        
        const handleBack = () => {
            if (this.state.activeSlide === 0) {
                this.setState({activeSlide: maxSlides - 1});
            } else {
                this.setState({ activeSlide: this.state.activeSlide - 1});
            }
        };
    
        const handleSlideChange = (slide) => {
            this.setState({ activeSlide: slide});
        };

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

        return (
            <div className="portfolio-display">
                <h3>
                    {this.portfolioSlides[this.state.activeSlide].title}
                </h3>
                <AutoPlaySwipeableViews
                    axis='x'
                    index={this.state.activeSlide}
                    onChangeIndex={handleSlideChange}
                    interval={10000}
                >
                {this.portfolioSlides.map((slide) => (
                    <div key={slide.label} className="slide">
                        {slide.imgSet ?
                            <div className="image-set">
                                <div><img src={slide.imgSet[0]} /></div>
                                <div><img src={slide.imgSet[1]} /></div>
                            </div>
                        :
                            <img src={slide.img} alt={slide.label} />
                        }
                        <br />
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
                        >
                        Previous
                        </Button>
                    }
                    nextButton={
                        <Button 
                            onClick={handleNext} 
                            variant="contained"
                            endIcon={nextIcon}
                        >
                        Next
                        </Button>
                    }
                />
            </div>
        )
    }

    render() {
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
`

class PortfolioViewer extends React.Component <Props, State> {

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

export default PortfolioViewer;
