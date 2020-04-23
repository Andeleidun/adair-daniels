import React from 'react';
import {reactLogo} from '../../Resources/images/index';

interface Props {};

class LoadScreen extends React.Component <Props> {
    render() {
      return (
        <figure>
          <img src={reactLogo} className="loading-logo" alt="Loading Logo" />
        </figure>
      );
    }
  }

export default LoadScreen;
