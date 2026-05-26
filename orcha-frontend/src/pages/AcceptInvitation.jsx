import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { teamApi } from '../api/teamApi';
import { useAuth } from '../context/AuthContext';

export default function AcceptInvitation() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { login } = useAuth();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [step, setStep] = useState('loading');
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) { setStep('error'); setError('Invalid invitation link.'); return; }
    teamApi.getInvitation(token)
      .then(res => { setInvite(res.data.data); setStep('form'); })
      .catch(err => { setStep('error'); setError(err.response?.data?.error?.message || 'Invitation not found or expired.'); });
  }, [token]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAccept = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await teamApi.acceptInvitation(token, form.name || undefined, form.password || undefined);
      const { token: jwt, user } = res.data.data;
      if (jwt) {
        login(jwt, user);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not accept invitation.');
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Orcha</Link>
        </div>
        <h1 className="auth-title">Accept invitation</h1>

        {step === 'loading' && <div className="loading" style={{ padding: 32 }}><div className="spinner" /> Loading...</div>}

        {step === 'error' && (
          <div className="form-error" style={{ marginTop: 16 }}>
            {error}
            <div style={{ marginTop: 10 }}><Link to="/login" className="auth-link">Back to sign in</Link></div>
          </div>
        )}

        {step === 'form' && invite && (
          <>
            <div className="form-notice" style={{ marginBottom: 16 }}>
              You've been invited to join <strong>{invite.organization?.name}</strong> as <strong>{invite.role}</strong>.
            </div>
            <form onSubmit={handleAccept} className="auth-form-body">
              {error && <div className="form-error">{error}</div>}
              {!invite.userExists && (
                <>
                  <label className="field">
                    <span>Your Name</span>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" required autoFocus />
                  </label>
                  <label className="field">
                    <span>Choose Password</span>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" required />
                  </label>
                </>
              )}
              <button className="btn btn-primary" type="submit" disabled={saving} style={{ width: '100%' }}>
                {saving ? 'Joining...' : 'Accept and join workspace'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
