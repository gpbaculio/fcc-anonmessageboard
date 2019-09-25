import React, { Component } from 'react';
import { Form, Input, Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { createBoard } from '../store/boards/actions';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { BoardsState } from '../store/boards/types';

interface AddBoardProps extends RouteComponentProps {
  boards: BoardsState;
}

interface AddBoardDispatchProps {
  // Add your dispatcher properties here
  createBoard: (name: string, delete_password: string) => void;
}

interface AddBoardState {
  text: string;
  delete_password: string;
  [text: string]: string;
}

class AddBoard extends Component<
  AddBoardProps & AddBoardDispatchProps,
  AddBoardState
> {
  constructor(props: AddBoardProps & AddBoardDispatchProps) {
    super(props);
    this.state = {
      text: '',
      delete_password: ''
    };
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = this.state.text.trim();
    const { delete_password } = this.state;
    if (text && delete_password) this.props.createBoard(text, delete_password);
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { boards } = this.props;
    const { text, delete_password } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className='d-flex'>
        <Input
          name='text'
          type='text'
          value={text}
          onChange={this.onChange}
          className='mr-2'
          placeholder='Board Name'
          autoComplete='off'
        />
        <Input
          className='mr-2'
          type='password'
          placeholder='Delete Password'
          name='delete_password'
          value={delete_password}
          onChange={this.onChange}
          autoComplete='off'
        />
        <Button
          className='d-flex align-items-center'
          color='primary'
          disabled={boards.loading.createBoard}
          type='submit'>
          {!!boards.loading.createBoard && (
            <Spinner className='mr-1' size='sm' color='light' />
          )}
          Submit
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

const mapDispatchToProps = {
  createBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddBoard));
