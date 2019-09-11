import React, { Component } from 'react';
import { Input, Form, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { updateName } from '../store/boards/actions';
import { updateNameArgs } from '../Api';
import { AppState } from '../store';
import { BoardsState } from '../store/boards/types';

interface EditBoardNameInputProps {
  setIsEditing: (show: boolean) => void;
  board_id: string;
  boards: BoardsState;
  updateName: (
    { board_id, board_name, delete_password }: updateNameArgs,
    callBack: () => void
  ) => void;
}

interface EditBoardNameInputState {
  board_name: string;
  [key: string]: string;
  delete_password: string;
}

class EditBoardNameInput extends Component<
  EditBoardNameInputProps,
  EditBoardNameInputState
> {
  constructor(props: EditBoardNameInputProps) {
    super(props);

    this.state = {
      board_name: props.boards.boards[props.board_id].name,
      delete_password: ''
    };
  }
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  componentDidUpdate({ boards: prevPropsBoards }: EditBoardNameInputProps) {
    const { board_id, boards: boardsProp } = this.props;
    if (
      prevPropsBoards.boards[board_id].loading.update_name && // loaded
      boardsProp.boards[board_id].loading.update_name
    ) {
      const board = boardsProp.boards[board_id];
      this.setState({ board_name: board.name });
    }
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { board_name, delete_password } = this.state;
    const { board_id, updateName, setIsEditing } = this.props;
    if (board_name.trim() && delete_password) {
      updateName({ board_id, board_name, delete_password }, () => {
        this.setState({ delete_password: '' });
        setIsEditing(false);
      });
    }
  };
  render() {
    const { board_name, deletePassword } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className='ml-2 flex-1 d-flex'>
        <Input
          onChange={this.onChange}
          name='board_name'
          value={board_name}
          type='text'
          className='mr-2'
          required
        />
        <Input
          placeholder='Delete Password'
          onChange={this.onChange}
          name='delete_password'
          value={deletePassword}
          type='password'
          className='mr-2'
          required
        />
        <Button color='primary' className='mr-2' type='submit'>
          Submit
        </Button>
        <Button
          outline
          color='primary'
          onClick={() => this.props.setIsEditing(false)}>
          Cancel
        </Button>
      </Form>
    );
  }
}

const mapDispatchToProps = {
  updateName
};

const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBoardNameInput);
