import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

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
import Library from './Components/Library/Library';
import LibraryViewer from './Components/Library/Library.codeview';
import Portal from './Components/Library/Portal/Portal';
import PortalViewer from './Components/Library/Portal/Portal.codeview';

interface PageInterface {
  text: string;
  title: string;
  route: string;
  icon: string;
  component: any;
  codeView?: any;
  exactRoute?: boolean;
}

const App = () => {
  const [navShow, setNavShow] = useState(false);
  const [navShowClass, setNavShowClass] = useState('app app-without-menu');
  const pages: PageInterface[] = [
    {
      text: 'Home',
      title: 'Adair Daniels',
      route: '/',
      icon: 'home',
      component: <Home />,
      codeView: <HomeViewer />,
      exactRoute: true,
    },
    {
      text: 'PokeTable',
      title: 'PokeTable',
      route: '/poketable',
      icon: 'table_view',
      component: (
        <Portal
          url="https://andeleidun.github.io/pokeTable/"
          title="PokeTable"
        />
      ),
      codeView: <PortalViewer />,
    },
    {
      text: 'Robot Battle Arena',
      title: 'Robot Battle Arena',
      route: '/robotBattle',
      icon: 'table_view',
      component: (
        <Portal
          url="https://andeleidun.github.io/robot-arena/"
          title="Robot Battle Arena"
        />
      ),
      codeView: <PortalViewer />,
    },
    {
      text: 'StockTwits Feed',
      title: 'StockTwits Feed',
      route: '/stock',
      icon: 'dvr',
      component: <StockTwits />,
      codeView: <StockViewer />,
    },
    {
      text: 'XKCD Slideshow',
      title: 'XKCD Slideshow',
      route: '/xkcd',
      icon: 'burst_mode',
      component: <XKCD />,
      codeView: <XKCDViewer />,
    },
    {
      text: 'Portfolio',
      title: 'Portfolio',
      route: '/portfolio',
      icon: 'compare',
      component: <Portfolio />,
      codeView: <PortfolioViewer />,
    },
    {
      text: 'Library',
      title: 'Library',
      route: '/library',
      icon: 'library_books',
      component: <Library />,
      codeView: <LibraryViewer />,
    },
  ];
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [codeView, setCodeView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  const toggleNav = () => {
    if (navShow) {
      setNavShowClass('app app-without-menu ');
    } else {
      setNavShowClass('app app-with-menu ');
    }
    setNavShow(!navShow);
  };

  const toggleCodeView = () => {
    setCodeView(!codeView);
  };

  const navigate = (page: PageInterface) => {
    setCurrentPage(page);
  };

  const generateOverlay = () => {
    if (navShow) {
      return <div className="app-overlay-mobile" onClick={() => toggleNav()} />;
    }
  };

  const generateComponent = () => {
    let generatedContent: any[] = [];
    for (let page of pages) {
      let component: any;
      if (codeView) {
        component = page.codeView;
      } else {
        component = page.component;
      }
      generatedContent.push(
        <Route
          path={page.route}
          exact={page.exactRoute}
          key={page.title}
          children={component}
        />
      );
    }
    return (
      <Switch>
        {generatedContent}
        <Route path="/" children={pages[0].component} key={0} />
      </Switch>
    );
  };

  return (
    <BrowserRouter basename={process ? process.env.PUBLIC_URL : ''}>
      <div className={navShowClass}>
        <Header
          onClick={() => toggleNav()}
          currentPage={currentPage}
          codeView={codeView}
          toggleCodeView={() => toggleCodeView()}
        />
        <Slide direction="right" in={navShow} mountOnEnter unmountOnExit>
          <div className="app-menu">
            <NavBar
              pages={pages}
              navClick={(page: PageInterface) => navigate(page)}
              codeView={codeView}
              toggleCodeView={() => toggleCodeView()}
            />
          </div>
        </Slide>
        {generateOverlay()}
        <div className="app-main">
          {loading ? (
            <LoadScreen />
          ) : (
            <div className="app-content">{generateComponent()}</div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
