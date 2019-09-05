import axios from 'axios';

export interface createThreadArgs {
  text: string;
  delete_password: string;
  board_id: string;
}

export interface createReplyArgs extends createThreadArgs {
  thread_id: string;
}

export default {
  boards: {
    createBoard: (name: string) => axios.post('/api/boards', { name }),
    getBoards: () => axios.get('/api/boards'),
    fetchBoard: (board_id: string) => axios.get(`/api/board/${board_id}`)
  },
  threads: {
    createThread: ({ text, delete_password, board_id }: createThreadArgs) => {
      return axios.post(`/api/threads/${board_id}`, { text, delete_password });
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
