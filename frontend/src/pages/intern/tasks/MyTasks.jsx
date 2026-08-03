import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';

import SearchBar from '../../../components/tasks/SearchBar';
import FilterPanel from '../../../components/tasks/FilterPanel';
import TaskCard from '../../../components/tasks/TaskCard';
import Pagination from '../../../components/tasks/Pagination';
import TaskStatusBadge from '../../../components/tasks/TaskStatusBadge';
import PriorityBadge from '../../../components/tasks/PriorityBadge';

import taskService from '../../../services/taskService';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [projectsMap, setProjectsMap] = useState({});

  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'deadline,asc', // defaults to deadline sort for interns to see closest deadlines first
    status: '',
    priority: '',
    projectId: '',
    deadline: '',
    search: '',
  });

  // Fetch project map
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await taskService.getAllProjects();
        if (response.success && response.data) {
          const map = {};
          response.data.content.forEach((p) => {
            map[p.id] = p.name;
          });
          setProjectsMap(map);
        }
      } catch (error) {
        console.error('Error fetching project lookup map:', error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch task list
  const fetchMyTasks = async () => {
    if (!user || !user.userId) return;
    setLoading(true);
    try {
      const response = await taskService.getAllTasks({
        ...params,
        assignedInternId: user.userId,
      });
      if (response.success && response.data) {
        setTasks(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to retrieve assigned tasks');
      }
    } catch (error) {
      console.error('Error loading intern tasks:', error);
      toast.error(error.response?.data?.message || 'Network error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [params, user]);

  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

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

  const handleInlineStatusChange = async (id, nextStatus) => {
    setLoading(true);
    try {
      const response = await taskService.updateTaskStatus(id, { status: nextStatus });
      if (response.success) {
        toast.success(response.message || 'Task status updated');
        fetchMyTasks();
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

  const renderSortIcon = (field) => {
    if (currentSortField !== field) return null;
    return currentSortDirection === 'asc' ? (
      <FiArrowUp size={12} className="ml-1 text-blue-600 inline" />
    ) : (
      <FiArrowDown size={12} className="ml-1 text-blue-600 inline" />
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="My Assigned Tasks"
        description="View and update progress statuses for tasks assigned to you."
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
            deadline: params.deadline,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          hideAssigneeFilter={true}
        />

        {/* Task Grid & Table list */}
        {loading && tasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<FiBriefcase size={36} />}
            title="No Tasks Assigned"
            description="You currently do not have any tasks assigned matching your filters."
          />
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex justify-center items-center z-10 rounded-xl">
                <div className="bg-slate-900 text-white px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold shadow-lg">
                  <LoadingSpinner fullScreen={false} />
                  <span>Syncing...</span>
                </div>
              </div>
            )}

            {/* Desktop View Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto w-full bg-white rounded-t-xl border-x border-t border-slate-200/80 shadow-sm">
                <table className="min-w-full divide-y divide-slate-150 text-left text-xs font-semibold text-slate-500">
                  <thead className="bg-slate-50 text-slate-405 uppercase tracking-wider select-none">
                    <tr>
                      <th
                        onClick={() => handleSort('title')}
                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        Task Title {renderSortIcon('title')}
                      </th>
                      <th className="px-6 py-4">Project</th>
                      <th
                        onClick={() => handleSort('priority')}
                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        Priority {renderSortIcon('priority')}
                      </th>
                      <th
                        onClick={() => handleSort('status')}
                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        Status {renderSortIcon('status')}
                      </th>
                      <th
                        onClick={() => handleSort('deadline')}
                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        Deadline {renderSortIcon('deadline')}
                      </th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                    {tasks.map((task) => {
                      const projectName = projectsMap[task.projectId] || 'Assigned Project';
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3.5 max-w-xs font-bold text-slate-900 truncate">
                            {task.title}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-550">
                            {projectName}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <PriorityBadge priority={task.priority} />
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <TaskStatusBadge status={task.status} />
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-805">
                            {task.deadline}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/intern/tasks/${task.id}`}
                                className="p-1.5 rounded-lg text-blue-650 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <FiEye size={15} />
                              </Link>

                              <select
                                value={task.status}
                                onChange={(e) => handleInlineStatusChange(task.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="TODO">Todo</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="SUBMITTED">Submitted</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectsMap={projectsMap}
                  internsMap={{ [user.userId]: user.fullName }}
                  isAdmin={false}
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
    </PageContainer>
  );
};

export default MyTasks;
