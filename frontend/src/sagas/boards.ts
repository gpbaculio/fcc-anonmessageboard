import { call, put } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import Api from '../Api';
import {
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  createBoardRequest,
  fetchBoardRequest,
  FETCH_BOARD_FAILURE,
  updateNameRequest,
  BoardType
} from '../store/boards/types';
import { board } from './normalizrEntities';
import {
  createboardSuccess,
  createBoardFailure,
  fetchBoardSuccess,
  updateNameSuccess,
  updateNameFailure
} from '../store/boards/actions';
import { boardInitLoading, boardInitError } from '../store/boards/reducers';

export function* createBoard(action: createBoardRequest) {
  try {
    const {
      data: { board }
    } = yield call(Api.boards.createBoard, action.payload);

    yield put(
      createboardSuccess({
        ...board,
        loading: boardInitLoading,
        error: boardInitError
      })
    );
  } catch (error) {
    yield put(createBoardFailure(error.response.data));
  }
}

export function* updateName({ payload, callBack }: updateNameRequest) {
  try {
    const {
      data: { board }
    } = yield call(Api.boards.updateName, payload);
    yield put(updateNameSuccess(board));
    if (callBack) callBack();
  } catch (error) {
    yield put(updateNameFailure(error.response.data, payload.board_id));
  }
}

export function* fetchBoard(action: fetchBoardRequest) {
  try {
    const { data } = yield call(Api.boards.fetchBoard, action.payload.board_id);
    const { boards, threads, replies } = normalize(
      {
        board: {
          ...data.board,
          loading: boardInitLoading,
          error: boardInitError
        }
      },
      { board }
    ).entities;
    yield put(fetchBoardSuccess({ boards, threads, replies }));
  } catch (error) {
    yield put({ type: FETCH_BOARD_FAILURE, payload: { error: error.message } });
  }
}

export function* fetchBoards() {
  try {
    const { data } = yield call(Api.boards.getBoards);
    const { boards, threads, replies } = normalize(
      {
        boards: data.boards.map((b: BoardType) => ({
          ...b,
          loading: boardInitLoading,
          error: boardInitError
        }))
      },
      {
        boards: [board]
      }
    ).entities;
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

export default {
  createBoard,
  fetchBoard,
  fetchBoards,
  updateName
};
