import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';

interface Props {
    pages: any[];
    navClick: any;
    closeClick: any;
};

class NavBar extends React.Component <Props> {
    populatePages() {
        let populatedPages:any[] = [];
        for (let page of this.props.pages) {
            populatedPages.push(
                <ListItem 
                    button 
                    key={page.text}
                    onClick={() => this.props.navClick(page, false)}
                >
                    <ListItemIcon>
                        <i className="material-icons">
                            {page.icon}
                        </i>
                    </ListItemIcon>
                    <ListItemText primary={page.text} />
                </ListItem>
            )
        }
        return (populatedPages);
    }
    render() {
        return (
            <nav className="app-nav">
                <List>
                    {this.populatePages()}
                </List>
                <Fab 
                    onClick={() => this.props.closeClick()}
                    className="close-menu-fab"
                >
                    <i className="material-icons">
                        close
                    </i>
                </Fab>
            </nav>
        );
    }
}

export default NavBar;