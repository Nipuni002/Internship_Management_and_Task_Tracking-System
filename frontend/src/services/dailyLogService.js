import api from '../api/axios';

const dailyLogService = {
  /**
   * Fetch all logs with optional filters and paging.
   * @param {Object} params - Query parameters.
   * @param {number} params.page - 0-indexed page index.
   * @param {number} params.size - Size of page.
   * @param {string} params.sort - Sort parameter (e.g. 'date,desc').
   * @param {string} params.date - Filter by specific date (yyyy-MM-dd).
   * @param {string} params.internId - Filter by intern UUID (admin only).
   * @param {number} params.month - Filter by month integer (1-12).
   * @param {number} params.year - Filter by year integer.
   */
  getAllLogs: async (params) => {
    const queryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams[key] = params[key];
        }
      });
    }
    const response = await api.get('/api/logs', { params: queryParams });
    return response.data; // ApiResponse wrapping Page<DailyLogResponse>
  },

  /**
   * Fetch a specific log by ID.
   * @param {string} id - Daily log UUID.
   */
  getLogById: async (id) => {
    const response = await api.get(`/api/logs/${id}`);
    return response.data; // ApiResponse wrapping DailyLogResponse
  },

  /**
   * Submit a new daily work log.
   * @param {Object} logData - DailyLogRequest properties.
   */
  createLog: async (logData) => {
    const response = await api.post('/api/logs', logData);
    return response.data; // ApiResponse wrapping DailyLogResponse
  },

  /**
   * Update an existing daily work log.
   * @param {string} id - Daily log UUID.
   * @param {Object} logData - DailyLogRequest properties.
   */
  updateLog: async (id, logData) => {
    const response = await api.put(`/api/logs/${id}`, logData);
    return response.data; // ApiResponse wrapping DailyLogResponse
  },

  /**
   * Delete a daily work log.
   * @param {string} id - Daily log UUID.
   */
  deleteLog: async (id) => {
    const response = await api.delete(`/api/logs/${id}`);
    return response.data; // ApiResponse wrapping Void
  }
};

export default dailyLogService;
