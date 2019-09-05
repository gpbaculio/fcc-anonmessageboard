import { ThreadType } from '../boards/types';

export const CREATE_THREAD_REQUEST = 'CREATE_THREAD_REQUEST';
export const CREATE_THREAD_SUCCESS = 'CREATE_THREAD_SUCCESS';
export const CREATE_THREAD_FAILURE = 'CREATE_THREAD_FAILURE';

export const GET_THREAD_REQUEST = 'GET_THREAD_REQUEST';
export const GET_THREAD_SUCCESS = 'GET_THREAD_SUCCESS';
export const GET_THREAD_FAILURE = 'GET_THREAD_FAILURE';

export interface createThreadRequest {
  type: typeof CREATE_THREAD_REQUEST;
  payload: {
    text: string;
    delete_password: string;
    board_id: string;
  };
}

export interface createThreadSuccess {
  type: typeof CREATE_THREAD_SUCCESS;
  payload: {
    thread: ThreadType;
  };
}

interface createThreadFailure {
  type: typeof CREATE_THREAD_FAILURE;
  payload: {
    error: string;
  };
}

export interface getThreadRequest {
  type: typeof GET_THREAD_REQUEST;
  payload: {
    thread_id: string;
  };
}

export type ThreadsActionTypes =
  | getThreadRequest
  | createThreadRequest
  | createThreadSuccess
  | createThreadFailure;
