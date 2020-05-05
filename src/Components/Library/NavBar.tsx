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

class NavBar extends React.Component <Props> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.toggleCodeView();
    }

    populatePages() {
        let populatedPages:any[] = [];
        for (let page of this.props.pages) {
            populatedPages.push(
                <Link to={page.route}>
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

    populateOptions() {
        let options:any[] = [
            (
                <ListItem className="code-view-bar">
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
                </ListItem>
            ),
        ];
        return (options);
    }

    render() {
        return (
            <nav className="app-nav">
                <List>
                    {this.populatePages()}
                    {this.populateOptions()}
                </List>
            </nav>
        );
    }
}

export default NavBar;