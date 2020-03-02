import React from 'react';
import './App.css';

import Header from './Components/Primary/Header';
import NavBar from './Components/Primary/NavBar';
import LoadScreen from './Components/Primary/LoadScreen';

import Home from './Components/Home/Home';

interface Props {};

interface State {
  loading: boolean;
  navShow: boolean;
  navShowClass: string;
};

class App extends React.Component <Props, State> {
  state: State = {
    loading: true,
    navShow: false,
    navShowClass: 'app app-without-menu'
  };

  toggleNav() {
    if (this.state.navShow) {
      this.setState({
        navShowClass: 'app app-without-menu'
      });
    } else {
      this.setState({
        navShowClass: 'app app-with-menu'
      });
    }
    this.setState({
      navShow: !this.state.navShow
    });
  }

  componentDidMount() {
    this.setState( {
      loading: false
    })
  }

  render() {
    return (
      <div className={this.state.navShowClass}>
        <Header
          onClick={() => this.toggleNav()}
         />
        {this.state.navShow &&
          <div className="app-menu">
            <NavBar />
          </div>
        }
        <div className="app-main">
          {this.state.loading ? (
            <LoadScreen />
          ) : (
            <div className="app-content">
              <Home />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
