import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

interface Props {
  onClick: any;
  title: string;
};

class Header extends React.Component <Props> {
  render() {
    return (
      <header className="app-header">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" aria-label="menu" onClick={this.props.onClick}>
              <i className="material-icons">
                menu
              </i>
            </IconButton>
            <h1>
              {this.props.title}
            </h1>
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

export default Header;
