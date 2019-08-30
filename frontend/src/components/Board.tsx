import React, { Component, Fragment } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardType, ThreadType } from '../store/boards/types';
import { createThread } from '../store/threads/actions';
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
  Row
} from 'reactstrap';
import { connect } from 'react-redux';
import { createThreadArgs } from '../Api';
import { AppState } from '../store';
import { Link } from 'react-router-dom';

interface BoardProps extends RouteComponentProps {
  location: H.Location<{ board_id: string }>;
  threads: {
    [_id: string]: ThreadType;
  };
  boards: {
    [_id: string]: BoardType;
  };
}

interface BoardDispatchProps {
  createThread: ({ delete_password, text, board_id }: createThreadArgs) => void;
}

interface BoardState {
  modal: boolean;
  thread_text: string;
  thread_delete_password: string;
  [name: string]: string | boolean;
  loading: boolean;
}

class Board extends Component<BoardProps & BoardDispatchProps, BoardState> {
  private initState = {
    modal: false,
    thread_text: '',
    thread_delete_password: '',
    loading: false
  };
  constructor(props: BoardProps & BoardDispatchProps) {
    super(props);
    this.state = this.initState;
  }
  componentDidMount() {
    console.log('cdm!');
  }
  toggle = () => {
    this.setState(state => ({
      modal: !state.modal
    }));
  };
  onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { thread_text, thread_delete_password } = this.state;
    const { board_id } = this.props.location.state;
    if (thread_text && thread_delete_password) {
      this.setState({ loading: true });
      await this.props.createThread({
        text: thread_text,
        delete_password: thread_delete_password,
        board_id
      });
      this.setState(this.initState);
    }
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    const { board_id } = this.props.location.state;
    const { threads, boards } = this.props;
    const board = boards[board_id];
    return (
      <Fragment>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Post New Thread</ModalHeader>
          <Form onSubmit={this.onSubmit}>
            <ModalBody>
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
                disabled={this.state.loading}
                color='primary'
                type='submit'>
                Submit New Thread
              </Button>
              <Button color='secondary' onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <div className='board-container d-flex justify-content-center align-items-center'>
          <Row>
            <Col>
              <div className='table-threads p-3 d-flex flex-column text-center'>
                <div className='d-flex justify-content-between mb-3 align-items-center'>
                  <legend className='mb-0 w-auto'>
                    BOARD:
                    <span className='font-weight-lighter'> {board.name}</span>
                  </legend>
                  <Button color='primary' onClick={this.toggle}>
                    Post New Thread
                  </Button>
                </div>
                <Table hover responsive>
                  <thead className='thead-light'>
                    <tr>
                      <th>Thread Title</th>
                      <th>Replies</th>
                      <th>Last Bumped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.threads.map(thId => {
                      const thread = threads[thId];
                      return (
                        <tr key={thread._id}>
                          <td scope='row'>
                            <Link
                              to={{
                                pathname: `/b/${board._id}/${thread._id}`,
                                state: { thread_id: thread._id }
                              }}>
                              {thread.text}
                            </Link>
                          </td>
                          <td>{thread.replies.length}</td>
                          <td>{new Date(thread.bumped_on).toUTCString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  threads: { threads },
  boards: { boards }
}: AppState) => ({
  threads,
  boards
});

const mapDispatchToProps = {
  createThread
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Board));
