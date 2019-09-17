import { expectSaga, SagaType, RunResult } from 'redux-saga-test-plan';
import uuidv1 from 'uuid/v1';

import Api, { createBoardArgs, updateNameArgs } from '../Api';
import boardsSagas from '../sagas/boards';
import boardsReducer, {
  boardInitLoading,
  boardInitError,
  boardsInitState
} from '../store/boards/reducers';

import { BoardLoadingType, BoardErrorType } from '../store/boards/types';
import {
  createboardSuccess,
  createBoard,
  updateName,
  updateNameSuccess
} from '../store/boards/actions';
import { combineReducers } from 'redux';

export class BoardTypeResponse {
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
    const genId = uuidv1();
    const genDelPass = uuidv1();
    const dateNow = new Date().toISOString();
    this.created_on = dateNow;
    this.name = params.name || 'TEST BOARD NAME';
    this.threads = [];
    this.updated_on = dateNow;
    this._id = params._id || genId;
    this.delete_password = params.delete_password || genDelPass;
    this.loading = {
      update_name: false
    };
    this.error = {
      update_name: ''
    };
  }
}

describe.only('Boards Sagas', () => {
  it('should create board', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    const { storeState } = await expectSaga(
      boardsSagas.createBoard as SagaType,
      // dispatch initial action it wants to test
      createBoard('CREATE BOARD TEST', 'abcd123')
    )
      .withReducer(
        // mimic reducer form
        combineReducers({
          boards: boardsReducer
        })
      )
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
      .put(
        createboardSuccess({
          ...mockBoard,
          loading: boardInitLoading,
          error: boardInitError
        })
      )
      .silentRun();
    // load should be false
    expect(storeState.boards.loading.createBoard).toEqual(false);
    // id of board on boards property
    expect(storeState.boards.boards).toHaveProperty(mockBoard._id);
    // loading and error prop is not on axios response since we use it for UI effects
    expect(storeState.boards.boards[mockBoard._id]).toEqual({
      ...mockBoard,
      loading: boardInitLoading,
      error: boardInitError
    });
  });
  it('should update board name', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    // create constant of args for updateName params to reference on test
    const updateNameArgs: updateNameArgs = {
      // use mockBoard id cause we use it for withReducer
      board_id: mockBoard._id,
      board_name: `UPDATED ${mockBoard.name}`,
      // delete password must match delete password of board to succeed
      delete_password: mockBoard.delete_password
    };
    const { storeState } = await expectSaga(
      boardsSagas.updateName as SagaType,
      // initial dispatch to test
      updateName(updateNameArgs)
    )
      .withReducer(
        // mimic reducer form
        combineReducers({
          boards: boardsReducer
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
          }
        }
      )
      .provide({
        call: (effect, next) => {
          // Check for the API call to return
          // fake board with updated name
          if (effect.fn === Api.boards.updateName) {
            return {
              data: {
                // reference updateNameArgs
                board: { ...mockBoard, name: updateNameArgs.board_name }
              }
            };
          }
          // Allow Redux Saga to handle other `call` effects
          return next();
        }
      })
      .put(
        // reference updateNameArgs assuming the operation succeeds
        updateNameSuccess({ ...mockBoard, name: updateNameArgs.board_name })
      )
      .run();

    // load of update name on specific board should be false
    expect(storeState.boards.boards[mockBoard._id].loading.update_name).toEqual(
      false
    );
    // board on state should contain updated name
    expect(storeState.boards.boards[mockBoard._id]).toEqual({
      ...mockBoard,
      name: updateNameArgs.board_name,
      loading: boardInitLoading,
      error: boardInitError
    });
  });
});
