import { call, put } from 'redux-saga/effects';
import {
  createReplyRequest,
  CREATE_REPLY_FAILURE,
  CREATE_REPLY_SUCCESS
} from '../store/replies/types';
import Api from '../Api';
import {
  createReplySuccess,
  createReplyFailure
} from '../store/replies/actions';

export function* createReply(action: createReplyRequest) {
  try {
    const {
      data: { reply }
    } = yield call(Api.replies.createReply, action.payload);
    yield put(createReplySuccess(reply));
  } catch (error) {
    yield put(createReplyFailure(error.response.data));
  }
}
