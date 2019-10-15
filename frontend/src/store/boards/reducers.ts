import { ADD_BOARD_SEARCH_RESULT } from './types';
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
  RESET_ERROR_STATE,
  UPDATE_NAME_SUCCESS,
  UPDATE_NAME_REQUEST,
  UPDATE_NAME_FAILURE,
  RESET_BOARD_ERROR,
  DELETE_BOARD_REQUEST,
  DELETE_BOARD_SUCCESS,
  DELETE_BOARD_FAILURE
} from './types';
import {
  createThreadSuccess,
  CREATE_THREAD_SUCCESS,
  DELETE_THREAD_SUCCESS
} from '../threads/types';

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

export const boardsInitState: BoardsState = {
  loading: initLoading,
  boards: {},
  error: initError,
  page: 1,
  search_text: ''
};

export const boardInitLoading = {
  update_name: false,
  delete_board: false
};

export const boardInitError = {
  update_name: '',
  delete_board: ''
};

const boardsReducer = (
  state = boardsInitState,
  action: BoardsActionTypes | createThreadSuccess
) => {
  switch (action.type) {
    // handle search result board to add on state to avoid unnecessary refetch
    case ADD_BOARD_SEARCH_RESULT: {
      const { board } = action.payload;
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            loading: boardInitLoading,
            error: boardInitError
          }
        }
      };
    }
    case DELETE_THREAD_SUCCESS: {
      const { board_id, thread_id } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            // remove deleted thread id
            threads: board.threads.filter(th_id => th_id !== thread_id)
          }
        }
      };
    }
    case DELETE_BOARD_REQUEST: {
      const { board_id } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          [board._id]: {
            ...board,
            loading: {
              ...board.loading,
              delete_board: true
            }
          }
        }
      };
    }
    case DELETE_BOARD_SUCCESS: {
      const { deleted_board } = action.payload;
      // deconstruct deleted_board
      const { [deleted_board._id]: removedBoard, ...boards } = state.boards;
      return {
        ...state,
        boards: { ...boards }
      };
    }
    case DELETE_BOARD_FAILURE: {
      const { board_id, error } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            loading: {
              ...board.loading,
              delete_board: false
            },
            error: {
              ...board.error,
              delete_board: error
            }
          }
        }
      };
    }
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
    case UPDATE_NAME_REQUEST: {
      const { board_id } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            loading: {
              ...board.loading,
              update_name: true
            }
          }
        }
      };
    }
    case UPDATE_NAME_SUCCESS: {
      const board = state.boards[action.payload.board._id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            ...action.payload.board,
            loading: {
              ...board.loading,
              update_name: false
            }
          }
        }
      };
    }
    case UPDATE_NAME_FAILURE: {
      const { error, board_id } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board_id]: {
            ...board,
            loading: {
              ...board.loading,
              update_name: false
            },
            error: {
              ...board.error,
              update_name: error
            }
          }
        }
      };
    }
    case RESET_BOARD_ERROR: {
      const { board_id, errorKey } = action.payload;
      const board = state.boards[board_id];
      return {
        ...state,
        boards: {
          ...state.boards,
          [board._id]: {
            ...board,
            error: {
              ...board.error,
              [errorKey]: ''
            }
          }
        }
      };
    }
    case CREATE_BOARD_SUCCESS: {
      const board = action.payload.board;
      return {
        ...state,
        loading: { ...state.loading, createBoard: false },
        boards: {
          [board._id]: {
            ...board,
            ...action.payload.board,
            error: boardInitError,
            loading: boardInitLoading
          },
          ...state.boards
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
