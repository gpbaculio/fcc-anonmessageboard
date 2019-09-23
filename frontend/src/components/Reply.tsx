import React, { Component } from 'react';
import * as H from 'history';
import { AppState } from '../store';
import * as RepliesActions from '../store/replies/actions';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { RepliesState } from '../store/replies/types';
import { updateReplyTextParamsType } from '../Api';
import { timeDifferenceForDate } from './utils';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import EditReplyTextInput from './EditReplyTextInput';

interface ReplyProps extends RouteComponentProps {
  location: H.Location;
  reply_id: string;
  replies: RepliesState;
}

interface ReplyState {
  isEditing: boolean;
}

class Reply extends Component<ReplyProps, ReplyState> {
  constructor(props: ReplyProps) {
    super(props);

    this.state = {
      isEditing: false
    };
  }
  setIsEditing = (show: boolean) => {
    this.setState({ isEditing: show });
  };
  render() {
    const { reply_id, replies } = this.props;
    const reply = replies.replies[reply_id];
    const { isEditing } = this.state;
    return (
      <div className='reply-container my-3 align-items-center d-flex justify-content-between'>
        <div className='d-flex align-items-center'>
          <span className={classNames({ hide: isEditing })}>{reply.text}</span>
          {!!isEditing && (
            // recommended: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
            <EditReplyTextInput
              key={reply._id}
              reply_id={reply._id}
              setIsEditing={this.setIsEditing}
            />
          )}
          <span className='ml-2'>
            <small>{timeDifferenceForDate(reply.created_on)}</small>
          </span>
        </div>
        <div
          className={classNames('d-flex justify-content-between', {
            hide: isEditing
          })}>
          <Button
            size='sm'
            color='success'
            className='mr-2'
            onClick={() => this.setIsEditing(true)}>
            Edit
          </Button>
          <Button size='sm' color='danger'>
            Delete
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ replies }: AppState) => ({
  replies
});

export default connect(mapStateToProps)(withRouter(Reply));
