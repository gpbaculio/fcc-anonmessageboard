import React, { Component, Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Col, Row, Spinner } from 'reactstrap';
import classNames from 'classnames';
import SearchInput from './SearchInput';
import AddBoard from './AddBoard';
import Boards from './Boards';
import { AppState } from '../store';
import { connect } from 'react-redux';
import { BoardsState } from '../store/boards/types';

interface HomeProps extends RouteComponentProps {
  // Add your regular properties here
  boards: BoardsState;
}

interface HomeDispatchProps {
  // Add your dispatcher properties here
}

class Home extends Component<HomeProps & HomeDispatchProps> {
  render() {
    const { boards } = this.props;
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

export default connect(mapStateToProps)(withRouter(Home));
