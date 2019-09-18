import { expectSaga, SagaType } from 'redux-saga-test-plan';
import uuidv1 from 'uuid/v1';

import Api, { createBoardArgs, createThreadArgs } from '../Api';
import * as repliesSagas from '../sagas/replies';
import boardsReducer, {
  boardInitLoading,
  boardInitError,
  boardsInitState
} from '../store/boards/reducers';

import threadsReducer, { threadsInitState } from '../store/threads/reducers';
import { combineReducers } from 'redux';
import { BoardTypeResponse } from './boards.test';
import { ThreadTypeResponse } from './threads.test';
import repliesReducer, { repliesInitState } from '../store/replies/reducers';
import { createReply, createReplySuccess } from '../store/replies/actions';

export class ReplyTypeResponse {
  created_on: string;
  delete_password: string;
  reported: boolean;
  text: string;
  thread_id: string;
  updated_on: string;
  _id: string;

  constructor(params: {
    delete_password?: string;
    text?: string;
    thread_id: string;
  }) {
    const genId = uuidv1();
    const genDelPass = uuidv1();
    const dateNow = new Date().toISOString();
    this.created_on = dateNow;
    this.delete_password = params.delete_password || genDelPass;
    this.reported = false;
    this.text = params.text || 'CREATE REPLY TEST';
    this.thread_id = params.thread_id;
    this.updated_on = dateNow;
    this._id = genId;
  }
}
describe.only('Replies Sagas', () => {
  it('should create reply on thread', async () => {
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
    //create thread to be owned by board
    const mockThread = new ThreadTypeResponse(createThreadArgs);
    const createReplyArgs = {
      delete_password: uuidv1(),
      text: 'CREATE REPLY TEXT',
      thread_id: mockThread._id
    };
    const mockReply = new ReplyTypeResponse(createReplyArgs);
    const { storeState } = await expectSaga(
      repliesSagas.createReply as SagaType,
      // dispatch initial action it wants to test
      // with the mockBoard since we have it on initial state of this test
      createReply({ board_id: mockBoard._id, ...createReplyArgs })
    )
      .withReducer(
        // mimic reducer form
        combineReducers({
          boards: boardsReducer,
          threads: threadsReducer,
          replies: repliesReducer
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
                // add as is thread is on board
                threads: [...mockBoard.threads, mockThread._id],
                loading: boardInitLoading,
                error: boardInitError
              }
            }
          },
          threads: {
            ...threadsInitState,
            threads: {
              ...threadsInitState.threads,
              // initial thread where we test for reply to be added
              [mockThread._id]: mockThread
            }
          },
          replies: repliesInitState
        }
      )
      .provide({
        call: (effect, next) => {
          // Check for the API call to return fake value
          if (effect.fn === Api.replies.createReply) {
            return { data: { reply: mockReply } };
          }
          // Allow Redux Saga to handle other `call` effects
          return next();
        }
      })
      .put(createReplySuccess(mockReply))
      .run();

    // expect thread with thread_id from created reply to contain reply id
    expect(storeState.threads.threads[mockThread._id].replies).toContainEqual(
      mockReply._id
    );
    // load should be false
    expect(storeState.replies.loading.createReply).toEqual(false);
    // id of created reply should be on replies property
    expect(storeState.replies.replies).toHaveProperty(mockReply._id);
    // check created reply on replies
    expect(storeState.replies.replies[mockReply._id]).toEqual(mockReply);
  });
});
