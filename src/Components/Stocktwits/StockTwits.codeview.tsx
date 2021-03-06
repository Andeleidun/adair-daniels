import React from 'react';

import Viewer from 'react-code-viewer';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import '../Library/CodeView.css';

import CardTemplate from '../Library/Card';

require('prismjs/components/prism-jsx');

interface Props {};

interface State {
    code: string,
    readonly: boolean
};

const code = `
/*
  This page is another example of consuming a RESTful API, this time
  from the StockTwits API. The received information is rendered 
  using the CardTemplate component from the library, and can be
  filtered by clicking on the stock symbol chips.
*/

import React from 'react';
import './StockTwits.scss';

import CardTemplate from '../Library/Card';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {};

interface State {
    symbols: any[];
    input: string;
    error: string;
    interval: any;
    currentCount: number;
    filter: any[];
    loading: boolean;
};

class StockTwits extends React.Component <Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      symbols: [],
      input: '',
      error: '',
      interval: undefined,
      currentCount: 5,
      filter: [],
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.timer = this.timer.bind(this);
  }

  chips:any[] = [];
  tweets:any[] = [];
  content:any;

  renderChips(symbols:any[]) {
    let chips:any[] = [];
    for (let symbol of symbols) {
      if (symbol.tweets) {
        let chipClass = 'chip';
        if (this.state.filter.includes(symbol.key)) {
          chipClass = 'chip active-chip';
        }
        chips.push(
          <Badge badgeContent={symbol.tweets.length} className="badge">
            <Chip
              label={symbol.label}
              className={chipClass}
              key={symbol.key}
              onClick={() => this.chipClick(symbol)}
            />
          </Badge>
        )
      }
      this.chips = chips;
    }
  }

  setTimer() {
    let intervalId = setInterval(this.timer, 60000);
    this.setState({
      interval: intervalId,
      currentCount: 5
    });
  }

  timer() {
    let newCount = this.state.currentCount - 1;
    if (newCount >= 0) {
      this.setState({ currentCount: newCount })
    } else {
      this.submitRequest();
      clearInterval(this.state.interval);
      this.setTimer();
    }
  }

  renderTweets(symbols:any[]) {
    let tweets:any[] = [];
    let tweetsFound = 0;
    for (let symbol of symbols) {
      if (symbol.tweets) {
        tweetsFound++;
        for (let tweet of symbol.tweets) {
            let message = (
                <div>
                    <figure className="picture">
                        <img src={tweet.user.avatar_url} alt={tweet.user.username} />
                    </figure>
                    <p className="namearea">
                        <span className="name">{tweet.user.name}</span> <span className="username">@ {tweet.user.username}</span>
                    </p>
                    <p className="text">
                        {tweet.body}
                    </p>
                </div>
            );
            tweets.push(
                <CardTemplate
                    content={message}
                    classGiven="card" 
                />
            );
        }
      }
    }
    if (tweetsFound > 0) {
      this.setTimer();
    }
    this.tweets = tweets;
  }

  chipClick(symbol:any) {
    let filter:any[] = this.state.filter;
    let symbols:any[] = this.state.symbols;
    let filteredSymbols:any[] = [];
    if (filter.includes(symbol.key)) {
      let position = filter.indexOf(symbol.key);
      filter.splice(position, 1);
      if (filter.length === 0) {
        this.setState({filter});
        clearInterval(this.state.interval);
        this.renderTweets(symbols);
        this.renderChips(symbols);
        return;
      }
    } else {
      filter.push(symbol.key);
    }
    for (let member of filter) {
      for (let symbol of symbols) {
        if (symbol.key === member) {
          filteredSymbols.push(symbol);
          break;
        }
      }
    }
    this.setState({filter});
    clearInterval(this.state.interval);
    this.renderTweets(filteredSymbols);
    this.renderChips(symbols);
  }

  async retrieveTweets(symbols:any[]) {
    {/* Retrieves images from StockTwits using open cors-anywhere proxy */}
    this.setState({ loading: true });
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const urlBase = 'https://api.stocktwits.com/api/2/streams/symbol/';
    const urlEnd = '.json';
    const proxiedRequest = (url, options = {headers: {}}) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Requested-With': 'stock-twits-live-feed',
      },
    })
    .then(res => res.json())
    .catch(error => this.setState({ error: error}));
    for (let symbol of symbols) {
      symbol.url = urlBase.concat(symbol.label).concat(urlEnd);
      let finalUrl = proxyUrl.concat(symbol.url);
      await proxiedRequest(finalUrl)
        .then((data) => {
          symbol.tweets = data.messages;
        })
        .catch(error => this.setState({ error: error}));
    }
    if (!this.state.error) {
      this.renderChips(symbols);
      this.renderTweets(symbols);
    }
    this.setState({ loading: false });
    return(symbols);
  }

  async submitRequest() {
    const newSymbols = this.state.input.toUpperCase().replace(/\s+/g, '').split(",");
    let formattedSymbols:any[] = [];
    let key:number = 0;
    for (let symbol of newSymbols) {
      formattedSymbols.push(
        {key: key, label: symbol, tweets: 0}
      );
      key++;
    }
    formattedSymbols = await this.retrieveTweets(formattedSymbols);
    this.setState({symbols: formattedSymbols});
  }

  handleChange(event:any) {
    this.setState({input: event.target.value});
  }

  handleSubmit(event:any) {
    this.submitRequest();
    event.preventDefault();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    if (this.state.loading) {
      this.content = <CircularProgress />;
    } else if (this.state.error) {
      this.content = <p>{this.state.error}</p>
    } else {
      this.content = (
        <section className="content">
          <section className="chips">
            {this.chips}
          </section>
          <section className="tweets">
            {this.tweets}
          </section>
        </section>
      );
    }
    return (
        <main className="app-stocktwits">
            <section className="search">
            <form>
                <TextField
                className="stock-input"
                id="stock-symbols"
                label="Input stock symbols (separate with a comma)"
                value={this.state.input}
                onChange={this.handleChange}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        $
                    </InputAdornment>
                    ),
                }}
                />
                <br />
                <Button className="search-button" variant="contained" onClick={this.handleSubmit}>Search</Button>
            </form>
            </section>
            {this.content}
        </main>
    );
  }
}

export default StockTwits;
`

class StockViewer extends React.Component <Props, State> {

    state = {
        code,
        readonly: true,
      };

    render() {
        let viewer = (
            <Viewer
                value={this.state.code}
                highlight={code => highlight(code, languages.js)}
                padding={10}
                style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                }}
            />);
    return (
        <main className="app-code-viewer">
            <CardTemplate
                content={viewer}
                classGiven="card"
            />
        </main>
    );
    }
}

export default StockViewer;
