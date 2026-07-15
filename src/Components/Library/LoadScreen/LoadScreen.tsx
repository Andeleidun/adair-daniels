import React from 'react';
import { reactLogo } from '../../../Resources/images/index';

function LoadScreen(): React.ReactElement {
  return (
    <figure>
      <img src={reactLogo} className="loading-logo" alt="Loading Logo" />
    </figure>
  );
}

export default LoadScreen;
