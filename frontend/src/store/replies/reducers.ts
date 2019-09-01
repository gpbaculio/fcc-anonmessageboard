import {
  ThreadType,
  FETCH_BOARDS_SUCCESS,
  fetchBoardsSuccess,
  ReplyType,
  FETCH_BOARD_SUCCESS
} from '../boards/types';

interface RepliesState {
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

const repliesReducer = (state = initState, action: fetchBoardsSuccess) => {
  switch (action.type) {
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
