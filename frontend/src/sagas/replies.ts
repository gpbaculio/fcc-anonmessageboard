import { call, put } from 'redux-saga/effects';
import {
  createReplyRequest,
  updateReplyTextRequestType
} from '../store/replies/types';
import Api from '../Api';
import * as RepliesActions from '../store/replies/actions';
import { updateReplyTextFailure } from '../store/replies/actions';

export function* createReply(action: createReplyRequest) {
  try {
    const {
      data: { reply }
    } = yield call(Api.replies.createReply, action.payload);
    yield put(RepliesActions.createReplySuccess(reply));
  } catch (error) {
    yield put(RepliesActions.createReplyFailure(error.message));
  }
}

export function* updateReplyText({
  payload,
  callBack
}: updateReplyTextRequestType) {
  try {
    const {
      data: { reply }
    } = yield call(Api.replies.updateReplyText, payload);

    yield put(RepliesActions.updateReplyTextSuccess(reply));
    if (callBack) callBack();
  } catch (error) {
    yield put(RepliesActions.updateReplyTextFailure(error.message));
  }
}
