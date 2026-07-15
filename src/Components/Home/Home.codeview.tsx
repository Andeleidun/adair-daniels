import React from 'react';
import '../Library/CodeView.css';
import CardTemplate from '../Library/Card';
import SourceViewer from '../Library/SourceViewer';
import homeCode from '!!raw-loader!./Home';

const HomeViewer = (): React.ReactElement => (
  <main className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={homeCode} />}
      classGiven="card"
    />
  </main>
);

export default HomeViewer;
