/*
  This page is another example of consuming a RESTful API, this time
  from the StockTwits API. The received information is rendered 
  using the CardTemplate component from the library, and can be
  filtered by clicking on the stock symbol chips.
*/

import React from 'react';
import './StockTwits.css';

import CardTemplate from '../Library/Card';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = unknown;

interface State {
  symbols: any[];
  input: string;
  error: string;
  interval: any;
  currentCount: number;
  filter: any[];
  loading: boolean;
}

class StockTwits extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      symbols: [],
      input: '',
      error: '',
      interval: undefined,
      currentCount: 5,
      filter: [],
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.timer = this.timer.bind(this);
  }

  chips: any[] = [];
  tweets: any[] = [];
  content: any;

  renderChips(symbols: any[]) {
    const chips: any[] = [];
    for (const symbol of symbols) {
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
        );
      }
      this.chips = chips;
    }
  }

  setTimer() {
    const intervalId = setInterval(this.timer, 60000);
    this.setState({
      interval: intervalId,
      currentCount: 5,
    });
  }

  timer() {
    const newCount = this.state.currentCount - 1;
    if (newCount >= 0) {
      this.setState({ currentCount: newCount });
    } else {
      this.submitRequest();
      clearInterval(this.state.interval);
      this.setTimer();
    }
  }

  renderTweets(symbols: any[]) {
    const tweets: any[] = [];
    let tweetsFound = 0;
    for (const symbol of symbols) {
      if (symbol.tweets) {
        tweetsFound++;
        for (const [index, tweet] of symbol.tweets.entries()) {
          const message = (
            <div key={tweet.user.username + index}>
              <figure className="picture">
                <img
                  src={tweet.user.avatar_url_ssl}
                  alt={tweet.user.username}
                />
              </figure>
              <p className="namearea">
                <span className="name">{tweet.user.name}</span>{' '}
                <span className="username">@ {tweet.user.username}</span>
              </p>
              <p className="text">{tweet.body}</p>
            </div>
          );
          tweets.push(
            <CardTemplate content={message} key={index} classGiven="card" />
          );
        }
      }
    }
    if (tweetsFound > 0) {
      this.setTimer();
    }
    this.tweets = tweets;
  }

  chipClick(symbol: any) {
    const filter: any[] = this.state.filter;
    const symbols: any[] = this.state.symbols;
    const filteredSymbols: any[] = [];
    if (filter.includes(symbol.key)) {
      const position = filter.indexOf(symbol.key);
      filter.splice(position, 1);
      if (filter.length === 0) {
        this.setState({ filter });
        clearInterval(this.state.interval);
        this.renderTweets(symbols);
        this.renderChips(symbols);
        return;
      }
    } else {
      filter.push(symbol.key);
    }
    for (const member of filter) {
      for (const symbol of symbols) {
        if (symbol.key === member) {
          filteredSymbols.push(symbol);
          break;
        }
      }
    }
    this.setState({ filter });
    clearInterval(this.state.interval);
    this.renderTweets(filteredSymbols);
    this.renderChips(symbols);
  }

  async retrieveTweets(symbols: any[]) {
    /* Retrieves images from StockTwits using open cors-anywhere proxy */
    this.setState({ loading: true });
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const urlBase = 'https://api.stocktwits.com/api/2/streams/symbol/';
    const urlEnd = '.json';
    const proxiedRequest = (url, options = { headers: {} }) =>
      fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Requested-With': 'stock-twits-live-feed',
        },
      })
        .then((res) => res.json())
        .catch((error) => this.setState({ error: error }));
    for (const symbol of symbols) {
      const useUrl = urlBase.concat(symbol.label).concat(urlEnd);
      const finalUrl = proxyUrl.concat(useUrl);
      await proxiedRequest(finalUrl)
        .then((data) => {
          const contents = JSON.parse(data.contents);
          symbol.tweets = contents.messages;
        })
        .catch((error) => this.setState({ error: error }));
    }
    if (!this.state.error && symbols[0].tweets) {
      this.renderChips(symbols);
      this.renderTweets(symbols);
    }
    this.setState({ loading: false });
    return symbols;
  }

  async submitRequest() {
    const newSymbols = this.state.input
      .toUpperCase()
      .replace(/\s+/g, '')
      .split(',');
    let formattedSymbols: any[] = [];
    let key = 0;
    for (const symbol of newSymbols) {
      formattedSymbols.push({ key: key, label: symbol, tweets: null });
      key++;
    }
    formattedSymbols = await this.retrieveTweets(formattedSymbols);
    this.setState({ symbols: formattedSymbols });
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    this.setState({ input: event.target.value });
  }

  handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    this.submitRequest();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    if (this.state.loading) {
      this.content = <CircularProgress />;
    } else if (this.state.error) {
      this.content = <p>{this.state.error}</p>;
    } else if (this.tweets[0]) {
      this.content = (
        <section className="content">
          <section className="chips">{this.chips}</section>
          <section className="tweets">{this.tweets}</section>
        </section>
      );
    } else {
      this.content = null;
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
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <br />
            <Button
              className="search-button"
              variant="contained"
              onClick={this.handleSubmit}
            >
              Search
            </Button>
          </form>
        </section>
        {this.content}
      </main>
    );
  }
}

export default StockTwits;
