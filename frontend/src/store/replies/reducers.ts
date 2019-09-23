import {
  UPDATE_REPLY_TEXT_REQUEST,
  UPDATE_REPLY_TEXT_SUCCESS,
  UPDATE_REPLY_TEXT_FAILURE
} from './types';
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
  CREATE_REPLY_FAILURE,
  RepliesState
} from './types';
import {
  getThreadSuccess,
  GET_THREAD_SUCCESS,
  UPDATE_THREAD_TEXT_SUCCESS
} from '../threads/types';

export const repliesInitState: RepliesState = {
  replies: {},
  loading: { createReply: false },
  error: { createReply: '' }
};

export const replyInitLoading = {
  update_text: false,
  delete_reply: false
};
export const replyInitError = { update_text: '', delete_reply: '' };

const repliesReducer = (
  state = repliesInitState,
  action: RepliesActionTypes | fetchBoardsSuccess | getThreadSuccess
) => {
  switch (action.type) {
    case UPDATE_REPLY_TEXT_REQUEST: {
      const { reply_id } = action.payload;
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            loading: {
              ...reply.loading,
              update_text: true
            }
          }
        }
      };
    }
    case UPDATE_REPLY_TEXT_SUCCESS: {
      const reply = {
        ...action.payload.reply,
        loading: replyInitLoading,
        error: replyInitError
      };
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: reply
        }
      };
    }
    case UPDATE_REPLY_TEXT_FAILURE: {
      const { reply_id, error } = action.payload;
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            loading: {
              ...reply.loading,
              update_text: false
            },
            error: {
              ...reply.error,
              update_text: error
            }
          }
        }
      };
    }
    case GET_THREAD_SUCCESS: {
      return {
        ...state,
        replies: {
          ...state.replies,
          ...action.payload.replies
        }
      };
    }
    case UPDATE_THREAD_TEXT_SUCCESS:
      const { replies } = action.payload;
      return {
        ...state,
        replies: {
          ...state.replies,
          ...replies
        }
      };
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
          [reply._id]: {
            ...reply,
            loading: replyInitLoading,
            error: replyInitError
          },
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
      const replies = Object.fromEntries(
        Object.entries(action.payload.replies).map(([k, v]) => [
          k,
          { ...v, loading: replyInitLoading, error: replyInitError }
        ])
      );
      return {
        ...state,
        replies: { ...state.replies, ...replies }
      };
    }
    case FETCH_BOARDS_SUCCESS: {
      const replies = Object.fromEntries(
        Object.entries(action.payload.replies).map(([k, v]) => [
          k,
          { ...v, loading: replyInitLoading, error: replyInitError }
        ])
      );
      return {
        ...state,
        replies: { ...state.replies, ...replies }
      };
    }
    default:
      return state;
  }
};

export default repliesReducer;
