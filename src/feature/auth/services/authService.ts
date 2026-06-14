import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(email: string, password: string, name: string) {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    const response = await axios.post(`${API_URL}/reset-password`, { email, code, newPassword });
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
