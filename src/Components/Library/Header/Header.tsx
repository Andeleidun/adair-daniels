import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const Header = (props) => {
  const handleChange = () => {
    props.toggleCodeView();
  };

  const generateCodeView = () => {
    if (props.currentPage.codeView) {
      const codeViewBar = (
        <div className="code-view-bar">
          <FormControlLabel
            control={
              <Switch
                checked={props.codeView}
                onChange={handleChange}
                name="codeView"
              />
            }
            label="Code View"
          />
        </div>
      );
      return codeViewBar;
    }
  };

  return (
    <header className="app-header">
      <AppBar position="static">
        <IconButton
          edge="start"
          aria-label="menu"
          className="menu-button"
          onClick={props.onClick}
        >
          <i className="material-icons">menu</i>
        </IconButton>
        <Toolbar className="title-bar">
          <h1>{props.currentPage.title}</h1>
        </Toolbar>
        {generateCodeView()}
      </AppBar>
    </header>
  );
};

export default Header;
