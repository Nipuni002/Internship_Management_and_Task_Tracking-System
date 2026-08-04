import React, { useState, useEffect } from 'react';
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
import ReviewModal from '../../../components/submissions/ReviewModal';

import submissionService from '../../../services/submissionService';
import taskService from '../../../services/taskService';
import internService from '../../../services/internService';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [taskDetailMap, setTaskDetailMap] = useState({}); // full task data lookup
  const [internsMap, setInternsMap] = useState({});
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

  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    id: null,
    taskTitle: '',
    internName: '',
  });

  const loadMetadataLookups = async () => {
    try {
      // Load all tasks details
      const taskResponse = await taskService.getAllTasks({ size: 1000 });
      if (taskResponse.success && taskResponse.data) {
        const tMap = {};
        const tdMap = {};
        taskResponse.data.content.forEach((t) => {
          tMap[t.id] = t.title;
          tdMap[t.id] = t; // cache whole task object
        });
        setTasksMap(tMap);
        setTaskDetailMap(tdMap);
      }

      // Load all interns lookup
      const internResponse = await internService.getAllInterns({ size: 1000 });
      if (internResponse.success && internResponse.data) {
        const iMap = {};
        internResponse.data.content.forEach((i) => {
          iMap[i.id] = `${i.firstName} ${i.lastName}`;
        });
        setInternsMap(iMap);
      }
    } catch (error) {
      console.error('Error loading admin metadata lookup maps:', error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await submissionService.getAllSubmissions({
        page: params.page,
        size: params.size,
        sort: params.sort,
        status: params.status,
      });
      if (response.success && response.data) {
        setSubmissions(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Error occurred while loading submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetadataLookups();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [params.page, params.size, params.sort, params.status]);

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

  // Admin Review trigger
  const openReview = (id, taskTitle, internName) => {
    setReviewModal({
      isOpen: true,
      id,
      taskTitle,
      internName,
    });
  };

  const closeReview = () => {
    setReviewModal({
      isOpen: false,
      id: null,
      taskTitle: '',
      internName: '',
    });
  };

  const handleConfirmReview = async (actionType, reviewData) => {
    const { id } = reviewModal;
    try {
      let response;
      if (actionType === 'APPROVE') {
        response = await submissionService.approveSubmission(id, reviewData);
      } else if (actionType === 'REJECT') {
        response = await submissionService.rejectSubmission(id, reviewData);
      } else if (actionType === 'REVISION') {
        response = await submissionService.requestRevision(id, reviewData);
      }

      if (response && response.success) {
        toast.success(response.message || `Submission reviewed successfully!`);
        closeReview();
        fetchSubmissions();
      } else {
        toast.error(response?.message || 'Review action failed');
      }
    } catch (error) {
      console.error('Error confirming review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // Local client-side filters for Date and Search (Task Name or Intern Name)
  const filteredSubmissions = submissions.map(sub => {
    // Inject internId dynamically into sub object from cached task metadata so table helper resolves it!
    const assocTask = taskDetailMap[sub.taskId];
    return {
      ...sub,
      internId: assocTask ? assocTask.assignedInternId : null
    };
  }).filter((sub) => {
    // 1. Filter by Search (Task name or Intern Name)
    if (params.search) {
      const taskTitle = (tasksMap[sub.taskId] || '').toLowerCase();
      const internName = (internsMap[sub.internId] || '').toLowerCase();
      const q = params.search.toLowerCase();
      if (!taskTitle.includes(q) && !internName.includes(q)) return false;
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
        title="Oversight Submissions"
        description="Inspect submitted work packages from interns, provide constructive feedback, and approve deliverables."
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
            title="No Submissions Found"
            description="No task submissions match the search parameters or filter scopes."
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
                internsMap={internsMap}
                showInternColumn={true}
                userRole="ROLE_ADMIN"
                onOpenFeedback={openFeedback}
                onOpenReview={openReview}
              />
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {filteredSubmissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  tasksMap={tasksMap}
                  internsMap={internsMap}
                  showInternName={true}
                  userRole="ROLE_ADMIN"
                  onOpenFeedback={openFeedback}
                  onOpenReview={openReview}
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

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReview}
        onConfirm={handleConfirmReview}
        taskTitle={reviewModal.taskTitle}
        internName={reviewModal.internName}
      />
    </PageContainer>
  );
};

export default SubmissionList;
