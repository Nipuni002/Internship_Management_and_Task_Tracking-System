import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import SearchBar from '../../../components/tasks/SearchBar';
import FilterPanel from '../../../components/tasks/FilterPanel';
import TaskTable from '../../../components/tasks/TaskTable';
import TaskCard from '../../../components/tasks/TaskCard';
import Pagination from '../../../components/tasks/Pagination';
import AssignTaskModal from '../../../components/tasks/AssignTaskModal';
import DeleteTaskModal from '../../../components/tasks/DeleteTaskModal';

import taskService from '../../../services/taskService';
import internService from '../../../services/internService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Maps for ID to Name resolution
  const [projectsMap, setProjectsMap] = useState({});
  const [internsMap, setInternsMap] = useState({});

  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'title,asc',
    status: '',
    priority: '',
    projectId: '',
    assignedInternId: '',
    deadline: '',
    search: '',
  });

  // Assign modal state
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: '',
    currentAssigneeId: '',
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });

  // Fetch projects and interns list once to construct lookup maps
  useEffect(() => {
    const fetchMetadataMaps = async () => {
      try {
        const projResponse = await taskService.getAllProjects();
        if (projResponse.success && projResponse.data) {
          const map = {};
          projResponse.data.content.forEach((p) => {
            map[p.id] = p.name;
          });
          setProjectsMap(map);
        }

        const internResponse = await internService.getAllInterns({ size: 1000 });
        if (internResponse.success && internResponse.data) {
          const map = {};
          internResponse.data.content.forEach((i) => {
            map[i.id] = `${i.firstName} ${i.lastName}`;
          });
          setInternsMap(map);
        }
      } catch (error) {
        console.error('Error fetching layout metadata:', error);
      }
    };

    fetchMetadataMaps();
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getAllTasks(params);
      if (response.success && response.data) {
        setTasks(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to retrieve tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(error.response?.data?.message || 'Network error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [params]);

  // Page handlers
  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  // Sorting handler
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

  // Filters & Search handlers
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
      priority: '',
      projectId: '',
      assignedInternId: '',
      deadline: '',
      page: 0,
    }));
  };

  const handleSearch = (searchVal) => {
    setParams((prev) => ({
      ...prev,
      search: searchVal,
      page: 0,
    }));
  };

  // Inline status update
  const handleInlineStatusUpdate = async (id, nextStatus) => {
    setLoading(true);
    try {
      const response = await taskService.updateTaskStatus(id, { status: nextStatus });
      if (response.success) {
        toast.success(response.message || 'Task status updated successfully');
        fetchTasks();
      } else {
        toast.error(response.message || 'Failed to update status');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
      setLoading(false);
    }
  };

  // Modal assign handlers
  const triggerAssignModal = (taskId, taskTitle, currentAssigneeId) => {
    setAssignModal({
      isOpen: true,
      taskId,
      taskTitle,
      currentAssigneeId,
    });
  };

  const closeAssignModal = () => {
    setAssignModal({
      isOpen: false,
      taskId: null,
      taskTitle: '',
      currentAssigneeId: '',
    });
  };

  const handleConfirmAssignment = async (internId) => {
    const { taskId } = assignModal;
    closeAssignModal();
    setLoading(true);
    try {
      const response = await taskService.assignTask(taskId, internId);
      if (response.success) {
        toast.success(response.message || 'Task assignment updated successfully');
        fetchTasks();
      } else {
        toast.error(response.message || 'Failed to assign task');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error(error.response?.data?.message || 'Failed to assign task');
      setLoading(false);
    }
  };

  // Modal delete handlers
  const triggerDeleteModal = (taskId, taskTitle) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      taskId: null,
      taskTitle: '',
    });
  };

  const handleConfirmDelete = async () => {
    const { taskId } = deleteModal;
    closeDeleteModal();
    setLoading(true);
    try {
      const response = await taskService.deleteTask(taskId);
      if (response.success) {
        toast.success(response.message || 'Task deleted successfully');
        const isLastItem = tasks.length === 1;
        const isNotFirstPage = params.page > 0;
        if (isLastItem && isNotFirstPage) {
          setParams((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchTasks();
        }
      } else {
        toast.error(response.message || 'Failed to delete task');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tasks Checklist"
        description="Configure development task backlogs, manage intern assignments, and view work progress statuses."
        actions={
          <Link
            to="/admin/tasks/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <FiPlus size={15} />
            Create Task
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
            priority: params.priority,
            projectId: params.projectId,
            assignedInternId: params.assignedInternId,
            deadline: params.deadline,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          hideAssigneeFilter={false}
        />

        {/* List Content */}
        {loading && tasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<FiBriefcase size={36} />}
            title="No Tasks Defined"
            description="No task checklist items match your filters. Try resetting options."
            action={
              <button
                onClick={() =>
                  setParams({
                    page: 0,
                    size: 10,
                    sort: 'title,asc',
                    status: '',
                    priority: '',
                    projectId: '',
                    assignedInternId: '',
                    deadline: '',
                    search: '',
                  })
                }
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Reset Filter Parameters
              </button>
            }
          />
        ) : (
          <div className="relative">
            {/* Loading Overlay */}
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
              <TaskTable
                tasks={tasks}
                projectsMap={projectsMap}
                internsMap={internsMap}
                sortField={currentSortField}
                sortDirection={currentSortDirection}
                onSort={handleSort}
                onDelete={triggerDeleteModal}
                onAssign={triggerAssignModal}
                onUpdateStatus={handleInlineStatusUpdate}
              />
            </div>

            {/* Mobile & Tablet Card Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectsMap={projectsMap}
                  internsMap={internsMap}
                  onDelete={triggerDeleteModal}
                  onAssign={triggerAssignModal}
                  isAdmin={true}
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

      {/* Assignment Modal */}
      <AssignTaskModal
        isOpen={assignModal.isOpen}
        onClose={closeAssignModal}
        onAssign={handleConfirmAssignment}
        taskTitle={assignModal.taskTitle}
        currentAssigneeId={assignModal.currentAssigneeId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        taskTitle={deleteModal.taskTitle}
      />
    </PageContainer>
  );
};

export default TaskList;
