import {
  CREATE_THREAD_REQUEST,
  GET_THREAD_REQUEST,
  CREATE_THREAD_SUCCESS,
  UPDATE_THREAD_TEXT_REQUEST,
  DELETE_THREAD_REQUEST
} from './types';
import {
  createThreadArgsType,
  updateThreadTextArgsType,
  deleteThreadArgsType
} from '../../Api';
import { ThreadType } from '../boards/types';
import { report_thread_args_type } from '../../Api';
import {
  DELETE_THREAD_FAILURE,
  RESET_THREAD_ERROR,
  REPORT_THREAD_REQUEST
} from './types';
import {
  updateThreadTextSuccessArgsType,
  DELETE_THREAD_SUCCESS
} from './types';
import {
  UPDATE_THREAD_TEXT_SUCCESS,
  UPDATE_THREAD_TEXT_FAILURE
} from './types';

export const report_thread = ({
  board_id,
  thread_id
}: report_thread_args_type) => ({
  type: REPORT_THREAD_REQUEST,
  payload: { board_id, thread_id }
});

export const deleteThreadRequest = (
  { thread_id, delete_password }: deleteThreadArgsType,
  callBack?: () => void
) => ({
  type: DELETE_THREAD_REQUEST,
  payload: { thread_id, delete_password },
  callBack
});

export const createThread = (
  { board_id, text, delete_password }: createThreadArgsType,
  callBack?: () => void
) => ({
  type: CREATE_THREAD_REQUEST,
  payload: { board_id, text, delete_password },
  callBack
});

export const getThread = (thread_id: string) => ({
  type: GET_THREAD_REQUEST,
  payload: { thread_id }
});

export const createThreadSuccess = (thread: ThreadType) => ({
  type: CREATE_THREAD_SUCCESS,
  payload: { thread }
});

export const updateThreadText = (
  { text, delete_password, thread_id }: updateThreadTextArgsType,
  callBack?: () => void
) => ({
  type: UPDATE_THREAD_TEXT_REQUEST,
  payload: {
    updateThreadTextArgs: {
      text,
      delete_password,
      thread_id
    },
    callBack
  }
});

export const updateThreadTextSuccess = ({
  thread,
  replies
}: updateThreadTextSuccessArgsType) => ({
  type: UPDATE_THREAD_TEXT_SUCCESS,
  payload: {
    thread,
    replies
  }
});

export const updateThreadTextFailure = (error: string, thread_id: string) => ({
  type: UPDATE_THREAD_TEXT_FAILURE,
  payload: {
    thread_id,
    error
  }
});

export const delete_thread_success = (thread_id: string, board_id: string) => ({
  type: DELETE_THREAD_SUCCESS,
  payload: {
    thread_id,
    board_id
  }
});

export const deleteThreadFailure = (error: string) => ({
  type: DELETE_THREAD_FAILURE,
  payload: {
    error
  }
});

export const resetThreadError = (errorKey: string, thread_id: string) => ({
  type: RESET_THREAD_ERROR,
  payload: {
    errorKey,
    thread_id
  }
});
