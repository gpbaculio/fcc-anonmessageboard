import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  BoardType,
  CREATE_BOARD_FAILURE,
  ThreadType,
  ReplyType,
  FETCH_BOARD_SUCCESS,
  RESET_ERROR_STATE
} from './types';

export const createBoard = (name: string) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name
  }
});

export const resetError = () => ({
  type: RESET_ERROR_STATE
});

export const createBoardSuccess = (board: BoardType) => ({
  type: CREATE_BOARD_SUCCESS,
  payload: { board }
});

export const createBoardFailure = (error: string) => ({
  type: CREATE_BOARD_FAILURE,
  payload: { error: error }
});

export const fetchBoard = (board_id: string) => ({
  type: FETCH_BOARD_REQUEST,
  payload: {
    board_id
  }
});
export interface fetchBoardsSuccessArgs {
  boards: {
    [_id: string]: BoardType;
  };
  threads: {
    [_id: string]: ThreadType;
  };
  replies: {
    [_id: string]: ReplyType;
  };
}
export const fetchBoardSuccess = ({
  boards,
  threads,
  replies
}: fetchBoardsSuccessArgs) => ({
  type: FETCH_BOARD_SUCCESS,
  payload: {
    boards,
    threads,
    replies
  }
});

export const fetchBoards = () => ({
  type: FETCH_BOARDS_REQUEST
});
