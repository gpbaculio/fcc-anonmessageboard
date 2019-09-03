import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as H from 'history';
import { ThreadType, ReplyType } from '../store/boards/types';
import { Row, Col, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { createReply } from '../store/replies/actions';
import { timeDifferenceForDate, getTimeDate } from './utils';
import { createReplyArgs } from '../Api';

interface ThreadProps extends RouteComponentProps {
  location: H.Location<{ thread_id: string }>;
  threads: {
    [_id: string]: ThreadType;
  };
  replies: {
    [_id: string]: ReplyType;
  };
}

interface ThreadDispatchProps {
  createReply: ({
    delete_password,
    text,
    board_id,
    thread_id
  }: createReplyArgs) => void;
}

interface ThreadState {
  reply_text: string;
  reply_delete_password: string;
  [name: string]: string;
}

class Thread extends Component<ThreadProps & ThreadDispatchProps, ThreadState> {
  private initState = {
    reply_text: '',
    reply_delete_password: ''
  };
  constructor(props: ThreadProps & ThreadDispatchProps) {
    super(props);
    this.state = this.initState;
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { reply_text, reply_delete_password } = this.state;
    const { threads, location } = this.props;
    console.log('location ', location.state);
    const { thread_id } = location.state;
    const thread = threads[thread_id];
    const text = reply_text.trim();
    const delete_password = reply_delete_password.trim();
    if (reply_text && reply_delete_password)
      this.props.createReply({
        text,
        delete_password,
        board_id: thread.board_id,
        thread_id
      });
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { replies, threads, location } = this.props;
    const { thread_id } = location.state;
    const thread = threads[thread_id];
    return (
      <div className='board-container d-flex justify-content-center align-items-center'>
        <Row>
          <Col>
            <div className='table-threads d-flex flex-column text-center'>
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
                <div className='reply-form-container'>
                  <Form className='p-3' onSubmit={this.onSubmit}>
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
                          value={thread_id}
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
                    <Button color='primary' type='submit'>
                      Submit Reply
                    </Button>
                  </Form>
                </div>
                {thread.replies.map(rId => {
                  const reply = replies[rId];
                  console.log('rId ', rId);
                  console.log('thread.replies ', thread.replies);
                  console.log('replies ', replies);
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
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({
  threads: { threads },
  replies: { replies }
}: AppState) => ({
  threads,
  replies
});

const mapDispatchToProps = {
  createReply
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Thread));
