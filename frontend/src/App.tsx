import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Input, Form } from 'reactstrap';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import { Home, Header } from './components';
import Board from './components/Board';
import Thread from './components/Thread';

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
            path='/b/:boardId'
            exact
            render={renderProps => <Board {...renderProps} />}
          />
          <Route
            exact
            path='/b/:boardId/:threadId'
            render={renderProps => <Thread {...renderProps} />}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
