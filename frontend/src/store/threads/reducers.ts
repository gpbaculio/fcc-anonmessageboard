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
  CREATE_THREAD_FAILURE
} from './types';
import { createReplySuccess, CREATE_REPLY_SUCCESS } from '../replies/types';

export interface ThreadsState {
  threads: { [_id: string]: ThreadType };
  loading: {
    createThread: boolean;
  };
  error: {
    createThread: string | null;
  };
}
const initState: ThreadsState = {
  threads: {},
  loading: { createThread: false },
  error: { createThread: '' }
};

const boardsReducer = (
  state = initState,
  action: ThreadsActionTypes | fetchBoardsSuccess | createReplySuccess
) => {
  switch (action.type) {
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
      return {
        ...state,
        threads: { ...state.threads, ...action.payload.threads }
      };
    }
    case CREATE_THREAD_REQUEST: {
      return {
        ...state,

        loading: { createThread: true }
      };
    }
    case CREATE_THREAD_SUCCESS: {
      const { thread } = action.payload;
      return {
        ...state,
        error: {
          ...state.error,
          createThread: null
        },
        threads: {
          ...state.threads,
          [thread._id]: { ...thread }
        },
        loading: { createThread: false }
      };
    }
    case CREATE_THREAD_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        loading: { createThread: false },
        error: { createThread: error }
      };
    }
    default:
      return state;
  }
};

export default boardsReducer;
