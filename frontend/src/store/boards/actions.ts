import { CREATE_BOARD_REQUEST, FETCH_BOARDS_REQUEST } from './types';

export const createBoard = (name: string) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name
  }
});

export const fetchBoards = () => ({
  type: FETCH_BOARDS_REQUEST
});
