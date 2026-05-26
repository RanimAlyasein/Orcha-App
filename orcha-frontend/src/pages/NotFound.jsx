import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  return (
    <div className="not-found-page">
      <div className="not-found-glow" />
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-sub">
        This page doesn't exist or has been moved.
      </p>
      <Link to={user ? '/dashboard' : '/'} className="btn btn-primary" style={{ marginTop: 8 }}>
        {user ? '← Back to Dashboard' : '← Go Home'}
      </Link>
    </div>
  );
}
