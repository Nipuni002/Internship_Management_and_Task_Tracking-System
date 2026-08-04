import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load page views for optimized code splitting
const Suspended = ({ children }) => (
  <React.Suspense fallback={
    <div className="min-h-[50vh] flex flex-col justify-center items-center font-sans">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      <span className="text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-wider">Loading Page View...</span>
    </div>
  }>
    {children}
  </React.Suspense>
);

// Auth Pages
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('../pages/admin/dashboard/AdminDashboard'));
const InternList = React.lazy(() => import('../pages/admin/interns/InternList'));
const AddIntern = React.lazy(() => import('../pages/admin/interns/AddIntern'));
const EditIntern = React.lazy(() => import('../pages/admin/interns/EditIntern'));
const InternDetails = React.lazy(() => import('../pages/admin/interns/InternDetails'));
const ProjectList = React.lazy(() => import('../pages/admin/projects/ProjectList'));
const CreateProject = React.lazy(() => import('../pages/admin/projects/CreateProject'));
const EditProject = React.lazy(() => import('../pages/admin/projects/EditProject'));
const ProjectDetails = React.lazy(() => import('../pages/admin/projects/ProjectDetails'));
const AdminTaskList = React.lazy(() => import('../pages/admin/tasks/TaskList'));
const AdminCreateTask = React.lazy(() => import('../pages/admin/tasks/CreateTask'));
const AdminEditTask = React.lazy(() => import('../pages/admin/tasks/EditTask'));
const AdminTaskDetails = React.lazy(() => import('../pages/admin/tasks/TaskDetails'));
const AllDailyLogs = React.lazy(() => import('../pages/admin/logs/AllDailyLogs'));
const AdminDailyLogDetails = React.lazy(() => import('../pages/admin/logs/DailyLogDetails'));
const SubmissionList = React.lazy(() => import('../pages/admin/submissions/SubmissionList'));
const ReviewSubmission = React.lazy(() => import('../pages/admin/submissions/ReviewSubmission'));
const AdminSubmissionDetails = React.lazy(() => import('../pages/admin/submissions/SubmissionDetails'));
const AdminAnalytics = React.lazy(() => import('../pages/admin/Analytics'));
const AdminProfile = React.lazy(() => import('../pages/admin/Profile'));

// Admin Additional Feature Pages
const AdminAttendance = React.lazy(() => import('../pages/admin/attendance/AdminAttendance'));
const AdminLeaveList = React.lazy(() => import('../pages/admin/leave/AdminLeaveList'));
const AdminEvaluation = React.lazy(() => import('../pages/admin/evaluations/AdminEvaluation'));

// Intern Pages
const InternDashboard = React.lazy(() => import('../pages/intern/dashboard/InternDashboard'));
const InternProjects = React.lazy(() => import('../pages/intern/Projects'));
const InternMyTasks = React.lazy(() => import('../pages/intern/tasks/MyTasks'));
const InternTaskDetails = React.lazy(() => import('../pages/intern/tasks/TaskDetails'));
const DailyLogList = React.lazy(() => import('../pages/intern/logs/DailyLogList'));
const AddDailyLog = React.lazy(() => import('../pages/intern/logs/AddDailyLog'));
const EditDailyLog = React.lazy(() => import('../pages/intern/logs/EditDailyLog'));
const InternDailyLogDetails = React.lazy(() => import('../pages/intern/logs/DailyLogDetails'));
const MySubmissions = React.lazy(() => import('../pages/intern/submissions/MySubmissions'));
const SubmitWork = React.lazy(() => import('../pages/intern/submissions/SubmitWork'));
const InternSubmissionDetails = React.lazy(() => import('../pages/intern/submissions/SubmissionDetails'));
const InternFeedback = React.lazy(() => import('../pages/intern/Feedback'));
const InternProfile = React.lazy(() => import('../pages/intern/Profile'));

// Intern Additional Feature Pages
const InternAttendance = React.lazy(() => import('../pages/intern/attendance/InternAttendance'));
const InternLeaveList = React.lazy(() => import('../pages/intern/leave/InternLeaveList'));
const InternEvaluation = React.lazy(() => import('../pages/intern/evaluations/InternEvaluation'));

// Common Pages
const AccessDenied = React.lazy(() => import('../components/common/AccessDenied'));

const NotFoundPlaceholder = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center font-sans">
    <div>
      <h1 className="text-6xl font-bold text-rose-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm mt-2">The page you are looking for does not exist.</p>
      <a href="/" className="mt-6 inline-block bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-all border border-slate-700">
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/login',
        element: <Suspended><Login /></Suspended>,
      },
      {
        path: '/register',
        element: <Suspended><Register /></Suspended>,
      },
      {
        path: '/forgot-password',
        element: <Suspended><ForgotPassword /></Suspended>,
      },
      {
        path: '/reset-password',
        element: <Suspended><ResetPassword /></Suspended>,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Admin View Routes
      {
        path: '/admin/dashboard',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminDashboard /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><InternList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/add',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AddIntern /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><InternDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/interns/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><EditIntern /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><ProjectList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/create',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><CreateProject /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><ProjectDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><EditProject /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminTaskList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/create',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminCreateTask /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminTaskDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminEditTask /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AllDailyLogs /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/logs/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminDailyLogDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><SubmissionList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminSubmissionDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions/:id/review',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><ReviewSubmission /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/analytics',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminAnalytics /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/profile',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminProfile /></Suspended>
          </RoleProtectedRoute>
        ),
      },

      // Admin Attendance Route
      {
        path: '/admin/attendance',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminAttendance /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      // Admin Leave Route
      {
        path: '/admin/leave',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminLeaveList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      // Admin Evaluations Route
      {
        path: '/admin/evaluations',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <Suspended><AdminEvaluation /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      
      // Intern View Routes
      {
        path: '/intern/dashboard',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternDashboard /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/projects',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternProjects /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/tasks',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternMyTasks /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/tasks/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternTaskDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><DailyLogList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/add',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><AddDailyLog /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternDailyLogDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs/:id/edit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><EditDailyLog /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><MySubmissions /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions/submit',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><SubmitWork /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions/:id',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternSubmissionDetails /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/feedback',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternFeedback /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/profile',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternProfile /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      // Intern Attendance Route
      {
        path: '/intern/attendance',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternAttendance /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      // Intern Leave Route
      {
        path: '/intern/leave',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternLeaveList /></Suspended>
          </RoleProtectedRoute>
        ),
      },
      // Intern Evaluations Route
      {
        path: '/intern/evaluations',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <Suspended><InternEvaluation /></Suspended>
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/access-denied',
    element: <Suspended><AccessDenied /></Suspended>,
  },
  {
    path: '*',
    element: <NotFoundPlaceholder />,
  },
]);
