import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiBookOpen } from 'react-icons/fi';
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
    </PageContainer>
  );
};

export default MySubmissions;
