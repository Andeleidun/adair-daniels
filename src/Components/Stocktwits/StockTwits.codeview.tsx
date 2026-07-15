import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import componentCode from '!!raw-loader!./Stocktwits';
import adapterCode from '!!raw-loader!./stockTwitsApi';
import transportCode from '!!raw-loader!../../Services/remoteData';

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
