import api from '../api/axios';

const internService = {
  /**
   * Fetch all interns with pagination, sorting, search, and filters.
   * @param {Object} params - Query parameters.
   * @param {number} params.page - 0-indexed page number.
   * @param {number} params.size - Items per page.
   * @param {string} params.sort - Sort field and direction (e.g. 'firstName,asc').
   * @param {string} params.status - InternStatus filter (ACTIVE, INACTIVE, COMPLETED).
   * @param {string} params.university - University filter.
   * @param {string} params.degree - Degree filter.
   * @param {string} params.search - Search string (matched against names and email).
   */
  getAllInterns: async (params) => {
    const queryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams[key] = params[key];
        }
      });
    }
    const response = await api.get('/api/interns', { params: queryParams });
    return response.data; // ApiResponse wrapping Page<InternResponse>
  },

  /**
   * Get an intern profile by ID.
   * @param {string} id - Intern UUID.
   */
  getInternById: async (id) => {
    const response = await api.get(`/api/interns/${id}`);
    return response.data; // ApiResponse wrapping InternResponse
  },

  /**
   * Create a new intern profile.
   * @param {Object} internData - InternRequest fields.
   */
  createIntern: async (internData) => {
    const response = await api.post('/api/interns', internData);
    return response.data; // ApiResponse wrapping InternResponse
  },

  /**
   * Update an existing intern profile.
   * @param {string} id - Intern UUID.
   * @param {Object} internData - InternRequest fields.
   */
  updateIntern: async (id, internData) => {
    const response = await api.put(`/api/interns/${id}`, internData);
    return response.data; // ApiResponse wrapping InternResponse
  },

  /**
   * Permanently delete an intern profile.
   * @param {string} id - Intern UUID.
   */
  deleteIntern: async (id) => {
    const response = await api.delete(`/api/interns/${id}`);
    return response.data; // ApiResponse wrapping Void
  },

  /**
   * Activate an intern.
   * @param {string} id - Intern UUID.
   */
  activateIntern: async (id) => {
    const response = await api.patch(`/api/interns/${id}/activate`);
    return response.data; // ApiResponse wrapping InternResponse
  },

  /**
   * Deactivate an intern.
   * @param {string} id - Intern UUID.
   */
  deactivateIntern: async (id) => {
    const response = await api.patch(`/api/interns/${id}/deactivate`);
    return response.data; // ApiResponse wrapping InternResponse
  },

  /**
   * Get current logged-in intern profile.
   */
  getCurrentInternProfile: async () => {
    try {
      const response = await api.get('/api/interns/me');
      return response.data; // ApiResponse wrapping InternResponse
    } catch (error) {
      if (localStorage.getItem('token') === 'mock-jwt-token-string') {
        return {
          success: true,
          data: {
            id: 'mock-intern-id',
            employeeId: 'INT-2026-001',
            firstName: 'System',
            lastName: 'Intern',
            email: 'intern@internship.com',
            phone: '+1 (555) 019-2834',
            university: 'Stanford University',
            degree: 'B.S. in Computer Science',
            startDate: '2026-01-15',
            endDate: '2026-07-15',
            status: 'ACTIVE'
          }
        };
      }
      throw error;
    }
  }
};

export default internService;
