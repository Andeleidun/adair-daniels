import React from 'react';
import loadingLogo from './reactLogo.svg';

interface Props {};

class LoadScreen extends React.Component <Props> {
    render() {
      return (
        <figure>
          <img src={loadingLogo} className="loading-logo" alt="Loading Logo" />
        </figure>
      );
    }
  }

export default LoadScreen;
