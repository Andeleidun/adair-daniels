import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import componentCode from '!!raw-loader!./xkcd';
import adapterCode from '!!raw-loader!./xkcdApi';
import transportCode from '!!raw-loader!../../Services/remoteData';

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
  <main className="app-code-viewer">
    <CardTemplate content={<SourceViewer value={source} />} classGiven="card" />
  </main>
);

export default XKCDViewer;
