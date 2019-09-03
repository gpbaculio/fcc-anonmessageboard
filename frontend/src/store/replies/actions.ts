import { CREATE_REPLY_REQUEST } from './types';
import { createReplyArgs } from '../../Api';

export const createReply = ({
  board_id,
  text,
  delete_password,
  thread_id
}: createReplyArgs) => ({
  type: CREATE_REPLY_REQUEST,
  payload: { board_id, text, delete_password, thread_id }
});
