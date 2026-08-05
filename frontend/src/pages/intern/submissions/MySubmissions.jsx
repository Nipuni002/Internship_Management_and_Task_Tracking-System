import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiBookOpen, FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import SearchBar from '../../../components/submissions/SearchBar';
import FilterPanel from '../../../components/submissions/FilterPanel';
import SubmissionTable from '../../../components/submissions/SubmissionTable';
import SubmissionCard from '../../../components/submissions/SubmissionCard';
import Pagination from '../../../components/submissions/Pagination';
import FeedbackModal from '../../../components/submissions/FeedbackModal';

import submissionService from '../../../services/submissionService';
import taskService from '../../../services/taskService';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter & page states
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'submittedAt,desc',
    status: '',
    date: '',
    search: '',
  });

  // Modal feedback state
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    taskTitle: '',
    feedback: '',
    status: '',
  });

  // Modal deletion state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    taskTitle: '',
  });

  const loadTasksLookup = async () => {
    try {
      const response = await taskService.getAllTasks({ size: 1000 });
      if (response.success && response.data) {
        const map = {};
        response.data.content.forEach((task) => {
          map[task.id] = task.title;
        });
        setTasksMap(map);
      }
    } catch (error) {
      console.error('Error fetching tasks map for submissions:', error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Fetch submissions
      const response = await submissionService.getAllSubmissions(params);
      if (response.success && response.data) {
        setSubmissions(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Error occurred while loading submissions list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasksLookup();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [params]);

  // Page index handlers
  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  // Search & Filter handlers
  const handleSearch = (searchVal) => {
    setParams((prev) => ({ ...prev, search: searchVal, page: 0 }));
  };

  const handleApplyFilters = (newFilters) => {
    setParams((prev) => ({
      ...prev,
      ...newFilters,
      page: 0,
    }));
  };

  const handleResetFilters = () => {
    setParams((prev) => ({
      ...prev,
      status: '',
      date: '',
      page: 0,
    }));
  };

  // Open feedback trigger
  const openFeedback = (taskTitle, feedback, status) => {
    setFeedbackModal({
      isOpen: true,
      taskTitle,
      feedback,
      status,
    });
  };

  const closeFeedback = () => {
    setFeedbackModal({
      isOpen: false,
      taskTitle: '',
      feedback: '',
      status: '',
    });
  };

  const triggerDeleteModal = (id, taskTitle) => {
    setDeleteModal({
      isOpen: true,
      id,
      taskTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      taskTitle: '',
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteModal;
    closeDeleteModal();
    setLoading(true);
    try {
      const response = await submissionService.deleteSubmission(id);
      if (response.success) {
        toast.success(response.message || 'Submission deleted successfully.');
        const isLastItem = filteredSubmissions.length === 1;
        const hasPrevPage = params.page > 0;
        if (isLastItem && hasPrevPage) {
          setParams((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchSubmissions();
        }
      } else {
        toast.error(response.message || 'Failed to delete submission');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error(error.response?.data?.message || 'Failed to delete submission');
      setLoading(false);
    }
  };

  // Local client-side filters for Date and Search (since backend does not filter dates/searches globally)
  const filteredSubmissions = submissions.filter((sub) => {
    // 1. Filter by Search (Task name)
    if (params.search) {
      const title = (tasksMap[sub.taskId] || '').toLowerCase();
      const q = params.search.toLowerCase();
      if (!title.includes(q)) return false;
    }
    // 2. Filter by Specific Date
    if (params.date) {
      const subDate = new Date(sub.submittedAt).toISOString().split('T')[0];
      if (subDate !== params.date) return false;
    }
    return true;
  });

  return (
    <PageContainer>
      <PageHeader
        title="My Task Submissions"
        description="Submit completed deliverables, review evaluation feedback, and monitor progress metrics."
        actions={
          <Link
            to="/intern/submissions/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg font-sans"
          >
            <FiPlus size={15} />
            Submit Work
          </Link>
        }
      />

      <div className="space-y-6 font-sans">
        {/* Search */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <SearchBar initialValue={params.search} onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <FilterPanel
          initialFilters={{
            status: params.status,
            date: params.date,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          showTaskFilter={false}
        />

        {/* Listings Container */}
        {loading && filteredSubmissions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <EmptyState
            icon={<FiBookOpen size={36} />}
            title="No Submissions Found"
            description="You don't have any task submissions matching current criteria. Submit your first deliverable to record work."
            action={
              <button
                onClick={() =>
                  setParams({
                    page: 0,
                    size: 10,
                    sort: 'submittedAt,desc',
                    status: '',
                    date: '',
                    search: '',
                  })
                }
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            }
          />
        ) : (
          <div className="relative">
            {/* Syncing Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex justify-center items-center z-10 rounded-xl">
                <div className="bg-slate-900 text-white px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold shadow-lg">
                  <LoadingSpinner fullScreen={false} />
                  <span>Syncing...</span>
                </div>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <SubmissionTable
                submissions={filteredSubmissions}
                tasksMap={tasksMap}
                userRole="ROLE_INTERN"
                onOpenFeedback={openFeedback}
                onDelete={triggerDeleteModal}
              />
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {filteredSubmissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  tasksMap={tasksMap}
                  userRole="ROLE_INTERN"
                  onOpenFeedback={openFeedback}
                  onDelete={triggerDeleteModal}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={params.page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={params.size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedback}
        taskTitle={feedbackModal.taskTitle}
        feedback={feedbackModal.feedback}
        status={feedbackModal.status}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <FiAlertTriangle size={20} className="shrink-0 animate-bounce" />
                <h3 className="text-sm font-bold tracking-wide uppercase">Confirm Delete Submission</h3>
              </div>
              <button 
                onClick={closeDeleteModal} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Close dialog"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to permanently delete your task submission for{' '}
                <strong className="text-slate-950 font-bold">{deleteModal.taskTitle}</strong>?
              </p>
              <p className="text-xs text-rose-500/90 mt-2 font-semibold bg-rose-50/70 border border-rose-100 p-2.5 rounded-lg">
                Warning: This action will permanently remove the submission record and revert the task status back to TODO.
              </p>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default MySubmissions;
