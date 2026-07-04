import { useState } from 'react';
import { teamApi } from '../api/teamApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ErrorBox from '../components/ErrorBox';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function Team() {
  const { user } = useAuth();
  const toast = useToast();

  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'MEMBER' });
  const [inviteError, setInviteError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: members, loading: mLoading, error: mError, refetch: mRefetch } = useFetch(() => teamApi.getMembers());

  const setI = (k, v) => setInviteForm(f => ({ ...f, [k]: v }));
  const closeInvite = () => { if (!saving) { setShowInvite(false); setInviteForm({ email: '', role: 'MEMBER' }); setInviteError(null); } };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError(null); setSaving(true);
    try {
      await teamApi.invite(inviteForm.email, inviteForm.role);
      toast(`Invitation sent to ${inviteForm.email}`);
      closeInvite();
      mRefetch();
    } catch (err) {
      setInviteError(err.response?.data?.error?.message || 'Could not send invitation.');
    } finally { setSaving(false); }
  };

  const handleRoleChange = async (memberId, role) => {
    try { await teamApi.updateRole(memberId, role); mRefetch(); }
    catch (err) { toast(err.response?.data?.error?.message || 'Could not update role.', 'error'); mRefetch(); }
  };

  const handleRemove = async (memberId) => {
    if (!confirm('Remove this member from the workspace?')) return;
    try { await teamApi.removeMember(memberId); mRefetch(); }
    catch (err) { toast(err.response?.data?.error?.message || 'Could not remove member.', 'error'); }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Team</div>
          <div className="topbar-sub">Manage your workspace members</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(true)}>+ Invite Member</button>
      </div>

      <div className="page-body">
        <ErrorBox message={mError} onRetry={mRefetch} />
        <div className="card">
          {mLoading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : members?.length === 0 ? (
            <div className="empty">No team members yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
                <tbody>
                  {members?.map(m => (
                    <tr key={m.id}>
                      <td><div style={{ fontWeight: 600 }}>{m.user?.name || '—'}</div></td>
                      <td style={{ fontSize: 12 }}>{m.user?.email}</td>
                      <td>
                        {m.user?.id === user?.id ? (
                          <StatusBadge value={m.role} />
                        ) : (
                          <select value={m.role} onChange={e => handleRoleChange(m.id, e.target.value)} className="status-select">
                            <option value="COMPANY_ADMIN">Company Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="MEMBER">Member</option>
                          </select>
                        )}
                      </td>
                      <td style={{ fontSize: 12 }}>{fmt(m.createdAt)}</td>
                      <td>
                        {m.user?.id !== user?.id && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleRemove(m.id)} style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showInvite && (
        <Modal title="Invite Team Member" subtitle="Send an email invitation to join your workspace" onClose={closeInvite}>
          <form className="form-grid" onSubmit={handleInvite} style={{ gridTemplateColumns: '1fr' }}>
            {inviteError && <div className="form-error">{inviteError}</div>}
            <label className="field">
              <span>Email address</span>
              <input type="email" value={inviteForm.email} onChange={e => setI('email', e.target.value)} placeholder="colleague@company.com" autoFocus required />
            </label>
            <label className="field">
              <span>Role</span>
              <select value={inviteForm.role} onChange={e => setI('role', e.target.value)}>
                <option value="MEMBER">Member</option>
                <option value="MANAGER">Manager</option>
                <option value="COMPANY_ADMIN">Company Admin</option>
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeInvite} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sending…' : 'Send Invitation'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
