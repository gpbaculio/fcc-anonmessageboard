import axios from 'axios';
import { deleteBoardArgs } from './store/boards/actions';

export interface createThreadArgs {
  text: string;
  delete_password: string;
  board_id: string;
}

export interface createReplyArgs extends createThreadArgs {
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
export default {
  boards: {
    createBoard: ({ name, delete_password }: createBoardArgs) =>
      axios.post('/api/boards', { name, delete_password }),
    getBoards: () => axios.get('/api/boards'),
    fetchBoard: (board_id: string) => axios.get(`/api/board/${board_id}`),
    deleteBoard: ({ board_id, delete_password }: deleteBoardArgs) =>
      axios.delete(`/api/board/${board_id}`, { data: { delete_password } }),
    updateName: ({ board_id, board_name, delete_password }: updateNameArgs) =>
      axios.post(`/api/board/${board_id}`, { board_name, delete_password })
  },
  threads: {
    createThread: ({ text, delete_password, board_id }: createThreadArgs) => {
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
    }: createReplyArgs) => {
      return axios.post(`/api/replies/${board_id}`, {
        text,
        delete_password,
        thread_id
      });
    }
  }
};
