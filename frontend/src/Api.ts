import axios from 'axios';
import { deleteBoardArgs, fetchBoardsParamsType } from './store/boards/actions';

export interface createThreadArgsType {
  text: string;
  delete_password: string;
  board_id: string;
}

export interface createReplyArgsType extends createThreadArgsType {
  thread_id: string;
}

export interface createBoardArgs {
  name: string;
  delete_password: string;
}

export interface updateNameArgs {
  board_id: string;
  board_name: string;
  delete_password: string;
}

export interface updateThreadTextArgsType {
  text: string;
  delete_password: string;
  thread_id: string;
}

export interface deleteThreadArgsType {
  delete_password: string;
  thread_id: string;
}

export interface updateReplyTextParamsType {
  reply_id: string;
  text: string;
  delete_password: string;
}

export interface deleteReplyParamsType {
  reply_id: string;
  delete_password: string;
}

export default {
  boards: {
    createBoard: ({ name, delete_password }: createBoardArgs) =>
      axios.post('/api/boards', { name, delete_password }),
    fetchBoards: ({ search_text, page, limit }: fetchBoardsParamsType) =>
      axios.get('/api/boards', {
        params: { ...(search_text ? { search_text } : {}), page, limit }
      }),
    fetchBoard: (board_id: string) => axios.get(`/api/board/${board_id}`),
    deleteBoard: ({ board_id, delete_password }: deleteBoardArgs) =>
      axios.delete(`/api/board/${board_id}`, { data: { delete_password } }),
    updateName: ({ board_id, board_name, delete_password }: updateNameArgs) =>
      axios.post(`/api/board/${board_id}`, { board_name, delete_password })
  },
  threads: {
    deleteThread: ({ delete_password, thread_id }: deleteThreadArgsType) => {
      return axios.delete(`/api/thread/${thread_id}`, {
        data: { delete_password }
      });
    },
    createThread: ({
      text,
      delete_password,
      board_id
    }: createThreadArgsType) => {
      return axios.post(`/api/threads/${board_id}`, { text, delete_password });
    },
    updateThreadText: ({
      text,
      delete_password,
      thread_id
    }: updateThreadTextArgsType) => {
      return axios.post(`/api/thread/${thread_id}`, { text, delete_password });
    },
    getThread: (thread_id: string) => axios.get(`/api/thread/${thread_id}`)
  },
  replies: {
    createReply: ({
      text,
      delete_password,
      thread_id,
      board_id
    }: createReplyArgsType) => {
      return axios.post(`/api/replies/${board_id}`, {
        text,
        delete_password,
        thread_id
      });
    },
    updateReplyText: ({
      reply_id,
      text,
      delete_password
    }: updateReplyTextParamsType) => {
      return axios.post(`/api/reply/${reply_id}`, { text, delete_password });
    },
    deleteReply: ({ reply_id, delete_password }: deleteReplyParamsType) => {
      return axios.delete(`/api/reply/${reply_id}`, {
        data: { delete_password }
      });
    }
  }
};
