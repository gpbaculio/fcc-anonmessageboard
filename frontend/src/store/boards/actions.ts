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
  DELETE_BOARD_FAILURE,
  DELETE_BOARD_SUCCESS
} from './types';
import { updateNameArgs, createBoardArgs } from '../../Api';
import { ADD_BOARD_SEARCH_RESULT } from './types';
import * as NormalizrEntities from '../../sagas/normalizrEntities';
import { normalize } from 'normalizr';
import { boardInitLoading, boardInitError } from './reducers';

export const addBoardSearchResult = (board: BoardType) => {
  // no need to be handled by sagas so we normalize here
  const { boards, threads, replies } = normalize(
    {
      board: {
        ...board,
        loading: boardInitLoading,
        error: boardInitError
      }
    },
    { board: NormalizrEntities.board }
  ).entities;
  return {
    type: ADD_BOARD_SEARCH_RESULT,
    payload: {
      board: boards[board._id],
      threads,
      replies
    }
  };
};

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

export const createBoard = (
  { name, delete_password }: createBoardArgs,
  call_back?: () => void
) => ({
  type: CREATE_BOARD_REQUEST,
  payload: {
    name,
    delete_password
  },
  call_back
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

export interface fetchBoardsParamsType {
  page?: number; // defaults = 1
  limit?: number; // default = 9
  search_text?: string;
  no_pagination_search?: boolean; // for searching input
}

export const fetchBoards = ({
  search_text,
  page,
  limit
}: fetchBoardsParamsType) => ({
  type: FETCH_BOARDS_REQUEST,
  payload: { page, limit, search_text }
});

export interface deleteBoardArgs {
  board_id: string;
  delete_password: string;
  callBack?: () => void;
}
export const deleteBoard = ({
  board_id,
  delete_password,
  callBack
}: deleteBoardArgs) => ({
  type: DELETE_BOARD_REQUEST,
  payload: {
    board_id,
    callBack,
    delete_password
  }
});

export const deleteBoardSuccess = (deleted_board: BoardType) => ({
  type: DELETE_BOARD_SUCCESS,
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
