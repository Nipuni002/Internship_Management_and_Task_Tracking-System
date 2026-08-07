import api from '../api/axios';

const submissionService = {
  /**
   * Fetch paginated list of task submissions.
   * @param {Object} params - Query parameters.
   * @param {number} params.page - 0-indexed page number.
   * @param {number} params.size - Size of the page.
   * @param {string} params.sort - Sort parameter (e.g. 'submittedAt,desc').
   * @param {string} params.status - SubmissionStatus filter (PENDING, APPROVED, REJECTED, REVISION_REQUIRED).
   * @param {string} params.taskId - Filter by a specific task ID.
   */
  getAllSubmissions: async (params) => {
    const queryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams[key] = params[key];
        }
      });
    }
    const response = await api.get('/api/submissions', { params: queryParams });
    return response.data; // ApiResponse wrapping Page<SubmissionResponse>
  },

  /**
   * Fetch detailed info of a task submission by ID.
   * @param {string} id - Submission UUID.
   */
  getSubmissionById: async (id) => {
    const response = await api.get(`/api/submissions/${id}`);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Submit completed work for a task.
   * @param {Object} submissionData - SubmissionRequest structure.
   */
  createSubmission: async (submissionData) => {
    const response = await api.post('/api/submissions', submissionData);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Update submission details (only if state is PENDING, REVISION_REQUIRED, etc.).
   * @param {string} id - Submission UUID.
   * @param {Object} submissionData - SubmissionRequest structure.
   */
  updateSubmission: async (id, submissionData) => {
    const response = await api.put(`/api/submissions/${id}`, submissionData);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Approve a task submission with feedback notes (Admin only).
   * @param {string} id - Submission UUID.
   * @param {Object} reviewData - SubmissionReviewRequest containing feedback.
   */
  approveSubmission: async (id, reviewData) => {
    const response = await api.patch(`/api/submissions/${id}/approve`, reviewData);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Reject a task submission with feedback notes (Admin only).
   * @param {string} id - Submission UUID.
   * @param {Object} reviewData - SubmissionReviewRequest containing feedback.
   */
  rejectSubmission: async (id, reviewData) => {
    const response = await api.patch(`/api/submissions/${id}/reject`, reviewData);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Request task revision with feedback notes (Admin only).
   * @param {string} id - Submission UUID.
   * @param {Object} reviewData - SubmissionReviewRequest containing feedback.
   */
  requestRevision: async (id, reviewData) => {
    const response = await api.patch(`/api/submissions/${id}/revision`, reviewData);
    return response.data; // ApiResponse wrapping SubmissionResponse
  },

  /**
   * Delete a task submission by ID.
   * @param {string} id - Submission UUID.
   */
  deleteSubmission: async (id) => {
    const response = await api.delete(`/api/submissions/${id}`);
    return response.data; // ApiResponse wrapping Void
  }
};

export default submissionService;
