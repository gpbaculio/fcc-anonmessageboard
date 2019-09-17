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
  RESET_ERROR_STATE,
  UPDATE_NAME_REQUEST,
  UPDATE_NAME_SUCCESS,
  UPDATE_NAME_FAILURE,
  RESET_BOARD_ERROR,
  DELETE_BOARD_REQUEST,
  DELETE_BOARD_FAILURE
} from './types';
import { updateNameArgs } from '../../Api';

export const updateName = (
  { board_id, board_name, delete_password }: updateNameArgs,
  callBack?: () => void
) => ({
  type: UPDATE_NAME_REQUEST,
  payload: {
    board_id,
    board_name,
    delete_password
  },
  callBack
});

export const createBoard = (name: string, delete_password: string) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name,
    delete_password
  }
});

export const resetError = () => ({
  type: RESET_ERROR_STATE
});

export const createboardSuccess = (board: BoardType) => ({
  type: CREATE_BOARD_SUCCESS,
  payload: { board }
});

export const updateNameSuccess = (board: BoardType) => ({
  type: UPDATE_NAME_SUCCESS,
  payload: { board }
});

export const createBoardFailure = (error: string) => ({
  type: CREATE_BOARD_FAILURE,
  payload: { error }
});

export const updateNameFailure = (error: string, board_id: string) => ({
  type: UPDATE_NAME_FAILURE,
  payload: { error, board_id }
});

export const fetchBoard = (board_id: string) => ({
  type: FETCH_BOARD_REQUEST,
  payload: {
    board_id
  }
});

export const resetBoardError = (errorKey: string, board_id: string) => ({
  type: RESET_BOARD_ERROR,
  payload: {
    errorKey,
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

export const deleteBoard = (board_id: string) => ({
  type: DELETE_BOARD_REQUEST,
  payload: {
    board_id
  }
});

export const deleteBoardSuccess = (deleted_board: BoardType) => ({
  type: DELETE_BOARD_REQUEST,
  payload: {
    deleted_board
  }
});

export const deleteBoardFailure = (error: string, board_id: string) => ({
  type: DELETE_BOARD_FAILURE,
  payload: {
    error,
    board_id
  }
});
