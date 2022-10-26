const NavBarCode = `
import React from 'react';
import {Link} from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface Props {
    pages: any[];
    navClick: any;
    codeView: boolean;
    toggleCodeView: any;
};

const NavBar = (props) => {
    const handleChange = () => {
        props.toggleCodeView();
    }
    
    const populatePages = () => {
        let populatedPages:any[] = [];
        for (let page of props.pages) {
            populatedPages.push(
                <Link 
                    to={page.route}
                    onClick={() => props.navClick(page)}
                >
                    <ListItem 
                        button 
                        key={page.text}
                    >
                        <ListItemIcon>
                            <i className="material-icons">
                                {page.icon}
                            </i>
                        </ListItemIcon>
                        <ListItemText primary={page.text} />
                    </ListItem>
                </Link>
            )
        }
        return (populatedPages);
    }

    const populateOptions = () => {
        let options:any[] = [
            (
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
            ),
        ];
        return (options);
    }
    
    return (
        <nav className="app-nav">
            <List>
                {populatePages()}
                {populateOptions()}
            </List>
        </nav>
    );
}

export default NavBar;
`;

export default NavBarCode;
