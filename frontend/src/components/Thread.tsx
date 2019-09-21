import React, { Component } from 'react';
import classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router';
import * as H from 'history';
import { ThreadType } from '../store/boards/types';
import {
  Row,
  Col,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Spinner,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { createReply } from '../store/replies/actions';
import { getThread } from '../store/threads/actions';
import { timeDifferenceForDate, getTimeDate } from './utils';
import { createReplyArgs } from '../Api';
import { RepliesState } from '../store/replies/reducers';
import {
  ThreadsState,
  threadInitLoading,
  threadInitError
} from '../store/threads/reducers';
import EditThreadTextInput from './EditThreadTextInput';

interface ThreadProps extends RouteComponentProps<{ thread_id: string }> {
  location: H.Location;
  threads: ThreadsState;
  replies: RepliesState;
}

interface ThreadDispatchProps {
  createReply: ({
    delete_password,
    text,
    board_id,
    thread_id
  }: createReplyArgs) => void;
  getThread: (thread_id: string) => void;
}

interface ThreadState {
  isEditing: boolean;
  reply_text: string;
  reply_delete_password: string;
  [name: string]: string | ThreadType | boolean;
  thread: ThreadType;
}

class Thread extends Component<ThreadProps & ThreadDispatchProps, ThreadState> {
  private initState = {
    isEditing: false,
    reply_text: '',
    reply_delete_password: '',
    thread: {
      _id: '',
      text: '',
      created_on: '',
      replies: [],
      bumped_on: '',
      board_id: '',
      loading: threadInitLoading,
      error: threadInitError
    }
  };
  setIsEditing = (show: boolean) => {
    this.setState({ isEditing: show });
  };
  constructor(props: ThreadProps & ThreadDispatchProps) {
    super(props);
    this.state = this.initState;
  }
  componentDidMount() {
    const { location, match, threads } = this.props;
    if (location.state) {
      const { thread_id } = location.state;
      const thread = threads.threads[thread_id];
      this.setState({ thread });
    } else {
      const { thread_id } = match.params;
      if (Object.keys(threads.threads).includes(thread_id)) {
        const thread = threads.threads[thread_id];
        this.setState({ thread });
      } else {
        this.props.getThread(thread_id);
      }
    }
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { reply_text, reply_delete_password, thread } = this.state;
    const text = reply_text.trim();
    const delete_password = reply_delete_password.trim();
    if (reply_text && reply_delete_password)
      this.props.createReply({
        text,
        delete_password,
        board_id: thread.board_id,
        thread_id: thread._id
      });
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  static getDerivedStateFromProps(
    { threads, match, location }: ThreadProps & ThreadDispatchProps,
    _state: ThreadState
  ) {
    if (location.state) {
      const { thread_id } = location.state;
      const thread = threads.threads[thread_id];
      return {
        thread
      };
    } else {
      const { thread_id } = match.params;
      if (Object.keys(threads.threads).includes(thread_id)) {
        const { thread_id } = match.params;
        const thread = threads.threads[thread_id];
        return {
          thread
        };
      }
    }
    return null;
  }

  render() {
    const { replies, threads } = this.props;
    const { thread, isEditing } = this.state;
    return (
      <Container>
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
        <Row>
          <Col>
            <h2 className='text-center my-5'>THREAD</h2>
            <div className='table-threads mx-auto d-flex flex-column text-center'>
              <div
                className={classNames(
                  'loader w--100 d-flex align-items-center justify-content-center position-absolute',
                  { hide: !threads.loading.getThread }
                )}>
                <Spinner color='info' className='mr-2' />
                <strong>Fetching Thread...</strong>
              </div>
              <div
                className={classNames(
                  'thread w-100 mx-auto d-flex flex-column text-center',
                  {
                    'fade-load': threads.loading.getThread
                  }
                )}>
                <div className='thread-title-container d-flex p-3 align-items-center justify-content-between'>
                  <legend className='mb-0 w-auto'>
                    <span
                      className={classNames('font-weight-lighter', {
                        hide: isEditing
                      })}>
                      {thread.text}
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
                    <Button color='danger'>Delete</Button>
                  </div>
                  {!!isEditing && (
                    // recommended: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                    <EditThreadTextInput
                      key={thread._id}
                      threadId={thread._id}
                      setIsEditing={this.setIsEditing}
                    />
                  )}
                </div>
                <div className='replies-container'>
                  <legend className='text-center reply-title mb-0 py-1'>
                    Reply on Thread
                  </legend>
                  <div className='reply-form-container position-relative'>
                    <div
                      className={classNames(
                        'loader  w-100 d-flex align-items-center justify-content-center position-absolute',
                        { hide: !replies.loading.createReply }
                      )}>
                      <Spinner color='info' className='mr-2' />
                      <strong>Processing...</strong>
                    </div>
                    <Form
                      className={classNames('p-3', {
                        'fade-load': replies.loading.createReply
                      })}
                      onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label for='thread_id'>Thread Id</Label>
                        <Col>
                          <Input
                            type='text'
                            name='thread_id'
                            id='thread_id'
                            placeholder='Thread Id'
                            autoComplete='off'
                            required
                            disabled
                            value={thread._id}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Label for='reply_text'>Text</Label>
                        <Col>
                          <Input
                            type='text'
                            name='reply_text'
                            id='reply_text'
                            placeholder='Text'
                            autoComplete='off'
                            required
                            onChange={this.onChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Label for='reply_delete_password'>
                          Delete Password
                        </Label>
                        <Col>
                          <Input
                            type='password'
                            name='reply_delete_password'
                            id='reply_delete_password'
                            placeholder='Delete Password'
                            autoComplete='off'
                            required
                            onChange={this.onChange}
                          />
                        </Col>
                      </FormGroup>
                      <Button
                        disabled={replies.loading.createReply}
                        color='primary'
                        type='submit'>
                        Submit Reply
                      </Button>
                    </Form>
                  </div>
                  {thread.replies.map(rId => {
                    const reply = replies.replies[rId];
                    return (
                      <div
                        key={reply._id}
                        className='reply-container my-3 d-flex justify-content-between'>
                        <span>{reply.text}</span>
                        <span>{timeDifferenceForDate(reply.created_on)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = ({ threads, replies }: AppState) => ({
  threads,
  replies
});

const mapDispatchToProps = {
  createReply,
  getThread
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Thread));
