import { ReplyType } from '../boards/types';
import { updateThreadTextSuccessType } from '../threads/types';
import { updateReplyTextParamsType } from '../../Api';

export const CREATE_REPLY_REQUEST = 'CREATE_REPLY_REQUEST';
export const CREATE_REPLY_SUCCESS = 'CREATE_REPLY_SUCCESS';
export const CREATE_REPLY_FAILURE = 'CREATE_REPLY_FAILURE';

export const UPDATE_REPLY_TEXT_REQUEST = 'UPDATE_REPLY_TEXT_REQUEST';
export const UPDATE_REPLY_TEXT_SUCCESS = 'UPDATE_REPLY_TEXT_SUCCESS';
export const UPDATE_REPLY_TEXT_FAILURE = 'UPDATE_REPLY_TEXT_FAILURE';

export const RESET_REPLY_ERROR = 'RESET_REPLY_ERROR';

export const DELETE_REPLY_REQUEST = 'DELETE_REPLY_REQUEST';
export const DELETE_REPLY_SUCCESS = 'DELETE_REPLY_SUCCESS';
export const DELETE_REPLY_FAILURE = 'DELETE_REPLY_FAILURE';

export interface RepliesState {
  replies: { [_id: string]: ReplyType };
  loading: {
    createReply: boolean;
  };
  error: {
    createReply: string;
  };
}

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

export interface repliesFailureType {
  type: typeof CREATE_REPLY_FAILURE;
  payload: {
    error: string;
  };
}
export interface updateReplyTextFailureType {
  type: typeof UPDATE_REPLY_TEXT_FAILURE;
  payload: {
    error: string;
    reply_id: string;
  };
}

export interface updateReplyTextRequestType {
  type: typeof UPDATE_REPLY_TEXT_REQUEST;
  payload: updateReplyTextParamsType;
  callBack?: () => void;
}

export interface updateReplyTextSuccessType {
  type: typeof UPDATE_REPLY_TEXT_SUCCESS;
  payload: {
    reply: ReplyType;
  };
}

export interface resetReplyErrorType {
  type: typeof RESET_REPLY_ERROR;
  payload: {
    reply_id: string;
    errorKey: string;
  };
}

export interface deleteReplyRequestType {
  type: typeof DELETE_REPLY_REQUEST;
  payload: {
    reply_id: string;
    delete_password: string;
  };
  callBack: () => void;
}

export interface deleteReplySuccessType {
  type: typeof DELETE_REPLY_SUCCESS;
  payload: {
    deletedReply: ReplyType;
  };
}

export interface deleteReplyFailureType {
  type: typeof DELETE_REPLY_FAILURE;
  payload: {
    error: string;
    reply_id: string;
  };
}

export type RepliesActionTypes =
  | deleteReplyRequestType
  | deleteReplySuccessType
  | deleteReplyFailureType
  | updateReplyTextFailureType
  | updateReplyTextSuccessType
  | updateReplyTextRequestType
  | updateThreadTextSuccessType
  | createReplyRequest
  | createReplySuccess
  | repliesFailureType
  | resetReplyErrorType;
