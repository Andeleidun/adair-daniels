import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

interface Props {
  onClick: any;
  navClick: any;
  currentPage: any;
  classGiven?: any;
};

class Header extends React.Component <Props> {

  generateCodeView() {
    if (this.props.currentPage.codeView) {
      let currentPage = this.props.currentPage;
      let codeViewBar:any = (
        <div className="code-view-bar">
          <Button onClick={() => this.props.navClick(currentPage, false)}>{this.props.currentPage.text}</Button>
          <Button onClick={() => this.props.navClick(currentPage, true)}>Code View</Button>
        </div>
      );
      return (codeViewBar);
    }
  }

  render() {
    return (
      <header className="app-header">
        <AppBar position="static">
          <IconButton edge="start" aria-label="menu" className="menu-button" onClick={this.props.onClick}>
              <i className="material-icons">
                menu
              </i>
          </IconButton>
          <Toolbar className="title-bar">
            <h1>
              {this.props.currentPage.title}
            </h1>
          </Toolbar>
           {this.generateCodeView()}
        </AppBar>
      </header>
    );
  }
}

export default Header;
