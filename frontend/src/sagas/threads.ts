import { takeEvery, call, put } from 'redux-saga/effects';
import Api from '../Api';
import {
  createThreadRequest,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE
} from '../store/threads/types';
import { schema } from 'normalizr';

export function* createThread(action: createThreadRequest) {
  try {
    const {
      data: { thread }
    } = yield call(Api.threads.createThread, action.payload);
    const reply = new schema.Entity('replies', {}, { idAttribute: '_id' });
    console.log('thread ', thread);
    // yield put({ type: CREATE_THREAD_SUCCESS, payload: { thread } });
  } catch (error) {
    console.log('error ', error);
    // yield put({ type: CREATE_THREAD_FAILURE, payload: { error } });
  }
}
