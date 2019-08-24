import { takeEvery, call, put } from 'redux-saga/effects';
import Api from '../Api';
import {
  BoardsActionTypes,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  createBoardRequest
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

// use them in parallel
export default function* rootSaga() {
  yield takeEvery(CREATE_BOARD_REQUEST, createBoard);
}
