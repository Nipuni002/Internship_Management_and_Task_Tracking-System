import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiCheckSquare, FiClock, FiActivity, FiMessageSquare, FiRotateCw } from 'react-icons/fi';
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
import internService from '../../../services/internService';
import submissionService from '../../../services/submissionService';

const InternDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // States
  const [dashboardStats, setDashboardStats] = useState({
    assignedProjects: 0,
    assignedTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    latestFeedback: 'No feedback received yet',
    dailyLogSummary: {
      totalLogsSubmitted: 0,
      totalHoursWorked: 0,
    },
  });

  const [chartsData, setChartsData] = useState({
    tasks: [],
    projects: [],
    activity: [],
  });

  const [activitiesList, setActivitiesList] = useState([]);

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // 1. Fetch current intern profile to get ID
      const profileRes = await internService.getCurrentInternProfile();
      if (!profileRes.success || !profileRes.data) {
        throw new Error('Failed to resolve intern profile');
      }
      const internId = profileRes.data.id;

      // 2. Fetch parallel data sets restricted to intern
      const [statsRes, projectsRes, tasksRes, logsRes, submissionsRes] = await Promise.all([
        dashboardService.getInternDashboard(),
        projectService.getAllProjects({ size: 1000 }),
        taskService.getAllTasks({ size: 1000 }),
        dailyLogService.getAllLogs({ size: 1000 }),
        submissionService.getAllSubmissions({ size: 5 }),
      ]);

      // 3. Process Stats
      if (statsRes.success && statsRes.data) {
        setDashboardStats(statsRes.data);
      } else {
        toast.error(statsRes.message || 'Failed to retrieve workspace statistics');
      }

      const projectsList = (projectsRes.success && projectsRes.data?.content) || [];
      const tasksList = (tasksRes.success && tasksRes.data?.content) || [];
      const logsList = (logsRes.success && logsRes.data?.content) || [];
      const submissionsList = (submissionsRes.success && submissionsRes.data?.content) || [];

      // Filter projects that this intern is assigned to
      const assignedProjectsList = projectsList.filter(
        (p) => p.assignedInternIds && p.assignedInternIds.includes(internId)
      );

      // 4. Task status chart data (Pie Chart)
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

      // 5. Project completion chart (Bar Chart)
      const processedProjectsChart = assignedProjectsList.map((p) => {
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

      // 6. Monthly activity chart (Area Chart)
      const logsByMonth = {};
      logsList.forEach((log) => {
        if (!log.date) return;
        const dateParts = log.date.split('-');
        if (dateParts.length >= 2) {
          const year = dateParts[0];
          const monthIndex = parseInt(dateParts[1], 10) - 1;
          const dummyDate = new Date(year, monthIndex, 1);
          const monthLabel = dummyDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          logsByMonth[monthLabel] = (logsByMonth[monthLabel] || 0) + (log.hoursWorked || 0);
        }
      });

      const sortedMonths = Object.keys(logsByMonth).sort((a, b) => new Date(a) - new Date(b));
      const processedActivityChart = sortedMonths.map((month) => ({
        name: month,
        hours: logsByMonth[month],
      }));

      setChartsData({
        tasks: processedTasksChart,
        projects: processedProjectsChart.slice(0, 8),
        activity: processedActivityChart,
      });

      // 7. Compile Chronological Recent Activity for Intern
      const tempActivities = [];

      // Add recently updated tasks
      tasksList.slice(0, 5).forEach((t) => {
        let actType = 'TASK';
        let actTitle = `Task assigned to you: ${t.title}`;
        if (t.status === 'COMPLETED') {
          actType = 'COMPLETED';
          actTitle = `You completed task: ${t.title}`;
        } else if (t.status === 'REVISION_REQUIRED') {
          actType = 'FEEDBACK';
          actTitle = `Revision requested for: ${t.title}`;
        }
        
        tempActivities.push({
          type: actType,
          title: actTitle,
          timestamp: t.updatedAt || t.createdAt,
        });
      });

      // Add recent submissions
      submissionsList.forEach((sub) => {
        const matchingTask = tasksList.find((t) => t.id === sub.taskId);
        const taskTitle = matchingTask ? matchingTask.title : 'Task';
        tempActivities.push({
          type: 'SUBMISSION',
          title: `You submitted task: ${taskTitle}`,
          timestamp: sub.submittedAt,
        });

        if (sub.feedback) {
          tempActivities.push({
            type: 'FEEDBACK',
            title: `Feedback received: "${sub.feedback.substring(0, 40)}${sub.feedback.length > 40 ? '...' : ''}" for ${taskTitle}`,
            timestamp: sub.updatedAt || sub.submittedAt,
          });
        }
      });

      // Add recent work logs
      logsList.slice(0, 5).forEach((l) => {
        tempActivities.push({
          type: 'DAILY_LOG',
          title: `Logged ${l.hoursWorked} hours: "${l.notes?.substring(0, 45) || 'No notes'}"`,
          timestamp: l.createdAt || l.date,
        });
      });

      // Sort combined array and take top 5
      tempActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setActivitiesList(tempActivities.slice(0, 5));

      if (isRefresh) {
        toast.success('Workspace updated');
      }
    } catch (error) {
      console.error('Error loading intern workspace:', error);
      toast.error('Failed to populate your workspace dashboard');
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
        <span className="text-slate-400 text-xs font-bold font-sans mt-2">Compiling Intern Workspace...</span>
      </div>
    );
  }

  // Display feedback beautifully in a truncated string or fallback
  const feedbackDisplay = dashboardStats.latestFeedback && dashboardStats.latestFeedback !== 'No feedback received yet'
    ? (dashboardStats.latestFeedback.length > 18 ? dashboardStats.latestFeedback.substring(0, 18) + '...' : dashboardStats.latestFeedback)
    : 'None';

  const statsList = [
    { title: 'Assigned Projects', value: dashboardStats.assignedProjects, colorTheme: 'blue', icon: <FiBriefcase size={20} /> },
    { title: 'Assigned Tasks', value: dashboardStats.assignedTasks, colorTheme: 'violet', icon: <FiCheckSquare size={20} /> },
    { title: 'Pending Tasks', value: dashboardStats.pendingTasks, colorTheme: 'amber', icon: <FiClock size={20} /> },
    { title: 'Completed Tasks', value: dashboardStats.completedTasks, colorTheme: 'emerald', icon: <FiCheckSquare size={20} /> },
    { title: 'Logs Submitted', value: dashboardStats.dailyLogSummary?.totalLogsSubmitted || 0, colorTheme: 'cyan', icon: <FiActivity size={20} /> },
    { title: 'Latest Feedback', value: feedbackDisplay, colorTheme: 'rose', icon: <FiMessageSquare size={20} /> },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        {/* Header bar */}
        <div className="relative">
          <DashboardHeader title="My Workspace" user={user} />
          <button 
            onClick={() => loadDashboardData(true)} 
            disabled={refreshing}
            className="absolute top-6 right-6 md:top-8 md:right-8 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 disabled:text-slate-300 p-2.5 rounded-xl border border-slate-200/50 hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Reload Workspace"
          >
            <FiRotateCw className={`shrink-0 ${refreshing ? 'animate-spin' : ''}`} size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* 3x2 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2">
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
            <QuickActions role="ROLE_INTERN" />
          </div>
          <div>
            <DashboardSummary stats={dashboardStats} role="ROLE_INTERN" />
          </div>
          <div>
            <RecentActivity activities={activitiesList} />
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

export default InternDashboard;
