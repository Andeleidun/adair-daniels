import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import componentCode from './Stocktwits.tsx?raw';
import adapterCode from './stockTwitsApi.ts?raw';
import transportCode from '../../Services/remoteData.ts?raw';

const source = [
  '// StockTwits component',
  componentCode,
  '',
  '// StockTwits adapter',
  adapterCode,
  '',
  '// Shared remote transport',
  transportCode,
].join('\n');

const StockViewer = (): React.ReactElement => (
  <main className="app-code-viewer">
    <CardTemplate content={<SourceViewer value={source} />} classGiven="card" />
  </main>
);

export default StockViewer;
