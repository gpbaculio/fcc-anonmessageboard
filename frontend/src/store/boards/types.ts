export const FETCH_BOARD_REQUEST = 'FETCH_BOARD_REQUEST';
export const FETCH_BOARD_SUCCESS = 'FETCH_BOARD_SUCCESS';
export const FETCH_BOARD_FAILURE = 'FETCH_BOARD_FAILURE';
export const FETCH_BOARDS_REQUEST = 'FETCH_BOARDS_REQUEST';
export const FETCH_BOARDS_SUCCESS = 'FETCH_BOARDS_SUCCESS';
export const FETCH_BOARDS_FAILURE = 'FETCH_BOARDS_FAILURE';
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';

export interface ReplyType {
  _id: string;
  text: string;
  created_on: string;
  thread_id: string;
}

export interface ThreadType {
  _id: string;
  text: string;
  created_on: string;
  replies: string[];
  bumped_on: string;
  board_id: string;
}

export interface BoardType {
  created_on: string;
  name: string;
  threads: string[];
  updated_on: string;
  _id: string;
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
}

export interface createBoardRequest {
  type: typeof CREATE_BOARD_REQUEST;
  payload: {
    name: string;
  };
}

interface createBoardSuccess {
  type: typeof CREATE_BOARD_SUCCESS;
  payload: {
    board: BoardType;
  };
}

interface createBoardFailure {
  type: typeof CREATE_BOARD_FAILURE;
  payload: {
    error: string;
  };
}

export interface fetchBoardsRequest {
  type: typeof FETCH_BOARDS_REQUEST;
  payload: {
    name: string;
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

interface boardsfailureTypes {
  type:
    | typeof FETCH_BOARDS_FAILURE
    | typeof CREATE_BOARD_FAILURE
    | typeof FETCH_BOARD_FAILURE;
  payload: {
    error: string;
  };
}

export type BoardsActionTypes =
  | fetchBoardRequest
  | boardsfailureTypes
  | createBoardRequest
  | createBoardSuccess
  | fetchBoardsRequest
  | fetchBoardsSuccess;
