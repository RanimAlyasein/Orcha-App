import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">← Back to home</Link>
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Orcha</Link>
        </div>
        <h1 className="auth-title">Reset your password</h1>
        {sent ? (
          <div className="form-notice" style={{ marginTop: 16 }}>
            If that email is registered, you'll receive a reset link shortly. Check your inbox (and spam folder).
            <div style={{ marginTop: 12 }}>
              <Link to="/login" className="auth-link">Back to sign in</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form-body">
            {error && <div className="form-error">{error}</div>}
            <label className="field">
              <span>Email address</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoFocus required />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
