import { deleteThreadSuccessType } from '../threads/types';
export const FETCH_BOARD_REQUEST = 'FETCH_BOARD_REQUEST';
export const FETCH_BOARD_SUCCESS = 'FETCH_BOARD_SUCCESS';
export const FETCH_BOARD_FAILURE = 'FETCH_BOARD_FAILURE';
export const FETCH_BOARDS_REQUEST = 'FETCH_BOARDS_REQUEST';
export const FETCH_BOARDS_SUCCESS = 'FETCH_BOARDS_SUCCESS';
export const FETCH_BOARDS_FAILURE = 'FETCH_BOARDS_FAILURE';
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';
export const RESET_ERROR_STATE = 'RESET_ERROR_STATE';
export const UPDATE_NAME_REQUEST = 'UPDATE_NAME_REQUEST';
export const UPDATE_NAME_SUCCESS = 'UPDATE_NAME_SUCCESS';
export const UPDATE_NAME_FAILURE = 'UPDATE_NAME_FAILURE';
export const RESET_BOARD_ERROR = 'RESET_BOARD_ERROR';
export const DELETE_BOARD_REQUEST = 'DELETE_BOARD_REQUEST';
export const DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
export const DELETE_BOARD_FAILURE = 'DELETE_BOARD_FAILURE';

export const SEARCH_BOARDS_REQUEST = 'SEARCH_BOARDS_REQUEST';
export const SEARCH_BOARDS_SUCCESS = 'SEARCH_BOARDS_SUCCESS';
export const SEARCH_BOARDS_FAILURE = 'SEARCH_BOARDS_FAILURE';

export const ADD_BOARD_SEARCH_RESULT = 'ADD_BOARD_SEARCH_RESULT';

export interface AddBoardSearchResultType {
  type: typeof ADD_BOARD_SEARCH_RESULT;
  payload: {
    board: BoardType;
    threads: {
      [_id: string]: ThreadType;
    };
    replies: {
      [_id: string]: ReplyType;
    };
  };
}

export interface ReplyLoadingType {
  update_text: boolean;
  delete_reply: boolean;
  report_reply: boolean;
}

export interface ReplyErrorType {
  update_text: string;
  delete_reply: string;
  report_reply: string;
}

export interface ReplyType {
  _id: string;
  text: string;
  created_on: string;
  thread_id: string;
  reported: boolean;
  loading: ReplyLoadingType;
  error: ReplyErrorType;
}

export interface deleteBoardRequestType {
  type: typeof DELETE_BOARD_REQUEST;
  payload: {
    board_id: string;
    callBack?: () => void;
    delete_password: string;
  };
}

export interface ThreadLoadingType {
  update_text: boolean;
  delete_thread: boolean;
  report_thread: boolean;
}
export interface ThreadErrorType {
  update_text: string;
  delete_thread: string;
  report_thread: string;
}

export interface ThreadType {
  _id: string;
  text: string;
  reported: boolean;
  created_on: string;
  replies: string[];
  bumped_on: string;
  board_id: string;
  loading: ThreadLoadingType;
  error: ThreadErrorType;
}

export interface BoardLoadingType {
  update_name: boolean;
  delete_board: boolean;
}

export interface BoardErrorType {
  update_name: string;
  delete_board: string;
}

export type BoardErrorTypeKeys = 'update_name';

export interface BoardType {
  created_on: string;
  name: string;
  threads: string[];
  updated_on: string;
  _id: string;
  loading: BoardLoadingType;
  error: BoardErrorType;
}

export interface BoardsLoadingType {
  createBoard: boolean;
  fetchBoards: boolean;
  fetchBoard: boolean;
}

export interface BoardsErrorType {
  createBoard: string;
  fetchBoards: string;
  fetchBoard: string;
}

export interface BoardsState {
  loading: BoardsLoadingType;
  error: BoardsErrorType;
  boards: {
    [_id: string]: BoardType;
  };
  page: number;
  search_text: string;
}

export interface createBoardRequest {
  type: typeof CREATE_BOARD_REQUEST;
  payload: {
    name: string;
    delete_password: string;
  };
  call_back?: () => void;
}

export interface updateNameRequest {
  type: typeof UPDATE_NAME_REQUEST;
  payload: {
    board_name: string;
    board_id: string;
    delete_password: string;
  };
  callBack: () => void;
}

export interface boardSuccess {
  type: typeof CREATE_BOARD_SUCCESS | typeof UPDATE_NAME_SUCCESS;
  payload: {
    board: BoardType;
  };
}

export interface fetchBoardsRequestType {
  type: typeof FETCH_BOARDS_REQUEST;
  payload: {
    search_text?: string;
    no_pagination_search?: boolean;
    page: number;
    limit: number;
  };
}

export interface fetchBoardsSuccess {
  type: typeof FETCH_BOARDS_SUCCESS | typeof FETCH_BOARD_SUCCESS;
  payload: {
    boards: {
      [_id: string]: BoardType;
    };
    threads: {
      [_id: string]: ThreadType;
    };
    replies: {
      [_id: string]: ReplyType;
    };
  };
}

export interface fetchBoardRequest {
  type: typeof FETCH_BOARD_REQUEST;
  payload: {
    board_id: string;
  };
}
export interface resetBoardErrorType {
  type: typeof RESET_BOARD_ERROR;
  payload: {
    errorKey: string;
    board_id: string;
  };
}
export interface boardsfailureTypes {
  type:
    | typeof FETCH_BOARDS_FAILURE
    | typeof CREATE_BOARD_FAILURE
    | typeof FETCH_BOARD_FAILURE;
  payload: {
    error: string;
  };
}

interface boardUpdateNameFailureType {
  type: typeof UPDATE_NAME_FAILURE;
  payload: {
    error: string;
    board_id: string;
  };
}

export interface resetErrorState {
  type: typeof RESET_ERROR_STATE;
}

export interface deleteBoardSuccess {
  type: typeof DELETE_BOARD_SUCCESS;
  payload: {
    deleted_board: BoardType;
  };
}

export interface deleteBoardFailure {
  type: typeof DELETE_BOARD_FAILURE;
  payload: {
    error: string;
    board_id: string;
  };
}

export type BoardsActionTypes =
  | AddBoardSearchResultType
  | deleteThreadSuccessType
  | deleteBoardSuccess
  | deleteBoardFailure
  | deleteBoardRequestType
  | fetchBoardRequest
  | boardsfailureTypes
  | createBoardRequest
  | boardSuccess
  | fetchBoardsRequestType
  | fetchBoardsSuccess
  | resetErrorState
  | updateNameRequest
  | boardUpdateNameFailureType
  | resetBoardErrorType;
