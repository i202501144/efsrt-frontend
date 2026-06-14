import axios from 'axios';

const API_URL = 'http://localhost:3000/raffles';

export const raffleService = {
  async getRaffles() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getRaffle(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
};
