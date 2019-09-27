import {
  ThreadType,
  ReplyType,
  AddBoardSearchResultType
} from '../boards/types';
import { updateThreadTextArgsType } from '../../Api';
import { deleteReplySuccessType } from '../replies/types';

export const CREATE_THREAD_REQUEST = 'CREATE_THREAD_REQUEST';
export const CREATE_THREAD_SUCCESS = 'CREATE_THREAD_SUCCESS';
export const CREATE_THREAD_FAILURE = 'CREATE_THREAD_FAILURE';

export const GET_THREAD_REQUEST = 'GET_THREAD_REQUEST';
export const GET_THREAD_SUCCESS = 'GET_THREAD_SUCCESS';
export const GET_THREAD_FAILURE = 'GET_THREAD_FAILURE';

export const UPDATE_THREAD_TEXT_REQUEST = 'UPDATE_THREAD_TEXT_REQUEST';
export const UPDATE_THREAD_TEXT_SUCCESS = 'UPDATE_THREAD_TEXT_SUCCESS';
export const UPDATE_THREAD_TEXT_FAILURE = 'UPDATE_THREAD_TEXT_FAILURE';

export const DELETE_THREAD_REQUEST = 'DELETE_THREAD_REQUEST';
export const DELETE_THREAD_SUCCESS = 'DELETE_THREAD_SUCCESS';
export const DELETE_THREAD_FAILURE = 'DELETE_THREAD_FAILURE';

export const RESET_THREAD_ERROR = 'RESET_THREAD_ERROR';

export interface resetThreadErrorType {
  type: typeof RESET_THREAD_ERROR;
  payload: {
    thread_id: string;
    errorKey: string;
  };
}

export interface updateThreadTextRequest {
  type: typeof UPDATE_THREAD_TEXT_REQUEST;
  payload: {
    updateThreadTextArgs: updateThreadTextArgsType;
    callBack?: () => void;
  };
}

export interface updateThreadTextSuccessArgsType {
  thread: ThreadType;
  replies: {
    [_id: string]: ReplyType;
  };
}

export interface updateThreadTextSuccessType {
  type: typeof UPDATE_THREAD_TEXT_SUCCESS;
  payload: updateThreadTextSuccessArgsType;
}

export interface createThreadRequest {
  type: typeof CREATE_THREAD_REQUEST;
  payload: {
    text: string;
    delete_password: string;
    board_id: string;
  };
  callBack: () => void;
}

export interface deleteThreadRequestType {
  type: typeof DELETE_THREAD_REQUEST;
  payload: {
    delete_password: string;
    thread_id: string;
  };
  callBack: () => void;
}

export interface createThreadSuccess {
  type: typeof CREATE_THREAD_SUCCESS;
  payload: {
    thread: ThreadType;
  };
}

interface threadsFailureTypes {
  type: typeof CREATE_THREAD_FAILURE | typeof GET_THREAD_FAILURE;
  payload: {
    error: string;
  };
}

interface threadFailureType {
  type: typeof DELETE_THREAD_FAILURE;
  payload: {
    error: string;
    thread_id: string;
  };
}

export interface getThreadRequest {
  type: typeof GET_THREAD_REQUEST;
  payload: {
    thread_id: string;
  };
}
export interface getThreadSuccess {
  type: typeof GET_THREAD_SUCCESS;
  payload: {
    thread: ThreadType;
    replies: {
      [_id: string]: ReplyType;
    };
  };
}

export interface deleteThreadSuccessType {
  type: typeof DELETE_THREAD_SUCCESS;
  payload: {
    deletedThread: ThreadType;
  };
}

export interface updateThreadTextFailureType {
  type: typeof UPDATE_THREAD_TEXT_FAILURE;
  payload: {
    thread_id: string;
    error: string;
  };
}

export type ThreadsActionTypes =
  | AddBoardSearchResultType
  | deleteReplySuccessType
  | resetThreadErrorType
  | threadFailureType
  | deleteThreadRequestType
  | deleteThreadSuccessType
  | updateThreadTextFailureType
  | updateThreadTextRequest
  | updateThreadTextSuccessType
  | getThreadRequest
  | getThreadSuccess
  | createThreadRequest
  | createThreadSuccess
  | threadsFailureTypes;
