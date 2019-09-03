import { ReplyType } from '../boards/types';

export const CREATE_REPLY_REQUEST = 'CREATE_REPLY_REQUEST';
export const CREATE_REPLY_SUCCESS = 'CREATE_REPLY_SUCCESS';
export const CREATE_REPLY_FAILURE = 'CREATE_REPLY_FAILURE';

export interface createReplyRequest {
  type: typeof CREATE_REPLY_REQUEST;
  payload: {
    text: string;
    delete_password: string;
    board_id: string;
    thread_id: string;
  };
}
export interface createReplySuccess {
  type: typeof CREATE_REPLY_SUCCESS;
  payload: {
    reply: ReplyType;
  };
}
export interface createReplyFailure {
  type: typeof CREATE_REPLY_FAILURE;
  payload: {
    error: string;
  };
}

export type RepliesActionTypes =
  | createReplyRequest
  | createReplySuccess
  | createReplyFailure;
