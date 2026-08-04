import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import SearchBar from '../../../components/projects/SearchBar';
import FilterPanel from '../../../components/projects/FilterPanel';
import ProjectTable from '../../../components/projects/ProjectTable';
import ProjectCard from '../../../components/projects/ProjectCard';
import Pagination from '../../../components/projects/Pagination';
import DeleteProjectModal from '../../../components/projects/DeleteProjectModal';
import AssignInternModal from '../../../components/projects/AssignInternModal';

import projectService from '../../../services/projectService';
import internService from '../../../services/internService';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [internsMap, setInternsMap] = useState({});

  // Filter, Search, Sort & Pagination state
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'title,asc',
    status: '',
    technology: '',
    deadline: '',
    search: '',
  });

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: '',
  });

  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    id: null,
    title: '',
    assignedIds: [],
  });

  // Fetch interns to populate ID-to-Name map
  const fetchInternsMap = async () => {
    try {
      const response = await internService.getAllInterns({ size: 1000 });
      if (response.success && response.data) {
        const map = {};
        response.data.content.forEach((i) => {
          map[i.id] = `${i.firstName} ${i.lastName}`;
        });
        setInternsMap(map);
      }
    } catch (error) {
      console.error('Error loading interns map:', error);
    }
  };

  useEffect(() => {
    fetchInternsMap();
  }, []);

  // Fetch projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Map frontend pagination (0-based) to backend
      const response = await projectService.getAllProjects(params);
      if (response.success && response.data) {
        const pageData = response.data;
        setProjects(pageData.content || []);
        setTotalElements(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      const errorMsg = error.response?.data?.message || 'Network error occurred while fetching projects';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [params]);

  // Pagination Handlers
  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  // Sorting Handler
  const handleSort = (field) => {
    let newSort = `${field},asc`;
    const [currentField, currentDir] = params.sort.split(',');
    if (currentField === field) {
      newSort = `${field},${currentDir === 'asc' ? 'desc' : 'asc'}`;
    }
    setParams((prev) => ({ ...prev, sort: newSort, page: 0 }));
  };

  const currentSortField = params.sort.split(',')[0];
  const currentSortDirection = params.sort.split(',')[1];

  // Search & Filter Handlers
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
      technology: '',
      deadline: '',
      page: 0,
    }));
  };

  // Delete Project Handlers
  const triggerDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      id,
      title,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      title: '',
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteModal;
    closeDeleteModal();
    setLoading(true);
    try {
      const response = await projectService.deleteProject(id);
      if (response.success) {
        toast.success(response.message || 'Project deleted successfully.');
        // Adjust page index if last item deleted on current page
        const isLastItem = projects.length === 1;
        const hasPrevPage = params.page > 0;
        if (isLastItem && hasPrevPage) {
          setParams((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchProjects();
        }
      } else {
        toast.error(response.message || 'Failed to delete project');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
      setLoading(false);
    }
  };

  // Assign Interns Handlers
  const triggerAssignModal = (id, title, assignedIds) => {
    setAssignModal({
      isOpen: true,
      id,
      title,
      assignedIds: assignedIds || [],
    });
  };

  const closeAssignModal = () => {
    setAssignModal({
      isOpen: false,
      id: null,
      title: '',
      assignedIds: [],
    });
  };

  // Quick remove intern handler
  const handleQuickRemoveIntern = async (projectId, internId, internName) => {
    setLoading(true);
    try {
      const response = await projectService.removeInterns(projectId, [internId]);
      if (response.success) {
        toast.success(`Removed ${internName} from project.`);
        fetchProjects();
      } else {
        toast.error(response.message || 'Failed to remove intern');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error removing intern:', error);
      toast.error(error.response?.data?.message || 'Failed to remove intern');
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Project Registry"
        description="Oversee, create, and filter all registered projects. Allocate intern teams and manage scopes."
        actions={
          <Link
            to="/admin/projects/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <FiPlus size={15} />
            Create Project
          </Link>
        }
      />

      <div className="space-y-6 font-sans">
        {/* Search Panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <SearchBar initialValue={params.search} onSearch={handleSearch} />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          initialFilters={{
            status: params.status,
            technology: params.technology,
            deadline: params.deadline,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Table & Cards Container */}
        {loading && projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FiBriefcase size={36} />}
            title="No Projects Found"
            description="No projects matched your filters or search terms. Get started by creating a new project."
            action={
              <button
                onClick={() =>
                  setParams({
                    page: 0,
                    size: 10,
                    sort: 'title,asc',
                    status: '',
                    technology: '',
                    deadline: '',
                    search: '',
                  })
                }
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Reset Search parameters
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

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <ProjectTable
                projects={projects}
                internsMap={internsMap}
                sortField={currentSortField}
                sortDirection={currentSortDirection}
                onSort={handleSort}
                onDelete={triggerDeleteModal}
                onAssignInterns={triggerAssignModal}
                onRemoveIntern={handleQuickRemoveIntern}
              />
            </div>

            {/* Mobile & Tablet Card Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  internsMap={internsMap}
                  onDelete={triggerDeleteModal}
                  onAssignInterns={triggerAssignModal}
                  onRemoveIntern={handleQuickRemoveIntern}
                />
              ))}
            </div>

            {/* Pagination Controls */}
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

      {/* Confirmation Modals */}
      <DeleteProjectModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        projectName={deleteModal.title}
      />

      <AssignInternModal
        isOpen={assignModal.isOpen}
        onClose={closeAssignModal}
        projectId={assignModal.id}
        projectName={assignModal.title}
        currentAssignedIds={assignModal.assignedIds}
        onSuccess={fetchProjects}
      />
    </PageContainer>
  );
};

export default ProjectList;
