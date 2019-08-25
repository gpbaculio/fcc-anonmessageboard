export const FETCH_BOARDS_REQUEST = 'FETCH_BOARDS_REQUEST';
export const FETCH_BOARDS_SUCCESS = 'FETCH_BOARDS_SUCCESS';
export const FETCH_BOARDS_FAILURE = 'FETCH_BOARDS_FAILURE';
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';

export interface BoardType {
  createdAt: string;
  name: string;
  threadIds: string[];
  updatedAt: string;
  _id: string;
}

export interface BoardsLoadingType {
  createBoard: boolean;
  fetchBoards: boolean;
}

export interface BoardsErrorType {
  createBoard: string;
  fetchBoards: string;
}

export interface BoardsReducerState {
  loading: BoardsLoadingType;
  error: BoardsErrorType;
  boards: {
    [text: string]: BoardType;
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
}

interface fetchBoardsSuccess {
  type: typeof FETCH_BOARDS_SUCCESS;
  payload: {
    boards: {
      [_id: string]: BoardType;
    };
  };
}

interface fetchBoardsFailure {
  type: typeof FETCH_BOARDS_FAILURE;
  payload: {
    error: string;
  };
}

export type BoardsActionTypes =
  | createBoardRequest
  | createBoardSuccess
  | createBoardFailure
  | fetchBoardsRequest
  | fetchBoardsSuccess
  | fetchBoardsFailure;
