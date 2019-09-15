jest.mock('../Api');
import Api, { createThreadArgs, createReplyArgs } from '../Api';
import * as repliesSagas from '../sagas/replies';
import * as repliesActions from '../store/replies/actions';
import uuidv1 from 'uuid/v1';
import { BoardLoadingType, BoardErrorType } from '../store/boards/types';
import { recordSaga } from './utils';
import { AxiosResponse } from 'axios';
import { Saga } from 'redux-saga';

describe.only('Replies Sagas', () => {
  class AxiosResponseErrorType extends Error {
    response: {
      data: string;
    };
    constructor(data: string) {
      super(data);
      this.response = {
        data
      };
    }
  }

  type RepliesSagasKeys = 'createReply';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  Object.keys(Api.boards).forEach((k: string) => {
    Api.replies[k as RepliesSagasKeys] = jest.fn();
  });

  class Board {
    created_on: string;
    name: string;
    threads: string[];
    updated_on: string;
    _id: string;
    delete_password: string;
    loading: BoardLoadingType;
    error: BoardErrorType;
    constructor() {
      this.created_on = this.now();
      this.name = 'TEST BOARD NAME';
      this.threads = [];
      this.updated_on = this.now();
      this._id = this.genUuidV1();
      this.delete_password = this.genUuidV1();
      this.loading = {
        update_name: false
      };
      this.error = {
        update_name: ''
      };
    }
    genUuidV1 = () => uuidv1();
    now = () => new Date().toISOString();
  }
  class Thread {
    reported: boolean;
    replies: string[];
    _id: string;
    board_id: string;
    text: string;
    bumped_on: string;
    created_on: string;
    updated_on: string;
    delete_password: string;
    constructor(params: {
      board_id: string;
      text?: string;
      delete_password?: string;
    }) {
      this.reported = false;
      this.replies = [];
      this._id = this.genUuidV1();
      this.board_id = params.board_id;
      this.text = params.text || 'THREAD TEXT TEST';
      this.bumped_on = this.now();
      this.created_on = this.now();
      this.updated_on = this.now();
      this.delete_password = params.delete_password || this.genUuidV1();
    }
    genUuidV1 = () => uuidv1();
    now = () => new Date().toISOString();
  }
  class Reply {
    created_on: string;
    delete_password: string;
    reported: boolean;
    text: string;
    thread_id: string;
    updated_on: string;
    _id: string;
    constructor(params: {
      thread_id: string;
      text?: string;
      delete_password?: string;
    }) {
      this.delete_password = params.delete_password || this.genUuidV1();
      this.reported = false;
      this.text = params.text || 'REPLY TEXT TEST';
      this.thread_id = params.thread_id;
      this.created_on = this.now();
      this.updated_on = this.now();
      this._id = this.genUuidV1();
    }
    genUuidV1 = () => uuidv1();
    now = () => new Date().toISOString();
  }

  it('should create reply on thread', async () => {
    const createMockThreadArgs = {
      text: 'CREATE MOCK THREAD TEXT',
      delete_password: uuidv1()
    };
    const createMockReplyArgs = {
      text: 'CREATE MOCK REPLY TEXT',
      delete_password: uuidv1()
    };
    const mockBoard = new Board();
    //called outside to reference thread on success
    const mockThread = new Thread({
      board_id: mockBoard._id,
      ...createMockThreadArgs
    });
    // add thread id
    mockBoard.threads = [...mockBoard.threads, mockThread._id];

    const mockReply = new Reply({
      thread_id: mockThread._id,
      text: createMockReplyArgs.text,
      delete_password: createMockReplyArgs.delete_password
    });
    // add reply id
    mockThread.replies = [...mockThread.replies, mockReply._id];

    (Api.replies.createReply as jest.Mock).mockImplementation(
      (_params: createReplyArgs) =>
        Promise.resolve({
          data: {
            reply: mockReply
          }
        }) as Promise<AxiosResponse<any>>
    );

    const dispatched = await recordSaga(
      repliesSagas.createReply as Saga,
      repliesActions.createReply({
        board_id: mockBoard._id,
        thread_id: mockThread._id,
        ...createMockReplyArgs
      })
    );
    expect(Api.replies.createReply).toHaveBeenCalledWith({
      board_id: mockBoard._id,
      thread_id: mockThread._id,
      ...createMockReplyArgs
    });
    expect(dispatched).toContainEqual(
      repliesActions.createReplySuccess(mockReply)
    );
    // created thread id property should be on board threads array
    expect(mockThread.replies).toContain(mockReply._id);
    // // created thread board_id property should reference if of its board
    expect(mockReply.thread_id).toEqual(mockThread._id);
  });
});
