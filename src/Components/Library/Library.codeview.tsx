import React from 'react';
import './CodeView.css';
import CardTemplate from './Card';
import SourceViewer from './SourceViewer';
import libraryCode from './Library.tsx?raw';

const LibraryViewer = (): React.ReactElement => (
  <div className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={libraryCode} />}
      classGiven="card"
    />
  </div>
);

export default LibraryViewer;
