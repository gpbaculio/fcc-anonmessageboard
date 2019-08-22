import axios from 'axios';

export default {
  boards: {
    createBoard: (name: string) => axios.post('/api/boards', { name })
  }
};
