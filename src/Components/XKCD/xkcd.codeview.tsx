import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import componentCode from './xkcd.tsx?raw';
import adapterCode from './xkcdApi.ts?raw';
import transportCode from '../../Services/remoteData.ts?raw';

const source = [
  '// XKCD component',
  componentCode,
  '',
  '// XKCD adapter',
  adapterCode,
  '',
  '// Shared remote transport',
  transportCode,
].join('\n');

const XKCDViewer = (): React.ReactElement => (
  <div className="app-code-viewer">
    <CardTemplate content={<SourceViewer value={source} />} classGiven="card" />
  </div>
);

export default XKCDViewer;
