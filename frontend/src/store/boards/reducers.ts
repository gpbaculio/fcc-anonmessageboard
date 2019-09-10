import {
  BoardsActionTypes,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  BoardsState,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  FETCH_BOARD_REQUEST,
  FETCH_BOARD_SUCCESS,
  FETCH_BOARD_FAILURE,
  RESET_ERROR_STATE
} from './types';
import { createThreadSuccess, CREATE_THREAD_SUCCESS } from '../threads/types';

const initError = {
  createBoard: '',
  fetchBoards: '',
  fetchBoard: ''
};
const initLoading = {
  createBoard: false,
  fetchBoards: false,
  fetchBoard: false
};
const initState: BoardsState = {
  loading: initLoading,
  boards: {},
  error: initError
};

const boardsReducer = (
  state = initState,
  action: BoardsActionTypes | createThreadSuccess
) => {
  switch (action.type) {
    case RESET_ERROR_STATE: {
      return {
        ...state,
        error: initError
      };
    }
    case FETCH_BOARD_REQUEST: {
      return { ...state, loading: { ...state.loading, fetchBoard: true } };
    }
    case FETCH_BOARD_SUCCESS: {
      return {
        ...state,
        loading: { ...state.loading, fetchBoard: false },
        boards: {
          ...action.payload.boards
        }
      };
    }
    case FETCH_BOARD_FAILURE: {
      return {
        ...state,
        error: { ...state.error, fetchBoards: action.payload.error },
        loading: { ...state.loading, fetchBoard: false }
      };
    }
    case CREATE_THREAD_SUCCESS: {
      const { thread } = action.payload;
      const board = state.boards[thread.board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            threads: [...board.threads, thread._id]
          }
        }
      };
    }
    case FETCH_BOARDS_REQUEST: {
      return { ...state, loading: { ...state.loading, fetchBoards: true } };
    }
    case FETCH_BOARDS_SUCCESS: {
      return {
        ...state,
        loading: { ...state.loading, fetchBoards: false },
        boards: {
          ...action.payload.boards
        }
      };
    }
    case FETCH_BOARDS_FAILURE: {
      return {
        ...state,
        error: { ...state.error, fetchBoards: action.payload.error },
        loading: { ...state.loading, fetchBoards: false }
      };
    }
    case CREATE_BOARD_REQUEST: {
      return { ...state, loading: { ...state.loading, createBoard: true } };
    }
    case CREATE_BOARD_SUCCESS: {
      const { board } = action.payload;
      return {
        ...state,
        loading: { ...state.loading, createBoard: false },
        boards: {
          ...state.boards,
          [board._id]: board
        }
      };
    }
    case CREATE_BOARD_FAILURE: {
      return {
        ...state,
        error: { ...state.error, createBoard: action.payload.error },
        loading: { ...state.loading, createBoard: false }
      };
    }
    default:
      return state;
  }
};

export default boardsReducer;
