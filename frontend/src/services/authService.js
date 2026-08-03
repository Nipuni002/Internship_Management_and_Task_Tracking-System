import api from '../api/axios';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data; // Custom ApiResponse wrapper structure, containing { success, message, data, timestamp }
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data; // returns wrapped user profile
  }
};

export default authService;
