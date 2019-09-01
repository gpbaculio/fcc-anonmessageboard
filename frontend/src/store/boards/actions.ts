import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARD_REQUEST
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
