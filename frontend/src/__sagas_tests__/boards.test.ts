import { call, put, take } from 'redux-saga/effects';
import { expectSaga, SagaType, RunResult } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import uuidv1 from 'uuid/v1';

import Api from '../Api';
import boardsSagas from '../sagas/boards';
import boardsReducer, {
  boardInitLoading,
  boardInitError,
  boardsInitState
} from '../store/boards/reducers';

import threadsReducer, { threadsInitState } from '../store/threads/reducers';
import repliesReducer, { repliesInitState } from '../store/replies/reducers';

import {
  BoardLoadingType,
  BoardErrorType,
  CREATE_BOARD_REQUEST,
  BoardsState
} from '../store/boards/types';
import { createboardSuccess, createBoard } from '../store/boards/actions';
import { AxiosResponse } from 'axios';
import { combineReducers } from 'redux';
class BoardTypeResponse {
  created_on: string;
  name: string;
  threads: string[];
  updated_on: string;
  _id: string;
  delete_password: string;
  loading: BoardLoadingType;
  error: BoardErrorType;

  constructor(params: {
    name?: string;
    delete_password?: string;
    _id?: string;
  }) {
    (this.created_on = this.now()),
      (this.name = params.name || 'TEST BOARD NAME'),
      (this.threads = []),
      (this.updated_on = this.now()),
      (this._id = params._id || this.genUuidV1()),
      (this.delete_password = params.delete_password || this.genUuidV1()),
      (this.loading = {
        update_name: false
      });
    this.error = {
      update_name: ''
    };
  }
  genUuidV1 = () => uuidv1();
  now = () => new Date().toISOString();
}
describe.only('Boards Sagas', () => {
  describe('handleFetchPostsRequest', () => {
    it('should create board', async () => {
      const createBoardArgs = {
        name: 'CREATE BOARD TEST',
        delete_password: 'abcd123'
      };
      const mockBoard = new BoardTypeResponse(createBoardArgs);
      const { storeState } = await expectSaga(
        boardsSagas.createBoard as SagaType,
        createBoard('CREATE BOARD TEST', 'abcd123')
      )
        .withReducer(boardsReducer)
        // Mock the response from API
        .provide({
          call: (effect, next) => {
            // Check for the API call to return fake value
            if (effect.fn === Api.boards.createBoard) {
              return { data: { board: mockBoard } };
            }
            // Allow Redux Saga to handle other `call` effects
            return next();
          }
        })
        // Dispatch the action that it wants to test
        .dispatch(createBoard('CREATE BOARD TEST', 'abcd123'))
        // Specify that it needs to call the API
        .call(Api.boards.createBoard, createBoardArgs)
        .put(
          createboardSuccess({
            ...mockBoard,
            loading: boardInitLoading,
            error: boardInitError
          })
        )
        .run();
      // load should be false
      expect(storeState.loading.createBoard).toEqual(false);
      // id of board on boards property
      expect(storeState.boards).toHaveProperty(mockBoard._id);
      // loading and error prop is not on axios response since we use it for UI effects
      expect(storeState.boards[mockBoard._id]).toEqual({
        ...mockBoard,
        loading: boardInitLoading,
        error: boardInitError
      });
    });
  });
});
