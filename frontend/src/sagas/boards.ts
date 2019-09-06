import { call, put } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import Api from '../Api';
import {
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  createBoardRequest,
  fetchBoardRequest,
  FETCH_BOARD_SUCCESS,
  FETCH_BOARD_FAILURE
} from '../store/boards/types';
import { board } from './normalizrEntities';

export function* createBoard(action: createBoardRequest) {
  try {
    const {
      data: { board }
    } = yield call(Api.boards.createBoard, action.payload.name);
    yield put({ type: CREATE_BOARD_SUCCESS, payload: { board } });
  } catch (error) {
    yield put({
      type: CREATE_BOARD_FAILURE,
      payload: { error: error.message }
    });
  }
}

export function* fetchBoard(action: fetchBoardRequest) {
  try {
    const { data } = yield call(Api.boards.fetchBoard, action.payload.board_id);
    const { boards, threads, replies } = normalize(data, { board }).entities;
    yield put({
      type: FETCH_BOARD_SUCCESS,
      payload: { boards, threads, replies }
    });
  } catch (error) {
    yield put({ type: FETCH_BOARD_FAILURE, payload: { error: error.message } });
  }
}

export function* fetchBoards() {
  try {
    const { data } = yield call(Api.boards.getBoards);
    const { boards, threads, replies } = normalize(data, {
      boards: [board]
    }).entities;
    yield put({
      type: FETCH_BOARDS_SUCCESS,
      payload: { boards, threads, replies }
    });
  } catch (error) {
    yield put({
      type: FETCH_BOARDS_FAILURE,
      payload: { error: error.message }
    });
  }
}
