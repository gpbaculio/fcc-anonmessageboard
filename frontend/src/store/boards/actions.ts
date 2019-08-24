import { CREATE_BOARD_REQUEST } from './types';

export const createBoard = (name: string) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name
  }
});
