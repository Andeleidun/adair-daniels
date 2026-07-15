import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import homeCode from './Home.tsx?raw';

const HomeViewer = (): React.ReactElement => (
  <div className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={homeCode} />}
      classGiven="card"
    />
  </div>
);

export default HomeViewer;
