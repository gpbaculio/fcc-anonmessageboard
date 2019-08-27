import { takeEvery } from 'redux-saga/effects';
import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST
} from '../store/boards/types';
import { CREATE_THREAD_REQUEST } from '../store/threads/types';
import { createBoard, fetchBoards } from './boards';
import { createThread } from './threads';

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(CREATE_BOARD_REQUEST, createBoard);
  yield takeEvery(FETCH_BOARDS_REQUEST, fetchBoards);
  yield takeEvery(CREATE_THREAD_REQUEST, createThread);
}
