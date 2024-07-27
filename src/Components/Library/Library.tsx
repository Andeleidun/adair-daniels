import React, { useState } from 'react';
import './Library.css';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../Library/CodeView.css';
import CardTemplate from './Card';

import AppCode from './App.codeview';
import CardCode from './Card/Card.codeview';
import HeaderCode from './Header/Header.codeview';
import NavBarCode from './NavBar/NavBar.codeview';

require('prismjs/components/prism-jsx');

const Library = () => {
  const components = [
    { index: 0, title: 'App', code: AppCode },
    { index: 1, title: 'Card', code: CardCode },
    { index: 2, title: 'Header', code: HeaderCode },
    { index: 3, title: 'Nav Bar', code: NavBarCode },
  ];
  const [codeState, setCodeState] = useState(components[0].code);

  const navigate = (index: number) => {
    setCodeState(components[index].code);
  };

  const links = [
    { onClick: () => navigate(0), text: 'App' },
    { onClick: () => navigate(1), text: 'Card' },
    { onClick: () => navigate(2), text: 'Header' },
    { onClick: () => navigate(3), text: 'Nav Bar' },
  ];

  const generateOptions = () => {
    const generatedOptions: any[] = [];

    generatedOptions.push(
      <CardTemplate
        title={'Library Navigation'}
        links={links}
        classGiven="card library-card"
      />
    );
    return generatedOptions;
  };

  const viewer = (
    <Viewer
      value={codeState}
      highlight={(value) => highlight(value, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );

  return (
    <main className="library-page">
      {generateOptions()}
      <CardTemplate content={viewer} classGiven="card" />
    </main>
  );
};

export default Library;
