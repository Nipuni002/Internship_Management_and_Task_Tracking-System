import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiCalendar, 
  FiClock, 
  FiTag, 
  FiUserPlus, 
  FiUserMinus, 
  FiUser, 
  FiMail, 
  FiBookOpen,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/projects/StatusBadge';
import AssignInternModal from '../../../components/projects/AssignInternModal';
import projectService from '../../../services/projectService';
import internService from '../../../services/internService';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [allInterns, setAllInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const projResponse = await projectService.getProjectById(id);
      if (projResponse.success && projResponse.data) {
        setProject(projResponse.data);
      } else {
        toast.error(projResponse.message || 'Failed to retrieve project details');
        navigate('/admin/projects');
        return;
      }

      // Fetch all interns to map full details
      const internResponse = await internService.getAllInterns({ size: 1000 });
      if (internResponse.success && internResponse.data) {
        setAllInterns(internResponse.data.content || []);
      }
    } catch (error) {
      console.error('Error loading project details:', error);
      toast.error(error.response?.data?.message || 'Error occurred while loading project details');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleQuickRemoveIntern = async (internId, internName) => {
    if (window.confirm(`Are you sure you want to remove ${internName} from this project?`)) {
      setActionLoading(true);
      try {
        const response = await projectService.removeInterns(id, [internId]);
        if (response.success) {
          toast.success(`${internName} removed from project successfully.`);
          fetchProjectDetails();
        } else {
          toast.error(response.message || 'Failed to remove intern');
        }
      } catch (error) {
        console.error('Error removing intern:', error);
        toast.error(error.response?.data?.message || 'Failed to remove intern from project');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading && !project) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <LoadingSpinner fullScreen={false} />
        <span className="text-slate-400 text-xs font-bold font-sans mt-2">Fetching project metadata...</span>
      </div>
    );
  }

  if (!project) return null;

  const { title, description, technology = [], deadline, status, assignedInternIds = [], createdAt, updatedAt } = project;

  // Resolve assigned interns details
  const assignedInterns = allInterns.filter((intern) => assignedInternIds.includes(intern.id));

  // Date Formatting Helper
  const formatDate = (dateString, showTime = false) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (showTime) {
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Project Scope Details"
        description="Detailed review of timeline constraints, technology configurations, and assigned engineering resources."
        actions={
          <div className="flex flex-wrap items-center gap-2 font-sans">
            <Link
              to="/admin/projects"
              className="border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiArrowLeft size={15} />
              Registry List
            </Link>

            <button
              onClick={() => setAssignModalOpen(true)}
              className="bg-emerald-50 border border-emerald-250 text-emerald-700 hover:bg-emerald-100 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiUserPlus size={15} />
              Assign Interns
            </button>

            <Link
              to={`/admin/projects/${id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg"
            >
              <FiEdit size={15} />
              Edit Project
            </Link>
          </div>
        }
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Project Meta Metrics Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                <FiActivity className="text-blue-500" />
                Core Scope
              </span>
              <StatusBadge status={status} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4">
              {title}
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[100px] whitespace-pre-line">
                  {description || <span className="text-slate-350 italic">No description provided for this project.</span>}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {technology && technology.length > 0 ? (
                    technology.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold shadow-xs"
                      >
                        <FiTag size={12} className="text-blue-500" />
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-350 italic font-semibold text-xs">No specific technologies logged.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Interns Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm relative">
            {actionLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex justify-center items-center z-10 rounded-2xl">
                <LoadingSpinner fullScreen={false} />
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Allocated Resources ({assignedInterns.length})
              </h4>
              <button
                onClick={() => setAssignModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 focus:outline-none"
              >
                <FiUserPlus size={13} />
                Manage Team
              </button>
            </div>

            {assignedInterns.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
                <FiUser size={36} className="stroke-1 mb-2 text-slate-350" />
                <p className="text-xs font-bold text-slate-700">No interns allocated to this project.</p>
                <p className="text-[10px] font-semibold mt-1">Assign interns to delegate tasks and track deliverables.</p>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="mt-4 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Allocate Resources
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignedInterns.map((intern) => {
                  const fullName = `${intern.firstName} ${intern.lastName}`;
                  return (
                    <div 
                      key={intern.id}
                      className="border border-slate-200/80 hover:border-slate-300 rounded-xl p-4 bg-white hover:shadow-xs transition-all relative group flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                          {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-bold text-slate-800 truncate" title={fullName}>
                            {fullName}
                          </h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                            ID: {intern.employeeId}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium text-slate-650">
                            <FiMail size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate" title={intern.email}>{intern.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-medium text-slate-650">
                            <FiBookOpen size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate" title={intern.degree}>{intern.degree}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-2.5 mt-3.5 flex items-center justify-between">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          intern.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`} title={`Status: ${intern.status}`}></span>
                        
                        <button
                          onClick={() => handleQuickRemoveIntern(intern.id, fullName)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-rose-50 rounded-lg flex items-center gap-1 text-[10px] font-bold focus:outline-none"
                          title={`De-allocate ${fullName}`}
                        >
                          <FiUserMinus size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Timeline & Metadata Column */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Timeline Constraint
            </h4>
            
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600 border border-amber-100 shrink-0">
                <FiCalendar size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Deadline</span>
                <span className="text-sm font-bold text-slate-800">{formatDate(deadline)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4 pt-4 border-t border-slate-150">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <FiClock />
                  Created At
                </span>
                <span className="text-slate-700 font-bold">{formatDate(createdAt, true)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <FiClock />
                  Last Updated
                </span>
                <span className="text-slate-700 font-bold">{formatDate(updatedAt, true)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssignInternModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        projectId={id}
        projectName={title}
        currentAssignedIds={assignedInternIds}
        onSuccess={fetchProjectDetails}
      />
    </PageContainer>
  );
};

export default ProjectDetails;
