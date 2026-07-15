import React from 'react';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import './CodeView.css';

interface SourceViewerProps {
  readonly value: string;
}

const SourceViewer = ({ value }: SourceViewerProps): React.ReactElement => (
  <pre className="source-viewer" aria-label="Source code" tabIndex={0}>
    <code
      // Prism escapes the source text before adding its own highlighting spans.
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{
        __html: highlight(value, languages.tsx, 'tsx'),
      }}
    />
  </pre>
);

export default SourceViewer;
