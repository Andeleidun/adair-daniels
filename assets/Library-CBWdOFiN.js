import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{J as t,t as n,z as r}from"./Card-CeC5etUB.js";import{t as i}from"./SourceViewer-DeS1hOSu.js";var a=e(t()),o=`import React, {\r
  lazy,\r
  ReactElement,\r
  Suspense,\r
  useEffect,\r
  useState,\r
} from 'react';\r
import './App.css';\r
import {\r
  BrowserRouter,\r
  matchPath,\r
  Route,\r
  Routes,\r
  useLocation,\r
} from 'react-router-dom';\r
import Slide from '@mui/material/Slide';\r
\r
import Header from './Components/Library/Header';\r
import NavBar from './Components/Library/NavBar';\r
import LoadScreen from './Components/Library/LoadScreen';\r
import Home from './Components/Home/Home';\r
import Portal from './Components/Library/Portal/Portal';\r
\r
const HomeViewer = lazy(() => import('./Components/Home/Home.codeview'));\r
const StockTwits = lazy(() => import('./Components/Stocktwits/Stocktwits'));\r
const StockViewer = lazy(\r
  () => import('./Components/Stocktwits/StockTwits.codeview')\r
);\r
const XKCD = lazy(() => import('./Components/XKCD/xkcd'));\r
const XKCDViewer = lazy(() => import('./Components/XKCD/xkcd.codeview'));\r
const Portfolio = lazy(() => import('./Components/Portfolio/Portfolio'));\r
const PortfolioViewer = lazy(\r
  () => import('./Components/Portfolio/Portfolio.codeview')\r
);\r
const Library = lazy(() => import('./Components/Library/Library'));\r
const LibraryViewer = lazy(\r
  () => import('./Components/Library/Library.codeview')\r
);\r
const PortalViewer = lazy(\r
  () => import('./Components/Library/Portal/Portal.codeview')\r
);\r
\r
export type AppRoute =\r
  | '/'\r
  | '/poketable'\r
  | '/robotBattle'\r
  | '/stock'\r
  | '/xkcd'\r
  | '/portfolio'\r
  | '/library';\r
\r
export interface PageDefinition {\r
  readonly text: string;\r
  readonly title: string;\r
  readonly route: AppRoute;\r
  readonly icon: string;\r
  readonly component: ReactElement;\r
  readonly codeView?: ReactElement;\r
  readonly exactRoute?: boolean;\r
}\r
\r
export const pages: ReadonlyArray<PageDefinition> = [\r
  {\r
    text: 'Home',\r
    title: 'Adair Daniels',\r
    route: '/',\r
    icon: 'home',\r
    component: <Home />,\r
    codeView: <HomeViewer />,\r
    exactRoute: true,\r
  },\r
  {\r
    text: 'PokeTable',\r
    title: 'PokeTable',\r
    route: '/poketable',\r
    icon: 'table_view',\r
    component: (\r
      <Portal url="https://andeleidun.github.io/pokeTable/" title="PokeTable" />\r
    ),\r
    codeView: <PortalViewer />,\r
  },\r
  {\r
    text: 'Robot Battle Arena',\r
    title: 'Robot Battle Arena',\r
    route: '/robotBattle',\r
    icon: 'table_view',\r
    component: (\r
      <Portal\r
        url="https://andeleidun.github.io/robot-arena/"\r
        title="Robot Battle Arena"\r
      />\r
    ),\r
    codeView: <PortalViewer />,\r
  },\r
  {\r
    text: 'StockTwits Feed',\r
    title: 'StockTwits Feed',\r
    route: '/stock',\r
    icon: 'dvr',\r
    component: <StockTwits />,\r
    codeView: <StockViewer />,\r
  },\r
  {\r
    text: 'XKCD Slideshow',\r
    title: 'XKCD Slideshow',\r
    route: '/xkcd',\r
    icon: 'burst_mode',\r
    component: <XKCD />,\r
    codeView: <XKCDViewer />,\r
  },\r
  {\r
    text: 'Portfolio',\r
    title: 'Portfolio',\r
    route: '/portfolio',\r
    icon: 'compare',\r
    component: <Portfolio />,\r
    codeView: <PortfolioViewer />,\r
  },\r
  {\r
    text: 'Library',\r
    title: 'Library',\r
    route: '/library',\r
    icon: 'library_books',\r
    component: <Library />,\r
    codeView: <LibraryViewer />,\r
  },\r
];\r
\r
const pageForPath = (pathname: string): PageDefinition =>\r
  pages.find((page) =>\r
    matchPath(\r
      {\r
        path: page.route,\r
        end: page.exactRoute !== false,\r
      },\r
      pathname\r
    )\r
  ) || pages[0];\r
\r
export const ApplicationShell = (): ReactElement => {\r
  const location = useLocation();\r
  const [navShow, setNavShow] = useState(false);\r
  const [codeView, setCodeView] = useState(false);\r
  const [loading, setLoading] = useState(true);\r
  const currentPage = pageForPath(location.pathname);\r
\r
  useEffect(() => {\r
    const loadingTimer = window.setTimeout(() => setLoading(false), 0);\r
    return () => window.clearTimeout(loadingTimer);\r
  }, []);\r
\r
  const toggleNav = () => setNavShow((shown) => !shown);\r
  const closeNav = () => setNavShow(false);\r
  const toggleCodeView = () => setCodeView((shown) => !shown);\r
  const appClass = navShow ? 'app app-with-menu' : 'app app-without-menu';\r
\r
  return (\r
    <div className={appClass}>\r
      <Header\r
        onClick={toggleNav}\r
        currentPage={currentPage}\r
        codeView={codeView}\r
        menuOpen={navShow}\r
        toggleCodeView={toggleCodeView}\r
      />\r
      <Slide direction="right" in={navShow} mountOnEnter unmountOnExit>\r
        <div className="app-menu">\r
          <NavBar\r
            pages={pages}\r
            activeRoute={currentPage.route}\r
            navClick={closeNav}\r
            codeView={codeView}\r
            toggleCodeView={toggleCodeView}\r
          />\r
        </div>\r
      </Slide>\r
      {navShow ? (\r
        <div\r
          className="app-overlay-mobile"\r
          onClick={closeNav}\r
          role="presentation"\r
          aria-hidden="true"\r
        />\r
      ) : null}\r
      <div className="app-main">\r
        {loading ? (\r
          <LoadScreen />\r
        ) : (\r
          <div className="app-content">\r
            <Suspense fallback={<LoadScreen />}>\r
              <Routes>\r
                {pages.map((page) => (\r
                  <Route\r
                    path={page.route}\r
                    key={page.route}\r
                    element={\r
                      codeView && page.codeView ? page.codeView : page.component\r
                    }\r
                  />\r
                ))}\r
                <Route\r
                  path="*"\r
                  element={codeView ? pages[0].codeView : pages[0].component}\r
                />\r
              </Routes>\r
            </Suspense>\r
          </div>\r
        )}\r
      </div>\r
    </div>\r
  );\r
};\r
\r
const App = (): ReactElement => (\r
  <BrowserRouter basename={import.meta.env.BASE_URL}>\r
    <ApplicationShell />\r
  </BrowserRouter>\r
);\r
\r
export default App;\r
`,s=`import React from 'react';\r
\r
import Card from '@mui/material/Card';\r
import CardActions from '@mui/material/CardActions';\r
import CardContent from '@mui/material/CardContent';\r
import CardMedia from '@mui/material/CardMedia';\r
import Button from '@mui/material/Button';\r
\r
export type CardAction =\r
  | { readonly kind: 'external'; readonly text: string; readonly url: string }\r
  | {\r
      readonly kind: 'button';\r
      readonly text: string;\r
      readonly onClick: () => void;\r
    };\r
\r
interface CardTemplateProps {\r
  readonly img?: string | null;\r
  readonly title?: string;\r
  readonly text?: string;\r
  readonly content?: React.ReactNode;\r
  readonly classGiven?: string;\r
  readonly links?: ReadonlyArray<CardAction>;\r
}\r
\r
const CardTemplate = (props: CardTemplateProps): React.ReactElement => {\r
  const { img, title, text, content, classGiven, links } = props;\r
\r
  const generateLinks = () => {\r
    if (links && links.length > 0) {\r
      return (\r
        <CardActions className="card-buttons">\r
          {links.map((link) =>\r
            link.kind === 'external' ? (\r
              <Button\r
                className="card-button"\r
                component="a"\r
                fullWidth\r
                href={link.url}\r
                key={\`\${link.kind}-\${link.text}\`}\r
                target="_blank"\r
                rel="noopener noreferrer"\r
              >\r
                {link.text}\r
              </Button>\r
            ) : (\r
              <Button\r
                className="card-button"\r
                fullWidth\r
                key={\`\${link.kind}-\${link.text}\`}\r
                onClick={link.onClick}\r
              >\r
                {link.text}\r
              </Button>\r
            )\r
          )}\r
        </CardActions>\r
      );\r
    }\r
    return null;\r
  };\r
\r
  const generateMedia = () => {\r
    if (img) {\r
      return (\r
        <CardMedia\r
          className="media-area"\r
          image={img}\r
          title={title}\r
          role={title ? 'img' : undefined}\r
          aria-label={title}\r
          aria-hidden={title ? undefined : true}\r
        />\r
      );\r
    }\r
  };\r
\r
  const generateContent = () => {\r
    return (\r
      <>\r
        {title ? <h2>{title}</h2> : null}\r
        {text ? <p>{text}</p> : null}\r
        {content}\r
      </>\r
    );\r
  };\r
\r
  return (\r
    <Card className={classGiven}>\r
      {generateMedia()}\r
      <CardContent>{generateContent()}</CardContent>\r
      {generateLinks()}\r
    </Card>\r
  );\r
};\r
\r
export default CardTemplate;\r
`,c=`import React from 'react';\r
\r
import AppBar from '@mui/material/AppBar';\r
import Toolbar from '@mui/material/Toolbar';\r
import IconButton from '@mui/material/IconButton';\r
import FormControlLabel from '@mui/material/FormControlLabel';\r
import Switch from '@mui/material/Switch';\r
\r
interface HeaderPage {\r
  readonly title: string;\r
  readonly codeView?: React.ReactElement;\r
}\r
\r
interface HeaderProps {\r
  readonly currentPage: HeaderPage;\r
  readonly codeView: boolean;\r
  readonly menuOpen: boolean;\r
  readonly onClick: () => void;\r
  readonly toggleCodeView: () => void;\r
}\r
\r
const Header = (props: HeaderProps): React.ReactElement => {\r
  const handleChange = () => {\r
    props.toggleCodeView();\r
  };\r
\r
  const generateCodeView = () => {\r
    if (props.currentPage.codeView) {\r
      const codeViewBar = (\r
        <div className="code-view-bar">\r
          <FormControlLabel\r
            control={\r
              <Switch\r
                checked={props.codeView}\r
                onChange={handleChange}\r
                name="codeView"\r
              />\r
            }\r
            label="Code View"\r
          />\r
        </div>\r
      );\r
      return codeViewBar;\r
    }\r
  };\r
\r
  return (\r
    <header className="app-header">\r
      <AppBar position="static">\r
        <IconButton\r
          edge="start"\r
          aria-label="menu"\r
          className="menu-button"\r
          onClick={props.onClick}\r
          aria-controls="app-navigation"\r
          aria-expanded={props.menuOpen}\r
        >\r
          <i className="material-icons" aria-hidden="true">\r
            menu\r
          </i>\r
        </IconButton>\r
        <Toolbar className="title-bar">\r
          <h1>{props.currentPage.title}</h1>\r
        </Toolbar>\r
        {generateCodeView()}\r
      </AppBar>\r
    </header>\r
  );\r
};\r
\r
export default Header;\r
`,l=`import React from 'react';\r
import { Link } from 'react-router-dom';\r
\r
import List from '@mui/material/List';\r
import ListItem from '@mui/material/ListItem';\r
import ListItemButton from '@mui/material/ListItemButton';\r
import ListItemIcon from '@mui/material/ListItemIcon';\r
import ListItemText from '@mui/material/ListItemText';\r
import FormControlLabel from '@mui/material/FormControlLabel';\r
import Switch from '@mui/material/Switch';\r
\r
export interface NavigationPage {\r
  readonly text: string;\r
  readonly route: string;\r
  readonly icon: string;\r
}\r
\r
interface NavBarProps {\r
  readonly pages: ReadonlyArray<NavigationPage>;\r
  readonly activeRoute: string;\r
  readonly navClick: () => void;\r
  readonly codeView: boolean;\r
  readonly toggleCodeView: () => void;\r
}\r
\r
const NavBar = (props: NavBarProps): React.ReactElement => {\r
  const handleChange = () => {\r
    props.toggleCodeView();\r
  };\r
\r
  const populatePages = () =>\r
    props.pages.map((page) => (\r
      <li key={page.route}>\r
        <ListItemButton\r
          component={Link}\r
          to={page.route}\r
          onClick={props.navClick}\r
          aria-current={props.activeRoute === page.route ? 'page' : undefined}\r
        >\r
          <ListItemIcon>\r
            <i className="material-icons" aria-hidden="true">\r
              {page.icon}\r
            </i>\r
          </ListItemIcon>\r
          <ListItemText primary={page.text} />\r
        </ListItemButton>\r
      </li>\r
    ));\r
\r
  const populateOptions = () => (\r
    <ListItem className="code-view-bar">\r
      <FormControlLabel\r
        control={\r
          <Switch\r
            checked={props.codeView}\r
            onChange={handleChange}\r
            name="codeView"\r
          />\r
        }\r
        label="Code View"\r
      />\r
    </ListItem>\r
  );\r
\r
  return (\r
    <nav className="app-nav" id="app-navigation" aria-label="Main navigation">\r
      <List>\r
        {populatePages()}\r
        {populateOptions()}\r
      </List>\r
    </nav>\r
  );\r
};\r
\r
export default NavBar;\r
`,u=r(),d=[{title:`App`,code:o},{title:`Card`,code:s},{title:`Header`,code:c},{title:`Nav Bar`,code:l}],f=()=>{let[e,t]=(0,a.useState)(d[0].code),r=e=>{t(d[e].code)};return(0,u.jsxs)(`main`,{className:`library-page`,children:[(0,u.jsx)(n,{title:`Library Navigation`,links:d.map((e,t)=>({kind:`button`,onClick:()=>r(t),text:e.title})),classGiven:`card library-card`}),(0,u.jsx)(n,{content:(0,u.jsx)(i,{value:e}),classGiven:`card`})]})};export{f as default};