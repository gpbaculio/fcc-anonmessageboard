import React, { Component } from 'react';
import { Input, Form, Button, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { updateName } from '../store/boards/actions';
import { updateNameArgs } from '../Api';
import { AppState } from '../store';
import { BoardsState } from '../store/boards/types';

interface EditBoardNameInputProps {
  setIsEditing: (show: boolean) => void;
  board_id: string;
  boards: BoardsState;
}

interface EditBoardNameInputDispatchProps {
  updateName: (
    { board_id, board_name, delete_password }: updateNameArgs,
    callBack: () => void
  ) => void;
}

interface EditBoardNameInputState {
  [state_key: string]: string;
  board_name: string;
  delete_password: string;
}

class EditBoardNameInput extends Component<
  EditBoardNameInputProps & EditBoardNameInputDispatchProps,
  EditBoardNameInputState
> {
  constructor(
    props: EditBoardNameInputProps & EditBoardNameInputDispatchProps
  ) {
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
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { delete_password } = this.state;
    const board_name = this.state.board_name.trim();
    const {
      board_id,
      updateName,
      setIsEditing,
      boards: { boards }
    } = this.props;
    const boardName = boards[board_id].name;
    if (board_name && boardName !== board_name && delete_password) {
      updateName({ board_id, board_name, delete_password }, () => {
        this.setState({ delete_password: '' });
        setIsEditing(false);
      });
    }
  };
  render() {
    const { board_name, deletePassword } = this.state;
    const {
      boards: { boards },
      board_id
    } = this.props;
    const load = boards[board_id].loading.update_name;
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
        <Button
          disabled={load}
          color='primary'
          className='mr-2 d-inline-flex align-items-center'
          type='submit'>
          {load && <Spinner size='sm' color='light' className='mr-2' />}
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
