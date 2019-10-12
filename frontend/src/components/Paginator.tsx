import React, { Component, Fragment } from 'react';
import Pagination from 'react-js-pagination';
import { AppState } from '../store';
import * as BoardsActions from '../store/boards/actions';
import { connect } from 'react-redux';
import { fetchBoardsParamsType } from '../store/boards/actions';
import { BoardsState } from '../store/boards/types';
import Api from '../Api';
import { Row, Col } from 'reactstrap';

interface PaginatorProps {
  boards: BoardsState;
  fetch_boards: ({ page, limit }: fetchBoardsParamsType) => void;
}

interface PaginatorState {
  active_page: number;
  count_per_page: number;
  total_count: number;
}

class Paginator extends Component<PaginatorProps, PaginatorState> {
  constructor(props: PaginatorProps) {
    super(props);

    this.state = {
      active_page: 1,
      count_per_page: 9,
      total_count: 0
    };
  }
  componentDidMount = async () => {
    const {
      data: { total_count }
    } = await Api.boards.get_boards_count();
    this.setState({ total_count });
  };
  onPageChange = async (page: number) => {
    const { fetch_boards, boards } = this.props;
    const { search_text } = boards;
    const query: fetchBoardsParamsType = {
      page,
      limit: 9
    };
    if (search_text) {
      query.search_text = search_text;
    }
    await fetch_boards(query);
    this.setState({ active_page: page });
  };

  render() {
    const { active_page, count_per_page, total_count } = this.state;
    return (
      <Row className='mt-4'>
        <Col xs='12'>
          <div className='d-flex align-items-center justify-content-between w-100'>
            <h5 className='mb-0'>Total Count: {total_count}</h5>
            <Pagination
              innerClass='pagination my-0'
              activePage={active_page}
              itemsCountPerPage={count_per_page}
              totalItemsCount={total_count}
              pageRangeDisplayed={5}
              onChange={this.onPageChange}
            />
          </div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ boards }: AppState) => ({ boards });

const mapDispatchToProps = {
  fetch_boards: BoardsActions.fetchBoards
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Paginator);
