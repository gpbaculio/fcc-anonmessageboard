import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  BoardType,
  CREATE_BOARD_FAILURE
} from './types';

export const createBoard = (name: string) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name
  }
});

export const fetchBoard = (board_id: string) => ({
  type: FETCH_BOARD_REQUEST,
  payload: {
    board_id
  }
});

export const fetchBoards = () => ({
  type: FETCH_BOARDS_REQUEST
});

export const createBoardSuccess = (board: BoardType) => ({
  type: CREATE_BOARD_SUCCESS,
  payload: { board }
});

export const createBoardFailure = (error: string) => ({
  type: CREATE_BOARD_FAILURE,
  payload: { error: error }
});
