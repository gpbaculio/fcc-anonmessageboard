import { call, put } from 'redux-saga/effects';
import {
  createReplyRequest,
  CREATE_REPLY_FAILURE,
  CREATE_REPLY_SUCCESS
} from '../store/replies/types';
import Api from '../Api';

export function* createReply(action: createReplyRequest) {
  try {
    const {
      data: { reply }
    } = yield call(Api.replies.createReply, action.payload);
    yield put({ type: CREATE_REPLY_SUCCESS, payload: { reply } });
  } catch (error) {
    yield put({
      type: CREATE_REPLY_FAILURE,
      payload: { error: error.message }
    });
  }
}
