import api from '../api/axios';

const dashboardService = {
  /**
   * Fetch Administrator Dashboard statistics and recent activities.
   * @returns {Promise<Object>} ApiResponse wrapping AdminDashboardResponse
   */
  getAdminDashboard: async () => {
    const response = await api.get('/api/dashboard/admin');
    return response.data;
  },

  /**
   * Fetch Intern Dashboard workspace statistics and logs.
   * @returns {Promise<Object>} ApiResponse wrapping InternDashboardResponse
   */
  getInternDashboard: async () => {
    const response = await api.get('/api/dashboard/intern');
    return response.data;
  }
};

export default dashboardService;
