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
              <Col xs='4' key={board._id}>
                <Card>
                  <Link
                    to={{
                      pathname: `/b/${board._id}`,
                      state: { board_id: board._id }
                    }}>
                    <CardBody>
                      <CardTitle className='mb-0'>
                        <div className='d-flex justify-content-between'>
                          <div className='d-flex flex-column'>
                            <h6>{board.name}</h6>
                            <small>{board.threads.length}</small>
                          </div>
                          <div>{getTimeDate(board.created_on)}</div>
                        </div>
                      </CardTitle>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Paginator />
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
