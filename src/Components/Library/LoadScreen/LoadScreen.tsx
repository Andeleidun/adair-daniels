import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function LoadScreen(): React.ReactElement {
  return (
    <div className="loading-status" role="status" aria-live="polite">
      <CircularProgress aria-hidden="true" />
      <span className="visually-hidden">Loading content</span>
    </div>
  );
}

export default LoadScreen;
