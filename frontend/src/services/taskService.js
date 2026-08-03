import api from '../api/axios';

const taskService = {
  /**
   * Fetch all tasks with optional pagination, sorting, search, and filters.
   * @param {Object} params - Query params.
   * @param {number} params.page - 0-indexed page.
   * @param {number} params.size - Size.
   * @param {string} params.sort - Sort string (e.g. 'title,asc').
   * @param {string} params.status - TaskStatus value.
   * @param {string} params.priority - Priority value.
   * @param {string} params.projectId - Project ID.
   * @param {string} params.assignedInternId - Assigned Intern ID.
   * @param {string} params.search - Search value.
   * @param {string} params.deadline - Date string (yyyy-MM-dd).
   */
  getAllTasks: async (params) => {
    const queryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams[key] = params[key];
        }
      });
    }
    const response = await api.get('/api/tasks', { params: queryParams });
    return response.data; // ApiResponse wrapping Page<TaskResponse>
  },

  /**
   * Fetch a specific task profile by ID.
   * @param {string} id - Task UUID.
   */
  getTaskById: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data; // ApiResponse wrapping TaskResponse
  },

  /**
   * Create a new task.
   * @param {Object} taskData - TaskRequest structure.
   */
  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data; // ApiResponse wrapping TaskResponse
  },

  /**
   * Update an existing task's core details.
   * @param {string} id - Task UUID.
   * @param {Object} taskData - TaskRequest structure.
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data; // ApiResponse wrapping TaskResponse
  },

  /**
   * Delete a task record.
   * @param {string} id - Task UUID.
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data; // ApiResponse wrapping Void
  },

  /**
   * Assign or reassign a task to an intern.
   * @param {string} id - Task UUID.
   * @param {string} assignedInternId - Intern ID.
   */
  assignTask: async (id, assignedInternId) => {
    const response = await api.patch(`/api/tasks/${id}/assign`, { assignedInternId });
    return response.data; // ApiResponse wrapping TaskResponse
  },

  /**
   * Update task status (optionally sending submission links or feedback text).
   * @param {string} id - Task UUID.
   * @param {Object} payload - Status request parameters.
   * @param {string} payload.status - TaskStatus enum value.
   * @param {string} [payload.submissionLink] - Optional URL (intern submissions).
   * @param {string} [payload.feedback] - Optional notes (admin reviews).
   */
  updateTaskStatus: async (id, payload) => {
    const response = await api.patch(`/api/tasks/${id}/status`, payload);
    return response.data; // ApiResponse wrapping TaskResponse
  },

  /**
   * Helper method to fetch list of projects for selection dropdowns.
   * Calls the projects endpoint with a high size to get all projects.
   */
  getAllProjects: async (params = { page: 0, size: 1000 }) => {
    const response = await api.get('/api/projects', { params });
    return response.data; // ApiResponse wrapping Page<ProjectResponse>
  }
};

export default taskService;
