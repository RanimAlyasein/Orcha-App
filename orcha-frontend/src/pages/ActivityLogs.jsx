// Activity Logs page — shows a full timeline of all events and actions in the workspace
import { useState } from 'react';
import { activityApi } from '../api/activityApi';
import { useFetch } from '../hooks/useFetch';
import Pagination from '../components/Pagination';
import ErrorBox from '../components/ErrorBox';

function fmtT(d) { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }

const EVENT_BADGE_CLASS = {
  MESSAGE_RECEIVED: 'log-event log-event-green',
  MESSAGE_SENT: 'log-event log-event-green',
  TASK_STARTED: 'log-event log-event-blue',
  TASK_COMPLETED: 'log-event log-event-green',
  TASK_FAILED: 'log-event log-event-red',
  OUTPUT_GENERATED: 'log-event log-event-purple',
  ERROR: 'log-event log-event-red',
  STATUS_CHANGED: 'log-event log-event-amber',
  CUSTOM: 'log-event log-event-gray',
};

const ACTION_BADGE_CLASS = {
  CREATE: 'log-event log-event-green',
  UPDATE: 'log-event log-event-blue',
  DELETE: 'log-event log-event-red',
  LOGIN: 'log-event log-event-amber',
  LOGOUT: 'log-event log-event-gray',
  APPROVE: 'log-event log-event-green',
  REJECT: 'log-event log-event-red',
};

function getActionClass(action) {
  if (!action) return 'log-event log-event-gray';
  const key = Object.keys(ACTION_BADGE_CLASS).find(k => action.toUpperCase().includes(k));
  return key ? ACTION_BADGE_CLASS[key] : 'log-event log-event-gray';
}

export default function ActivityLogs() {
  const [tab, setTab] = useState('activity');
  const [page, setPage] = useState(1);
  const [aPage, setAPage] = useState(1);

  const { data: logs, meta, loading, error, refetch } = useFetch(() => activityApi.getLogs(page, 30), [page]);
  const { data: audits, meta: aMeta, loading: aLoading, error: aError, refetch: aRefetch } = useFetch(() => activityApi.getAuditLogs(aPage, 30), [aPage]);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Activity Logs</div>
          <div className="topbar-sub">System events and audit trail</div>
        </div>
      </div>
      <div className="page-body">
        <div className="activity-tabs">
          <button
            className={`activity-tab${tab === 'activity' ? ' active' : ''}`}
            onClick={() => { setTab('activity'); setPage(1); }}
          >
            Activity Log
            {meta?.total > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>{meta.total}</span>}
          </button>
          <button
            className={`activity-tab${tab === 'audit' ? ' active' : ''}`}
            onClick={() => { setTab('audit'); setAPage(1); }}
          >
            Audit Log
            {aMeta?.total > 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>{aMeta.total}</span>}
          </button>
        </div>

        {tab === 'activity' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Activity Log</span>
              <span className="card-meta">{meta?.total || 0} entries</span>
            </div>
            <ErrorBox message={error} onRetry={refetch} />
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : logs?.length === 0 ? (
              <div className="empty">No activity recorded yet.</div>
            ) : (
              <>
                <div className="log-list">
                  {logs?.map(log => (
                    <div key={log.id} className="log-item">
                      <div className={`log-dot${log.eventType === 'ERROR' || log.eventType === 'TASK_FAILED' ? ' log-dot-error' : log.eventType === 'STATUS_CHANGED' ? ' log-dot-status' : ''}`} style={{ marginTop: 6 }} />
                      <div style={{ flex: 1 }}>
                        <span className={EVENT_BADGE_CLASS[log.eventType] || 'log-event log-event-gray'}>
                          {log.eventType}
                        </span>
                        {log.agent && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                            {log.agent.name}
                          </span>
                        )}
                        <div className="log-message">{log.message}</div>
                        <div className="log-time">{fmtT(log.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination meta={meta} page={page} onPage={setPage} />
              </>
            )}
          </div>
        )}

        {tab === 'audit' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Audit Log</span>
              <span className="card-meta">{aMeta?.total || 0} entries</span>
            </div>
            <ErrorBox message={aError} onRetry={aRefetch} />
            {aLoading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : audits?.length === 0 ? (
              <div className="empty">No audit records yet.</div>
            ) : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Resource</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audits?.map(a => (
                        <tr key={a.id}>
                          <td>
                            <span className={getActionClass(a.action)}>{a.action}</span>
                          </td>
                          <td style={{ fontSize: 12, fontWeight: 600 }}>{a.actor?.name || a.actor?.email || '—'}</td>
                          <td style={{ fontSize: 12, color: 'var(--mid)' }}>{a.resourceType || '—'}</td>
                          <td style={{ fontSize: 12, color: 'var(--light)' }}>{fmtT(a.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination meta={aMeta} page={aPage} onPage={setAPage} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
