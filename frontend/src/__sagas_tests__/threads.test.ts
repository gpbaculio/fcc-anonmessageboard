import { expectSaga, SagaType } from 'redux-saga-test-plan';
import uuidv1 from 'uuid/v1';

import Api, { createBoardArgs, createThreadArgs } from '../Api';
import * as threadsSagas from '../sagas/threads';
import boardsReducer, {
  boardInitLoading,
  boardInitError,
  boardsInitState
} from '../store/boards/reducers';

import threadsReducer, { threadsInitState } from '../store/threads/reducers';
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
describe.only('Threads Sagas', () => {
  it('should create thread on board', async () => {
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
    const mockThread = new ThreadTypeResponse(createThreadArgs);
    const { storeState } = await expectSaga(
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

    // expect board on state to include thread id of thread created
    expect(storeState.boards.boards[mockBoard._id].threads).toContainEqual(
      mockThread._id
    );

    // load should be false
    expect(storeState.threads.loading.createThread).toEqual(false);
    // id of thread should be on threads property
    expect(storeState.threads.threads).toHaveProperty(mockThread._id);
    // check thread on threads
    expect(storeState.threads.threads[mockThread._id]).toEqual(mockThread);
  });
});
