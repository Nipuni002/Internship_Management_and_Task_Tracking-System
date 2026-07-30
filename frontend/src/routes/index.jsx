import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminInterns from '../pages/admin/Interns';
import AdminProjects from '../pages/admin/Projects';
import AdminTasks from '../pages/admin/Tasks';
import AdminLogs from '../pages/admin/Logs';
import AdminSubmissions from '../pages/admin/Submissions';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminProfile from '../pages/admin/Profile';
import AdminSettings from '../pages/admin/Settings';

// Intern Pages
import InternDashboard from '../pages/intern/InternDashboard';
import InternProjects from '../pages/intern/Projects';
import InternTasks from '../pages/intern/Tasks';
import InternLogs from '../pages/intern/Logs';
import InternSubmissions from '../pages/intern/Submissions';
import InternFeedback from '../pages/intern/Feedback';
import InternProfile from '../pages/intern/Profile';

// Common Pages
import AccessDenied from '../components/common/AccessDenied';

const RegisterPlaceholder = () => (
  <div className="text-center text-slate-200">
    <p>Registration Form Placeholder</p>
    <a href="/login" className="text-emerald-400 hover:underline mt-4 inline-block font-sans text-xs">Back to Login</a>
  </div>
);

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
        element: <RegisterPlaceholder />,
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
            <AdminInterns />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/projects',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminProjects />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/tasks',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminTasks />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminLogs />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/admin/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_ADMIN">
            <AdminSubmissions />
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
            <InternTasks />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/logs',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternLogs />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/intern/submissions',
        element: (
          <RoleProtectedRoute allowedRoles="ROLE_INTERN">
            <InternSubmissions />
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
