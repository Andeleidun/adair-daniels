import React, { useState } from 'react';
import './Library.css';

import '../Library/CodeView.css';
import CardTemplate, { CardAction } from './Card';
import SourceViewer from './SourceViewer';

import AppCode from './App.codeview';
import CardCode from './Card/Card.codeview';
import HeaderCode from './Header/Header.codeview';
import NavBarCode from './NavBar/NavBar.codeview';

interface LibraryComponent {
  readonly title: string;
  readonly code: string;
}

const components: ReadonlyArray<LibraryComponent> = [
  { title: 'App', code: AppCode },
  { title: 'Card', code: CardCode },
  { title: 'Header', code: HeaderCode },
  { title: 'Nav Bar', code: NavBarCode },
];

const Library = (): React.ReactElement => {
  const [codeState, setCodeState] = useState(components[0].code);

  const navigate = (index: number) => {
    setCodeState(components[index].code);
  };

  const links: ReadonlyArray<CardAction> = components.map(
    (component, index) => ({
      kind: 'button',
      onClick: () => navigate(index),
      text: component.title,
    })
  );

  const viewer = <SourceViewer value={codeState} />;

  return (
    <main className="library-page">
      <CardTemplate
        title="Library Navigation"
        links={links}
        classGiven="card library-card"
      />
      <CardTemplate content={viewer} classGiven="card" />
    </main>
  );
};

export default Library;
