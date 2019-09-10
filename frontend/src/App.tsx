import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import { Home, Header } from './components';
import Board from './components/Board';
import Thread from './components/Thread';
import { Container } from 'reactstrap';

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
            path='/b/:board_id'
            exact
            render={renderProps => <Board {...renderProps} />}
          />
          <Route
            exact
            path='/b/:board_id/:thread_id'
            render={renderProps => <Thread {...renderProps} />}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
