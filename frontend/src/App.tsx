import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Input, Form } from 'reactstrap';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import { Home, Header } from './components';
import Board from './components/Board';

// interface AppProps {
//   createBoard: (name: string) => void;
// }

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Switch>
          <Route
            exact
            path='/(home)?'
            render={renderProps => <Home {...renderProps} />}
          />
          <Route
            path='/board/:boardId'
            render={renderProps => <Board {...renderProps} />}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
