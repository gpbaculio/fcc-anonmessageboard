import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Form } from 'reactstrap';
import logo from './logo.svg';
import './App.css';
import { AppState } from './store';
import { login } from './store/boards/actions';

interface AppProps {
  login: (name: string) => void;
}

class App extends Component<AppProps> {
  onSubmit = async (e: React.FormEvent) => {
    console.log('onSubmit ');
    e.preventDefault();
    this.props.login('shela');
  };
  render() {
    return (
      <div>
        asd
        <Form onSubmit={this.onSubmit}>
          <Input value='shela' />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
