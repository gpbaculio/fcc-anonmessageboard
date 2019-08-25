import { takeEvery, call, put } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import Api from '../Api';
import {
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  FETCH_BOARDS_REQUEST,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE
} from '../store/boards/types';
import { AnyAction } from 'redux';

export function* createBoard(action: AnyAction) {
  try {
    const {
      data: { board }
    } = yield call(Api.boards.createBoard, action.payload.name);
    yield put({ type: CREATE_BOARD_SUCCESS, payload: { board } });
  } catch (error) {
    yield put({ type: CREATE_BOARD_FAILURE, payload: { error } });
  }
}

export function* fetchBoards() {
  try {
    const { data } = yield call(Api.boards.getBoards);
    const board = new schema.Entity('boards', {}, { idAttribute: '_id' });
    const { boards } = normalize(data.boards, [board]).entities;
    yield put({ type: FETCH_BOARDS_SUCCESS, payload: { boards } });
  } catch (error) {
    yield put({ type: FETCH_BOARDS_FAILURE, payload: { error } });
  }
}

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(CREATE_BOARD_REQUEST, createBoard);
  yield takeEvery(FETCH_BOARDS_REQUEST, fetchBoards);
}
