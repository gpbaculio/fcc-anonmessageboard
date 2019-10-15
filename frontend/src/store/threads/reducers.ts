import {
  ThreadType,
  FETCH_BOARDS_SUCCESS,
  fetchBoardsSuccess,
  FETCH_BOARD_SUCCESS
} from '../boards/types';
import {
  CREATE_THREAD_REQUEST,
  ThreadsActionTypes,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE,
  GET_THREAD_REQUEST,
  GET_THREAD_SUCCESS,
  GET_THREAD_FAILURE
} from './types';
import {
  createReplySuccess,
  CREATE_REPLY_SUCCESS,
  DELETE_REPLY_SUCCESS
} from '../replies/types';
import {
  UPDATE_THREAD_TEXT_REQUEST,
  UPDATE_THREAD_TEXT_SUCCESS
} from './types';
import { updateName } from '../boards/actions';
import {
  UPDATE_THREAD_TEXT_FAILURE,
  RESET_THREAD_ERROR,
  REPORT_THREAD_REQUEST
} from './types';
import { ADD_BOARD_SEARCH_RESULT } from '../boards/types';
import { REPORT_THREAD_SUCCESS, REPORT_THREAD_FAILURE } from './types';
import {
  DELETE_THREAD_REQUEST,
  DELETE_THREAD_SUCCESS,
  DELETE_THREAD_FAILURE
} from './types';

export interface ThreadsState {
  threads: { [_id: string]: ThreadType };
  loading: {
    createThread: boolean;
    getThread: boolean;
  };
  error: {
    createThread: string;
    getThread: string;
  };
}

export const threadsInitState: ThreadsState = {
  threads: {},
  loading: { createThread: false, getThread: false },
  error: { createThread: '', getThread: '' }
};

export const threadInitLoading = {
  update_text: false,
  delete_thread: false,
  report_thread: false
};

export const threadInitError = {
  update_text: '',
  delete_thread: '',
  report_thread: ''
};

const repliesReducer = (
  state = threadsInitState,
  action: ThreadsActionTypes | fetchBoardsSuccess | createReplySuccess
) => {
  switch (action.type) {
    case REPORT_THREAD_REQUEST: {
      const { thread_id } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            // this is optimistic response
            // toggle reported status upon successful operation
            reported: !thread.reported,
            loading: {
              ...thread.loading,
              report_thread: true
            }
          }
        }
      };
    }
    case REPORT_THREAD_SUCCESS: {
      const { thread_id } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: {
              ...thread.loading,
              report_thread: false
            }
          }
        }
      };
    }
    case REPORT_THREAD_FAILURE: {
      const { thread_id, error } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            // toggle reported status upon successful operation
            reported: !thread.reported,
            loading: {
              ...thread.loading,
              report_thread: false
            },
            error: {
              ...thread.error,
              error
            }
          }
        }
      };
    }
    case ADD_BOARD_SEARCH_RESULT: {
      let threads = {};
      if (
        action.payload.threads &&
        Object.keys(action.payload.threads).length
      ) {
        threads = Object.fromEntries(
          Object.entries(action.payload.threads).map(([k, v]) => [
            k,
            { ...v, loading: threadInitLoading, error: threadInitError }
          ])
        );
      }
      return {
        ...state,
        threads: {
          ...state.threads,
          ...threads
        }
      };
    }
    case RESET_THREAD_ERROR: {
      const { thread_id, errorKey } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            error: {
              ...thread.error,
              [errorKey]: ''
            }
          }
        }
      };
    }
    case DELETE_THREAD_REQUEST: {
      const thread = state.threads[action.payload.thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: {
              ...thread.loading,
              delete_thread: true
            }
          }
        }
      };
    }
    case DELETE_THREAD_SUCCESS: {
      const { thread_id } = action.payload;
      // deconstruct deleted Thread
      const { [thread_id]: removed_thread, ...threads } = state.threads;
      return {
        ...state,
        threads: { ...threads }
      };
    }
    case DELETE_REPLY_SUCCESS: {
      const { thread_id, _id: reply_id } = action.payload.deletedReply;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            // remove deletedReply _id
            replies: thread.replies.filter(r_id => r_id !== reply_id)
          }
        }
      };
    }
    case DELETE_THREAD_FAILURE: {
      const { thread_id, error } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: {
              ...thread.loading,
              delete_thread: false
            },
            error: {
              ...thread.error,
              delete_thread: error
            }
          }
        }
      };
    }
    case UPDATE_THREAD_TEXT_REQUEST: {
      const { thread_id } = action.payload.updateThreadTextArgs;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: {
              ...thread.loading,
              update_text: true
            }
          }
        }
      };
    }
    case UPDATE_THREAD_TEXT_SUCCESS: {
      const thread = {
        ...action.payload.thread,
        loading: threadInitLoading,
        error: threadInitError
      };
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: thread
        }
      };
    }
    case UPDATE_THREAD_TEXT_FAILURE: {
      const { error, thread_id } = action.payload;
      const thread = state.threads[thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: {
              ...thread.loading,
              update_text: false
            },
            error: {
              ...thread.error,
              update_text: error
            }
          }
        }
      };
    }
    case GET_THREAD_REQUEST: {
      return {
        ...state,
        loading: {
          ...state.loading,
          getThread: true
        }
      };
    }
    case GET_THREAD_SUCCESS: {
      const { thread } = action.payload;
      return {
        ...state,
        loading: {
          ...state.loading,
          getThread: false
        },
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: threadInitLoading,
            error: threadInitError
          }
        }
      };
    }
    case GET_THREAD_FAILURE: {
      return {
        ...state,
        error: {
          ...state.error,
          error: action.payload.error
        }
      };
    }
    case CREATE_REPLY_SUCCESS: {
      const { reply } = action.payload;
      const thread = state.threads[reply.thread_id];
      return {
        ...state,
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            replies: [...thread.replies, reply._id]
          }
        }
      };
    }
    case FETCH_BOARD_SUCCESS: {
      let threads = {};
      if (
        action.payload.threads &&
        Object.keys(action.payload.threads).length
      ) {
        threads = Object.fromEntries(
          Object.entries(action.payload.threads).map(([k, v]) => [
            k,
            { ...v, loading: threadInitLoading, error: threadInitError }
          ])
        );
      }
      return {
        ...state,
        threads: { ...state.threads, ...threads }
      };
    }
    case FETCH_BOARDS_SUCCESS: {
      let threads = {};
      if (
        action.payload.threads &&
        Object.keys(action.payload.threads).length
      ) {
        threads = Object.fromEntries(
          Object.entries(action.payload.threads).map(([k, v]) => [
            k,
            { ...v, loading: threadInitLoading, error: threadInitError }
          ])
        );
      }
      return {
        ...state,
        threads: { ...state.threads, ...threads }
      };
    }
    case CREATE_THREAD_REQUEST: {
      return {
        ...state,

        loading: { ...state.loading, createThread: true }
      };
    }
    case CREATE_THREAD_SUCCESS: {
      const { thread } = action.payload;

      return {
        ...state,
        error: {
          ...state.error,
          createThread: ''
        },
        threads: {
          ...state.threads,
          [thread._id]: {
            ...thread,
            loading: threadInitLoading,
            error: threadInitError
          }
        },
        loading: { ...state.loading, createThread: false }
      };
    }
    case CREATE_THREAD_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: { ...state.loading, createThread: false },
        error: { ...state.error, createThread: error }
      };
    }
    default:
      return state;
  }
};

export default repliesReducer;
