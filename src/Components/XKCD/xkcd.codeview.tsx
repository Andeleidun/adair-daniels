import React from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../Library/CodeView.css';

import CardTemplate from '../Library/Card';

require('prismjs/components/prism-jsx');

/* eslint-disable-next-line */
const XKCDCode = require('!!raw-loader!./xkcd').default;

const viewer = (
  <Viewer
    value={XKCDCode}
    highlight={(code) => highlight(code, languages.js)}
    padding={10}
    style={{
      fontFamily: '"Fira code", "Fira Mono", monospace',
      fontSize: 12,
    }}
  />
);

function XKCDViewer() {
  return (
    <main className="app-code-viewer">
      <CardTemplate content={viewer} classGiven="card" />
    </main>
  );
}

export default XKCDViewer;
