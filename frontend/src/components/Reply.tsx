import React, { Component, Fragment } from 'react';
import * as H from 'history';
import { AppState } from '../store';
import * as RepliesActions from '../store/replies/actions';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { RepliesState } from '../store/replies/types';
import { updateReplyTextParamsType, deleteReplyParamsType } from '../Api';
import { timeDifferenceForDate } from './utils';
import {
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Col,
  Input,
  ModalFooter
} from 'reactstrap';
import classNames from 'classnames';
import EditReplyTextInput from './EditReplyTextInput';

interface ReplyProps extends RouteComponentProps {
  location: H.Location;
  reply_id: string;
  replies: RepliesState;
}

interface ReplyDispatchProps {
  resetReplyError: (errorKey: string, reply_id: string) => void;
  deleteReplyRequest: ({
    reply_id,
    delete_password
  }: deleteReplyParamsType) => void;
}

interface ReplyState {
  isEditing: boolean;
  deleteModal: boolean;
  reply_delete_password: string;
  [name: string]: string | boolean;
}

type ReplyErrorTypeKeys = 'update_text' | 'delete_reply';

class Reply extends Component<ReplyProps & ReplyDispatchProps, ReplyState> {
  constructor(props: ReplyProps & ReplyDispatchProps) {
    super(props);

    this.state = {
      reply_delete_password: '',
      isEditing: false,
      deleteModal: false
    };
  }
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  setIsEditing = (show: boolean) => {
    this.setState({ isEditing: show });
  };
  toggleModal = (type: string) => {
    this.setState(state => ({
      [type]: !state[type]
    }));
  };
  render() {
    const { reply_id, replies, resetReplyError } = this.props;
    const reply = replies.replies[reply_id];
    const { isEditing } = this.state;
    if (!reply) return null;
    return (
      <Fragment>
        <Modal
          isOpen={this.state.deleteModal}
          toggle={() => this.toggleModal('deleteModal')}>
          <ModalHeader toggle={() => this.toggleModal('deleteModal')}>
            Delete Reply
          </ModalHeader>
          <ModalBody
            className={classNames({
              'fade-load': reply.loading.delete_reply
            })}>
            Are you sure you want to delete <strong>{`${reply.text}`}</strong>?
            <FormGroup row className='mt-3'>
              <Label for='reply_delete_password' sm={4}>
                Delete Password
              </Label>
              <Col>
                <Input
                  onChange={this.onChange}
                  type='password'
                  name='reply_delete_password'
                  id='reply_delete_password'
                  placeholder='Delete Password'
                  autoComplete='off'
                  required
                  value={this.state.reply_delete_password}
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              disabled={reply.loading.delete_reply}
              onClick={() => {
                this.props.deleteReplyRequest({
                  reply_id: reply._id,
                  delete_password: this.state.reply_delete_password
                });
              }}>
              Delete
            </Button>
            <Button
              color='secondary'
              onClick={() => this.toggleModal('deleteModal')}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <div
          className={classNames(
            'reply-container my-3 align-items-center justify-content-between',
            {
              'flex-column': Object.keys(reply.error).some(k =>
                Boolean(reply.error[k as ReplyErrorTypeKeys])
              ),
              'd-flex': Object.keys(reply.error).every(
                k => !Boolean(reply.error[k as ReplyErrorTypeKeys])
              )
            }
          )}>
          {Object.keys(reply.error).map((k: string, i) => {
            const errorMsg = reply.error[k as ReplyErrorTypeKeys];
            return (
              <Alert
                key={`${i}-${k}`}
                color='danger'
                isOpen={Boolean(errorMsg)}
                toggle={() =>
                  resetReplyError(k as ReplyErrorTypeKeys, reply._id)
                }>
                {errorMsg}
              </Alert>
            );
          })}
          <div className='w-100 d-flex justify-content-between'>
            <div className='d-flex align-items-center'>
              <span className={classNames({ hide: isEditing })}>
                {reply.text}
              </span>
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
              <Button
                size='sm'
                color='danger'
                onClick={() => this.toggleModal('deleteModal')}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ replies }: AppState) => ({
  replies
});

const mapDispatchToProps = {
  resetReplyError: RepliesActions.resetReplyError,
  deleteReplyRequest: RepliesActions.deleteReplyRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Reply));
