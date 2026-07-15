import React, { ReactElement, useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter,
  matchPath,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
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

export type AppRoute =
  | '/'
  | '/poketable'
  | '/robotBattle'
  | '/stock'
  | '/xkcd'
  | '/portfolio'
  | '/library';

export interface PageDefinition {
  readonly text: string;
  readonly title: string;
  readonly route: AppRoute;
  readonly icon: string;
  readonly component: ReactElement;
  readonly codeView?: ReactElement;
  readonly exactRoute?: boolean;
}

export const pages: ReadonlyArray<PageDefinition> = [
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
      <Portal url="https://andeleidun.github.io/pokeTable/" title="PokeTable" />
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

const pageForPath = (pathname: string): PageDefinition =>
  pages.find((page) =>
    matchPath(pathname, {
      path: page.route,
      exact: page.exactRoute !== false,
    })
  ) || pages[0];

export const ApplicationShell = (): ReactElement => {
  const location = useLocation();
  const [navShow, setNavShow] = useState(false);
  const [codeView, setCodeView] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentPage = pageForPath(location.pathname);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleNav = () => setNavShow((shown) => !shown);
  const closeNav = () => setNavShow(false);
  const toggleCodeView = () => setCodeView((shown) => !shown);
  const appClass = navShow ? 'app app-with-menu' : 'app app-without-menu';

  return (
    <div className={appClass}>
      <Header
        onClick={toggleNav}
        currentPage={currentPage}
        codeView={codeView}
        menuOpen={navShow}
        toggleCodeView={toggleCodeView}
      />
      <Slide direction="right" in={navShow} mountOnEnter unmountOnExit>
        <div className="app-menu">
          <NavBar
            pages={pages}
            activeRoute={currentPage.route}
            navClick={closeNav}
            codeView={codeView}
            toggleCodeView={toggleCodeView}
          />
        </div>
      </Slide>
      {navShow ? (
        <div
          className="app-overlay-mobile"
          onClick={closeNav}
          role="presentation"
          aria-hidden="true"
        />
      ) : null}
      <div className="app-main">
        {loading ? (
          <LoadScreen />
        ) : (
          <div className="app-content">
            <Switch>
              {pages.map((page) => (
                <Route
                  path={page.route}
                  exact={page.exactRoute !== false}
                  key={page.route}
                >
                  {codeView && page.codeView ? page.codeView : page.component}
                </Route>
              ))}
              <Route>{codeView ? pages[0].codeView : pages[0].component}</Route>
            </Switch>
          </div>
        )}
      </div>
    </div>
  );
};

const App = (): ReactElement => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <ApplicationShell />
  </BrowserRouter>
);

export default App;
