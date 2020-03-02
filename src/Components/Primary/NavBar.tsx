import React from 'react';

interface Props {};

class NavBar extends React.Component <Props> {
    render() {
        return (
            <nav className="app-nav">
                <p>Nav</p>
            </nav>
        );
    }
}

export default NavBar;