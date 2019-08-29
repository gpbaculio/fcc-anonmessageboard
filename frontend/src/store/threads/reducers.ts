import {
  ThreadType,
  FETCH_BOARDS_SUCCESS,
  fetchBoardsSuccess
} from '../boards/types';
import {
  CREATE_THREAD_REQUEST,
  ThreadsActionTypes,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE
} from './types';

interface ThreadsState {
  threads: { [_id: string]: ThreadType };
  loading: {
    createThread: boolean;
  };
  error: {
    createThread: string;
  };
}
const initState: ThreadsState = {
  threads: {},
  loading: { createThread: false },
  error: { createThread: '' }
};

const boardsReducer = (
  state = initState,
  action: ThreadsActionTypes | fetchBoardsSuccess
) => {
  switch (action.type) {
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
