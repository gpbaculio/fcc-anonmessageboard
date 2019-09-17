import React, { Component, Fragment } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import classNames from 'classnames';
import {
  BoardsState,
  BoardType,
  BoardErrorTypeKeys
} from '../store/boards/types';
import * as boardsActions from '../store/boards/actions';
import * as threadsActions from '../store/threads/actions';
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
  Spinner,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import { createThreadArgs } from '../Api';
import { AppState } from '../store';
import { Link } from 'react-router-dom';
import { getTimeDate } from './utils';
import { ThreadsState } from '../store/threads/reducers';
import EditBoardNameInput from './EditBoardNameInput';
import { boardInitLoading, boardInitError } from '../store/boards/reducers';

interface LocationState {
  board_id: string;
}

interface BoardProps extends RouteComponentProps<LocationState> {
  location: H.Location;
  threads: ThreadsState;
  boards: BoardsState;
}

interface BoardDispatchProps {
  createThread: (
    { delete_password, text, board_id }: createThreadArgs,
    callBack: () => void
  ) => void;
  fetchBoard: (board_id: string) => void;
  resetBoardError: (errorKey: string, board_id: string) => void;
  deleteBoard: ({
    board_id,
    delete_password,
    callBack
  }: boardsActions.deleteBoardArgs) => void;
}

interface BoardState {
  board_delete_password: string;
  postNewModal: boolean;
  deleteModal: boolean;
  thread_text: string;
  thread_delete_password: string;
  [name: string]: string | boolean | BoardType;
  loading: boolean;
  board: BoardType;
  isEditing: boolean;
}

class Board extends Component<BoardProps & BoardDispatchProps, BoardState> {
  private initState = {
    board_delete_password: '',
    postNewModal: false,
    thread_text: '',
    deleteModal: false,
    thread_delete_password: '',
    loading: false,
    isEditing: false,
    board: {
      created_on: '',
      name: '',
      threads: [],
      updated_on: '',
      _id: '',
      loading: boardInitLoading,
      error: boardInitError
    }
  };
  constructor(props: BoardProps & BoardDispatchProps) {
    super(props);
    this.state = this.initState;
  }
  static getDerivedStateFromProps(
    { boards, match, location }: BoardProps & BoardDispatchProps,
    _state: BoardState
  ) {
    if (location.state) {
      const { board_id } = location.state;
      const board = boards.boards[board_id];
      return {
        board
      };
    } else {
      const { board_id } = match.params;
      if (Object.keys(boards.boards).includes(board_id)) {
        const { board_id } = match.params;
        const board = boards.boards[board_id];
        return {
          board
        };
      }
    }
    return null;
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
  toggleModal = (type: string) => {
    this.setState(state => ({
      [type]: !state[type]
    }));
  };
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { thread_text, thread_delete_password } = this.state;
    const {
      location: { state },
      match: { params }
    } = this.props;
    const board_id = state ? state.board_id : params.board_id;
    if (thread_text && thread_delete_password) {
      this.props.createThread(
        {
          text: thread_text,
          delete_password: thread_delete_password,
          board_id
        },
        () => {
          this.setState({
            postNewModal: false,
            thread_text: '',
            thread_delete_password: ''
          });
        }
      );
    }
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  setIsEditing = (show: boolean) => {
    this.setState({ isEditing: show });
  };
  render() {
    const { threads, boards, resetBoardError } = this.props;
    const { board, isEditing } = this.state;
    return (
      <Fragment>
        <Modal
          isOpen={this.state.deleteModal}
          toggle={() => this.toggleModal('deleteModal')}>
          <ModalHeader toggle={() => this.toggleModal('deleteModal')}>
            Delete Board
          </ModalHeader>
          <ModalBody
            className={classNames({
              'fade-load': board.loading.delete_board
            })}>
            Are you sure you want to delete <strong>{`${board.name}`}</strong>?
            <FormGroup row className='mt-3'>
              <Label for='board_delete_password' sm={4}>
                Delete Password
              </Label>
              <Col>
                <Input
                  onChange={this.onChange}
                  type='password'
                  name='board_delete_password'
                  id='board_delete_password'
                  placeholder='Delete Password'
                  autoComplete='off'
                  required
                  value={this.state.board_delete_password}
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              disabled={board.loading.delete_board}
              onClick={() =>
                this.props.deleteBoard({
                  board_id: board._id,
                  delete_password: this.state.board_delete_password,
                  callBack: () => {
                    this.props.history.push('/');
                  }
                })
              }>
              Delete
            </Button>
            <Button
              color='secondary'
              onClick={() => this.toggleModal('deleteModal')}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.postNewModal}
          toggle={() => this.toggleModal('postNewModal')}>
          <ModalHeader toggle={() => this.toggleModal('postNewModal')}>
            Post New Thread
          </ModalHeader>
          <div
            className={classNames(
              'loader  w-100 d-flex align-items-center justify-content-center position-absolute',
              { hide: !threads.loading.createThread }
            )}>
            <Spinner color='info' className='mr-2' />
            <strong>Processing...</strong>
          </div>
          <Form onSubmit={this.onSubmit}>
            <ModalBody
              className={classNames({
                'fade-load': threads.loading.createThread
              })}>
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
              <Button
                color='secondary'
                onClick={() => this.toggleModal('postNewModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <div className='board-container d-flex justify-content-center align-items-center'>
          <Row>
            <Col>
              {Object.keys(board.error).map((k: string, i) => {
                const errorMsg = board.error[k as BoardErrorTypeKeys];
                return (
                  <Alert
                    key={`${i}-${k}`}
                    color='danger'
                    isOpen={Boolean(errorMsg)}
                    toggle={() =>
                      resetBoardError(k as BoardErrorTypeKeys, board._id)
                    }>
                    {errorMsg}
                  </Alert>
                );
              })}
              <div className='table-threads'>
                <div
                  className={classNames(
                    'loader w-100 d-flex align-items-center justify-content-center position-absolute',
                    { hide: !boards.loading.fetchBoard }
                  )}>
                  <Spinner color='info' className='mr-2' />
                  <strong>Fetching Board...</strong>
                </div>
                <div
                  className={classNames('p-3 d-flex flex-column text-center', {
                    'fade-load': boards.loading.fetchBoard
                  })}>
                  <div className='d-flex justify-content-between mb-3 align-items-center'>
                    <legend className='mb-0 w-auto'>
                      BOARD:
                      <span
                        className={classNames('font-weight-lighter', {
                          hide: isEditing
                        })}>
                        {board.name}
                      </span>
                    </legend>
                    <div
                      className={classNames(
                        'board-controllers d-flex w-25 justify-content-between',
                        {
                          hide: isEditing
                        }
                      )}>
                      <Button
                        color='success'
                        onClick={() => this.setIsEditing(true)}>
                        Edit
                      </Button>
                      <Button
                        color='danger'
                        onClick={() => this.toggleModal('deleteModal')}>
                        Delete
                      </Button>
                    </div>
                    {!!isEditing && (
                      <EditBoardNameInput
                        board_id={board._id}
                        setIsEditing={this.setIsEditing}
                      />
                    )}
                  </div>
                  <div className='w-100 mb-2 d-flex justify-content-between align-items-end'>
                    <h5>Threads</h5>
                    <Button
                      color='primary'
                      onClick={() => this.toggleModal('postNewModal')}>
                      Post New Thread
                    </Button>
                  </div>
                  <Table hover responsive className='threads-table'>
                    <thead className='thead-light'>
                      <tr>
                        <th>Thread Title</th>
                        <th>Replies</th>
                        <th>Last Bumped</th>
                      </tr>
                    </thead>
                    <tbody>
                      {board.threads.length === 0 && (
                        <tr>
                          <td colSpan={3}>No Threads</td>
                        </tr>
                      )}
                      {board.threads.map(thId => {
                        const thread = threads.threads[thId];
                        return (
                          <tr key={thread._id}>
                            <td>
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
  createThread: threadsActions.createThread,
  fetchBoard: boardsActions.fetchBoard,
  resetBoardError: boardsActions.resetBoardError,
  deleteBoard: boardsActions.deleteBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Board));
