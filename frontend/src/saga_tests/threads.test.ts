import Api from '../Api';
jest.mock('../Api');

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

  it('create thread on board', async () => {
    const mockThread = {
      created_on: '',
      name: '',
      threads: [],
      updated_on: '',
      _id: '',
      loading: {
        update_name: false
      },
      error: {
        update_name: false
      }
    };
  });
});
