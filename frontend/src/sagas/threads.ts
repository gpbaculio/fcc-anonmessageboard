import { call, put } from 'redux-saga/effects';
import Api from '../Api';
import {
  createThreadRequest,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE,
  getThreadRequest,
  GET_THREAD_FAILURE,
  GET_THREAD_SUCCESS
} from '../store/threads/types';
import { thread } from './normalizrEntities';
import { normalize } from 'normalizr';
import { createThreadSuccess } from '../store/threads/actions';
import { threadInitLoading } from '../store/threads/reducers';
import { UPDATE_THREAD_TEXT_SUCCESS } from '../store/threads/types';
import {
  updateThreadTextRequest,
  UPDATE_THREAD_TEXT_FAILURE
} from '../store/threads/types';

export function* createThread({ payload, callBack }: createThreadRequest) {
  try {
    const {
      data: { thread }
    } = yield call(Api.threads.createThread, payload);
    yield put(createThreadSuccess({ ...thread, loading: threadInitLoading }));
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
    yield put({
      type: GET_THREAD_FAILURE,
      payload: { error: error.message }
    });
  }
}

export function* updateThread(action: updateThreadTextRequest) {
  try {
    const { data } = yield call(Api.threads.updateThreadText, action.payload);
    const { replies, threads } = normalize(data, { thread }).entities;
    yield put({
      type: UPDATE_THREAD_TEXT_SUCCESS,
      payload: {
        thread: threads[action.payload.thread_id],
        replies
      }
    });
  } catch (error) {
    yield put({
      type: UPDATE_THREAD_TEXT_FAILURE,
      payload: {
        error: error.message
      }
    });
  }
}
