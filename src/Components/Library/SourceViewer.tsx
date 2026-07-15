import React from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import './CodeView.css';

interface SourceViewerProps {
  readonly value: string;
}

const SourceViewer = ({ value }: SourceViewerProps): React.ReactElement => (
  <pre className="source-viewer" aria-label="Source code">
    <code
      dangerouslySetInnerHTML={{
        __html: highlight(value, languages.js),
      }}
    />
  </pre>
);

export default SourceViewer;
