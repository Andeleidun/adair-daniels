import React, { useState } from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../CodeView.css';

import CardTemplate from '../Card';

require('prismjs/components/prism-jsx');

/* eslint import/no-webpack-loader-syntax: off */
const PortalCode = require('!!raw-loader!./Portal').default;

const PortalViewer = () => {
  let viewer = (
    <Viewer
      value={PortalCode}
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
