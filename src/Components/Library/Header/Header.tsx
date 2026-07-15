import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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
