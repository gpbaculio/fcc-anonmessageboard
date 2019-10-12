import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Col,
  Input,
  ModalFooter,
  Button
} from 'reactstrap';
import classNames from 'classnames';
import { ThreadType } from '../store/boards/types';
import { use_text_input } from './hooks/input_hook';
import { AppState } from '../store/index';
import { connect } from 'react-redux';
interface Modal_Report_Thread_Props {
  report_thread_modal_view: boolean;
  toggle_modal: (modal_type: string) => void;
  thread: ThreadType;
  thread_id: string;
}
class Modal_Report_Thread extends Component<Modal_Report_Thread_Props> {
  render() {
    const { report_thread_modal_view, toggle_modal, thread } = this.props;
    const {
      value: value_report_thread_delete_password,
      bind: bind_report_thread_delete_password,
      reset: reset_report_thread_delete_password
    } = use_text_input('');
    // TO WORK ON MODAL TOMORROW
    return (
      <div>
        <Modal
          isOpen={report_thread_modal_view}
          toggle={() => toggle_modal('report_thread')}>
          <ModalHeader toggle={() => toggle_modal('report_thread')}>
            Delete Thread
          </ModalHeader>
          <ModalBody
            className={classNames({
              'fade-load': thread.loading.report_thread
            })}>
            Are you sure you want to delete <strong>{`${thread.text}`}</strong>?
            <FormGroup row className='mt-3'>
              <Label for='board_delete_password' sm={4}>
                Delete Password
              </Label>
              <Col>
                <Input
                  {...bind_report_thread_delete_password}
                  type='password'
                  name='report_thread_delete_password'
                  id='report_thread_delete_password'
                  placeholder='Thread Delete Password'
                  autoComplete='off'
                  required
                  value={value_report_thread_delete_password}
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              disabled={thread.loading.delete_thread}
              onClick={() => {
                console.log(' del thread');
                // this.props.deleteThread(
                //   {
                //     thread_id: thread._id,
                //     delete_password: this.state.thread_delete_password
                //   },
                //   () => {
                //     console.log(' GO BACK');
                //     this.props.history.replace(`/b/${thread.board_id}`);
                //   }
                // );
              }}>
              Delete
            </Button>
            <Button
              color='secondary'
              onClick={() => toggle_modal('report_thread')}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (
  { threads }: AppState,
  own_props: Modal_Report_Thread_Props
) => ({
  thread: threads.threads[own_props.thread_id]
});

const mapDispatchToProps = {};

export default connect(mapStateToProps)(Modal_Report_Thread);
