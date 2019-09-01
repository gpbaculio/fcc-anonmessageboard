import React, { Component, Fragment } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardsState, BoardType } from '../store/boards/types';
import { fetchBoard } from '../store/boards/actions';
import { createThread } from '../store/threads/actions';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  Label,
  Col,
  Table,
  Row,
  Spinner
} from 'reactstrap';
import { connect } from 'react-redux';
import { createThreadArgs } from '../Api';
import { AppState } from '../store';
import { Link } from 'react-router-dom';
import { getTimeDate } from './utils';
import { ThreadsState } from '../store/threads/reducers';

interface BoardProps extends RouteComponentProps<{ board_id: string }> {
  location: H.Location<{ board_id: string }>;
  threads: ThreadsState;
  boards: BoardsState;
}

interface BoardDispatchProps {
  createThread: ({ delete_password, text, board_id }: createThreadArgs) => void;
  fetchBoard: (board_id: string) => void;
}

interface BoardState {
  modal: boolean;
  thread_text: string;
  thread_delete_password: string;
  [name: string]: string | boolean | BoardType;
  loading: boolean;
  board: BoardType;
}

class Board extends Component<BoardProps & BoardDispatchProps, BoardState> {
  private initState = {
    modal: false,
    thread_text: '',
    thread_delete_password: '',
    loading: false,
    board: {
      created_on: '',
      name: '',
      threads: [],
      updated_on: '',
      _id: ''
    }
  };
  constructor(props: BoardProps & BoardDispatchProps) {
    super(props);
    this.state = this.initState;
  }
  componentDidMount() {
    const { location, match, boards } = this.props;
    if (location.state) {
      const { board_id } = location.state;
      const board = boards.boards[board_id];
      this.setState({ board });
    } else {
      const { board_id } = match.params;
      if (Object.keys(boards.boards).includes(board_id)) {
        const board = boards.boards[board_id];
        this.setState({ board });
      } else {
        this.props.fetchBoard(board_id);
      }
    }
  }
  toggle = () => {
    this.setState(state => ({
      modal: !state.modal
    }));
  };
  onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { thread_text, thread_delete_password } = this.state;
    const {
      location: { state },
      threads,
      match: { params }
    } = this.props;
    const board_id = state ? state.board_id : params.board_id;
    if (thread_text && thread_delete_password) {
      await this.props.createThread({
        text: thread_text,
        delete_password: thread_delete_password,
        board_id
      });
    }
  };
  componentDidUpdate({
    threads: { loading: prevThreadsLoading },
    boards: { loading: prevBoardsLoading }
  }: BoardProps) {
    const {
      threads: { loading: threadsLoadingState, error: threadsErrorState },
      boards: {
        loading: boardsLoadingState,
        error: boardsErrorState,
        boards: boardsState
      },
      match
    } = this.props;
    if (
      prevThreadsLoading.createThread === true &&
      threadsLoadingState.createThread === false &&
      !threadsErrorState.createThread
    ) {
      const { board_id } = match.params;
      const board = boardsState[board_id];
      this.setState({ ...this.initState, board });
    }
    if (
      prevBoardsLoading.fetchBoard === true &&
      boardsLoadingState.fetchBoard === false &&
      !boardsErrorState.fetchBoard
    ) {
      const { board_id } = match.params;
      const board = boardsState[board_id];
      this.setState({ board });
    }
  }
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    const { threads, boards } = this.props;
    const { board } = this.state;
    return (
      <Fragment>
        {boards.loading.fetchBoard && (
          <div className='mx-auto d-flex justify-content-center'>
            <Spinner color='info' className='mr-2' /> Fetching Board...
          </div>
        )}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Post New Thread</ModalHeader>
          <Form onSubmit={this.onSubmit}>
            <ModalBody>
              <FormGroup row>
                <Label for='board_id' sm={4}>
                  Board Id
                </Label>
                <Col>
                  <Input
                    disabled
                    type='text'
                    name='board_id'
                    id='board_id'
                    placeholder='Board Id'
                    autoComplete='off'
                    required
                    value={board._id}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='thread_text' sm={4}>
                  Text
                </Label>
                <Col>
                  <Input
                    onChange={this.onChange}
                    type='text'
                    name='thread_text'
                    id='thread_text'
                    placeholder='Text'
                    autoComplete='off'
                    required
                    value={this.state.thread_text}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='thread_delete_password' sm={4}>
                  Delete Password
                </Label>
                <Col>
                  <Input
                    onChange={this.onChange}
                    type='password'
                    name='thread_delete_password'
                    id='thread_delete_password'
                    placeholder='Delete Password'
                    autoComplete='off'
                    required
                    value={this.state.thread_delete_password}
                  />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={threads.loading.createThread}
                color='primary'
                type='submit'>
                Submit New Thread
              </Button>
              <Button color='secondary' onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <div className='board-container d-flex justify-content-center align-items-center'>
          <Row>
            <Col>
              <div
                style={{ opacity: boards.loading.fetchBoard ? 0.5 : 1 }}
                className='table-threads p-3 d-flex flex-column text-center'>
                <div className='d-flex justify-content-between mb-3 align-items-center'>
                  <legend className='mb-0 w-auto'>
                    BOARD:
                    <span className='font-weight-lighter'> {board.name}</span>
                  </legend>
                  <Button color='primary' onClick={this.toggle}>
                    Post New Thread
                  </Button>
                </div>
                <Table hover responsive>
                  <thead className='thead-light'>
                    <tr>
                      <th>Thread Title</th>
                      <th>Replies</th>
                      <th>Last Bumped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.threads.map(thId => {
                      const thread = threads.threads[thId];
                      return (
                        <tr key={thread._id}>
                          <td scope='row'>
                            <Link
                              to={{
                                pathname: `/b/${board._id}/${thread._id}`,
                                state: { thread_id: thread._id }
                              }}>
                              {thread.text}
                            </Link>
                          </td>
                          <td>{thread.replies.length}</td>
                          <td>{getTimeDate(thread.bumped_on)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ threads, boards }: AppState) => ({
  threads,
  boards
});

const mapDispatchToProps = {
  createThread,
  fetchBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Board));
