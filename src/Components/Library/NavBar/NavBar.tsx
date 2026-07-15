import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export interface NavigationPage {
  readonly text: string;
  readonly route: string;
  readonly icon: string;
}

interface NavBarProps {
  readonly pages: ReadonlyArray<NavigationPage>;
  readonly activeRoute: string;
  readonly navClick: () => void;
  readonly codeView: boolean;
  readonly toggleCodeView: () => void;
}

const NavBar = (props: NavBarProps): React.ReactElement => {
  const handleChange = () => {
    props.toggleCodeView();
  };

  const populatePages = () =>
    props.pages.map((page) => (
      <li key={page.route}>
        <ListItemButton
          component={Link}
          to={page.route}
          onClick={props.navClick}
          aria-current={props.activeRoute === page.route ? 'page' : undefined}
        >
          <ListItemIcon>
            <i className="material-icons" aria-hidden="true">
              {page.icon}
            </i>
          </ListItemIcon>
          <ListItemText primary={page.text} />
        </ListItemButton>
      </li>
    ));

  const populateOptions = () => (
    <ListItem className="code-view-bar">
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
    </ListItem>
  );

  return (
    <nav className="app-nav" id="app-navigation" aria-label="Main navigation">
      <List>
        {populatePages()}
        {populateOptions()}
      </List>
    </nav>
  );
};

export default NavBar;
