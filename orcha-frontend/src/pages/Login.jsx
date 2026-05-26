// Login page — lets users enter their email and password to sign into the app
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      const { token, user } = res.data.data;
      login(token, user);
      const destination = user.role === 'SYSTEM_ADMIN' ? '/admin' : '/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed.');
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
          <p>AI Agent Management</p>
        </div>
        <h1 className="auth-title">Sign in to your workspace</h1>
        <form onSubmit={handleSubmit} className="auth-form-body">
          {error && <div className="form-error">{error}</div>}
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" autoFocus required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required />
          </label>
          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </div>
        <div className="auth-demo">
          <strong>Demo credentials</strong>
          <div>manager@orcha.demo / password123 (Company Admin)</div>
          <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 2 }}>admin@orcha.demo / password123 (System Admin)</div>
        </div>
      </div>
    </div>
  );
}
