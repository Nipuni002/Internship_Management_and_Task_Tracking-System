import React, { useState, useEffect } from 'react';
import { FiUsers, FiFolder, FiCheckSquare, FiClock, FiActivity, FiAlertCircle, FiRotateCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import PageContainer from '../../../components/common/PageContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// Dashboard Components
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import StatisticCard from '../../../components/dashboard/StatisticCard';
import DashboardSummary from '../../../components/dashboard/DashboardSummary';
import QuickActions from '../../../components/dashboard/QuickActions';
import RecentActivity from '../../../components/dashboard/RecentActivity';

// Chart Components
import TaskStatusChart from '../../../components/dashboard/TaskStatusChart';
import ProjectProgressChart from '../../../components/dashboard/ProjectProgressChart';
import MonthlyActivityChart from '../../../components/dashboard/MonthlyActivityChart';

// Services
import dashboardService from '../../../services/dashboardService';
import projectService from '../../../services/projectService';
import taskService from '../../../services/taskService';
import dailyLogService from '../../../services/dailyLogService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // States
  const [dashboardStats, setDashboardStats] = useState({
    totalInterns: 0,
    activeInterns: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    revisionRequiredTasks: 0,
    recentActivities: [],
  });

  const [chartsData, setChartsData] = useState({
    tasks: [],
    projects: [],
    activity: [],
  });

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Execute parallel requests to keep operations speedy and unified
      const [statsRes, projectsRes, tasksRes, logsRes] = await Promise.all([
        dashboardService.getAdminDashboard(),
        projectService.getAllProjects({ size: 1000 }),
        taskService.getAllTasks({ size: 1000 }),
        dailyLogService.getAllLogs({ size: 1000 }),
      ]);

      // 1. Process Stats
      if (statsRes.success && statsRes.data) {
        setDashboardStats(statsRes.data);
      } else {
        toast.error(statsRes.message || 'Failed to fetch dashboard stats');
      }

      const projectsList = (projectsRes.success && projectsRes.data?.content) || [];
      const tasksList = (tasksRes.success && tasksRes.data?.content) || [];
      const logsList = (logsRes.success && logsRes.data?.content) || [];

      // 2. Process Task Chart Data (Pie Chart)
      const taskStatusCounts = {
        'TO DO': 0,
        'IN PROGRESS': 0,
        'SUBMITTED': 0,
        'REVISION REQUIRED': 0,
        'COMPLETED': 0,
      };

      tasksList.forEach((task) => {
        const status = task.status?.replace(/_/g, ' ').toUpperCase();
        if (taskStatusCounts[status] !== undefined) {
          taskStatusCounts[status]++;
        }
      });

      const processedTasksChart = Object.keys(taskStatusCounts).map((key) => ({
        name: key,
        value: taskStatusCounts[key],
      }));

      // 3. Process Project Chart Data (Bar Chart)
      const processedProjectsChart = projectsList.map((p) => {
        const projTasks = tasksList.filter((t) => t.projectId === p.id);
        const total = projTasks.length;
        const completed = projTasks.filter((t) => t.status === 'COMPLETED').length;
        
        let progress = 0;
        if (p.status === 'COMPLETED') {
          progress = 100;
        } else if (total > 0) {
          progress = Math.round((completed / total) * 100);
        }
        return {
          name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
          progress,
        };
      });

      // 4. Process Monthly Activity Chart Data (Area Chart)
      const logsByMonth = {};
      logsList.forEach((log) => {
        if (!log.date) return;
        
        // Parse date yyyy-MM-dd
        const dateParts = log.date.split('-');
        if (dateParts.length >= 2) {
          const year = dateParts[0];
          const monthIndex = parseInt(dateParts[1], 10) - 1;
          const dummyDate = new Date(year, monthIndex, 1);
          const monthLabel = dummyDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          logsByMonth[monthLabel] = (logsByMonth[monthLabel] || 0) + (log.hoursWorked || 0);
        }
      });

      // Sort chronological
      const sortedMonths = Object.keys(logsByMonth).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const processedActivityChart = sortedMonths.map((month) => ({
        name: month,
        hours: logsByMonth[month],
      }));

      setChartsData({
        tasks: processedTasksChart,
        projects: processedProjectsChart.slice(0, 8), // limits to top 8 projects to avoid overcrowding
        activity: processedActivityChart,
      });

      if (isRefresh) {
        toast.success('Dashboard metrics updated');
      }
    } catch (error) {
      console.error('Error fetching administrator dashboard data:', error);
      toast.error('Could not populate dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <LoadingSpinner fullScreen={false} />
        <span className="text-slate-400 text-xs font-bold font-sans mt-2">Compiling Administrator Dashboard...</span>
      </div>
    );
  }

  // Define statistic cards mapping
  const statsList = [
    { title: 'Total Interns', value: dashboardStats.totalInterns, colorTheme: 'blue', icon: <FiUsers size={20} /> },
    { title: 'Active Interns', value: dashboardStats.activeInterns, colorTheme: 'emerald', icon: <FiActivity size={20} /> },
    { title: 'Total Projects', value: dashboardStats.totalProjects, colorTheme: 'violet', icon: <FiFolder size={20} /> },
    { title: 'Active Projects', value: dashboardStats.activeProjects, colorTheme: 'cyan', icon: <FiFolder size={20} /> },
    { title: 'Pending Tasks', value: dashboardStats.pendingTasks, colorTheme: 'amber', icon: <FiClock size={20} /> },
    { title: 'Completed Tasks', value: dashboardStats.completedTasks, colorTheme: 'emerald', icon: <FiCheckSquare size={20} /> },
    { title: 'Overdue Tasks', value: dashboardStats.overdueTasks, colorTheme: 'rose', icon: <FiAlertCircle size={20} /> },
    { title: 'Revision Tasks', value: dashboardStats.revisionRequiredTasks, colorTheme: 'rose', icon: <FiRotateCw size={20} /> },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        {/* Header bar */}
        <div className="relative">
          <DashboardHeader title="Administrator Dashboard" user={user} />
          <button 
            onClick={() => loadDashboardData(true)} 
            disabled={refreshing}
            className="absolute top-6 right-6 md:top-8 md:right-8 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 disabled:text-slate-300 p-2.5 rounded-xl border border-slate-200/50 hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Reload Stats"
          >
            <FiRotateCw className={`shrink-0 ${refreshing ? 'animate-spin' : ''}`} size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* 4x2 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
          {statsList.map((stat, idx) => (
            <StatisticCard
              key={idx}
              title={stat.title}
              value={stat.value}
              colorTheme={stat.colorTheme}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Sub-layout section for Actions, Health Summary & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
          <div>
            <QuickActions role="ROLE_ADMIN" />
          </div>
          <div>
            <DashboardSummary stats={dashboardStats} role="ROLE_ADMIN" />
          </div>
          <div>
            <RecentActivity activities={dashboardStats.recentActivities} />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TaskStatusChart data={chartsData.tasks} />
          </div>
          <div className="lg:col-span-1">
            <ProjectProgressChart data={chartsData.projects} />
          </div>
          <div className="lg:col-span-1 md:col-span-2">
            <MonthlyActivityChart data={chartsData.activity} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
