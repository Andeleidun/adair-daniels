import React from 'react';
import './CodeView.css';
import CardTemplate from './Card';
import SourceViewer from './SourceViewer';
import libraryCode from '!!raw-loader!./Library';

const LibraryViewer = (): React.ReactElement => (
  <main className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={libraryCode} />}
      classGiven="card"
    />
  </main>
);

export default LibraryViewer;
