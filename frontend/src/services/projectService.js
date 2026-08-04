import api from '../api/axios';

const projectService = {
  /**
   * Fetch all projects with pagination, sorting, search, and filters.
   * @param {Object} params - Query parameters.
   * @param {number} params.page - 0-indexed page number.
   * @param {number} params.size - Items per page.
   * @param {string} params.sort - Sort field and direction (e.g. 'title,asc').
   * @param {string} params.status - ProjectStatus filter (ACTIVE, COMPLETED, ON_HOLD).
   * @param {string} params.deadline - Deadline date filter (yyyy-MM-dd).
   * @param {string} params.technology - Technology filter.
   * @param {string} params.search - Search string.
   */
  getAllProjects: async (params) => {
    const queryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams[key] = params[key];
        }
      });
    }
    const response = await api.get('/api/projects', { params: queryParams });
    return response.data; // ApiResponse wrapping Page<ProjectResponse>
  },

  /**
   * Get project details by ID.
   * @param {string} id - Project UUID.
   */
  getProjectById: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data; // ApiResponse wrapping ProjectResponse
  },

  /**
   * Create a new project.
   * @param {Object} projectData - ProjectRequest fields.
   */
  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data; // ApiResponse wrapping ProjectResponse
  },

  /**
   * Update an existing project.
   * @param {string} id - Project UUID.
   * @param {Object} projectData - ProjectRequest fields.
   */
  updateProject: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data; // ApiResponse wrapping ProjectResponse
  },

  /**
   * Delete a project by ID.
   * @param {string} id - Project UUID.
   */
  deleteProject: async (id) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data; // ApiResponse wrapping Void
  },

  /**
   * Assign interns to a project.
   * @param {string} id - Project UUID.
   * @param {string[]} internIds - Array of Intern UUIDs to assign.
   */
  assignInterns: async (id, internIds) => {
    const response = await api.patch(`/api/projects/${id}/assign`, { internIds });
    return response.data; // ApiResponse wrapping ProjectResponse
  },

  /**
   * Remove interns from a project.
   * @param {string} id - Project UUID.
   * @param {string[]} internIds - Array of Intern UUIDs to remove.
   */
  removeInterns: async (id, internIds) => {
    const response = await api.patch(`/api/projects/${id}/remove`, { internIds });
    return response.data; // ApiResponse wrapping ProjectResponse
  }
};

export default projectService;
