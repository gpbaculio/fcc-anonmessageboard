import React, { Component, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import classNames from 'classnames';
import * as BoardsActions from '../store/boards/actions';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { BoardsState } from '../store/boards/types';
import { Col } from 'reactstrap';
import { createBoardArgs } from '../Api';

interface AddBoardProps extends RouteComponentProps {
  boards: BoardsState;
}

interface AddBoardDispatchProps {
  // Add your dispatcher properties here
  createBoard: (
    { name, delete_password }: createBoardArgs,
    call_back?: () => void
  ) => void;
}

interface AddBoardState {
  board_text: string;
  delete_password: string;
  [state_key: string]: string | boolean;
  add_board_modal: boolean;
}

class AddBoard extends Component<
  AddBoardProps & AddBoardDispatchProps,
  AddBoardState
> {
  constructor(props: AddBoardProps & AddBoardDispatchProps) {
    super(props);
    this.state = {
      add_board_modal: false,
      board_text: '',
      delete_password: ''
    };
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const board_text = this.state.board_text.trim();
    const { delete_password } = this.state;
    if (board_text && delete_password) {
      this.props.createBoard({ name: board_text, delete_password }, () => {
        this.setState({ add_board_modal: false });
      });
    }
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  toggle_modal = (type: string) => {
    this.setState(state => ({
      [type]: !state[type]
    }));
  };
  render() {
    const { boards } = this.props;
    const { board_text, delete_password } = this.state;
    return (
      <Fragment>
        <Modal
          isOpen={this.state.add_board_modal}
          toggle={() => this.toggle_modal('add_board_modal')}>
          <ModalHeader toggle={() => this.toggle_modal('add_board_modal')}>
            Add New Board
          </ModalHeader>
          <div
            className={classNames(
              'loader  w-100 d-flex align-items-center justify-content-center position-absolute',
              { hide: !boards.loading.createBoard }
            )}>
            <Spinner color='info' className='mr-2' />
            <strong>Processing...</strong>
          </div>
          <Form onSubmit={this.onSubmit}>
            <ModalBody
              className={classNames({
                'fade-load': boards.loading.createBoard
              })}>
              <FormGroup row>
                <Label for='board_text' sm={4}>
                  Text
                </Label>
                <Col>
                  <Input
                    name='board_text'
                    type='text'
                    value={board_text}
                    onChange={this.onChange}
                    className='mr-2'
                    placeholder='Board Name'
                    autoComplete='off'
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='thread_text' sm={4}>
                  Delete Password
                </Label>
                <Col>
                  <Input
                    className='mr-2'
                    type='password'
                    placeholder='Delete Password'
                    name='delete_password'
                    value={delete_password}
                    onChange={this.onChange}
                    autoComplete='off'
                  />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                className='d-flex align-items-center'
                color='primary'
                disabled={boards.loading.createBoard}
                type='submit'>
                {!!boards.loading.createBoard && (
                  <Spinner className='mr-1' size='sm' color='light' />
                )}
                Submit
              </Button>
              <Button
                color='secondary'
                onClick={() => this.toggle_modal('add_board_modal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Button
          className='btn-block'
          color='primary'
          onClick={() => this.toggle_modal('add_board_modal')}>
          Add Board
        </Button>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

const mapDispatchToProps = {
  createBoard: BoardsActions.createBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddBoard));
