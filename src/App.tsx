import React from 'react';
import './App.css';

import Header from './Components/Library/Header';
import NavBar from './Components/Library/NavBar';
import LoadScreen from './Components/Library/LoadScreen';

import Home from './Components/Home/Home';
import XKCD from './Components/XKCD/xkcd';

interface Props {};

interface State {
  loading: boolean;
  navShow: boolean;
  navShowClass: string;
  currentPage: any;
};

interface PageInterface {
  text: string;
  title: string;
  icon: string;
  component: any;
}

class App extends React.Component <Props, State> {

  pages: PageInterface[] = [
    {text: 'Home', title: 'Adair Daniels', icon: 'home', component: <Home />},
    {text: 'XKCD Slideshow', title: 'XKCD Slideshow', icon: 'burst_mode', component: <XKCD />}
  ];

  state: State = {
    loading: true,
    navShow: false,
    navShowClass: 'app app-without-menu',
    currentPage: this.pages[0]
  };

  toggleNav() {
    if (this.state.navShow) {
      this.setState({
        navShowClass: 'app app-without-menu '
      });
    } else {
      this.setState({
        navShowClass: 'app app-with-menu '
      });
    }
    this.setState({
      navShow: !this.state.navShow
    });
  }

  navigate(page: any) {
    this.setState({
      currentPage: page
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
          currentPage={this.state.currentPage}
         />
        {this.state.navShow &&
          <div className="app-menu">
            <NavBar
              pages={this.pages}
              navClick={(page: any) => this.navigate(page)}
              closeClick={() => this.toggleNav()}
            />
          </div>
        }
        <div className="app-main">
          {this.state.loading ? (
            <LoadScreen />
          ) : (
            <div className="app-content">
              {this.state.currentPage.component}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
