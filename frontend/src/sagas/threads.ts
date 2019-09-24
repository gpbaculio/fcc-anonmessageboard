import { call, put, delay } from 'redux-saga/effects';
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
import { createThreadSuccess } from '../store/threads/actions';
import { threadInitLoading, threadInitError } from '../store/threads/reducers';
import { updateThreadTextRequest } from '../store/threads/types';

export function* createThread({ payload, callBack }: createThreadRequest) {
  try {
    const {
      data: { thread }
    } = yield call(Api.threads.createThread, payload);
    yield put(
      createThreadSuccess({
        ...thread,
        loading: threadInitLoading,
        error: threadInitError
      })
    );
    callBack();
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
    console.log('error ', error);
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
    const {
      data: { deletedThread }
    } = yield call(Api.threads.deleteThread, action.payload);

    if (action.callBack) {
      action.callBack();
    }
    yield put(ThreadsActions.deleteThreadSuccess(deletedThread));
  } catch (error) {
    yield put(ThreadsActions.deleteThreadFailure(error.message));
  }
}
