jest.mock('../Api');
import Api, { updateNameArgs } from '../Api';
import boardsSagas from '../sagas/boards';
import { Saga } from 'redux-saga';
import uuidv1 from 'uuid/v1';
import { recordSaga } from './utils';
import Axios, { AxiosResponse } from 'axios';
import * as BoardsActions from '../store/boards/actions';
import { normalize } from 'normalizr';
import { board } from '../sagas/normalizrEntities';
import { BoardLoadingType, BoardErrorType } from '../store/boards/types';
import boardsReducer from '../store/boards/reducers';
import threadsReducer from '../store/threads/reducers';
import repliesReducer from '../store/replies/reducers';

describe.only('Boards Sagas', () => {
  class AxiosResponseErrorType extends Error {
    response: {
      data: string;
    };
    constructor(data: string) {
      super(data);
      this.response = {
        data: new Error(data).message
      };
    }
  }
  class AxiosResponseBoardType {
    board: {
      [prop: string]: string | string[] | BoardLoadingType | BoardErrorType;
      created_on: string;
      name: string;
      threads: string[];
      updated_on: string;
      _id: string;
      delete_password: string;
      loading: BoardLoadingType;
      error: BoardErrorType;
    };
    constructor(params: {
      name?: string;
      delete_password?: string;
      _id?: string;
    }) {
      this.board = {
        created_on: this.now(),
        name: params.name || 'TEST BOARD NAME',
        threads: [],
        updated_on: this.now(),
        _id: params._id || this.genUuidV1(),
        delete_password: params.delete_password || this.genUuidV1(),
        loading: {
          update_name: false
        },
        error: {
          update_name: ''
        }
      };
    }
    genUuidV1 = () => uuidv1();
    now = () => new Date().toISOString();
  }

  type BoardsSagasKeys = 'createBoard' | 'getBoards' | 'fetchBoard';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  Object.keys(Api.boards).forEach((k: string) => {
    Api.boards[k as BoardsSagasKeys] = jest.fn();
  });

  it('should createBoard', async () => {
    const createBoardArgs = {
      boardName: 'BoardName Test',
      deletePassword: 'abcd123'
    };
    const mockBoard = new AxiosResponseBoardType({
      name: createBoardArgs.boardName,
      delete_password: createBoardArgs.deletePassword
    });
    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () => Promise.resolve({ data: mockBoard }) as Promise<AxiosResponse<any>>
    );
    const dispatched = await recordSaga(
      boardsSagas.createBoard as Saga,
      BoardsActions.createBoard(
        createBoardArgs.boardName,
        createBoardArgs.deletePassword
      )
    );
    expect(Api.boards.createBoard).toHaveBeenCalledWith({
      name: createBoardArgs.boardName,
      delete_password: createBoardArgs.deletePassword
    });
    expect(dispatched).toContainEqual(
      BoardsActions.createboardSuccess(mockBoard.board)
    );
  });
  it('should fail to update board name', async () => {
    const updateBoardNameArgs = {
      boardName: 'BoardName Test',
      deletePassword: 'abcd123',
      boardId: uuidv1()
    };
    (Api.boards.updateName as jest.Mock).mockImplementation(
      ({ board_id, board_name, delete_password }) => {
        if (updateBoardNameArgs.deletePassword === delete_password) {
          return Promise.resolve({
            data: new AxiosResponseBoardType({
              name: board_name,
              delete_password: delete_password,
              _id: board_id
            })
          }) as Promise<AxiosResponse<any>>;
        } else {
          return Promise.reject(
            new AxiosResponseErrorType('Invalid Delete Password')
          ) as Promise<AxiosResponse<any>>;
        }
      }
    );

    const dispatched = await recordSaga(
      boardsSagas.updateName as Saga,
      BoardsActions.updateName({
        board_id: updateBoardNameArgs.boardId,
        board_name: updateBoardNameArgs.boardName,
        delete_password: 'wrongPassowrd'
      })
    );
    expect(Api.boards.updateName).toHaveBeenCalledWith({
      board_id: updateBoardNameArgs.boardId,
      board_name: updateBoardNameArgs.boardName,
      delete_password: 'wrongPassowrd'
    });
    expect(dispatched).toContainEqual(
      BoardsActions.updateNameFailure(
        'Invalid Delete Password',
        updateBoardNameArgs.boardId
      )
    );
  });
  it('should update board name', async () => {
    const updateBoardNameArgs = {
      boardName: 'BoardName Test',
      deletePassword: 'abcd123',
      boardId: uuidv1()
    };
    const mockBoard = new AxiosResponseBoardType({
      name: updateBoardNameArgs.boardName,
      delete_password: updateBoardNameArgs.deletePassword,
      _id: updateBoardNameArgs.boardId
    });
    (Api.boards.updateName as jest.Mock).mockImplementation(
      ({ delete_password }) => {
        if (updateBoardNameArgs.deletePassword === delete_password) {
          return Promise.resolve({
            data: mockBoard
          }) as Promise<AxiosResponse<any>>;
        } else {
          return Promise.reject(
            new AxiosResponseErrorType('Invalid Delete Password')
          ) as Promise<AxiosResponse<any>>;
        }
      }
    );

    const dispatched = await recordSaga(
      boardsSagas.updateName as Saga,
      BoardsActions.updateName({
        board_id: updateBoardNameArgs.boardId,
        board_name: updateBoardNameArgs.boardName,
        delete_password: updateBoardNameArgs.deletePassword
      })
    );
    expect(Api.boards.updateName).toHaveBeenCalledWith({
      board_id: updateBoardNameArgs.boardId,
      board_name: updateBoardNameArgs.boardName,
      delete_password: updateBoardNameArgs.deletePassword
    });
    expect(dispatched).toContainEqual(
      BoardsActions.updateNameSuccess(mockBoard.board)
    );
  });
  it('should fail to create board', async () => {
    const mockBoardData = {
      name: 'REJECT CREATE BOARD TEST',
      delete_password: 'abcd123'
    };

    const errorResponse = new AxiosResponseErrorType('Something went wrong');
    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () => Promise.reject(errorResponse) as Promise<AxiosResponse<any>>
    );

    const dispatched = await recordSaga(
      boardsSagas.createBoard as Saga,
      BoardsActions.createBoard(
        mockBoardData.name,
        mockBoardData.delete_password
      )
    );

    expect(Api.boards.createBoard).toHaveBeenCalledWith({
      name: mockBoardData.name,
      delete_password: mockBoardData.delete_password
    });
    expect(dispatched).toContainEqual(
      BoardsActions.createBoardFailure(errorResponse.response.data)
    );
  });
  it('should fetch board', async () => {
    const mockBoard = new AxiosResponseBoardType({
      _id: uuidv1()
    });

    (Api.boards.fetchBoard as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          data: mockBoard
        }) as Promise<AxiosResponse<any>>
    );
    const { boards, threads, replies } = normalize(mockBoard, {
      board
    }).entities;
    const dispatched = await recordSaga(
      boardsSagas.fetchBoard as Saga,
      BoardsActions.fetchBoard(mockBoard.board._id)
    );
    expect(Api.boards.fetchBoard).toHaveBeenCalledWith(mockBoard.board._id);
    expect(dispatched).toContainEqual(
      BoardsActions.fetchBoardSuccess({ boards, threads, replies })
    );
  });
});
