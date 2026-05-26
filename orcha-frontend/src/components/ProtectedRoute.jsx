// Blocks access to a page if the user is not logged in, redirecting them to /login
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'SYSTEM_ADMIN') return <Navigate to="/dashboard" replace />;
  // Only redirect admins away from non-admin routes; don't redirect if already going to /admin
  if (!requireAdmin && user.role === 'SYSTEM_ADMIN' && pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
