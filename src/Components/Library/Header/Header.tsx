import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SiteIcon from '../SiteIcon';

interface HeaderProps {
  readonly codeView: boolean;
  readonly codeViewAvailable: boolean;
  readonly menuOpen: boolean;
  readonly onClick: () => void;
  readonly ref?: React.Ref<HTMLButtonElement>;
  readonly toggleCodeView: () => void;
}

const Header = ({
  codeView,
  codeViewAvailable,
  menuOpen,
  onClick,
  ref,
  toggleCodeView,
}: HeaderProps): React.ReactElement => {
  const handleChange = () => {
    toggleCodeView();
  };

  const generateCodeView = () => {
    if (codeViewAvailable) {
      const codeViewBar = (
        <div className="code-view-bar">
          <FormControlLabel
            control={
              <Switch
                checked={codeView}
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
      <AppBar position="fixed" color="secondary" component="div">
        <Toolbar className="header-toolbar">
          <IconButton
            edge="start"
            ref={ref}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="menu-button"
            onClick={onClick}
            aria-controls="app-navigation"
            aria-expanded={menuOpen}
          >
            <SiteIcon name={menuOpen ? 'close' : 'menu'} />
          </IconButton>
          <Link className="site-brand" to="/" aria-label="Adair Daniels home">
            <img
              className="site-brand-monogram"
              src={`${import.meta.env.BASE_URL}ad-monogram.svg`}
              alt=""
              aria-hidden="true"
              width="40"
              height="40"
            />
            <span className="site-brand-name">Adair Daniels</span>
          </Link>
          {generateCodeView()}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
