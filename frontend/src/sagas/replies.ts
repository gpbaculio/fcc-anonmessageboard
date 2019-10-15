import { call, put } from 'redux-saga/effects';
import {
  createReplyRequest,
  updateReplyTextRequestType,
  deleteReplyRequestType
} from '../store/replies/types';
import Api from '../Api';
import * as RepliesActions from '../store/replies/actions';
import {
  type_report_reply_request,
  REPORT_REPLY_SUCCESS,
  REPORT_REPLY_FAILURE
} from '../store/replies/types';

export function* report_reply({ payload }: type_report_reply_request) {
  try {
    const { data } = yield call(Api.replies.report_reply, payload);
    // log successful operation since api response is only text as required on project
    console.log(
      `Toggle report operation of reply with id ${payload.reply_id}`,
      data
    );
    // just pass the id on success
    yield put({
      type: REPORT_REPLY_SUCCESS,
      payload: { reply_id: payload.reply_id }
    });
  } catch (error) {
    yield put({
      type: REPORT_REPLY_FAILURE,
      payload: { error: error.response.data, reply_id: payload.reply_id }
    });
  }
}

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
    yield put(
      RepliesActions.updateReplyTextFailure(
        error.response.data,
        payload.reply_id
      )
    );
  }
}

export function* deleteReply({ payload }: deleteReplyRequestType) {
  try {
    const {
      data: { deletedReply }
    } = yield call(Api.replies.deleteReply, payload);
    yield put(RepliesActions.deleteReplySuccess(deletedReply));
  } catch (error) {
    yield put(
      RepliesActions.deleteReplyFailure(error.response.data, payload.reply_id)
    );
  }
}
