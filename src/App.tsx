import React from 'react';
import './App.scss';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";

import Header from './Components/Library/Header';
import NavBar from './Components/Library/NavBar';
import LoadScreen from './Components/Library/LoadScreen';

import Home from './Components/Home/Home';
import HomeViewer from './Components/Home/Home.codeview';
import StockTwits from './Components/Stocktwits/Stocktwits';
import StockViewer from './Components/Stocktwits/StockTwits.codeview';
import XKCD from './Components/XKCD/xkcd';
import XKCDViewer from './Components/XKCD/xkcd.codeview';
import Portfolio from './Components/Portfolio/Portfolio';
import PortfolioViewer from './Components/Portfolio/Portfolio.codeview';

import Slide from '@material-ui/core/Slide';

interface Props {
};

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
  route: string;
  icon: string;
  component: any;
  codeView?: any;
  exactRoute?: boolean;
}

class App extends React.Component <Props, State> {

  pages: PageInterface[] = [
    {text: 'Home', title: 'Adair Daniels', route: '/', icon: 'home', component: <Home />, codeView: <HomeViewer />, exactRoute: true},
    {text: 'StockTwits Feed', title: 'StockTwits Feed', route: '/stock', icon: 'dvr', component: <StockTwits />, codeView: <StockViewer />},
    {text: 'XKCD Slideshow', title: 'XKCD Slideshow', route: '/xkcd', icon: 'burst_mode', component: <XKCD />, codeView: <XKCDViewer />},
    {text: 'Portfolio', title: 'Portfolio', route: '/portfolio', icon: 'compare', component: <Portfolio />, codeView: <PortfolioViewer />},
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

  toggleCodeView() {
    this.setState({
      codeView: !this.state.codeView
    });
  }

  navigate(page: any) {
    this.setState({
      currentPage: page
    });
  }

  generateOverlay() {
    if (this.state.navShow) {
      return (<div className="app-overlay-mobile" onClick={() => this.toggleNav()} />)
    }
  }

  generateComponent() {
    let generatedContent:any[] = [];
    for (let page of this.pages) {
      let component: any;
      if (this.state.codeView) {
        component = page.codeView;
      } else {
        component = page.component;
      }
      generatedContent.push(
        <Route
          path={page.route}
          exact={page.exactRoute}
          children={component}
        />
      );
    }
    return (
      <Switch>
        {generatedContent}
      </Switch>
    );
  }

  componentDidMount() {
    this.setState( {
      loading: false
    });
  }

  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className={this.state.navShowClass}>
          <Header
            onClick={() => this.toggleNav()}
            currentPage={this.state.currentPage}
            codeView={this.state.codeView}
            toggleCodeView={() => this.toggleCodeView()}
          />
          <Slide direction="right" in={this.state.navShow} mountOnEnter unmountOnExit>
            <div className="app-menu">
              <NavBar
                pages={this.pages}
                navClick={(page: any) => this.navigate(page)}
                codeView={this.state.codeView}
                toggleCodeView={() => this.toggleCodeView()}
              />
            </div>
          </Slide>
          {this.generateOverlay()}
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
      </BrowserRouter>
    );
  }
}

export default App;
