import {
  CREATE_THREAD_REQUEST,
  GET_THREAD_REQUEST,
  CREATE_THREAD_SUCCESS,
  UPDATE_THREAD_TEXT_REQUEST
} from './types';
import { createThreadArgs, updateThreadTextArgsType } from '../../Api';
import { ThreadType, ReplyType } from '../boards/types';
import { updateThreadTextSuccessArgsType } from './types';
import {
  UPDATE_THREAD_TEXT_SUCCESS,
  UPDATE_THREAD_TEXT_FAILURE
} from './types';

export const createThread = (
  { board_id, text, delete_password }: createThreadArgs,
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

export const updateThreadTextFailure = (error: string) => ({
  type: UPDATE_THREAD_TEXT_FAILURE,
  payload: {
    error
  }
});
