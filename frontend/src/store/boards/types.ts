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

export interface BoardsReducerState {
  loading: boolean;
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

export type BoardsActionTypes =
  | createBoardRequest
  | createBoardSuccess
  | createBoardFailure;
