import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface Props {
  onClick: any;
  currentPage: any;
  classGiven?: any;
  codeView: boolean;
  toggleCodeView: any;
};

class Header extends React.Component <Props> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.toggleCodeView();
  }

  generateCodeView() {
    if (this.props.currentPage.codeView) {
      let codeViewBar:any = (
        <div className="code-view-bar">
          <FormControlLabel
            control={
              <Switch
                checked={this.props.codeView}
                onChange={this.handleChange}
                name="codeView"
              />
            }
            label="Code View"
          />
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
