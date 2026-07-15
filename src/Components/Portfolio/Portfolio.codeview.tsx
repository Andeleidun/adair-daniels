import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import portfolioCode from './Portfolio.tsx?raw';

const PortfolioViewer = (): React.ReactElement => (
  <div className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={portfolioCode} />}
      classGiven="card"
    />
  </div>
);

export default PortfolioViewer;
