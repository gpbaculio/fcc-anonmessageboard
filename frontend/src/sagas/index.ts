import { takeEvery } from 'redux-saga/effects';
import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARD_REQUEST,
  UPDATE_NAME_REQUEST
} from '../store/boards/types';
import {
  CREATE_THREAD_REQUEST,
  GET_THREAD_REQUEST
} from '../store/threads/types';
import { createBoard, fetchBoards, fetchBoard, updateName } from './boards';
import { createThread, getThread } from './threads';
import { CREATE_REPLY_REQUEST } from '../store/replies/types';
import { createReply } from './replies';

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(FETCH_BOARD_REQUEST, fetchBoard);
  yield takeEvery(CREATE_BOARD_REQUEST, createBoard);
  yield takeEvery(FETCH_BOARDS_REQUEST, fetchBoards);
  yield takeEvery(CREATE_THREAD_REQUEST, createThread);
  yield takeEvery(CREATE_REPLY_REQUEST, createReply);
  yield takeEvery(GET_THREAD_REQUEST, getThread);
  yield takeEvery(UPDATE_NAME_REQUEST, updateName);
}
