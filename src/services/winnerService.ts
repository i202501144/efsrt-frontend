import axios from 'axios';

const API_URL = 'http://localhost:3000/winners';

export const winnerService = {
  async getWinners() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching winners:', error);
      return [];
    }
  }
};
