import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import SiteIcon, { SiteIconName } from '../SiteIcon';

export type NavigationGroup = 'demos' | 'profile';

export interface NavigationPage {
  readonly text: string;
  readonly route: string;
  readonly icon: SiteIconName;
  readonly navGroup: NavigationGroup;
}

interface NavBarProps {
  readonly pages: ReadonlyArray<NavigationPage>;
  readonly activeRoute: string;
  readonly navClick: () => void;
  readonly codeView: boolean;
  readonly codeViewAvailable: boolean;
  readonly toggleCodeView: () => void;
}

const NavBar = (props: NavBarProps): React.ReactElement => {
  const handleChange = () => {
    props.toggleCodeView();
  };

  const populatePages = (group: NavigationGroup) =>
    props.pages
      .filter((page) => page.navGroup === group)
      .map((page) => (
        <li key={page.route}>
          <ListItemButton
            component={Link}
            to={page.route}
            onClick={props.navClick}
            aria-current={props.activeRoute === page.route ? 'page' : undefined}
          >
            <ListItemIcon aria-hidden="true">
              <SiteIcon name={page.icon} />
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
        <li className="nav-close">
          <Button
            onClick={props.navClick}
            startIcon={<SiteIcon name="close" />}
          >
            Close navigation
          </Button>
        </li>
        <ListSubheader component="li">Profile and work</ListSubheader>
        {populatePages('profile')}
        <ListSubheader component="li">Engineering demos</ListSubheader>
        {populatePages('demos')}
        {props.codeViewAvailable ? populateOptions() : null}
      </List>
    </nav>
  );
};

export default NavBar;
