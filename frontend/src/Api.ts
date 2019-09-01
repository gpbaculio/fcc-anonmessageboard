import axios from 'axios';

export interface createThreadArgs {
  text: string;
  delete_password: string;
  board_id: string;
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
    }
  }
};
