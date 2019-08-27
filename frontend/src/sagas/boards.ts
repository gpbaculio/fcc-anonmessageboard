import { call, put } from 'redux-saga/effects';
import { normalize, schema } from 'normalizr';
import Api from '../Api';
import {
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  createBoardRequest
} from '../store/boards/types';

export function* createBoard(action: createBoardRequest) {
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
    const thread = new schema.Entity('threads', {}, { idAttribute: '_id' });
    const board = new schema.Entity(
      'boards',
      { threads: [thread] },
      { idAttribute: '_id' }
    );
    const { boards, threads } = normalize(data, { boards: [board] }).entities;
    yield put({
      type: FETCH_BOARDS_SUCCESS,
      payload: { boards }
    });
    yield put({
      type: FETCH_BOARDS_SUCCESS,
      payload: { threads }
    });
  } catch (error) {
    yield put({ type: FETCH_BOARDS_FAILURE, payload: { error } });
  }
}
