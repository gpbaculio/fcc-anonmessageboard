import {
  CREATE_REPLY_REQUEST,
  CREATE_REPLY_FAILURE,
  CREATE_REPLY_SUCCESS,
  UPDATE_REPLY_TEXT_SUCCESS
} from './types';
import {
  createReplyArgsType,
  updateReplyTextParamsType,
  deleteReplyParamsType
} from '../../Api';
import { ReplyType, CREATE_BOARD_SUCCESS } from '../boards/types';
import { DELETE_REPLY_FAILURE } from './types';
import {
  RESET_REPLY_ERROR,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS
} from './types';
import {
  UPDATE_REPLY_TEXT_FAILURE,
  updateReplyTextRequestType,
  UPDATE_REPLY_TEXT_REQUEST
} from './types';

export const createReply = ({
  board_id,
  text,
  delete_password,
  thread_id
}: createReplyArgsType) => ({
  type: CREATE_REPLY_REQUEST,
  payload: { board_id, text, delete_password, thread_id }
});

export const createReplySuccess = (reply: ReplyType) => ({
  type: CREATE_REPLY_SUCCESS,
  payload: { reply }
});

export const createReplyFailure = (error: string) => ({
  type: CREATE_REPLY_FAILURE,
  payload: { error }
});

export const updateReplyTextRequest = (
  { reply_id, text, delete_password }: updateReplyTextParamsType,
  callBack?: () => void
) => ({
  type: UPDATE_REPLY_TEXT_REQUEST,
  payload: { reply_id, text, delete_password },
  callBack
});

export const updateReplyTextSuccess = (reply: ReplyType) => ({
  type: UPDATE_REPLY_TEXT_SUCCESS,
  payload: { reply }
});

export const updateReplyTextFailure = (error: string, reply_id: string) => ({
  type: UPDATE_REPLY_TEXT_FAILURE,
  payload: { error, reply_id }
});

export const resetReplyError = (errorKey: string, reply_id: string) => ({
  type: RESET_REPLY_ERROR,
  payload: {
    errorKey,
    reply_id
  }
});

export const deleteReplyRequest = ({
  reply_id,
  delete_password
}: deleteReplyParamsType) => ({
  type: DELETE_REPLY_REQUEST,
  payload: { reply_id, delete_password }
});

export const deleteReplySuccess = (deletedReply: ReplyType) => ({
  type: DELETE_REPLY_SUCCESS,
  payload: {
    deletedReply
  }
});

export const deleteReplyFailure = (error: string, reply_id: string) => ({
  type: DELETE_REPLY_FAILURE,
  payload: {
    error,
    reply_id
  }
});
