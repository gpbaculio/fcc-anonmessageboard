import React, { Component } from 'react';
import { Input, Form, Button, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import * as RepliesActions from '../store/replies/actions';
import { updateThreadTextArgsType, updateReplyTextParamsType } from '../Api';
import { RepliesState } from '../store/replies/types';

interface EditReplyTextInputProps {
  setIsEditing: (show: boolean) => void;
  reply_id: string;
  replies: RepliesState;
}

interface EditReplyTextInputDispatchProps {
  updateReplyText: (
    { reply_id, text, delete_password }: updateReplyTextParamsType,
    callBack: () => void
  ) => void;
}

interface EditReplyTextInputState {
  [state_key: string]: string;
  reply_text: string;
  delete_password: string;
}

class EditReplyTextInput extends Component<
  EditReplyTextInputProps & EditReplyTextInputDispatchProps,
  EditReplyTextInputState
> {
  constructor(
    props: EditReplyTextInputProps & EditReplyTextInputDispatchProps
  ) {
    super(props);
    const { replies, reply_id } = props;
    const reply = replies.replies[reply_id];
    this.state = {
      reply_text: reply.text,
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

    // trim whitespaces
    const reply_text = this.state.reply_text.trim();

    const { reply_id, updateReplyText, setIsEditing, replies } = this.props;
    // replyText is text from state
    const replyText = replies.replies[reply_id].text;
    if (replyText !== reply_text && reply_text && delete_password) {
      updateReplyText({ reply_id, text: reply_text, delete_password }, () => {
        this.setState({ delete_password: '' });
        setIsEditing(false);
      });
    }
  };
  render() {
    const { reply_text, delete_password } = this.state;
    const { replies, reply_id } = this.props;
    const reply = replies.replies[reply_id];
    return (
      <Form onSubmit={this.onSubmit} className='ml-2 flex-1 d-flex'>
        <Input
          onChange={this.onChange}
          name='reply_text'
          value={reply_text}
          bsSize='sm'
          type='text'
          className='mr-2'
          required
        />
        <Input
          placeholder='Delete Password'
          onChange={this.onChange}
          name='delete_password'
          value={delete_password}
          bsSize='sm'
          type='password'
          className='mr-2'
          required
        />
        <Button
          disabled={reply.loading.update_text}
          color='primary'
          size='sm'
          className='mr-2 d-inline-flex align-items-center'
          type='submit'>
          {reply.loading.update_text && (
            <Spinner size='sm' color='light' className='mr-2' />
          )}
          Submit
        </Button>
        <Button
          outline
          size='sm'
          color='primary'
          onClick={() => this.props.setIsEditing(false)}>
          Cancel
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = ({ replies }: AppState) => ({
  replies
});

const mapDispatchToProps = {
  updateReplyText: RepliesActions.updateReplyTextRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditReplyTextInput);
