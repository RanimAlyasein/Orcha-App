// Profile page — lets the logged-in user update their name and change their password
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/authApi';
import StatusBadge from '../components/StatusBadge';

export default function Profile() {
  const { user, org, orgRole, isAdmin, refreshUser } = useAuth();
  const toast = useToast();

  /* ── Edit name ── */
  const [name, setName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === user?.name) return;
    setNameSaving(true);
    try {
      await authApi.updateProfile(name.trim());
      await refreshUser();
      toast('Name updated successfully.');
    } catch (err) {
      toast(err.response?.data?.error?.message || 'Could not update name.', 'error');
    } finally { setNameSaving(false); }
  };

  /* ── Change password ── */
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const setPw = (k, v) => setPwForm(f => ({ ...f, [k]: v }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next.length < 6) { toast('New password must be at least 6 characters.', 'error'); return; }
    if (pwForm.next !== pwForm.confirm) { toast('Passwords do not match.', 'error'); return; }
    setPwSaving(true);
    try {
      await authApi.changePassword(pwForm.current, pwForm.next);
      setPwForm({ current: '', next: '', confirm: '' });
      toast('Password changed successfully.');
    } catch (err) {
      toast(err.response?.data?.error?.message || 'Could not change password.', 'error');
    } finally { setPwSaving(false); }
  };

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Profile &amp; Settings</div>
          <div className="topbar-sub">Manage your account</div>
        </div>
      </div>

      <div className="page-body">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-avatar" style={{ fontSize: 26, fontWeight: 800, background: 'var(--green)', color: '#fff' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div className="detail-name">{user?.name}</div>
            <div className="detail-meta">
              <span>&#x2709; {user?.email}</span>
              <StatusBadge value={isAdmin ? 'SYSTEM_ADMIN' : (orgRole || 'MEMBER')} />
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Account info */}
          <div className="card">
            <div className="card-header"><span className="card-title">Account</span></div>
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, width: 110, paddingLeft: 0 }}>Email</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, paddingLeft: 0 }}>Role</td>
                    <td><StatusBadge value={user?.role} /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, paddingLeft: 0 }}>Verified</td>
                    <td>
                      {user?.isVerified
                        ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Verified</span>
                        : <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Pending</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, paddingLeft: 0 }}>Workspace</td>
                    <td>{org?.name || '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, paddingLeft: 0 }}>Your Role</td>
                    <td><StatusBadge value={orgRole || '—'} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit name */}
          <div className="card">
            <div className="card-header"><span className="card-title">Edit Name</span></div>
            <div className="card-body">
              <form onSubmit={handleSaveName} style={{ display: 'grid', gap: 12 }}>
                <label className="field">
                  <span>Display name</span>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    minLength={2}
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={nameSaving || !name.trim() || name.trim() === user?.name}
                >
                  {nameSaving ? 'Saving…' : 'Save Name'}
                </button>
              </form>
            </div>
          </div>

          {/* Change password */}
          <div className="card profile-pw-card">
            <div className="card-header"><span className="card-title">Change Password</span></div>
            <div className="card-body">
              <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: 12 }}>
                <label className="field">
                  <span>Current password</span>
                  <input
                    type="password"
                    value={pwForm.current}
                    onChange={e => setPw('current', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </label>
                <label className="field">
                  <span>New password</span>
                  <input
                    type="password"
                    value={pwForm.next}
                    onChange={e => setPw('next', e.target.value)}
                    placeholder="Min. 6 characters"
                    minLength={6}
                    required
                  />
                </label>
                <label className="field">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => setPw('confirm', e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary btn-sm" disabled={pwSaving}>
                  {pwSaving ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
