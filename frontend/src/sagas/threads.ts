import { call, put } from 'redux-saga/effects';
import Api from '../Api';
import {
  createThreadRequest,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE
} from '../store/threads/types';

export function* createThread(action: createThreadRequest) {
  try {
    const {
      data: { thread }
    } = yield call(Api.threads.createThread, action.payload);
    yield put({ type: CREATE_THREAD_SUCCESS, payload: { thread } });
  } catch (error) {
    yield put({
      type: CREATE_THREAD_FAILURE,
      payload: { error: error.message }
    });
  }
}
