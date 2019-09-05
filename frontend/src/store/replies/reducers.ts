import {
  FETCH_BOARDS_SUCCESS,
  fetchBoardsSuccess,
  ReplyType,
  FETCH_BOARD_SUCCESS
} from '../boards/types';
import {
  RepliesActionTypes,
  CREATE_REPLY_SUCCESS,
  CREATE_REPLY_REQUEST,
  CREATE_REPLY_FAILURE
} from './types';

export interface RepliesState {
  replies: { [_id: string]: ReplyType };
  loading: {
    createReply: boolean;
  };
  error: {
    createReply: string;
  };
}

const initState: RepliesState = {
  replies: {},
  loading: { createReply: false },
  error: { createReply: '' }
};

const repliesReducer = (
  state = initState,
  action: RepliesActionTypes | fetchBoardsSuccess
) => {
  switch (action.type) {
    case CREATE_REPLY_REQUEST: {
      return {
        ...state,
        loading: {
          ...state.loading,
          createReply: true
        }
      };
    }
    case CREATE_REPLY_SUCCESS: {
      const { reply } = action.payload;
      return {
        ...state,
        replies: {
          [reply._id]: reply,
          ...state.replies
        },
        loading: {
          ...state.loading,
          createReply: false
        }
      };
    }
    case CREATE_REPLY_FAILURE: {
      return {
        ...state,
        error: {
          ...state.error,
          createReply: action.payload.error
        }
      };
    }
    case FETCH_BOARD_SUCCESS: {
      return {
        ...state,
        replies: { ...state.replies, ...action.payload.replies }
      };
    }
    case FETCH_BOARDS_SUCCESS: {
      return {
        ...state,
        replies: { ...state.replies, ...action.payload.replies }
      };
    }
    default:
      return state;
  }
};

export default repliesReducer;
