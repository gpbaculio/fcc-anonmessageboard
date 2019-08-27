import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardType } from '../store/boards/types';
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
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  Label,
  Col
} from 'reactstrap';
import { timeDifferenceForDate } from './utils';
import { connect } from 'react-redux';
import { createThreadArgs } from '../Api';

interface BoardProps extends RouteComponentProps {
  location: H.Location<{ board: BoardType }>;
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
        <Card className='board-card'>
          <CardBody>
            <CardTitle className='mb-0'>
              <div className='d-flex mb-3 justify-content-between'>
                <div className='d-flex flex-column'>
                  <h6>{board.name}</h6>
                </div>
                <div>{timeDifferenceForDate(board.created_on)}</div>
              </div>
              <Button
                className='btn-block'
                color='primary'
                onClick={this.toggle}>
                Post New Thread
              </Button>
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
                          type='text'
                          name='text'
                          id='thread_text'
                          placeholder='Text'
                          autoComplete='off'
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for='thread_delete_password' sm={4}>
                        Delete Password
                      </Label>
                      <Col>
                        <Input
                          type='password'
                          name='delete_password'
                          id='thread_delete_password'
                          placeholder='Delete Password'
                          autoComplete='off'
                          required
                        />
                      </Col>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='primary' type='submit'>
                      Submit New Thread
                    </Button>
                    <Button color='secondary' onClick={this.toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            </CardTitle>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createThread
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(Board));
