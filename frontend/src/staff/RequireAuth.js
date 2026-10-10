import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center text-white/80">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/staff" state={{ from: location }} replace />;
  }

  return children;
}
