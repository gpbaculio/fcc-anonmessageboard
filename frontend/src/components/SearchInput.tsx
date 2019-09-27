import React, { Component } from 'react';
import { Form, Input, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { AppState } from '../store';
import Api from '../Api';
import { BoardType } from '../store/boards/types';
import * as BoardsActions from '../store/boards/actions';
import { withRouter, RouteComponentProps } from 'react-router';

interface SearchInputState {
  search_text: string;
  show_result: boolean;
  loading: boolean;
  search_text_results: BoardType[];
  [_state_key: string]: boolean | string | BoardType[];
}
interface SearchInputProps extends RouteComponentProps {
  addBoardSearchResult: (board: BoardType) => void;
}
class SearchInput extends Component<SearchInputProps, SearchInputState> {
  delayTimer: null | number = null;
  // for reseting
  initState = {
    loading: false,
    search_text_results: [],
    search_text: '',
    show_result: false
  };
  constructor(props: SearchInputProps) {
    super(props);
    this.state = this.initState;
  }
  handle_result_click = (board: BoardType) => {
    const { history, addBoardSearchResult } = this.props;
    addBoardSearchResult(board);
    this.setState({ ...this.initState });
    history.push(`/b/${board._id}`);
  };
  handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value, show_result: true, search_text_results: [] },
      async () => {
        const { search_text } = this.state;
        if (search_text) {
          if (this.delayTimer) clearTimeout(this.delayTimer);
          this.delayTimer = window.setTimeout(async () => {
            await this.fetch_boards(search_text);
          }, 2000);
        }
      }
    );
  };
  fetch_boards = async (search_text: string) => {
    this.setState({ loading: true });
    const {
      data: { boards }
    } = await Api.boards.boards_search_input({
      search_text,
      no_pagination_search: true
    });
    this.setState({
      search_text_results: boards,
      loading: false
    });
  };
  render() {
    const {
      search_text,
      show_result,
      search_text_results,
      loading
    } = this.state;
    return (
      <Form className='d-flex w-50 search-form'>
        <div className='search-input d-flex flex-column position-relative'>
          <Input
            autoComplete='off'
            value={search_text}
            onChange={this.handle_change}
            className='flex-grow-1'
            required
            type='text'
            name='search_text'
            id='search_text'
            placeholder='Search Boards'
          />
          <div className='autocomplete-items'>
            {show_result &&
              search_text_results.map(board => {
                const board_name_highlighted = board.name.replace(
                  new RegExp(search_text, 'g'),
                  `<strong>${search_text}</strong>`
                );
                return (
                  <div
                    key={board._id}
                    onClick={() => this.handle_result_click(board)}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${board_name_highlighted}</span>`
                    }}
                  />
                );
              })}
            {loading && ( // looading boolean
              <div className='mx-auto d-flex justify-content-center'>
                <Spinner color='info' className='mr-2' /> Loading...
              </div>
            )}
          </div>
        </div>
      </Form>
    );
  }
}
const mapStateToProps = ({ boards }: AppState) => ({
  boards
});

const mapDispatchToProps = {
  addBoardSearchResult: BoardsActions.addBoardSearchResult
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchInput));
