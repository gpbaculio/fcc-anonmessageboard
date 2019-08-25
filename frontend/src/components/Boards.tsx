import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { fetchBoards } from '../store/boards/actions';
import { AppState } from '../store';
import {
  BoardType,
  BoardsLoadingType,
  BoardsErrorType
} from '../store/boards/types';
import { Row, Col } from 'reactstrap';
import { timeDifferenceForDate } from './utils';

interface BoardsProps extends RouteComponentProps {
  // Add your regular properties here
  boards: BoardType[];
  loading: BoardsLoadingType;
  error: BoardsErrorType;
}

interface BoardsDispatchProps {
  // Add your dispatcher properties here
  fetchBoards: () => void;
}

class Boards extends Component<BoardsProps & BoardsDispatchProps> {
  componentDidMount = async () => {
    await this.props.fetchBoards();
  };
  render() {
    console.log('props.boards', this.props);
    const { boards } = this.props;
    return (
      <Row>
        {boards.map(b => (
          <Col xs='3' key={b._id}>
            <div>
              {b.name} <span>{timeDifferenceForDate(b.createdAt)}</span>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
}

const mapStateToProps = ({ boards: { boards, loading, error } }: AppState) => ({
  boards: Object.keys(boards).map(k => boards[k]),
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
