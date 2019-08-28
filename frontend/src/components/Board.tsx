import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardType, ThreadType } from '../store/boards/types';
import { createThread } from '../store/threads/actions';
import {
  Card,
  CardTitle,
  CardBody,
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
import { timeDifferenceForDate } from './utils';
import { connect } from 'react-redux';
import { createThreadArgs } from '../Api';
import { AppState } from '../store';

interface BoardProps extends RouteComponentProps {
  location: H.Location<{ board: BoardType }>;
  threads: {
    [_id: string]: ThreadType;
  };
}

interface BoardDispatchProps {
  createThread: ({ delete_password, text, board_id }: createThreadArgs) => void;
}

interface BoardState {
  modal: boolean;
  thread_text: string;
  thread_delete_password: string;
}

class Board extends Component<BoardProps & BoardDispatchProps, BoardState> {
  constructor(props: BoardProps & BoardDispatchProps) {
    super(props);
    this.state = {
      modal: false,
      thread_text: '',
      thread_delete_password: ''
    };
  }
  toggle = () => {
    this.setState(state => ({
      modal: !state.modal
    }));
  };

  onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      thread_text: text,
      thread_delete_password: delete_password
    } = this.state;
    const { board } = this.props.location.state;
    if (text && delete_password)
      await this.props.createThread({
        text,
        delete_password,
        board_id: board._id
      });
  };
  render() {
    const { board } = this.props.location.state;
    return (
      <div className='board-container d-flex justify-content-center align-items-center'>
        <Row>
          <Col>
            <div className='table-threads p-3 d-flex flex-column'>
              <div className='d-flex justify-content-between mb-3 align-items-center'>
                <legend className='mb-0 w-auto'>BOARD: {board.name}</legend>
                <Button size='sm' color='primary'>
                  Post New Thread
                </Button>
              </div>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Thread Title</th>
                    <th>Replies</th>
                    <th>Last Bumped</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope='row'>1</th>
                    <td>Table cell</td>
                    <td>Table cell</td>
                  </tr>
                  <tr>
                    <th scope='row'>2</th>
                    <td>Table cell</td>
                    <td>Table cell</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ threads: { threads } }: AppState) => ({
  threads
});

const mapDispatchToProps = {
  createThread
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Board));
