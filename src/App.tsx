"use strict";

import React from 'react';
import './App.scss';

import Header from './Components/Library/Header';
import NavBar from './Components/Library/NavBar';
import LoadScreen from './Components/Library/LoadScreen';

import Home from './Components/Home/Home';
import HomeViewer from './Components/Home/Home.codeview';
import XKCD from './Components/XKCD/xkcd';
import XKCDViewer from './Components/XKCD/xkcd.codeview';
import Portfolio from './Components/Portfolio/Portfolio';
import PortfolioViewer from './Components/Portfolio/Portfolio.codeview';

import Slide from '@material-ui/core/Slide';

interface Props {};

interface State {
  loading: boolean;
  navShow: boolean;
  navShowClass: string;
  currentPage: any;
  codeView: boolean;
};

interface PageInterface {
  text: string;
  title: string;
  icon: string;
  component: any;
  codeView?: any;
}

class App extends React.Component <Props, State> {

  pages: PageInterface[] = [
    {text: 'Home', title: 'Adair Daniels', icon: 'home', component: <Home />, codeView: <HomeViewer />},
    {text: 'XKCD Slideshow', title: 'XKCD Slideshow', icon: 'burst_mode', component: <XKCD />, codeView: <XKCDViewer />},
    {text: 'Portfolio', title: 'Portfolio', icon: 'compare', component: <Portfolio />, codeView: <PortfolioViewer />},
  ];

  state: State = {
    loading: true,
    navShow: false,
    navShowClass: 'app app-without-menu',
    currentPage: this.pages[0],
    codeView: false
  };

  toggleNav() {
    if (this.state.navShow) {
      this.setState({
        navShowClass: 'app app-without-menu '
      });
    } else {
      this.setState({
        navShowClass: 'app app-with-menu '
      });
    }
    this.setState({
      navShow: !this.state.navShow
    });
  }

  navigate(page: any, codeView: boolean) {
    this.setState({
      currentPage: page,
      codeView
    });
  }

  generateComponent() {
    if (this.state.codeView) {
      return (this.state.currentPage.codeView);
    } else {
      return (this.state.currentPage.component);
    }
  }

  componentDidMount() {
    this.setState( {
      loading: false
    })
  }

  render() {
    return (
      <div className={this.state.navShowClass}>
        <Header
          onClick={() => this.toggleNav()}
          navClick={(page: any, codeView:boolean) => this.navigate(page, codeView)}
          currentPage={this.state.currentPage}
         />
        <Slide direction="right" in={this.state.navShow} mountOnEnter unmountOnExit>
          <div className="app-menu">
            <NavBar
              pages={this.pages}
              navClick={(page: any, codeView:boolean) => this.navigate(page, codeView)}
              closeClick={() => this.toggleNav()}
            />
          </div>
        </Slide>
        <div className="app-main">
          {this.state.loading ? (
            <LoadScreen />
          ) : (
            <div className="app-content">
              {this.generateComponent()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
