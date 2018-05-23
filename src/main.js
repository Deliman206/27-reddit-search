'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';
import '../style/main.scss';

const limit = 25;

class Header extends React.Component {
  render() {
    return (
      <h1>Lab 27!</h1>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lookupValue: '',
    };
    this.handlelookupValue = this.handlelookupValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handlelookupValue(event) {
    this.setState({ lookupValue: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.redditSelect(this.state.lookupValue);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type='text' 
          name='searchBar' 
          placeholder='' 
          value={this.state.lookupValue} 
          onChange={this.handlelookupValue}>
        </input>
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ul>
        { this.props.something.data.children.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.data.url}>{item.data.url}</a>
              <p>{item.data.title}</p>
              <p>ups: {item.data.ups}</p>
            </li>
          );
        })}
      </ul>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redditLookup: {},
      redditSelected: null,
      redditLookupError: null,
    };
    this.redditSelect = this.redditSelect.bind(this);
  }
  redditSelect(lookupValue) {
    if (!lookupValue) {
      this.setState({
        redditSelected: null,
        redditLookupError: lookupValue,
      });
    } else {
      const apiUrl = `https://www.reddit.com/r/${lookupValue}.json?${limit}`;
      return superagent.get(apiUrl)
        .then((response) => {
          this.setState({
            redditLookup: response.body,
            redditSelected: lookupValue,
            redditLookupError: null,
          });
        })
        .catch(error => console.log(error));
    }
    return undefined;
  }
  
  render() {
    return (
      <div>
        <Header/>
        <SearchForm redditSelect={this.redditSelect}/>
        {
          this.state.redditLookupError ?
          <div>
            <h2 className='error'>
              { `'${this.state.redditLookupError}'`} does not reddit
            </h2>
          </div> :
          <div>
            {
              this.state.redditSelected ?
              <div>
                <SearchResultList something={this.state.redditLookup}/>
              </div> :
              <div>
                Please make a request to see a page
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
const rootNode = document.createElement('div');
document.body.appendChild(rootNode);
ReactDom.render(<App/>, rootNode);
