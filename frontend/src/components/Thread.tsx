import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as H from 'history';
import { ThreadType, ReplyType } from '../store/boards/types';
import { Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { timeDifferenceForDate } from './utils';

interface ThreadProps extends RouteComponentProps {
  location: H.Location<{ thread_id: string }>;
  threads: {
    [_id: string]: ThreadType;
  };
  replies: {
    [_id: string]: ReplyType;
  };
}

// interface BoardDispatchProps {
//   createThread: ({ delete_password, text, board_id }: createThreadArgs) => void;
// }

// interface BoardState {
//   modal: boolean;
//   thread_text: string;
//   thread_delete_password: string;
//   [name: string]: string | boolean;
//   loading: boolean;
// }

class Thread extends Component<ThreadProps> {
  render() {
    const { replies, threads, location } = this.props;
    const { thread_id } = location.state;
    const thread = threads[thread_id];
    return (
      <div className='board-container d-flex justify-content-center align-items-center'>
        <Row>
          <Col>
            <div className='table-threads p-3 d-flex flex-column text-center'>
              <div className='d-flex mb-3 align-items-center justify-content-between'>
                <legend className='mb-0 w-auto'>
                  THREAD:
                  <span className='font-weight-lighter'> {thread.text}</span>
                </legend>
                <span>{timeDifferenceForDate(thread.created_on)}</span>
              </div>
              {thread.replies.map(rId => {
                const reply = replies[rId];
                return <span key={reply._id}>{reply.text}</span>;
              })}
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

// const mapDispatchToProps = {
//   createReply
// };

export default connect(mapStateToProps)(withRouter(Thread));
