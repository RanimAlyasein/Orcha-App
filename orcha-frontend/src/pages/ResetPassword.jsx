import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(null);
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="form-error">Invalid or missing reset token. <Link to="/forgot-password" className="auth-link">Request a new link.</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Orcha</Link>
        </div>
        <h1 className="auth-title">Set new password</h1>
        {done ? (
          <div className="form-notice" style={{ marginTop: 16 }}>
            Password updated! Redirecting you to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form-body">
            {error && <div className="form-error">{error}</div>}
            <label className="field">
              <span>New Password</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" autoFocus required />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving...' : 'Set new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
