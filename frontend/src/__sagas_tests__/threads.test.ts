import { call, put, take } from 'redux-saga/effects';
import { expectSaga, SagaType, RunResult } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import uuidv1 from 'uuid/v1';

import Api, { createBoardArgs, updateNameArgs, createThreadArgs } from '../Api';
import boardsSagas from '../sagas/boards';
import * as threadsSagas from '../sagas/threads';
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
import {
  createboardSuccess,
  createBoard,
  updateName,
  updateNameSuccess
} from '../store/boards/actions';
import { AxiosResponse } from 'axios';
import { combineReducers } from 'redux';
import { createThread, createThreadSuccess } from '../store/threads/actions';
import { BoardTypeResponse } from './boards.test';

export class ThreadTypeResponse {
  board_id: string;
  bumped_on: string;
  created_on: string;
  replies: string[];
  reported: boolean;
  text: string;
  updated_on: string;
  _id: string;

  constructor(params: {
    text?: string;
    delete_password?: string;
    board_id: string;
  }) {
    const genId = uuidv1();
    const genDelPass = uuidv1();
    const dateNow = new Date().toISOString();
    this.board_id = params.board_id;
    this.bumped_on = dateNow;
    this.created_on = dateNow;
    this.replies = [];
    this.reported = false;
    this.text = params.text || 'CREATE BOARD TEST';
    this.updated_on = dateNow;
    this._id = genId;
  }
}
describe.only('Boards Sagas', () => {
  it('should create board', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    const createThreadArgs: createThreadArgs = {
      board_id: mockBoard._id,
      text: 'CREATE THREAD TEST',
      delete_password: uuidv1()
    };
    const mockThread = new ThreadTypeResponse({
      text: 'CREATE THREAD TEST',
      delete_password: uuidv1(),
      board_id: mockBoard._id
    });
    const result = await expectSaga(
      threadsSagas.createThread as SagaType,
      // dispatch initial action it wants to test
      // with the mockBoard since we have it on initial state of this test
      createThread(createThreadArgs)
    )
      .withReducer(
        // mimic reducer form
        combineReducers({
          boards: boardsReducer,
          threads: threadsReducer
        }),
        // initial state of boards
        {
          boards: {
            ...boardsInitState,
            // assign the mock board on boards reducer
            // with initial loading end error state
            boards: {
              ...boardsInitState.boards,
              [mockBoard._id]: {
                ...mockBoard,
                loading: boardInitLoading,
                error: boardInitError
              }
            }
          },
          threads: threadsInitState
        }
      )
      // Mock the response from API
      .provide({
        call: (effect, next) => {
          // Check for the API call to return fake value
          if (effect.fn === Api.threads.createThread) {
            return { data: { thread: mockThread } };
          }
          // Allow Redux Saga to handle other `call` effects
          return next();
        }
      })
      .put(createThreadSuccess(mockThread))
      .silentRun();
    console.log('result 1 ', result.storeState.boards.boards[mockBoard._id]);

    // expect board on state to include thread id of thread created
    expect(
      result.storeState.boards.boards[mockBoard._id].threads
    ).toContainEqual(mockThread._id);

    // // load should be false
    // expect(storeState.boards.loading.createBoard).toEqual(false);
    // // id of board on boards property
    // expect(storeState.boards.boards).toHaveProperty(mockBoard._id);
    // // loading and error prop is not on axios response since we use it for UI effects
    // expect(storeState.boards.boards[mockBoard._id]).toEqual({
    //   ...mockBoard,
    //   loading: boardInitLoading,
    //   error: boardInitError
    // });
  });
});
