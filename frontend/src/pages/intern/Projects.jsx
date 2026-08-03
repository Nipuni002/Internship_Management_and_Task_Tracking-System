import React, { useState, useEffect } from 'react';
import { FiCalendar, FiTag, FiClock, FiUser, FiInfo, FiX, FiBriefcase, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/projects/StatusBadge';

import projectService from '../../services/projectService';
import internService from '../../services/internService';
import useAuth from '../../hooks/useAuth';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [internsMap, setInternsMap] = useState({});
  const [currentInternId, setCurrentInternId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selected project for details modal
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadProjectsAndMetadata = async () => {
      setLoading(true);
      try {
        // Fetch current intern profile first to obtain their actual Intern ID
        let activeInternId = null;
        try {
          const profileResponse = await internService.getCurrentInternProfile();
          if (profileResponse.success && profileResponse.data) {
            activeInternId = profileResponse.data.id;
            setCurrentInternId(activeInternId);
          }
        } catch (err) {
          console.warn('Failed to load current intern profile:', err);
        }

        const resolvedInternId = activeInternId || user?.userId;

        // Fetch all interns to map teammate names
        const map = {};
        try {
          const internResponse = await internService.getAllInterns({ size: 1000 });
          if (internResponse.success && internResponse.data) {
            internResponse.data.content.forEach((i) => {
              map[i.id] = `${i.firstName} ${i.lastName}`;
            });
          }
        } catch (err) {
          console.warn('Failed to load teammate names:', err);
        }
        setInternsMap(map);

        // Fetch all projects
        const projResponse = await projectService.getAllProjects({ size: 1000 });
        if (projResponse.success && projResponse.data) {
          // Filter projects where logged-in intern is assigned
          const allProjects = projResponse.data.content || [];
          const assigned = allProjects.filter(p => 
            p.assignedInternIds && p.assignedInternIds.includes(resolvedInternId)
          );
          setProjects(assigned);
        } else {
          toast.error(projResponse.message || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching intern projects:', error);
        toast.error(error.response?.data?.message || 'Error occurred while loading projects');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      loadProjectsAndMetadata();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="My Projects"
        description="Review all development projects you have been allocated to, check timelines, and view team allocations."
      />

      <div className="font-sans">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FiBriefcase size={36} />}
            title="No Allocated Projects"
            description="You are currently not assigned to any development projects. Please check back later or consult your administrator."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {projects.map((project) => {
              const { id, title, description, technology = [], deadline, status, assignedInternIds = [] } = project;
              
              // Filter out current user from teammate list
              const teammateIds = assignedInternIds.filter(tid => tid !== (currentInternId || user?.userId));

              return (
                <div 
                  key={id} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{title}</h4>
                      <StatusBadge status={status} />
                    </div>

                    {/* Body */}
                    <div className="space-y-3 pb-3">
                      {/* Description */}
                      <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">
                        {description || <span className="text-slate-350 italic">No description available.</span>}
                      </p>

                      {/* Tech Stack */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tech Stack</span>
                        <div className="flex flex-wrap gap-1">
                          {technology && technology.length > 0 ? (
                            technology.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold"
                              >
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-350 italic text-[10px]">None</span>
                          )}
                        </div>
                      </div>

                      {/* Teammates */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <FiUsers size={11} />
                          <span>Team Members ({assignedInternIds.length})</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {teammateIds.length > 0 ? (
                            teammateIds.map((tid) => (
                              <span 
                                key={tid}
                                className="px-2 py-0.5 rounded-full bg-slate-150 text-slate-650 text-[10px] font-semibold border border-slate-200"
                              >
                                {internsMap[tid] || 'Teammate'}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-450 italic font-medium pl-0.5">Solo Project</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      <FiCalendar size={13} className="text-slate-400" />
                      <span>Due: {formatDate(deadline)}</span>
                    </div>

                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer focus:outline-none"
                    >
                      <FiInfo size={13} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800">Project Details</h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Close details"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">{selectedProject.title}</h4>
                  <StatusBadge status={selectedProject.status} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-450 font-bold uppercase tracking-wider">
                  <FiCalendar size={13} className="text-slate-450" />
                  <span>Deadline: {formatDate(selectedProject.deadline)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Description</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-line min-h-[100px]">
                  {selectedProject.description || <span className="italic text-slate-350">No description provided.</span>}
                </p>
              </div>

              {/* Technology Stack */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technology Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technology && selectedProject.technology.length > 0 ? (
                    selectedProject.technology.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-350 italic text-xs">No specific technologies logged.</span>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Team Members</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                  {selectedProject.assignedInternIds && selectedProject.assignedInternIds.length > 0 ? (
                    selectedProject.assignedInternIds.map((tid) => {
                      const name = internsMap[tid] || 'Loading...';
                      const isMe = tid === (currentInternId || user?.userId);
                      return (
                        <div key={tid} className="flex items-center gap-3 p-3 select-none">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800">
                              {name}
                            </span>
                            {isMe && (
                              <span className="ml-2 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No interns assigned.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Projects;
