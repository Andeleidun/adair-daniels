import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface HeaderPage {
  readonly title: string;
  readonly codeView?: React.ReactElement;
}

interface HeaderProps {
  readonly currentPage: HeaderPage;
  readonly codeView: boolean;
  readonly menuOpen: boolean;
  readonly onClick: () => void;
  readonly toggleCodeView: () => void;
}

const Header = (props: HeaderProps): React.ReactElement => {
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
          aria-controls="app-navigation"
          aria-expanded={props.menuOpen}
        >
          <i className="material-icons" aria-hidden="true">
            menu
          </i>
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
