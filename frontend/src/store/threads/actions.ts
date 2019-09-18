import {
  CREATE_THREAD_REQUEST,
  GET_THREAD_REQUEST,
  CREATE_THREAD_SUCCESS,
  UPDATE_THREAD_TEXT_REQUEST
} from './types';
import { createThreadArgs, updateThreadTextArgsType } from '../../Api';
import { ThreadType } from '../boards/types';

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

export const updateThreadText = ({
  text,
  delete_password,
  thread_id
}: updateThreadTextArgsType) => ({
  type: UPDATE_THREAD_TEXT_REQUEST,
  payload: {
    text,
    delete_password,
    thread_id
  }
});
