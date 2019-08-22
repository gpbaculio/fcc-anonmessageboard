import { takeEvery, call, put } from 'redux-saga/effects';
import Api from '../Api';
import {
  BoardActionTypes,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE
} from './types';

export function* createBoard(action: BoardActionTypes) {
  console.log('createBoardSAGA');
  try {
    const data = yield call(Api.boards.createBoard, action.payload.name);
    console.log('createBoard action', action);
    console.log('createBoard data', data);
    yield put({ type: CREATE_BOARD_SUCCESS, data });
  } catch (error) {
    yield put({ type: CREATE_BOARD_FAILURE, error });
  }
}

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(CREATE_BOARD_REQUEST, createBoard);
}
