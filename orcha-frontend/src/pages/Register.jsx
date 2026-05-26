// Register page — creates a new user account and organization in one step
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await authApi.register(form.name, form.email, form.password, form.organizationName);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed.');
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
        <h1 className="auth-title">Create your workspace</h1>
        <form onSubmit={handleSubmit} className="auth-form-body">
          {error && <div className="form-error">{error}</div>}
          <label className="field">
            <span>Full Name</span>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" autoFocus required />
          </label>
          <label className="field">
            <span>Work Email</span>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" required />
          </label>
          <label className="field">
            <span>Organization Name</span>
            <input value={form.organizationName} onChange={e => set('organizationName', e.target.value)} placeholder="Acme Corp" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Creating workspace...' : 'Create workspace'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
