import {
  BoardsActionTypes,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  BoardsReducerState
} from './types';
import { AnyAction } from 'redux';
const initState: BoardsReducerState = {
  loading: false,
  boards: {}
};

const boardsReducer = (state = initState, action: BoardsActionTypes) => {
  switch (action.type) {
    case CREATE_BOARD_REQUEST: {
      return { ...state, loading: true };
    }
    case CREATE_BOARD_SUCCESS: {
      const { board } = action.payload;
      return {
        ...state,
        loading: false,
        boards: {
          ...state.boards,
          [board._id]: board
        }
      };
    }
    case CREATE_BOARD_FAILURE: {
      return { ...state, loading: false };
    }
    default:
      return state;
  }
};

export default boardsReducer;
