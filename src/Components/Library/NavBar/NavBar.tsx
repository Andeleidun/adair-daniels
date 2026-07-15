import React from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
        <ListItem
          button
          component={Link}
          to={page.route}
          onClick={props.navClick}
          role="link"
          aria-current={props.activeRoute === page.route ? 'page' : undefined}
        >
          <ListItemIcon>
            <i className="material-icons" aria-hidden="true">
              {page.icon}
            </i>
          </ListItemIcon>
          <ListItemText primary={page.text} />
        </ListItem>
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
