import { CREATE_BOARD_REQUEST } from '../../sagas/types';

export const login = (name: string) => {
  console.log('boards actions login');
  return {
    type: CREATE_BOARD_REQUEST,
    payload: { name }
  };
};
