import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleProtectedRoute;
