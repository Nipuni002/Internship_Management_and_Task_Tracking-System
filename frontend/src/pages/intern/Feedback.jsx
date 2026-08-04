import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMessageSquare, 
  FiCheckCircle, 
  FiRotateCw, 
  FiAlertCircle, 
  FiExternalLink, 
  FiFilter, 
  FiBookOpen, 
  FiStar,
  FiClock,
  FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import StatisticCard from '../../components/dashboard/StatisticCard';

// Services
import submissionService from '../../services/submissionService';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // States
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [projectsMap, setProjectsMap] = useState({});
  
  // Analytics Metrics
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    approvedCount: 0,
    revisionCount: 0,
    acceptanceRate: 0,
  });

  // Filter States
  const [filters, setFilters] = useState({
    status: 'ALL',
    projectId: 'ALL',
  });

  // Modal / Detailed view state
  const [selectedReview, setSelectedReview] = useState(null);

  const loadFeedbackData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Parallel loading of tasks, projects, and submissions
      const [tasksRes, projectsRes, submissionsRes] = await Promise.all([
        taskService.getAllTasks({ size: 1000 }),
        projectService.getAllProjects({ size: 1000 }),
        submissionService.getAllSubmissions({ size: 1000 }),
      ]);

      const tasksList = (tasksRes.success && tasksRes.data?.content) || [];
      const projectsList = (projectsRes.success && projectsRes.data?.content) || [];
      const submissionsList = (submissionsRes.success && submissionsRes.data?.content) || [];

      // Map Tasks lookup
      const tMap = {};
      tasksList.forEach((t) => {
        tMap[t.id] = t;
      });
      setTasksMap(tMap);

      // Map Projects lookup
      const pMap = {};
      projectsList.forEach((p) => {
        pMap[p.id] = p.title;
      });
      setProjectsMap(pMap);

      // Process and compile feedbacks from submissions
      const compiledFeedbacks = [];

      // A submission is considered reviewed if feedback is present, or if status is not PENDING
      submissionsList.forEach((sub) => {
        if (sub.feedback || sub.status !== 'PENDING') {
          const taskObj = tMap[sub.taskId] || {};
          const projectTitle = pMap[taskObj.projectId] || 'No Project Linked';
          
          compiledFeedbacks.push({
            id: sub.id,
            taskId: sub.taskId,
            taskTitle: taskObj.title || 'Unknown Task',
            projectId: taskObj.projectId || '',
            projectTitle,
            githubLink: sub.githubLink,
            documentLink: sub.documentLink,
            notes: sub.notes,
            feedback: sub.feedback || 'Work completed without additional review comments.',
            status: sub.status, // APPROVED, REVISION_REQUIRED, REJECTED
            submittedAt: sub.submittedAt,
            reviewedAt: sub.updatedAt || sub.submittedAt,
          });
        }
      });

      // Also gather feedback directly saved on Tasks (general task feedback comments)
      tasksList.forEach((task) => {
        if (task.feedback && !compiledFeedbacks.some((f) => f.taskId === task.id)) {
          const projectTitle = pMap[task.projectId] || 'No Project Linked';
          compiledFeedbacks.push({
            id: `task-fb-${task.id}`,
            taskId: task.id,
            taskTitle: task.title,
            projectId: task.projectId || '',
            projectTitle,
            feedback: task.feedback,
            status: task.status === 'COMPLETED' ? 'APPROVED' : (task.status === 'REVISION_REQUIRED' ? 'REVISION_REQUIRED' : 'GENERAL'),
            submittedAt: task.createdAt,
            reviewedAt: task.updatedAt || task.createdAt,
          });
        }
      });

      // Sort by date reviewed descending
      compiledFeedbacks.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
      
      setFeedbacks(compiledFeedbacks);
      setFilteredFeedbacks(compiledFeedbacks);

      // Compute performance metrics
      const totalReviews = compiledFeedbacks.length;
      const approvedCount = compiledFeedbacks.filter(f => f.status === 'APPROVED').length;
      const revisionCount = compiledFeedbacks.filter(f => f.status === 'REVISION_REQUIRED').length;
      const acceptanceRate = totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0;

      setMetrics({
        totalReviews,
        approvedCount,
        revisionCount,
        acceptanceRate,
      });

      if (isRefresh) {
        toast.success('Feedback list updated');
      }
    } catch (error) {
      console.error('Error loading feedback data:', error);
      toast.error('Could not load feedback and review history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeedbackData();
  }, []);

  // Filter application
  useEffect(() => {
    let result = feedbacks;

    if (filters.status !== 'ALL') {
      result = result.filter(f => f.status === filters.status);
    }

    if (filters.projectId !== 'ALL') {
      result = result.filter(f => f.projectId === filters.projectId);
    }

    setFilteredFeedbacks(result);
  }, [filters, feedbacks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          label: 'Approved',
          icon: <FiCheckCircle className="shrink-0" size={12} />,
        };
      case 'REVISION_REQUIRED':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          label: 'Revision Required',
          icon: <FiRotateCw className="shrink-0 animate-spin" style={{ animationDuration: '4s' }} size={12} />,
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-100',
          label: 'Rejected',
          icon: <FiAlertCircle className="shrink-0" size={12} />,
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-100',
          label: 'Reviewed',
          icon: <FiAward className="shrink-0" size={12} />,
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <LoadingSpinner fullScreen={false} />
        <span className="text-slate-400 text-xs font-bold font-sans mt-2">Loading Reviews and Critique Feed...</span>
      </div>
    );
  }

  // Find unique projects to populate filtering dropdown
  const uniqueProjects = Array.from(
    new Set(feedbacks.map(f => JSON.stringify({ id: f.projectId, title: f.projectTitle })))
  ).map(str => JSON.parse(str)).filter(p => p.id);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 font-sans">
        
        {/* Header Block with quick refresh */}
        <div className="relative">
          <PageHeader 
            title="Feedback & Reviews" 
            description="Examine detailed critiques, reviews, and grading scores assigned by administrators for your submitted work."
          />
          <button 
            onClick={() => loadFeedbackData(true)} 
            disabled={refreshing}
            className="absolute top-2 right-0 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 disabled:text-slate-300 p-2.5 rounded-xl border border-slate-200/50 hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Reload Reviews"
          >
            <FiRotateCw className={`shrink-0 ${refreshing ? 'animate-spin' : ''}`} size={14} />
            <span className="hidden sm:inline">Refresh Reviews</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard 
            title="Total Reviews" 
            value={metrics.totalReviews} 
            colorTheme="blue" 
            icon={<FiMessageSquare size={20} />} 
          />
          <StatisticCard 
            title="Approved Tasks" 
            value={metrics.approvedCount} 
            colorTheme="emerald" 
            icon={<FiCheckCircle size={20} />} 
          />
          <StatisticCard 
            title="Revision Requested" 
            value={metrics.revisionCount} 
            colorTheme="amber" 
            icon={<FiRotateCw size={20} />} 
          />
          <StatisticCard 
            title="Approval rate" 
            value={`${metrics.acceptanceRate.toFixed(1)}%`} 
            colorTheme="violet" 
            icon={<FiStar size={20} />} 
          />
        </div>

        {/* Filters and Review Feed Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <FiFilter className="text-slate-400" size={16} />
              <h4 className="font-bold text-slate-800 text-sm">Review Filters</h4>
            </div>

            <div className="space-y-4">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REVISION_REQUIRED">Revision Required</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Project Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project</label>
                <select
                  value={filters.projectId}
                  onChange={(e) => handleFilterChange('projectId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Projects</option>
                  {uniqueProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Reviews Timeline List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((rev) => {
                const statusMeta = getStatusStyle(rev.status);
                return (
                  <div 
                    key={rev.id} 
                    className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedReview(rev)}
                  >
                    {/* Background Soft Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-2xl pointer-events-none ${
                      rev.status === 'APPROVED' ? 'bg-emerald-500' : (rev.status === 'REVISION_REQUIRED' ? 'bg-amber-500' : 'bg-blue-500')
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold tracking-wide uppercase border border-blue-100/50 inline-block mb-1.5">
                          {rev.projectTitle}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm leading-snug">{rev.taskTitle}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusMeta.bg}`}>
                          {statusMeta.icon}
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    {/* Feedback quote bubble */}
                    <div className="relative pl-4 border-l-2 border-slate-200 italic text-slate-600 text-xs leading-relaxed py-1 font-medium bg-slate-50/50 p-3.5 rounded-r-xl">
                      "{rev.feedback}"
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide pt-1">
                      <div className="flex items-center gap-1.5">
                        <FiClock size={12} className="text-slate-350" />
                        <span>Reviewed: {formatDate(rev.reviewedAt)}</span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReview(rev);
                        }}
                        className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        Inspect Details →
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl py-16 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mb-3">
                  <FiMessageSquare size={22} />
                </div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">No reviews matched</h4>
                <p className="text-[10px] text-slate-400 font-medium max-w-[250px] mt-1.5 leading-relaxed">
                  No critique reviews match the selected filter parameters. Adjust filters to check all reviews.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Review Details Drawer Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold tracking-wide uppercase border border-blue-100/50 inline-block mb-1.5">
                  {selectedReview.projectTitle}
                </span>
                <h3 className="font-black text-slate-800 text-base leading-snug">{selectedReview.taskTitle}</h3>
              </div>
              <button 
                onClick={() => setSelectedReview(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content items */}
            <div className="space-y-5">
              {/* Review status banner */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${getStatusStyle(selectedReview.status).bg}`}>
                <div className="shrink-0">
                  {getStatusStyle(selectedReview.status).icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none mb-1">
                    Grading Status: {getStatusStyle(selectedReview.status).label}
                  </h4>
                  <p className="text-[10px] font-medium opacity-80">
                    Reviewed on {formatDate(selectedReview.reviewedAt)}
                  </p>
                </div>
              </div>

              {/* Administrator critique */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Administrator Review Critique</span>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-650 leading-relaxed font-medium">
                  {selectedReview.feedback}
                </div>
              </div>

              {/* Submission metadata (if available) */}
              {(selectedReview.githubLink || selectedReview.documentLink || selectedReview.notes) && (
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Work Submission Details</h4>
                  
                  {selectedReview.notes && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Submission Notes</span>
                      <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">{selectedReview.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedReview.githubLink && (
                      <a 
                        href={selectedReview.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3 py-2 rounded-xl text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <FiExternalLink size={12} />
                        <span>GitHub Repository</span>
                      </a>
                    )}
                    {selectedReview.documentLink && (
                      <a 
                        href={selectedReview.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <FiExternalLink size={12} />
                        <span>Documentation Link</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-100 pt-5 mt-6 flex items-center justify-between gap-3">
              <button 
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              {selectedReview.status === 'REVISION_REQUIRED' && (
                <Link
                  to="/intern/submissions/submit"
                  state={{ taskId: selectedReview.taskId }}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <FiRotateCw size={13} />
                  <span>Update and Re-submit Work</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Feedback;
