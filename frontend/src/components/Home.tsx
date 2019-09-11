import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Col, Row, Spinner, Alert } from 'reactstrap';
import classNames from 'classnames';
import SearchInput from './SearchInput';
import AddBoard from './AddBoard';
import Boards from './Boards';
import { AppState } from '../store';
import { connect } from 'react-redux';
import { BoardsState } from '../store/boards/types';
import { resetError } from '../store/boards/actions';

interface HomeProps extends RouteComponentProps {
  // Add your regular properties here
  boards: BoardsState;
}

interface HomeDispatchProps {
  resetError: () => void;
}

interface HomeState {
  errorKey: string;
}

class Home extends Component<HomeProps & HomeDispatchProps, HomeState> {
  render() {
    const { boards, resetError } = this.props;
    type BoardsErrorKeys = 'createBoard' | 'fetchBoards' | 'fetchBoard';
    return (
      <Container className='position-relative'>
        <div
          className={classNames('position-absolute home-fade', {
            'fade-load': boards.loading.fetchBoards
          })}
        />
        <div
          className={classNames(
            'loader home-loader w-100 d-flex align-items-center justify-content-center position-absolute',
            { hide: !boards.loading.fetchBoards }
          )}>
          <Spinner color='info' className='mr-2' />
          <strong>Fetching boards...</strong>
        </div>
        <Row>
          <Col>
            <SearchInput />
          </Col>
          <Col>
            <AddBoard />
          </Col>
        </Row>
        <Alert
          color='danger'
          isOpen={Object.keys(boards.error).some(k => {
            const errorMsg = boards.error[k as BoardsErrorKeys];
            return Boolean(errorMsg);
          })}
          toggle={() => resetError()}>
          {Object.keys(boards.error).map(k => {
            return boards.error[k as BoardsErrorKeys];
          })}
        </Alert>
        <Row>
          <Col>
            <Boards />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

const mapDispatchToProps = {
  resetError
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home));
