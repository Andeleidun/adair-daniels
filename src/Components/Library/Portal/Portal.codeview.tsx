import React from 'react';
import '../CodeView.css';
import CardTemplate from '../Card';
import SourceViewer from '../SourceViewer';
import portalCode from '!!raw-loader!./Portal';

const PortalViewer = (): React.ReactElement => (
  <main className="app-code-viewer">
    <CardTemplate
      content={<SourceViewer value={portalCode} />}
      classGiven="card"
    />
  </main>
);

export default PortalViewer;
