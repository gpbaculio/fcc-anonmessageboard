jest.mock('../Api');
import Api, { createThreadArgs } from '../Api';
import * as threadsSagas from '../sagas/threads';
import * as threadsActions from '../store/threads/actions';
import uuidv1 from 'uuid/v1';
import { BoardLoadingType, BoardErrorType } from '../store/boards/types';
import { recordSaga } from './utils';
import { AxiosResponse } from 'axios';
import { Saga } from 'redux-saga';

describe.only('Boards Sagas', () => {
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

  type ThreadsSagasKeys = 'createThread' | 'getThread';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  Object.keys(Api.boards).forEach((k: string) => {
    Api.threads[k as ThreadsSagasKeys] = jest.fn();
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
    private delete_password: string;
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

  it('should create thread on board', async () => {
    const createMockThreadArgs = {
      text: 'CREATE MOCK THREAD TEXT',
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
    (Api.threads.createThread as jest.Mock).mockImplementation(
      (_createBoardArgs: createThreadArgs) =>
        Promise.resolve({
          data: {
            thread: mockThread
          }
        }) as Promise<AxiosResponse<any>>
    );
    const dispatched = await recordSaga(
      threadsSagas.createThread as Saga,
      threadsActions.createThread({
        board_id: mockBoard._id,
        ...createMockThreadArgs
      })
    );
    expect(Api.threads.createThread).toHaveBeenCalledWith({
      board_id: mockBoard._id,
      ...createMockThreadArgs
    });
    expect(dispatched).toContainEqual(
      threadsActions.createThreadSuccess(mockThread)
    );
    // created thread id property should be on board threads array
    expect(mockBoard.threads).toContain(mockThread._id);
    // created thread board_id property should reference if of its board
    expect(mockThread.board_id).toEqual(mockBoard._id);
  });
});
