import React from 'react';

interface Props {
  onClick: any;
};

class Header extends React.Component <Props> {
  render() {
    return (
      <header className="app-header">
        <button onClick={this.props.onClick}>Nav</button>
        <h1>Adair Daniels</h1>
      </header>
    );
  }
}

export default Header;
