import { CREATE_REPLY_REQUEST, CREATE_REPLY_FAILURE } from './types';
import { createReplyArgs } from '../../Api';
import { ReplyType, CREATE_BOARD_SUCCESS } from '../boards/types';

export const createReply = ({
  board_id,
  text,
  delete_password,
  thread_id
}: createReplyArgs) => ({
  type: CREATE_REPLY_REQUEST,
  payload: { board_id, text, delete_password, thread_id }
});

export const createReplySuccess = (reply: ReplyType) => ({
  type: CREATE_BOARD_SUCCESS,
  payload: { reply }
});

export const createReplyFailure = (error: string) => ({
  type: CREATE_REPLY_FAILURE,
  payload: { error }
});
