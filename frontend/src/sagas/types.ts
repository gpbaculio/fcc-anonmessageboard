export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';

interface createBoard {
  type: typeof CREATE_BOARD_REQUEST;
  payload: {
    name: string;
  };
}

export type BoardActionTypes = createBoard;
