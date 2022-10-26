import React, { useState } from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../CodeView.css';

import CardTemplate from '../Card';

require('prismjs/components/prism-jsx');

const code = `
/*
  This component uses lazy loading iframes to setup a portal
  for separately hosted micro-frontends. This is implemented 
  with the PokeTable.
  PokeTable is a filterable and sortable React data table.
  PokeTable code can be found on github -
  https://github.com/Andeleidun/pokeTable
*/
import React from 'react';
import './Portal.css';

interface Props {
  url: string;
}

const Portal = ({ url }: Props) => {
  return <iframe src={url} loading="lazy" className="portal" />;
};

export default Portal;

`;

const PortalViewer = () => {
  const [codeState] = useState(code);

  let viewer = (
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
    <main className="app-code-viewer">
      <CardTemplate content={viewer} classGiven="card" />
    </main>
  );
};

export default PortalViewer;
