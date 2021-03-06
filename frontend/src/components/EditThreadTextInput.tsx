import React, { Component } from 'react';
import { Input, Form, Button, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import * as threadsActions from '../store/threads/actions';
import { updateThreadTextArgsType } from '../Api';
import { ThreadsState } from '../store/threads/reducers';

interface EditThreadTextInputProps {
  setIsEditing: (show: boolean) => void;
  threadId: string;
  threads: ThreadsState;
}

interface EditThreadTextInputDispatchProps {
  updateThreadText: (
    { text, delete_password, thread_id }: updateThreadTextArgsType,
    callBack: () => void
  ) => void;
}

interface EditThreadTextInputState {
  [state_key: string]: string;
  thread_text: string;
  delete_password: string;
}

class EditThreadTextInput extends Component<
  EditThreadTextInputProps & EditThreadTextInputDispatchProps,
  EditThreadTextInputState
> {
  constructor(
    props: EditThreadTextInputProps & EditThreadTextInputDispatchProps
  ) {
    super(props);
    const { threads, threadId } = props;
    this.state = {
      thread_text: threads.threads[threadId].text,
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
    const thread_text = this.state.thread_text.trim();
    const {
      threadId,
      updateThreadText,
      setIsEditing,
      threads: { threads }
    } = this.props;
    // thread_text is text from state
    const threadText = threads[threadId].text;
    if (thread_text && threadText !== thread_text && delete_password) {
      updateThreadText(
        { thread_id: threadId, text: thread_text, delete_password },
        () => {
          this.setState({ delete_password: '' });
          setIsEditing(false);
        }
      );
    }
  };
  render() {
    const { thread_text, delete_password } = this.state;
    const {
      threads: { threads },
      threadId
    } = this.props;
    const thread = threads[threadId];
    return (
      <Form onSubmit={this.onSubmit} className='ml-2 flex-1 d-flex'>
        <Input
          onChange={this.onChange}
          name='thread_text'
          value={thread_text}
          type='text'
          className='mr-2'
          required
        />
        <Input
          placeholder='Delete Password'
          onChange={this.onChange}
          name='delete_password'
          value={delete_password}
          type='password'
          className='mr-2'
          required
        />
        <Button
          disabled={thread.loading.update_text}
          color='primary'
          className='mr-2 d-inline-flex align-items-center'
          type='submit'>
          {thread.loading.update_text && (
            <Spinner size='sm' color='light' className='mr-2' />
          )}
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
const mapStateToProps = ({ threads, replies }: AppState) => ({
  threads,
  replies
});

const mapDispatchToProps = {
  updateThreadText: threadsActions.updateThreadText
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditThreadTextInput);
