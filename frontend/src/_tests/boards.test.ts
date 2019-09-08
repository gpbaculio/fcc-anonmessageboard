jest.mock('../Api');
import Api from '../Api';
import boardsSagas from '../sagas/boards';
import { runSaga, Saga } from 'redux-saga';
import { AnyAction } from 'redux';
import uuidv1 from 'uuid/v1';
import { recordSaga } from './utils';
import { AxiosResponse } from 'axios';
import * as BoardsActions from '../store/boards/actions';

describe.only('Boards Sagas', () => {
  type BoadsSagasKeys = 'createBoard' | 'getBoards' | 'fetchBoard';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  Object.keys(Api.boards).forEach((k: string) => {
    Api.boards[k as BoadsSagasKeys] = jest.fn();
  });

  it('should createBoard', async () => {
    const mockBoardData = {
      date: new Date().toISOString(),
      name: 'ADD BOARD TEST',
      _id: uuidv1()
    };

    const getMockBoard = (name: string) => ({
      created_on: mockBoardData.date,
      name,
      threads: [],
      updated_on: mockBoardData.date,
      _id: mockBoardData._id
    });
    (Api.boards.createBoard as jest.Mock).mockImplementation(
      () =>
        Promise.resolve({
          data: { board: getMockBoard(mockBoardData.name) }
        }) as Promise<AxiosResponse<any>>
    );
    const res = BoardsActions.createBoard(mockBoardData.name);
    const dispatched = await recordSaga(boardsSagas.createBoard as Saga, res);

    expect(Api.boards.createBoard).toHaveBeenCalledWith(mockBoardData.name);
    expect(dispatched).toContainEqual(
      BoardsActions.createBoardSuccess(getMockBoard(mockBoardData.name))
    );
  });
});
