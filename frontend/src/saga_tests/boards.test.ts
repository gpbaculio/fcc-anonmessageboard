jest.mock('../Api');
import Api, { updateNameArgs } from '../Api';
import boardsSagas from '../sagas/boards';
import { Saga } from 'redux-saga';
import uuidv1 from 'uuid/v1';
import { recordSaga } from './utils';
import { AxiosResponse } from 'axios';
import * as BoardsActions from '../store/boards/actions';
import { normalize } from 'normalizr';
import { board } from '../sagas/normalizrEntities';

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

  type BoardsSagasKeys = 'createBoard' | 'getBoards' | 'fetchBoard';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  Object.keys(Api.boards).forEach((k: string) => {
    Api.boards[k as BoardsSagasKeys] = jest.fn();
  });

  it('should createBoard', async () => {
    const mockBoardData = {
      date: new Date().toISOString(),
      name: 'ADD BOARD TEST',
      _id: uuidv1(),
      delete_password: 'abcd123'
    };

    const getCreatedMockBoard = (name: string, delete_password: string) => ({
      created_on: mockBoardData.date,
      name,
      threads: [],
      updated_on: mockBoardData.date,
      _id: mockBoardData._id,
      delete_password,
      loading: {
        update_name: false
      },
      error: {
        update_name: ''
      }
    });

    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          data: {
            board: getCreatedMockBoard(
              mockBoardData.name,
              mockBoardData.delete_password
            )
          }
        }) as Promise<AxiosResponse<any>>
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
      BoardsActions.createboardSuccess(
        getCreatedMockBoard(mockBoardData.name, mockBoardData.delete_password)
      )
    );
  });
  it('should fail to update board name', async () => {
    const mockBoardData = {
      // delete_password prop as is real password
      date: new Date().toISOString(),
      name: 'ADD BOARD TEST',
      _id: uuidv1(),
      delete_password: 'abcd123'
    };

    const getUpdatedNameMockBoard = ({
      board_id,
      board_name,
      delete_password
    }: updateNameArgs) => ({
      created_on: mockBoardData.date,
      name: board_name,
      threads: [],
      updated_on: mockBoardData.date,
      _id: board_id,
      delete_password,
      loading: {
        update_name: false
      },
      error: {
        update_name: ''
      }
    });

    (Api.boards.updateName as jest.Mock).mockImplementation(
      ({ board_id, board_name, delete_password }) => {
        if (mockBoardData.delete_password === delete_password) {
          return Promise.resolve({
            data: {
              board: getUpdatedNameMockBoard({
                board_id,
                board_name,
                delete_password
              })
            }
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
        board_id: mockBoardData._id,
        board_name: mockBoardData.name,
        delete_password: 'wrongPassowrd'
      })
    );
    expect(Api.boards.updateName).toHaveBeenCalledWith({
      board_id: mockBoardData._id,
      board_name: mockBoardData.name,
      delete_password: 'wrongPassowrd'
    });
    expect(dispatched).toContainEqual(
      BoardsActions.updateNameFailure(
        'Invalid Delete Password',
        mockBoardData._id
      )
    );
  });
  it('should update board name', async () => {
    const mockBoardData = {
      date: new Date().toISOString(),
      name: 'ADD BOARD TEST',
      _id: uuidv1(),
      delete_password: 'abcd123'
    };

    const getUpdatedNameMockBoard = ({
      board_id,
      board_name,
      delete_password
    }: updateNameArgs) => ({
      created_on: mockBoardData.date,
      name: board_name,
      threads: [],
      updated_on: mockBoardData.date,
      _id: board_id,
      delete_password,
      loading: {
        update_name: false
      },
      error: {
        update_name: ''
      }
    });

    (Api.boards.updateName as jest.Mock).mockImplementation(
      ({ board_id, board_name, delete_password }) => {
        if (mockBoardData.delete_password === delete_password) {
          return Promise.resolve({
            data: {
              board: getUpdatedNameMockBoard({
                board_id,
                board_name,
                delete_password
              })
            }
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
        board_id: mockBoardData._id,
        board_name: mockBoardData.name,
        delete_password: mockBoardData.delete_password
      })
    );

    expect(Api.boards.updateName).toHaveBeenCalledWith({
      board_id: mockBoardData._id,
      board_name: mockBoardData.name,
      delete_password: mockBoardData.delete_password
    });
    expect(dispatched).toContainEqual(
      BoardsActions.updateNameSuccess(
        getUpdatedNameMockBoard({
          board_id: mockBoardData._id,
          board_name: mockBoardData.name,
          delete_password: mockBoardData.delete_password
        })
      )
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
    const mockBoardData = {
      date: new Date().toISOString(),
      name: 'FETCH BOARD TEST',
      _id: uuidv1()
    };
    const getFetchedMockBoard = (_id: string) => ({
      created_on: mockBoardData.date,
      name: mockBoardData.name,
      threads: [],
      updated_on: mockBoardData.date,
      _id,
      loading: {
        update_name: false
      },
      error: {
        update_name: ''
      }
    });
    const mockResponseData = { board: getFetchedMockBoard(mockBoardData._id) };
    (Api.boards.fetchBoard as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          data: mockResponseData
        }) as Promise<AxiosResponse<any>>
    );
    const { boards, threads, replies } = normalize(mockResponseData, {
      board
    }).entities;
    const dispatched = await recordSaga(
      boardsSagas.fetchBoard as Saga,
      BoardsActions.fetchBoard(mockBoardData._id)
    );
    expect(Api.boards.fetchBoard).toHaveBeenCalledWith(mockBoardData._id);
    expect(dispatched).toContainEqual(
      BoardsActions.fetchBoardSuccess({ boards, threads, replies })
    );
  });
});
