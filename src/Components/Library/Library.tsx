import React, { useState } from 'react';
import './Library.css';
import '../Library/CodeView.css';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SourceViewer from './SourceViewer';

import AppCode from './App.codeview';
import CardCode from './Card/Card.codeview';
import HeaderCode from './Header/Header.codeview';
import NavBarCode from './NavBar/NavBar.codeview';
import SiteIconCode from './SiteIcon/SiteIcon.codeview';

interface LibraryComponent {
  readonly title: string;
  readonly code: string;
}

const components: ReadonlyArray<LibraryComponent> = [
  { title: 'App shell', code: AppCode },
  { title: 'Card', code: CardCode },
  { title: 'Header', code: HeaderCode },
  { title: 'Navigation', code: NavBarCode },
  { title: 'Site icon', code: SiteIconCode },
];

const Library = (): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="library-page">
      <section
        className="library-navigation"
        aria-labelledby="library-nav-title"
      >
        <h2 id="library-nav-title">Choose a shared component</h2>
        <Tabs
          value={activeIndex}
          onChange={(_event, value: number) => setActiveIndex(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Component source"
        >
          {components.map((component, index) => (
            <Tab
              id={`component-tab-${index}`}
              aria-controls={`component-panel-${index}`}
              label={component.title}
              key={component.title}
            />
          ))}
        </Tabs>
      </section>
      {components.map((component, index) => {
        const active = activeIndex === index;
        return (
          <section
            className="library-source"
            id={`component-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`component-tab-${index}`}
            hidden={!active}
            key={component.title}
          >
            {active ? (
              <>
                <h2>{component.title} source</h2>
                <SourceViewer
                  value={component.code}
                  label={`${component.title} source code`}
                />
              </>
            ) : null}
          </section>
        );
      })}
    </div>
  );
};

export default Library;
