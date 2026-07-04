// Admin Panel — system-wide management page for viewing all users and organizations (System Admin only)
import { useState } from 'react';
import { adminApi } from '../api/adminApi';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import ErrorBox from '../components/ErrorBox';

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

const TABS = ['users', 'organizations'];

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [uPage, setUPage] = useState(1);
  const [oPage, setOPage] = useState(1);

  const { data: users, meta: uMeta, loading: uLoading, error: uError, refetch: uRefetch } = useFetch(
    () => adminApi.getUsers(uPage), [uPage]
  );
  const { data: orgs, meta: oMeta, loading: oLoading, error: oError, refetch: oRefetch } = useFetch(
    () => adminApi.getOrgs(oPage), [oPage]
  );
  const toast = useToast();

  const handleToggleUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try { await adminApi.updateUserStatus(userId, newStatus); uRefetch(); }
    catch (err) { toast(err.response?.data?.error?.message || 'Could not update user status.', 'error'); }
  };

  const handleToggleOrg = async (orgId, currentIsActive) => {
    try { await adminApi.updateOrgStatus(orgId, !currentIsActive); oRefetch(); }
    catch (err) { toast(err.response?.data?.error?.message || 'Could not update organization status.', 'error'); }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Admin Panel</div>
          <div className="topbar-sub">System-wide management — System Admins only</div>
        </div>
      </div>
      <div className="page-body">
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="btn"
              style={{ background: tab === t ? 'var(--green)' : 'var(--white)', color: tab === t ? '#fff' : 'var(--mid)', border: '1px solid', borderColor: tab === t ? 'var(--green)' : 'var(--border)' }}>
              {t === 'users' ? 'All Users' : 'Organizations'}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">All Users</span>
              <span style={{ fontSize: 12, color: 'var(--light)' }}>{uMeta?.total || 0} total</span>
            </div>
            <ErrorBox message={uError} onRetry={uRefetch} />
            {uLoading ? <div className="loading"><div className="spinner" /></div> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                    <tbody>
                      {users?.map(u => (
                        <tr key={u.id}>
                          <td><div style={{ fontWeight: 600 }}>{u.name}</div></td>
                          <td style={{ fontSize: 12 }}>{u.email}</td>
                          <td><StatusBadge value={u.role} /></td>
                          <td><StatusBadge value={u.status} /></td>
                          <td style={{ fontSize: 12 }}>{fmt(u.createdAt)}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleToggleUser(u.id, u.status)}
                              style={{ color: u.status === 'ACTIVE' ? 'var(--red)' : 'var(--green)' }}>
                              {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination meta={uMeta} page={uPage} onPage={setUPage} />
              </>
            )}
          </div>
        )}

        {tab === 'organizations' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">All Organizations</span>
              <span style={{ fontSize: 12, color: 'var(--light)' }}>{oMeta?.total || 0} total</span>
            </div>
            <ErrorBox message={oError} onRetry={oRefetch} />
            {oLoading ? <div className="loading"><div className="spinner" /></div> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Slug</th><th>Plan</th><th>Status</th><th>Created</th><th></th></tr></thead>
                    <tbody>
                      {orgs?.map(o => (
                        <tr key={o.id}>
                          <td><div style={{ fontWeight: 600 }}>{o.name}</div></td>
                          <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{o.slug}</td>
                          <td><StatusBadge value={o.plan} /></td>
                          <td><StatusBadge value={o.isActive ? 'ACTIVE' : 'SUSPENDED'} /></td>
                          <td style={{ fontSize: 12 }}>{fmt(o.createdAt)}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleToggleOrg(o.id, o.isActive)}
                              style={{ color: o.isActive ? 'var(--red)' : 'var(--green)' }}>
                              {o.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination meta={oMeta} page={oPage} onPage={setOPage} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
