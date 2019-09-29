import React, { Component, Fragment } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { fetchBoards, fetchBoardsParamsType } from '../store/boards/actions';
import { AppState } from '../store';
import {
  BoardType,
  BoardsLoadingType,
  BoardsErrorType
} from '../store/boards/types';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { getTimeDate } from './utils';
import { Link } from 'react-router-dom';
import Paginator from './Paginator';

interface BoardsProps extends RouteComponentProps {
  // Add your regular properties here
  boards: BoardType[];
  loading: BoardsLoadingType;
  error: BoardsErrorType;
}

interface BoardsDispatchProps {
  // Add your dispatcher properties here
  fetchBoards: ({ page, limit }: fetchBoardsParamsType) => void;
}

class Boards extends Component<BoardsProps & BoardsDispatchProps> {
  componentDidMount = async () => {
    await this.props.fetchBoards({ page: 1, limit: 9 });
  };
  render() {
    const { boards } = this.props;
    return (
      <Fragment>
        <Row>
          {boards.map(board => {
            return (
              <Col xs='12' sm='6' md='4' key={board._id} className='my-3'>
                <Card>
                  <Link
                    to={{
                      pathname: `/b/${board._id}`,
                      state: { board_id: board._id }
                    }}>
                    <CardBody>
                      <CardTitle className='mb-0'>
                        <div className='d-flex flex-column'>
                          <div className='d-flex  justify-content-between'>
                            <h6>{board.name}</h6>
                            <small>Threads: {board.threads.length}</small>
                          </div>
                          <small>{getTimeDate(board.created_on)}</small>
                        </div>
                      </CardTitle>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ boards: { boards, loading, error } }: AppState) => ({
  boards: Object.keys(boards).map(k => {
    const board = boards[k];
    return board;
  }),
  loading,
  error
});

const mapDispatchToProps = {
  fetchBoards
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Boards));
