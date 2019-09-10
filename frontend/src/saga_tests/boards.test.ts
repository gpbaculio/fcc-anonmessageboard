jest.mock('../Api');
import Api from '../Api';
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
      _id: uuidv1()
    };

    const getCreatedMockBoard = (name: string) => ({
      created_on: mockBoardData.date,
      name,
      threads: [],
      updated_on: mockBoardData.date,
      _id: mockBoardData._id
    });

    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          data: { board: getCreatedMockBoard(mockBoardData.name) }
        }) as Promise<AxiosResponse<any>>
    );

    const dispatched = await recordSaga(
      boardsSagas.createBoard as Saga,
      BoardsActions.createBoard(mockBoardData.name)
    );

    expect(Api.boards.createBoard).toHaveBeenCalledWith(mockBoardData.name);
    expect(dispatched).toContainEqual(
      BoardsActions.createBoardSuccess(getCreatedMockBoard(mockBoardData.name))
    );
  });
  it('should fail to create board', async () => {
    const mockBoardName = 'REJECT CREATE BOARD TEST';
    const errorText = 'Something went wrong';
    const errorResponse = new AxiosResponseErrorType(errorText);
    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () => Promise.reject(errorResponse) as Promise<AxiosResponse<any>>
    );

    const dispatched = await recordSaga(
      boardsSagas.createBoard as Saga,
      BoardsActions.createBoard(mockBoardName)
    );

    expect(Api.boards.createBoard).toHaveBeenCalledWith(mockBoardName);
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
      _id
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
