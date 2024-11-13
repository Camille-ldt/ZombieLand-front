
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== undefined && user.role_id !== requiredRole) { // Comparer les nombres
    return <p>Accès refusé : vous n'avez pas les autorisations nécessaires.</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;