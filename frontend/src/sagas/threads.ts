import { call, put, select } from 'redux-saga/effects';
import Api from '../Api';
import {
  createThreadRequest,
  CREATE_THREAD_FAILURE,
  getThreadRequest,
  GET_THREAD_FAILURE,
  GET_THREAD_SUCCESS,
  deleteThreadRequestType
} from '../store/threads/types';
import * as ThreadsActions from '../store/threads/actions';
import { thread } from './normalizrEntities';
import { normalize } from 'normalizr';
import {
  REPORT_THREAD_FAILURE,
  REPORT_THREAD_SUCCESS
} from '../store/threads/types';
import {
  updateThreadTextRequest,
  type_report_thread_request
} from '../store/threads/types';
import { AppState } from '../store';

export function* report_thread({ payload }: type_report_thread_request) {
  try {
    const response = yield call(Api.threads.report_thread, payload);
    // log successful operation since api response is only text as required on project
    console.log(
      `Toggle report operation of thread with id ${payload.thread_id}`,
      response.data
    );
    // just pass the id on success
    yield put({
      type: REPORT_THREAD_SUCCESS,
      payload: { thread_id: payload.thread_id }
    });
  } catch (error) {
    yield put({
      type: REPORT_THREAD_FAILURE,
      payload: { error: error.response.data, thread_id: payload.thread_id }
    });
  }
}

export function* create_thread({ payload, callBack }: createThreadRequest) {
  try {
    const {
      data: { thread }
    } = yield call(Api.threads.createThread, payload);
    yield put(ThreadsActions.createThreadSuccess(thread));
    if (callBack) callBack();
  } catch (error) {
    yield put({
      type: CREATE_THREAD_FAILURE,
      payload: { error: error.message }
    });
  }
}

export function* getThread(action: getThreadRequest) {
  try {
    const { data } = yield call(
      Api.threads.getThread,
      action.payload.thread_id
    );
    const { replies, threads } = normalize(data, { thread }).entities;
    yield put({
      type: GET_THREAD_SUCCESS,
      payload: { thread: threads[action.payload.thread_id], replies }
    });
  } catch (error) {
    yield put({
      type: GET_THREAD_FAILURE,
      payload: { error: error.message }
    });
  }
}

export function* updateThread({ payload }: updateThreadTextRequest) {
  try {
    const { data } = yield call(
      Api.threads.updateThreadText,
      payload.updateThreadTextArgs
    );
    const { replies, threads } = normalize(data, { thread }).entities;
    if (payload.callBack) payload.callBack();
    yield put(
      ThreadsActions.updateThreadTextSuccess({
        thread: threads[payload.updateThreadTextArgs.thread_id],
        replies
      })
    );
  } catch (error) {
    yield put(
      ThreadsActions.updateThreadTextFailure(
        error.response.data,
        payload.updateThreadTextArgs.thread_id
      )
    );
  }
}
export function* deleteThreadSaga(action: deleteThreadRequestType) {
  try {
    // data is only text of success or incorrect password
    const { data } = yield call(Api.threads.deleteThread, action.payload);
    console.log(
      `Delete operation of thread with id ${action.payload.thread_id}`,
      data
    );
    const thread_board_id = yield select(
      (state: AppState) =>
        state.threads.threads[action.payload.thread_id].board_id
    );
    if (action.callBack) action.callBack();

    yield put(
      ThreadsActions.delete_thread_success(
        action.payload.thread_id,
        thread_board_id
      )
    );
  } catch (error) {
    yield put(ThreadsActions.deleteThreadFailure(error.message));
  }
}
