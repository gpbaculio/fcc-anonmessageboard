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
import { createReplySuccess, CREATE_REPLY_SUCCESS } from '../replies/types';
import { UPDATE_THREAD_TEXT_REQUEST } from './types';
import { updateName } from '../boards/actions';

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
  update_text: false
};

export const threadInitError = {
  update_text: ''
};

const repliesReducer = (
  state = threadsInitState,
  action: ThreadsActionTypes | fetchBoardsSuccess | createReplySuccess
) => {
  switch (action.type) {
    case UPDATE_THREAD_TEXT_REQUEST: {
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
              update_text: true
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
          [thread._id]: { ...thread, loading: threadInitLoading }
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
      return {
        ...state,
        threads: { ...state.threads, ...action.payload.threads }
      };
    }
    case FETCH_BOARDS_SUCCESS: {
      const threads = Object.fromEntries(
        Object.entries(action.payload.threads).map(([k, v]) => [
          k,
          { ...v, loading: threadInitLoading }
        ])
      );
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
          [thread._id]: { ...thread }
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
