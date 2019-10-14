import { takeEvery } from 'redux-saga/effects';
import {
  CREATE_BOARD_REQUEST,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARD_REQUEST,
  UPDATE_NAME_REQUEST,
  DELETE_BOARD_REQUEST
} from '../store/boards/types';
import {
  CREATE_THREAD_REQUEST,
  GET_THREAD_REQUEST
} from '../store/threads/types';
import * as boardsSagas from './boards';
import * as threadsSagas from './threads';
import {
  CREATE_REPLY_REQUEST,
  UPDATE_REPLY_TEXT_REQUEST
} from '../store/replies/types';
import * as repliesSagas from './replies';
import { DELETE_REPLY_REQUEST } from '../store/replies/types';
import { REPORT_THREAD_REQUEST } from '../store/threads/types';
import {
  UPDATE_THREAD_TEXT_REQUEST,
  DELETE_THREAD_REQUEST
} from '../store/threads/types';

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(REPORT_THREAD_REQUEST, threadsSagas.report_thread);
  yield takeEvery(DELETE_REPLY_REQUEST, repliesSagas.deleteReply);
  yield takeEvery(UPDATE_REPLY_TEXT_REQUEST, repliesSagas.updateReplyText);
  yield takeEvery(DELETE_THREAD_REQUEST, threadsSagas.deleteThreadSaga);
  yield takeEvery(UPDATE_THREAD_TEXT_REQUEST, threadsSagas.updateThread);
  yield takeEvery(FETCH_BOARD_REQUEST, boardsSagas.fetchBoard);
  yield takeEvery(CREATE_BOARD_REQUEST, boardsSagas.createBoard);
  yield takeEvery(FETCH_BOARDS_REQUEST, boardsSagas.fetchBoards);
  yield takeEvery(CREATE_THREAD_REQUEST, threadsSagas.createThread);
  yield takeEvery(CREATE_REPLY_REQUEST, repliesSagas.createReply);
  yield takeEvery(GET_THREAD_REQUEST, threadsSagas.getThread);
  yield takeEvery(UPDATE_NAME_REQUEST, boardsSagas.updateName);
  yield takeEvery(DELETE_BOARD_REQUEST, boardsSagas.deleteBoard);
}
