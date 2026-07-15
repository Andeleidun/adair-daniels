import React from 'react';
import '../CodeView.css';
import CardTemplate from '../Card';
import SourceViewer from '../SourceViewer';
import portalCode from './Portal.tsx?raw';

const PortalViewer = (): React.ReactElement => (
  <div className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={portalCode} />}
      classGiven="card"
    />
  </div>
);

export default PortalViewer;
