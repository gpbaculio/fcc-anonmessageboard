import { ADD_BOARD_SEARCH_RESULT } from '../boards/types';
import {
  REPORT_REPLY_REQUEST,
  REPORT_REPLY_SUCCESS,
  REPORT_REPLY_FAILURE
} from './types';
import {
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
  DELETE_REPLY_FAILURE
} from './types';
import {
  UPDATE_REPLY_TEXT_REQUEST,
  UPDATE_REPLY_TEXT_SUCCESS,
  UPDATE_REPLY_TEXT_FAILURE,
  RESET_REPLY_ERROR
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
  delete_reply: false,
  report_reply: false
};
export const replyInitError = {
  update_text: '',
  delete_reply: '',
  report_reply: ''
};

const repliesReducer = (
  state = repliesInitState,
  action: RepliesActionTypes | fetchBoardsSuccess | getThreadSuccess
) => {
  switch (action.type) {
    case REPORT_REPLY_REQUEST: {
      const { reply_id } = action.payload;
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            // this is optimistic response
            // toggle reported status upon successful operation
            reported: !reply.reported,
            loading: {
              ...reply.loading,
              report_reply: true
            }
          }
        }
      };
    }
    case REPORT_REPLY_SUCCESS: {
      const { reply_id } = action.payload;
      // we change nothing since we toggled the report status on request since we want optimistic response
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            loading: {
              ...reply.loading,
              report_reply: false
            }
          }
        }
      };
    }
    case REPORT_REPLY_FAILURE: {
      const { reply_id, error } = action.payload;
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            // toggle reported status upon successful operation
            reported: !reply.reported,
            loading: {
              ...reply.loading,
              report_thread: false
            },
            error: {
              ...reply.error,
              error
            }
          }
        }
      };
    }
    case ADD_BOARD_SEARCH_RESULT: {
      let replies = {};
      if (
        action.payload.replies &&
        Object.keys(action.payload.replies).length
      ) {
        replies = Object.fromEntries(
          Object.entries(action.payload.replies).map(([k, v]) => [
            k,
            { ...v, loading: replyInitLoading, error: replyInitError }
          ])
        );
      }
      return {
        ...state,
        replies: {
          ...state.replies,
          ...replies
        }
      };
    }
    case DELETE_REPLY_REQUEST: {
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
              delete_reply: true
            }
          }
        }
      };
    }
    case DELETE_REPLY_SUCCESS: {
      const { deletedReply } = action.payload;
      // deconstruct deleted Thread
      const { [deletedReply._id]: removedReply, ...replies } = state.replies;
      return {
        ...state,
        replies: { ...replies }
      };
    }
    case DELETE_REPLY_FAILURE: {
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
              delete_reply: false
            },
            error: {
              ...reply.error,
              delete_reply: error
            }
          }
        }
      };
    }
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
    case RESET_REPLY_ERROR: {
      const { reply_id, errorKey } = action.payload;
      const reply = state.replies[reply_id];
      return {
        ...state,
        replies: {
          ...state.replies,
          [reply._id]: {
            ...reply,
            error: {
              ...reply.error,
              [errorKey]: ''
            }
          }
        }
      };
    }
    case GET_THREAD_SUCCESS: {
      let replies = {};
      if (action.payload.replies && Object.keys(action.payload.replies).length)
        replies = Object.fromEntries(
          Object.entries(action.payload.replies).map(([k, v]) => [
            k,
            { ...v, loading: replyInitLoading, error: replyInitError }
          ])
        );
      return {
        ...state,
        replies: {
          ...state.replies,
          ...replies
        }
      };
    }
    case UPDATE_THREAD_TEXT_SUCCESS:
      let replies = {};
      if (action.payload.replies && Object.keys(action.payload.replies).length)
        replies = Object.fromEntries(
          Object.entries(action.payload.replies).map(([k, v]) => [
            k,
            { ...v, loading: replyInitLoading, error: replyInitError }
          ])
        );
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
      let replies = {};
      if (
        action.payload.replies &&
        Object.keys(action.payload.replies).length
      ) {
        replies = Object.fromEntries(
          Object.entries(action.payload.replies).map(([k, v]) => [
            k,
            { ...v, loading: replyInitLoading, error: replyInitError }
          ])
        );
      }
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
