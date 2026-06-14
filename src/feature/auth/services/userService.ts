import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const userService = {
  async subscribe(userId: string) {
    const response = await axios.post(`${API_URL}/subscribe/${userId}`);
    // Actualizamos el usuario en localStorage para persistir el estado de suscriptor
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async recordGameResult(userId: string, gameType: string, result: string, isWin: boolean, prize?: string) {
    const response = await axios.post(`${API_URL}/game-result`, {
      userId,
      gameType,
      result,
      isWin,
      prize
    });
    return response.data;
  },

  async buyTicket(userId: string, raffleId: string) {
    const response = await axios.post(`${API_URL}/buy-ticket`, {
      userId,
      raffleId
    });
    return response.data;
  },

  async getUserTickets(userId: string) {
    const response = await axios.get(`${API_URL}/${userId}/tickets`);
    return response.data;
  }
};
