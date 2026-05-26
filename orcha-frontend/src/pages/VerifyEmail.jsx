import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) { setStatus('error'); setError('No verification token found.'); return; }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error');
        setError(err.response?.data?.error?.message || 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Orcha</Link>
        </div>
        <h1 className="auth-title">Email verification</h1>
        {status === 'loading' && <div className="loading" style={{ padding: 32 }}><div className="spinner" /> Verifying...</div>}
        {status === 'success' && (
          <div className="form-notice" style={{ marginTop: 16 }}>
            Email verified successfully! Your account is now active.
            <div style={{ marginTop: 12 }}>
              <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="form-error" style={{ marginTop: 16 }}>
            {error}
            <div style={{ marginTop: 10 }}>
              <Link to="/login" className="auth-link">Back to sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
