import React, { Component } from 'react';
import classNames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router';
import * as H from 'history';
import { ThreadType, ReplyType } from '../store/boards/types';
import {
  Row,
  Col,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { createReply } from '../store/replies/actions';
import { getThread } from '../store/threads/actions';
import { timeDifferenceForDate, getTimeDate } from './utils';
import { createReplyArgs } from '../Api';
import { RepliesState } from '../store/replies/reducers';
import { ThreadsState } from '../store/threads/reducers';

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
  reply_text: string;
  reply_delete_password: string;
  [name: string]: string | ThreadType;
  thread: ThreadType;
}

class Thread extends Component<ThreadProps & ThreadDispatchProps, ThreadState> {
  private initState = {
    reply_text: '',
    reply_delete_password: '',
    thread: {
      _id: '',
      text: '',
      created_on: '',
      replies: [],
      bumped_on: '',
      board_id: ''
    }
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
  componentDidUpdate(
    prevProps: ThreadProps & ThreadDispatchProps,
    _prevState: ThreadState
  ) {
    const { threads: prevThreadsProp, replies: prevRepliesProp } = prevProps;
    const {
      threads: threadsProp,
      match: {
        params: { thread_id }
      },
      replies: repliesProp
    } = this.props;
    if (prevThreadsProp.loading.getThread && !threadsProp.loading.getThread) {
      const thread = threadsProp.threads[thread_id];
      this.setState({ thread });
    }
    if (
      prevRepliesProp.loading.createReply &&
      !repliesProp.loading.createReply
    ) {
      const thread = threadsProp.threads[thread_id];
      console.log('re render thread ', thread);
      this.setState({ thread });
    }
  }

  render() {
    const { replies, threads } = this.props;
    const { thread } = this.state;
    return (
      <Row>
        <Col>
          <div className='table-threads mx-auto my-5 d-flex flex-column text-center'>
            <div
              className={classNames(
                'loader w-100 d-flex align-items-center justify-content-center position-absolute',
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
                  THREAD:
                  <span className='font-weight-lighter'> {thread.text}</span>
                </legend>
                <span>{getTimeDate(thread.created_on)}</span>
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
                      <Label for='reply_delete_password'>Delete Password</Label>
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
