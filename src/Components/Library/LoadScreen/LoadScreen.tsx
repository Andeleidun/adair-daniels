import React from 'react';
import { reactLogo } from '../../../Resources/images/index';

function LoadScreen() {
  return (
    <figure>
      <img src={reactLogo} className="loading-logo" alt="Loading Logo" />
    </figure>
  );
}

export default LoadScreen;
