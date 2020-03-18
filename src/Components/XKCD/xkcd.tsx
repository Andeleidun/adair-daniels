import React from 'react';
import './xkcd.css';
import logo from '../Primary/reactLogo.svg';

interface Props {
  img?: any;
  onClick?: any;
  className?: any;
};
interface State {
  images?: any;
  index: number;
  initialIndex: number;
  finalIndex: number;
  loading: boolean;
};

class Panel extends React.Component <Props> {
  render() {
    return (
      <div>
        <h2>{this.props.img.title}</h2>
        <figure>
          <img 
          src={this.props.img.img} 
          alt={this.props.img.alt}
          />
        </figure>
      </div>
    );
  }
}

class NavBar extends React.Component <Props> {
  render() {
    return(
      <nav>
        <button
          onClick={() => this.props.onClick('first')}
        >
          First
        </button>
        <button
          onClick={() => this.props.onClick('previous')}
        >
          Previous
        </button>
        <button
          onClick={() => this.props.onClick('next')}
        >
          Next
        </button>
        <button
          onClick={() => this.props.onClick('last')}
        >
          Last
        </button>
      </nav>
    );
  }
}

class XKCD extends React.Component <Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      images: Array(3).fill(''),
      index: 1,
      initialIndex: 1,
      finalIndex: 0,
      loading: true,
    };
  }
  async retrieveImages(index: any) {
    {/* Retrieves images from XKCD using open cors-anywhere proxy */}
    console.log(index);
    this.setState({ loading: true });
    this.setState({ images: Array(3).fill('')});
    const proxyUrl = 'https://cors-anywhere.herokuapp.com';
    const urlBase = 'http://xkcd.com/';
    const urlEnd = '/info.0.json';
    const currentUrl = 'http://xkcd.com/info.0.json'
    let currentIndex = index;
    let urlArray = [];
    for (let i = 0; i < 3; i++) {
      let createUrl = urlBase.concat(currentIndex).concat(urlEnd);
      urlArray.push(createUrl);
      currentIndex++;
    }
    const proxiedRequest = (url: string, options = {headers: {}}) =>
      fetch(`${proxyUrl}/${url}`, {
        ...options,
        headers: {
          ...options.headers,
          'X-Requested-With': 'xkcd-slideshow',
        },
      })
      .then(res => res.json())
      .catch(error => console.error(error))
    if (this.state.finalIndex == 0) {
      await proxiedRequest(currentUrl)
        .then((data) => {
          let finalPlaceholder = data.num - 2;
          this.setState({ finalIndex : finalPlaceholder });
        })
        .catch(error => console.error(error))
    }
    let dataArray: any[] = [];
    for (let useUrl of urlArray) {
      await proxiedRequest(useUrl)
        .then((data: any) => {
          dataArray.push(data);
        })
        .catch(error => console.error(error))
    }
    this.setState({ images: dataArray});
    this.setState({ loading: false });
  }
  renderPanels(i: number) {
    return (
      <Panel
        img={this.state.images[i]}
        className="panel"
      />
    );
  }
  navigate(input: string) {
    let step = 3;
    let newState = 1;
    switch(input) {
      case 'first':
        newState = this.state.initialIndex;
        break;
      case 'previous':
        newState = this.state.index - step;
        if ( newState < this.state.initialIndex ) {
          newState = this.state.initialIndex;
        }
        break;
      case 'next':
        newState = this.state.index + step;
        if ( newState > this.state.finalIndex ) {
          newState = this.state.finalIndex;
        }
        break;
      case 'last':
          newState = this.state.finalIndex;
        break;
      default:
        console.log("Navigation error.");
    }
    this.retrieveImages(newState);
    this.setState({ index: newState});
  }
  componentDidMount() {
    this.retrieveImages(this.state.index);
  }
  render() {
    return (
      <div className="xkcd">
        {this.state.loading ? (
          <img src={logo} className="loading-logo" alt="logo" />
        ) : (
          <main className="slideshow">
            {this.renderPanels(0)}
            {this.renderPanels(1)}
            {this.renderPanels(2)}
          </main>
        ) }
        <footer className="xkcd-footer">
          <NavBar
            onClick={(i: string) => this.navigate(i)}
          />
          <section className="credit">
            <p>
              Sincere thanks to <a href="https://xkcd.com">Randlal Munroe over at XKCD</a> for making such an awesome webcomic.
            </p>
          </section>
        </footer>
      </div>
    );
  }
}

export default XKCD;
