import React, {
  lazy,
  ReactElement,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import './App.css';
import {
  BrowserRouter,
  Link,
  type Location,
  matchPath,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

import Header from './Components/Library/Header';
import NavBar, { NavigationGroup } from './Components/Library/NavBar/NavBar';
import LoadScreen from './Components/Library/LoadScreen';
import Home from './Components/Home/Home';
import Portal from './Components/Library/Portal/Portal';
import { SiteIconName } from './Components/Library/SiteIcon';

const HomeViewer = lazy(() => import('./Components/Home/Home.codeview'));
const StockTwits = lazy(() => import('./Components/Stocktwits/Stocktwits'));
const StockViewer = lazy(
  () => import('./Components/Stocktwits/StockTwits.codeview')
);
const XKCD = lazy(() => import('./Components/XKCD/xkcd'));
const XKCDViewer = lazy(() => import('./Components/XKCD/xkcd.codeview'));
const Portfolio = lazy(() => import('./Components/Portfolio/Portfolio'));
const PortfolioViewer = lazy(
  () => import('./Components/Portfolio/Portfolio.codeview')
);
const Library = lazy(() => import('./Components/Library/Library'));
const LibraryViewer = lazy(
  () => import('./Components/Library/Library.codeview')
);
const PortalViewer = lazy(
  () => import('./Components/Library/Portal/Portal.codeview')
);

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
  readonly description: string;
  readonly documentTitle: string;
  readonly route: AppRoute;
  readonly icon: SiteIconName;
  readonly navGroup: NavigationGroup;
  readonly component: (options: PageRenderOptions) => ReactElement;
  readonly codeView?: ReactElement;
  readonly exactRoute?: boolean;
}

interface PageRenderOptions {
  readonly demoExpanded: boolean;
  readonly onDemoExpandedChange: (expanded: boolean) => void;
}

export const pages: ReadonlyArray<PageDefinition> = [
  {
    text: 'Home',
    title: 'Adair Daniels',
    description:
      'Senior Frontend Engineer focused on accessible, dependable software.',
    documentTitle: 'Adair Daniels | Senior Frontend Engineer',
    route: '/',
    icon: 'home',
    navGroup: 'profile',
    component: () => <Home />,
    codeView: <HomeViewer />,
    exactRoute: true,
  },
  {
    text: 'Selected Work',
    title: 'Selected Work',
    description: 'Project screenshots and implementation highlights.',
    documentTitle: 'Selected Work | Adair Daniels',
    route: '/portfolio',
    icon: 'portfolio',
    navGroup: 'profile',
    component: () => <Portfolio />,
    codeView: <PortfolioViewer />,
  },
  {
    text: 'Component Library',
    title: 'Component Library',
    description: 'Reusable interface components and their source.',
    documentTitle: 'Component Library | Adair Daniels',
    route: '/library',
    icon: 'library',
    navGroup: 'profile',
    component: () => <Library />,
    codeView: <LibraryViewer />,
  },
  {
    text: 'PokeTable',
    title: 'PokeTable',
    description: 'A filterable and sortable React data-table demonstration.',
    documentTitle: 'PokeTable Demo | Adair Daniels',
    route: '/poketable',
    icon: 'table',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <Portal
        url="https://andeleidun.github.io/pokeTable/"
        title="PokeTable"
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <PortalViewer />,
  },
  {
    text: 'Robot Battle Arena',
    title: 'Robot Battle Arena',
    description: 'A separately hosted interactive React demonstration.',
    documentTitle: 'Robot Battle Arena | Adair Daniels',
    route: '/robotBattle',
    icon: 'robot',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <Portal
        url="https://andeleidun.github.io/robot-arena/"
        title="Robot Battle Arena"
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <PortalViewer />,
  },
  {
    text: 'StockTwits Feed',
    title: 'StockTwits Feed',
    description: 'Validated live data with cancellation and resilient states.',
    documentTitle: 'StockTwits Feed Demo | Adair Daniels',
    route: '/stock',
    icon: 'stock',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <StockTwits
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <StockViewer />,
  },
  {
    text: 'XKCD Slideshow',
    title: 'XKCD Slideshow',
    description: 'A responsive, failure-aware live comic browser.',
    documentTitle: 'XKCD Slideshow Demo | Adair Daniels',
    route: '/xkcd',
    icon: 'xkcd',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <XKCD expanded={demoExpanded} onExpandedChange={onDemoExpandedChange} />
    ),
    codeView: <XKCDViewer />,
  },
];

const pageForPath = (pathname: string): PageDefinition | undefined =>
  pages.find((page) =>
    matchPath(
      {
        path: page.route,
        end: page.exactRoute !== false,
      },
      pathname
    )
  );

const NotFound = (): ReactElement => (
  <section className="not-found" aria-labelledby="not-found-title">
    <h2 id="not-found-title">This page could not be found</h2>
    <p>The address may have changed, or the page may no longer exist.</p>
    <Button component={Link} to="/" variant="contained">
      Return home
    </Button>
  </section>
);

const currentYear = new Date().getFullYear();

const AppFooter = (): ReactElement => (
  <footer className="site-footer">
    <p>&copy; {currentYear} Adair Daniels</p>
    <nav aria-label="Professional links">
      <a
        href="https://www.linkedin.com/in/adairdaniels/"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn <span className="visually-hidden">(opens in a new tab)</span>
      </a>
      <a
        href="https://github.com/andeleidun"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub <span className="visually-hidden">(opens in a new tab)</span>
      </a>
      <a href="#page-title">Back to top</a>
    </nav>
  </footer>
);

export const ApplicationShell = (): ReactElement => {
  const location = useLocation();
  const desktop = useMediaQuery('(min-width:961px)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathnameRef = useRef(location.pathname);
  const [navShow, setNavShow] = useState(false);
  const [codeView, setCodeView] = useState(false);
  const [expandedDemoLocation, setExpandedDemoLocation] =
    useState<Location | null>(null);
  const currentPage = pageForPath(location.pathname);
  const sourceViewActive = codeView && Boolean(currentPage?.codeView);
  const demoExpanded = !sourceViewActive && expandedDemoLocation === location;
  const pageTitle = currentPage?.title ?? 'Page not found';
  const pageDescription =
    currentPage?.description ?? 'The requested portfolio page was not found.';
  const showPageHeading = currentPage?.route !== '/' && !demoExpanded;
  const pageKicker = currentPage
    ? currentPage.route === '/'
      ? undefined
      : currentPage.navGroup === 'demos'
        ? 'Engineering demonstration'
        : 'Portfolio'
    : undefined;

  useEffect(() => {
    const pageUrl = new URL(
      location.pathname,
      'https://adairdaniels.com/'
    ).toString();
    document.title =
      currentPage?.documentTitle ?? 'Page not found | Adair Daniels';
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    description?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute(
        'content',
        currentPage?.documentTitle ?? 'Page not found | Adair Daniels'
      );
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.setAttribute('content', pageUrl);
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
      ?.setAttribute(
        'content',
        currentPage?.documentTitle ?? 'Page not found | Adair Daniels'
      );
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
      ?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', pageUrl);
  }, [currentPage, location.pathname, pageDescription]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return undefined;
    }
    previousPathnameRef.current = location.pathname;
    const focusTimer = window.setTimeout(() => headingRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [location.pathname]);

  useEffect(() => {
    if (!demoExpanded) {
      return undefined;
    }
    document.documentElement.classList.add('demo-expanded');
    document.body.classList.add('demo-expanded');
    return () => {
      document.documentElement.classList.remove('demo-expanded');
      document.body.classList.remove('demo-expanded');
    };
  }, [demoExpanded]);

  const toggleNav = () => setNavShow((shown) => !shown);
  const closeNav = () => {
    setNavShow(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };
  const toggleCodeView = () => {
    setExpandedDemoLocation(null);
    setCodeView((shown) => !shown);
  };
  const handleDemoExpandedChange = (expanded: boolean) => {
    setNavShow(false);
    setExpandedDemoLocation(expanded ? location : null);
  };
  const contentClass = demoExpanded
    ? 'app-main app-main-demo-expanded'
    : desktop && navShow
      ? 'app-main app-main-with-menu'
      : 'app-main';
  const appContentClass = demoExpanded
    ? 'app-content app-content-demo-expanded'
    : 'app-content';

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header
        codeViewAvailable={
          desktop && !demoExpanded && Boolean(currentPage?.codeView)
        }
        onClick={toggleNav}
        codeView={codeView}
        menuOpen={navShow}
        ref={menuButtonRef}
        toggleCodeView={toggleCodeView}
      />
      <Drawer
        className="app-drawer"
        variant={desktop ? 'persistent' : 'temporary'}
        open={navShow}
        onClose={closeNav}
        transitionDuration={reduceMotion ? 0 : 160}
        ModalProps={{ disableRestoreFocus: true, keepMounted: true }}
      >
        <NavBar
          pages={pages}
          activeRoute={currentPage?.route ?? ''}
          navClick={closeNav}
          codeView={codeView}
          codeViewAvailable={
            !desktop && !demoExpanded && Boolean(currentPage?.codeView)
          }
          toggleCodeView={toggleCodeView}
        />
      </Drawer>
      <div className={contentClass}>
        <main id="main-content" className={appContentClass} tabIndex={-1}>
          <div
            className="app-screen"
            key={`${location.pathname}-${sourceViewActive ? 'source' : 'live'}`}
          >
            {showPageHeading ? (
              <header className="page-heading">
                {pageKicker ? (
                  <p className="page-kicker">{pageKicker}</p>
                ) : null}
                <h1 id="page-title" ref={headingRef} tabIndex={-1}>
                  {pageTitle}
                </h1>
                <p className="page-description">{pageDescription}</p>
              </header>
            ) : (
              <h1
                id="page-title"
                className="visually-hidden"
                ref={headingRef}
                tabIndex={-1}
              >
                {pageTitle}
              </h1>
            )}
            {currentPage?.codeView ? (
              <p className="visually-hidden" role="status">
                {sourceViewActive ? 'Source view' : 'Live demonstration view'}
              </p>
            ) : null}
            <Suspense fallback={<LoadScreen />}>
              <Routes>
                {pages.map((page) => (
                  <Route
                    path={page.route}
                    key={page.route}
                    element={
                      sourceViewActive && page.codeView
                        ? page.codeView
                        : page.component({
                            demoExpanded:
                              demoExpanded && page.route === currentPage?.route,
                            onDemoExpandedChange: handleDemoExpandedChange,
                          })
                    }
                  />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        {demoExpanded ? null : <AppFooter />}
      </div>
    </div>
  );
};

const App = (): ReactElement => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ApplicationShell />
  </BrowserRouter>
);

export default App;
