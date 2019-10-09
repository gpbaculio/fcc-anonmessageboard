import { expectSaga, SagaType } from 'redux-saga-test-plan';
import uuidv1 from 'uuid/v1';

import Api, { createBoardArgs, createThreadArgsType } from '../Api';
import * as RepliesSagas from '../sagas/replies';
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
import * as RepliesActions from '../store/replies/actions';
import { ReplyLoadingType, ReplyErrorType } from '../store/boards/types';
import { replyInitLoading, replyInitError } from '../store/replies/reducers';
import { threadInitLoading, threadInitError } from '../store/threads/reducers';

export class ReplyTypeResponse {
  created_on: string;
  delete_password: string;
  reported: boolean;
  text: string;
  thread_id: string;
  updated_on: string;
  _id: string;
  loading: ReplyLoadingType;
  error: ReplyErrorType;

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
    this.loading = replyInitLoading;
    this.error = replyInitError;
  }
}
describe.only('Replies Sagas', () => {
  it('should delete reply', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    // create mock board where you put thread
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    const createThreadArgs: createThreadArgsType = {
      // use mock board id to establish connection as foreign key
      board_id: mockBoard._id,
      text: 'CREATE THREAD TEST',
      delete_password: uuidv1()
    };
    // create mock thread
    const mockThread = new ThreadTypeResponse(createThreadArgs);

    const createReplyArgs = {
      delete_password: uuidv1(),
      text: 'CREATE REPLY TEXT',
      thread_id: mockThread._id
    };
    const mockReply = new ReplyTypeResponse(createReplyArgs);
    // the created mock Reply will be added on initial state
    // and will be used for delete test
    const deleteReplyArgs = {
      reply_id: mockReply._id,
      delete_password: mockReply.delete_password
    };
    const { storeState } = await expectSaga(
      RepliesSagas.deleteReply as SagaType,
      // initial dispatch to test
      RepliesActions.deleteReplyRequest(deleteReplyArgs)
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
                // add created thread on threads, we are using normalizr
                // for the state so a board will contain array of thread ids on threads prop
                // and refer to the state object with ids prop that has thread data
                threads: [mockThread._id],
                // loading and error prop for the UI
                loading: boardInitLoading,
                error: boardInitError
              }
            }
          },
          threads: {
            ...threadsInitState,
            threads: {
              ...threadsInitState.threads,
              // assign the created thread as it will be used to test
              [mockThread._id]: {
                ...mockThread,
                replies: [mockReply._id],
                loading: threadInitLoading,
                error: threadInitError
              }
            }
          },
          replies: {
            ...repliesInitState,
            replies: {
              ...repliesInitState.replies,
              // add mock reply on initial reducer
              [mockReply._id]: {
                ...mockReply,
                loading: replyInitLoading,
                error: replyInitError
              }
            }
          }
        }
      )
      .provide({
        call: (effect, next) => {
          // Check for the API call to return fake value
          if (effect.fn === Api.replies.deleteReply) {
            // mocking the provided argument delete password to match to delete as it is required in api
            //  effect.args = [ { reply_id, text, delete_password } ]
            if (mockReply.delete_password === effect.args[0].delete_password)
              return {
                // reference the argument text to assume successful operation
                data: { deletedReply: mockReply }
              };
            else return { data: 'Invalid Password' };
          }
          // Allow Redux Saga to handle other `call` effects
          return next();
        }
      })
      .put(RepliesActions.deleteReplySuccess(mockReply))
      .silentRun();
    // reply id on replies prop of thread should be removed
    expect(storeState.threads.threads[mockThread._id].replies).not.toContain(
      mockReply._id
    );
    // uses normalizr, should not contain reply property
    expect(storeState.replies.replies).not.toHaveProperty(mockReply._id);
  });
  it('should update reply text', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    // create mock board where you put thread
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    const createThreadArgs: createThreadArgsType = {
      // use mock board id to establish connection as foreign key
      board_id: mockBoard._id,
      text: 'CREATE THREAD TEST',
      delete_password: uuidv1()
    };
    // create mock thread
    const mockThread = new ThreadTypeResponse(createThreadArgs);

    const createReplyArgs = {
      delete_password: uuidv1(),
      text: 'CREATE REPLY TEXT',
      thread_id: mockThread._id
    };
    const mockReply = new ReplyTypeResponse(createReplyArgs);
    const updateReplyTextArgs = {
      reply_id: mockReply._id,
      text: 'UPDATED TEXT',
      delete_password: mockReply.delete_password
    };
    const { storeState } = await expectSaga(
      RepliesSagas.updateReplyText as SagaType,
      // initial dispatch to test
      RepliesActions.updateReplyTextRequest(updateReplyTextArgs)
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
                // add created thread on threads, we are using normalizr
                // for the state so a board will contain array of thread ids on threads prop
                // and refer to the state object with ids prop that has thread data
                threads: [mockThread._id],
                // loading and error prop for the UI
                loading: boardInitLoading,
                error: boardInitError
              }
            }
          },
          threads: {
            ...threadsInitState,
            threads: {
              ...threadsInitState.threads,
              // assign the created thread as it will be used to test
              [mockThread._id]: {
                ...mockThread,
                replies: [mockReply._id],
                loading: threadInitLoading,
                error: threadInitError
              }
            }
          },
          replies: {
            ...repliesInitState,
            replies: {
              ...repliesInitState.replies,
              // add mock reply on initial reducer
              [mockReply._id]: {
                ...mockReply,
                loading: replyInitLoading,
                error: replyInitError
              }
            }
          }
        }
      )
      // Mock the response from API
      .provide({
        call: (effect, next) => {
          // Check for the API call to return fake value
          if (effect.fn === Api.replies.updateReplyText) {
            // mocking the provided argument to match board to delete as it is required in api
            //  effect.args = [ { reply_id, text, delete_password } ]
            if (mockReply.delete_password === effect.args[0].delete_password)
              return {
                // reference the argument text to assume successful operation
                data: {
                  reply: { ...mockReply, text: updateReplyTextArgs.text }
                }
              };
            else return { data: 'Invalid Password' };
          }
          // Allow Redux Saga to handle other `call` effects
          return next();
        }
      })
      .put(
        RepliesActions.updateReplyTextSuccess({
          ...mockReply,
          text: updateReplyTextArgs.text
        })
      )
      .silentRun();
    // check if the reply on state matches the argument text assuming for successful operation
    expect(storeState.replies.replies[mockReply._id]).toEqual({
      ...mockReply,
      text: updateReplyTextArgs.text
    });
  });
  it('should create reply on thread', async () => {
    const createBoardArgs: createBoardArgs = {
      name: 'CREATE BOARD TEST',
      delete_password: 'abcd123'
    };
    const mockBoard = new BoardTypeResponse(createBoardArgs);
    const createThreadArgs: createThreadArgsType = {
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
      RepliesSagas.createReply as SagaType,
      // dispatch initial action it wants to test
      // with the mockBoard since we have it on initial state of this test
      RepliesActions.createReply({
        board_id: mockBoard._id,
        ...createReplyArgs
      })
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
      .put(RepliesActions.createReplySuccess(mockReply))
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
