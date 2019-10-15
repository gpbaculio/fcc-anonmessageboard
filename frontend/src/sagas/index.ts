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
import * as Boards_Sagas from './boards';
import * as Threads_Sagas from './threads';
import {
  CREATE_REPLY_REQUEST,
  UPDATE_REPLY_TEXT_REQUEST
} from '../store/replies/types';
import * as Replies_Sagas from './replies';
import {
  DELETE_REPLY_REQUEST,
  REPORT_REPLY_REQUEST
} from '../store/replies/types';
import { REPORT_THREAD_REQUEST } from '../store/threads/types';
import {
  UPDATE_THREAD_TEXT_REQUEST,
  DELETE_THREAD_REQUEST
} from '../store/threads/types';

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(REPORT_REPLY_REQUEST, Replies_Sagas.report_reply);
  yield takeEvery(REPORT_THREAD_REQUEST, Threads_Sagas.report_thread);
  yield takeEvery(DELETE_REPLY_REQUEST, Replies_Sagas.deleteReply);
  yield takeEvery(UPDATE_REPLY_TEXT_REQUEST, Replies_Sagas.updateReplyText);
  yield takeEvery(DELETE_THREAD_REQUEST, Threads_Sagas.deleteThreadSaga);
  yield takeEvery(UPDATE_THREAD_TEXT_REQUEST, Threads_Sagas.updateThread);
  yield takeEvery(FETCH_BOARD_REQUEST, Boards_Sagas.fetchBoard);
  yield takeEvery(CREATE_BOARD_REQUEST, Boards_Sagas.createBoard);
  yield takeEvery(FETCH_BOARDS_REQUEST, Boards_Sagas.fetchBoards);
  yield takeEvery(CREATE_THREAD_REQUEST, Threads_Sagas.createThread);
  yield takeEvery(CREATE_REPLY_REQUEST, Replies_Sagas.createReply);
  yield takeEvery(GET_THREAD_REQUEST, Threads_Sagas.getThread);
  yield takeEvery(UPDATE_NAME_REQUEST, Boards_Sagas.updateName);
  yield takeEvery(DELETE_BOARD_REQUEST, Boards_Sagas.deleteBoard);
}
