// Review Queue page — shows AI-generated outputs waiting for human approval, edit, or rejection
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewQueueApi } from '../api/reviewQueueApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import ErrorBox from '../components/ErrorBox';

function fmtT(d) { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'EDITED', label: 'Edited' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'SENT', label: 'Sent' },
];

const RQ_CARD_CLASS = {
  PENDING: 'rq-card rq-card--pending',
  APPROVED: 'rq-card rq-card--approved',
  EDITED: 'rq-card rq-card--approved',
  REJECTED: 'rq-card rq-card--rejected',
  SENT: 'rq-card rq-card--sent',
};

export default function ReviewQueue() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedOutput, setEditedOutput] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionError, setActionError] = useState(null);

  const { data: items, meta, loading, error, refetch } = useFetch(
    () => reviewQueueApi.getAll(page, filterStatus),
    [page, filterStatus]
  );

  const doAction = async (fn, onDone) => {
    setActionError(null);
    try { await fn(); onDone?.(); refetch(); }
    catch (e) { setActionError(e.response?.data?.error?.message || 'Action failed.'); }
  };

  const handleApprove = (id) => doAction(() => reviewQueueApi.approve(id));
  const handleMarkSent = (id) => doAction(() => reviewQueueApi.markSent(id));
  const handleReject = (id) => doAction(() => reviewQueueApi.reject(id, rejectNote), () => { setRejectingId(null); setRejectNote(''); });
  const handleEdit = (id) => doAction(() => reviewQueueApi.edit(id, editedOutput), () => { setEditingId(null); setEditedOutput(''); });

  const pendingCount = items?.filter(i => i.status === 'PENDING').length ?? 0;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Review Queue</div>
          <div className="topbar-sub">{meta?.total ?? 0} items &middot; {pendingCount} pending</div>
        </div>
        <Link to="/event-simulator" className="btn btn-primary">⚡ Simulate Event</Link>
      </div>
      <div className="page-body">
        <ErrorBox message={error} onRetry={refetch} />
        {actionError && <div className="alert-banner alert-banner-red" style={{ marginBottom: 12 }}>{actionError}</div>}

        <div className="filter-tabs">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value || 'all'}
              onClick={() => { setFilterStatus(f.value); setPage(1); }}
              className={`filter-tab${filterStatus === f.value ? ' active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : items?.length === 0 ? (
          <div className="card">
            <div className="empty">
              No review items{filterStatus ? ` with status "${filterStatus}"` : ''}.{' '}
              <Link to="/event-simulator" style={{ color: 'var(--green-dark)' }}>Simulate an event →</Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 16 }}>
              {items?.map(item => (
                <div key={item.id} className={RQ_CARD_CLASS[item.status] || 'rq-card'}>
                  <div className="rq-header">
                    <div className="rq-agent-avatar">
                      {(item.agent?.name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)' }}>
                        {item.agent?.name || 'Unknown Agent'}
                        {item.agent?.channel && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--light)', fontWeight: 400, background: 'var(--bg)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>
                            {item.agent.channel}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 2 }}>{fmtT(item.createdAt)}</div>
                    </div>
                    <StatusBadge value={item.status} />
                  </div>

                  <div className="rq-body">
                    <div className="rq-label">Original Output</div>
                    <div className="rq-output">
                      {item.originalOutput || <em style={{ color: 'var(--light)' }}>No output recorded</em>}
                    </div>

                    {item.editedOutput && (
                      <>
                        <div className="rq-label" style={{ marginTop: 12 }}>Edited Version</div>
                        <div className="rq-output" style={{ background: 'var(--green-pale)', borderColor: 'rgba(62,207,110,.3)' }}>
                          {item.editedOutput}
                        </div>
                      </>
                    )}

                    {item.reviewNote && (
                      <>
                        <div className="rq-label" style={{ marginTop: 12 }}>Rejection Note</div>
                        <div style={{ fontSize: 12, color: '#c0392b', padding: '8px 0' }}>{item.reviewNote}</div>
                      </>
                    )}

                    {editingId === item.id && (
                      <div style={{ marginTop: 12 }}>
                        <textarea
                          value={editedOutput}
                          onChange={e => setEditedOutput(e.target.value)}
                          rows={4}
                          className="form-input"
                          style={{ width: '100%', resize: 'vertical' }}
                          placeholder="Write the corrected version..."
                        />
                        <div className="rq-actions" style={{ marginTop: 8 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item.id)}>Save Edit</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditingId(null); setEditedOutput(''); }}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {rejectingId === item.id && (
                      <div style={{ marginTop: 12 }}>
                        <input
                          value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)}
                          placeholder="Reason for rejection (optional)"
                          className="form-input"
                          style={{ width: '100%', marginBottom: 8 }}
                        />
                        <div className="rq-actions">
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(item.id)}>Confirm Reject</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setRejectingId(null); setRejectNote(''); }}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {item.status === 'PENDING' && editingId !== item.id && rejectingId !== item.id && (
                      <div className="rq-actions">
                        <button className="rq-btn-approve" onClick={() => handleApprove(item.id)}>✓ Approve</button>
                        <button className="rq-btn-edit" onClick={() => { setEditingId(item.id); setEditedOutput(item.originalOutput || ''); }}>✏️ Edit &amp; Approve</button>
                        <button className="rq-btn-reject" onClick={() => setRejectingId(item.id)}>✕ Reject</button>
                      </div>
                    )}

                    {['APPROVED', 'EDITED'].includes(item.status) && (
                      <div className="rq-actions">
                        <button className="rq-btn-sent" onClick={() => handleMarkSent(item.id)}>📤 Mark as Sent</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        )}
      </div>
    </>
  );
}
