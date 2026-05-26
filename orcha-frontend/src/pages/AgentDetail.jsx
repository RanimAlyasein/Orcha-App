// Agent detail page — shows a single agent's info, tasks, events, and webhook integration details
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { agentApi } from '../api/agentApi';
import { taskApi } from '../api/taskApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
function fmtT(d) { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }

const INIT_TASK = { title: '', description: '', status: 'TODO', priority: 'MEDIUM' };

const TABS = [
  { id: 'events', label: 'Events' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'logs', label: 'Activity Log' },
  { id: 'integration', label: 'Integration Setup' },
];

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [taskPage, setTaskPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INIT_TASK);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const { data: agent, loading: aLoading, error: aError } = useFetch(() => agentApi.getOne(id), [id]);
  const { data: tasks, meta: tMeta, loading: tLoading, refetch: refetchTasks } = useFetch(() => agentApi.getTasks(id, taskPage), [id, taskPage]);
  const { data: logs, meta: lMeta, loading: lLoading } = useFetch(() => agentApi.getLogs(id, logPage), [id, logPage]);
  const { data: events, meta: eMeta, loading: eLoading } = useFetch(() => agentApi.getEvents(id, eventsPage), [id, eventsPage]);
  const { data: integration, loading: iLoading } = useFetch(() => agentApi.getIntegration(id), [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => { if (!saving) { setShowModal(false); setForm(INIT_TASK); setFormError(null); } };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      await taskApi.create({ ...form, agentId: id });
      close();
      setTab('tasks');
      refetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Could not create task.');
    } finally {
      setSaving(false);
    }
  };

  if (aLoading) return <div className="loading"><div className="spinner" /> Loading agent...</div>;
  if (aError) return <div className="page-body"><div className="error-box">&#9888; {aError}</div></div>;
  if (!agent) return null;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">{agent.name}</div>
          <div className="topbar-sub">{agent.channel || agent.type} &middot; <StatusBadge value={agent.connectionStatus} /></div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>&larr; Back</button>
        </div>
      </div>

      <div className="page-body">
        <div className="breadcrumb">
          <Link to="/agents">Agents</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{agent.name}</span>
        </div>

        <div className="detail-header">
          <div className="detail-avatar">🤖</div>
          <div style={{ flex: 1 }}>
            <div className="detail-name">{agent.name}</div>
            <div className="detail-meta">
              <span>{agent.channel || agent.type}</span>
              {agent.provider && <span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--green-pale)', padding: '1px 7px', borderRadius: 4 }}>{agent.provider}</span>}
              <StatusBadge value={agent.connectionStatus} />
              {agent.reviewRequired && <span className="badge badge-pending">Review Required</span>}
            </div>
            {agent.description && <p style={{ fontSize: 13, color: 'var(--light)', marginTop: 10, maxWidth: 520 }}>{agent.description}</p>}
            <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 8 }}>
              Connected: {fmt(agent.createdAt)} &middot; Last event: {agent.lastEventAt ? fmtT(agent.lastEventAt) : 'Never'}
            </div>
          </div>
          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-stat-num">{agent._count?.agentEvents ?? '—'}</div>
              <div className="detail-stat-lbl">Events</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-num">{agent._count?.reviewItems ?? '—'}</div>
              <div className="detail-stat-lbl">Reviews</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-num">{tMeta?.total ?? '—'}</div>
              <div className="detail-stat-lbl">Tasks</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="btn"
              style={{ background: tab === t.id ? 'var(--green)' : 'var(--white)', color: tab === t.id ? '#fff' : 'var(--mid)', border: '1px solid', borderColor: tab === t.id ? 'var(--green)' : 'var(--border)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'events' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Agent Events</span>
              <span style={{ fontSize: 12, color: 'var(--light)' }}>{eMeta?.total || 0} total</span>
            </div>
            {eLoading ? <div className="loading"><div className="spinner" /></div> : events?.length === 0 ? (
              <div className="empty">No events received yet. Configure your agent using the Integration Setup tab.</div>
            ) : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Type</th><th>Channel</th><th>Customer</th><th>Output</th><th>Review</th><th>Time</th></tr></thead>
                    <tbody>
                      {events?.map(ev => (
                        <tr key={ev.id}>
                          <td><span style={{ fontFamily: 'monospace', fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{ev.eventType}</span></td>
                          <td style={{ fontSize: 12 }}>{ev.channel || '—'}</td>
                          <td style={{ fontSize: 12 }}>{ev.customerName || '—'}</td>
                          <td style={{ fontSize: 12, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.output || ev.message || '—'}</td>
                          <td><StatusBadge value={ev.requiresReview ? 'PENDING' : 'DONE'} /></td>
                          <td style={{ fontSize: 11 }}>{fmtT(ev.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination meta={eMeta} page={eventsPage} onPage={setEventsPage} />
              </>
            )}
          </div>
        )}

        {tab === 'tasks' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Tasks</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(true)}>Add Task</button>
            </div>
            {tLoading ? <div className="loading"><div className="spinner" /></div> : tasks?.length === 0 ? <div className="empty">No tasks yet.</div> : (
              <>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Created</th></tr></thead>
                    <tbody>
                      {tasks?.map(t => (
                        <tr key={t.id}>
                          <td><div style={{ fontWeight: 600 }}>{t.title}</div>{t.description && <div style={{ fontSize: 11, color: 'var(--light)' }}>{t.description}</div>}</td>
                          <td><StatusBadge value={t.status} /></td>
                          <td><StatusBadge value={t.priority} /></td>
                          <td style={{ fontSize: 12 }}>{fmt(t.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination meta={tMeta} page={taskPage} onPage={setTaskPage} />
              </>
            )}
          </div>
        )}

        {tab === 'logs' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Activity Log</span>
              <span style={{ fontSize: 12, color: 'var(--light)' }}>{lMeta?.total || 0} entries</span>
            </div>
            {lLoading ? <div className="loading"><div className="spinner" /></div> : logs?.length === 0 ? <div className="empty">No activity yet.</div> : (
              <>
                <div className="log-list">
                  {logs?.map(log => (
                    <div key={log.id} className="log-item">
                      <div className={`log-dot${log.eventType === 'ERROR' ? ' log-dot-error' : ''}`} style={{ marginTop: 6 }} />
                      <div style={{ flex: 1 }}>
                        <span className="log-event">{log.eventType}</span>
                        <div className="log-message">{log.message}</div>
                        <div className="log-time">{fmtT(log.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination meta={lMeta} page={logPage} onPage={setLogPage} />
              </>
            )}
          </div>
        )}

        {tab === 'integration' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Integration Setup</span>
            </div>
            {iLoading ? <div className="loading"><div className="spinner" /></div> : !integration ? <div className="empty">Integration info not available.</div> : (
              <div className="card-body" style={{ padding: 24, display: 'grid', gap: 20 }}>
                <div className="form-notice">
                  Send events from your external agent to the webhook endpoint below using the credentials shown. For production, store your API key securely and never expose it in client-side code.
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Webhook Endpoint</div>
                  <div style={{ background: '#f8faf8', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', lineHeight: 1.6, color: 'var(--green-dark)' }}>
                    POST {integration.webhookEndpoint}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Required Headers</div>
                  <div style={{ background: '#f8faf8', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, lineHeight: 2 }}>
                    <div style={{ wordBreak: 'break-all' }}>X-Agent-Id: <span style={{ color: 'var(--green-dark)' }}>{integration.agentId}</span></div>
                    <div style={{ wordBreak: 'break-all' }}>
                      X-Api-Key: <span style={{ color: 'var(--green-dark)' }}>{integration.apiKey || '(not available)'}</span>
                    </div>
                    {integration.apiKey && (
                      <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => copyToClipboard(integration.apiKey)}>
                        {keyCopied ? '✓ Copied!' : 'Copy API Key'}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Example Payload</div>
                  <pre style={{ background: '#f8faf8', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', fontSize: 12, overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
{JSON.stringify(integration.examplePayload, null, 2)}
                  </pre>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Event Types</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['MESSAGE_RECEIVED', 'MESSAGE_SENT', 'TASK_STARTED', 'TASK_COMPLETED', 'TASK_FAILED', 'OUTPUT_GENERATED', 'STATUS_CHANGE', 'ERROR', 'CUSTOM'].map(t => (
                      <span key={t} style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--green-pale)', padding: '3px 8px', borderRadius: 4 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add Task" subtitle={`Create a task for ${agent.name}`} onClose={close}>
          <form className="form-grid" onSubmit={handleCreateTask}>
            {formError && <div className="form-error">{formError}</div>}
            <label className="field field-full">
              <span>Title</span>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Review support backlog" autoFocus />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </label>
            <label className="field field-full">
              <span>Description</span>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Details or expected output" rows={3} />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create Task'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
