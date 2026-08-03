import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import InternList from '../pages/admin/interns/InternList';
import AddIntern from '../pages/admin/interns/AddIntern';
import EditIntern from '../pages/admin/interns/EditIntern';
import InternDetails from '../pages/admin/interns/InternDetails';
import ProjectList from '../pages/admin/projects/ProjectList';
import CreateProject from '../pages/admin/projects/CreateProject';
import EditProject from '../pages/admin/projects/EditProject';
import ProjectDetails from '../pages/admin/projects/ProjectDetails';
import AdminTaskList from '../pages/admin/tasks/TaskList';
import AdminCreateTask from '../pages/admin/tasks/CreateTask';
import AdminEditTask from '../pages/admin/tasks/EditTask';
import AdminTaskDetails from '../pages/admin/tasks/TaskDetails';
import AllDailyLogs from '../pages/admin/logs/AllDailyLogs';
import AdminDailyLogDetails from '../pages/admin/logs/DailyLogDetails';
import SubmissionList from '../pages/admin/submissions/SubmissionList';
import ReviewSubmission from '../pages/admin/submissions/ReviewSubmission';
import AdminSubmissionDetails from '../pages/admin/submissions/SubmissionDetails';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminProfile from '../pages/admin/Profile';
import AdminSettings from '../pages/admin/Settings';

// Intern Pages
import InternDashboard from '../pages/intern/InternDashboard';
import InternProjects from '../pages/intern/Projects';
import InternMyTasks from '../pages/intern/tasks/MyTasks';
import InternTaskDetails from '../pages/intern/tasks/TaskDetails';
import DailyLogList from '../pages/intern/logs/DailyLogList';
import AddDailyLog from '../pages/intern/logs/AddDailyLog';
import EditDailyLog from '../pages/intern/logs/EditDailyLog';
import InternDailyLogDetails from '../pages/intern/logs/DailyLogDetails';
import MySubmissions from '../pages/intern/submissions/MySubmissions';
import SubmitWork from '../pages/intern/submissions/SubmitWork';
import InternSubmissionDetails from '../pages/intern/submissions/SubmissionDetails';
import InternFeedback from '../pages/intern/Feedback';
import InternProfile from '../pages/intern/Profile';

// Common Pages
import AccessDenied from '../components/common/AccessDenied';



const NotFoundPlaceholder = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center font-sans">
    <div>
      <h1 className="text-6xl font-bold text-rose-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm mt-2">The page you are looking for does not exist.</p>
      <a href="/" className="mt-6 inline-block bg-slate-800 hover:bg-slate-705 text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-all border border-slate-700">
        Back Home
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Admin View Routes
      {
        path: '/admin/dashboard',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <InternList />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/add',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AddIntern />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <InternDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <EditIntern />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <ProjectList />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/create',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <CreateProject />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <ProjectDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <EditProject />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminTaskList />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/create',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminCreateTask />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminTaskDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminEditTask />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AllDailyLogs />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/logs/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminDailyLogDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <SubmissionList />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminSubmissionDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions/:id/review',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <ReviewSubmission />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/analytics',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminAnalytics />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/profile',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminProfile />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/settings',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminSettings />
          </RoleProtectedRoute>
        ),
      },
      
      // Intern View Routes
      {
        path: '/intern/dashboard',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/projects',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternProjects />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/tasks',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternMyTasks />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/tasks/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternTaskDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <DailyLogList />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/add',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <AddDailyLog />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternDailyLogDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <EditDailyLog />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <MySubmissions />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions/submit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <SubmitWork />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternSubmissionDetails />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/feedback',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternFeedback />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/profile',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternProfile />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/access-denied',
    element: <AccessDenied />,
  },
  {
    path: '*',
    element: <NotFoundPlaceholder />,
  },
]);
