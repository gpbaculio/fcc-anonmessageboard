import { CREATE_THREAD_REQUEST } from './types';
import { createThreadArgs } from '../../Api';

export const createThread = ({
  board_id,
  text,
  delete_password
}: createThreadArgs) => ({
  type: CREATE_THREAD_REQUEST,
  payload: { board_id, text, delete_password }
});
