// Agent detail page — shows a single agent's info, tasks, events, weekly schedule, and webhook integration details
import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { agentApi } from '../api/agentApi';
import { taskApi } from '../api/taskApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
function fmtT(d) { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }

const INIT_TASK = { title: '', description: '', status: 'TODO', priority: 'MEDIUM' };

const TABS = [
  { id: 'events',      label: 'Events' },
  { id: 'tasks',       label: 'Tasks' },
  { id: 'schedule',    label: 'Weekly Schedule' },
  { id: 'logs',        label: 'Activity Log' },
  { id: 'integration', label: 'Integration Setup' },
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_COLORS = {
  MESSAGE_RECEIVED: { bg: '#e8f5e9', color: '#2e7d32', label: 'Received' },
  MESSAGE_SENT:     { bg: '#e3f2fd', color: '#1565c0', label: 'Sent' },
  TASK_STARTED:     { bg: '#fff8e1', color: '#f57f17', label: 'Started' },
  TASK_COMPLETED:   { bg: '#e8f5e9', color: '#2e7d32', label: 'Completed' },
  OUTPUT_GENERATED: { bg: '#f3e5f5', color: '#6a1b9a', label: 'Output' },
  STATUS_CHANGE:    { bg: '#fce4ec', color: '#880e4f', label: 'Status' },
  ERROR:            { bg: '#ffebee', color: '#c62828', label: 'Error' },
  CUSTOM:           { bg: '#f5f5f5', color: '#424242', label: 'Custom' },
};

const PRIORITY_COLORS = {
  URGENT: '#c62828',
  HIGH:   '#e65100',
  MEDIUM: '#f9a825',
  LOW:    '#558b2f',
};

function getWeekDays(offset = 0) {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function WeekCalendar({ events, tasks }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const today = new Date();

  const weekStart = days[0];
  const weekEnd = days[6];
  const weekLabel = weekOffset === 0 ? 'This week'
    : weekOffset === -1 ? 'Last week'
    : weekOffset === 1 ? 'Next week'
    : `${weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${weekEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;

  const eventsByDay = days.map(day =>
    (events || []).filter(e => isSameDay(new Date(e.createdAt), day))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  const tasksByDay = days.map(day =>
    (tasks || []).filter(t => isSameDay(new Date(t.createdAt), day))
  );

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <span className="card-title">Weekly Schedule</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(w => w - 1)}>←</button>
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 100, textAlign: 'center' }}>{weekLabel}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(w => w + 1)}>→</button>
          {weekOffset !== 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(0)}>Today</button>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: 1, background: 'var(--border)', minWidth: 700 }}>
          {/* Day headers */}
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            return (
              <div key={i} style={{
                background: isToday ? 'var(--green)' : 'var(--surface)',
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isToday ? '#fff' : 'var(--mid)' }}>{DAY_NAMES[i]}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? '#fff' : 'var(--text)', lineHeight: 1.3 }}>
                  {day.getDate()}
                </div>
                <div style={{ fontSize: 11, color: isToday ? 'rgba(255,255,255,0.8)' : 'var(--light)' }}>
                  {day.toLocaleDateString('en-GB', { month: 'short' })}
                </div>
              </div>
            );
          })}

          {/* Day cells */}
          {days.map((day, i) => {
            const dayEvents = eventsByDay[i];
            const dayTasks = tasksByDay[i];
            const isEmpty = dayEvents.length === 0 && dayTasks.length === 0;

            return (
              <div key={i} style={{
                background: 'var(--white)',
                minHeight: 160,
                padding: '8px 6px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                {isEmpty && (
                  <div style={{ fontSize: 11, color: 'var(--light)', textAlign: 'center', marginTop: 24 }}>—</div>
                )}

                {dayTasks.map(task => (
                  <div key={`t-${task.id}`} style={{
                    fontSize: 11,
                    padding: '4px 6px',
                    borderRadius: 4,
                    background: '#fff8e1',
                    borderLeft: `3px solid ${PRIORITY_COLORS[task.priority] || '#ccc'}`,
                    lineHeight: 1.3,
                  }}>
                    <div style={{ fontWeight: 600, color: '#5d4037', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </div>
                    <div style={{ color: '#8d6e63', marginTop: 1 }}>{task.status.replace('_', ' ')}</div>
                  </div>
                ))}

                {dayEvents.map(ev => {
                  const style = EVENT_COLORS[ev.eventType] || EVENT_COLORS.CUSTOM;
                  return (
                    <div key={`e-${ev.id}`} style={{
                      fontSize: 11,
                      padding: '4px 6px',
                      borderRadius: 4,
                      background: style.bg,
                      borderLeft: `3px solid ${style.color}`,
                      lineHeight: 1.3,
                    }}>
                      <div style={{ fontWeight: 600, color: style.color }}>{fmtTime(ev.createdAt)}</div>
                      <div style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.customerName || style.label}
                      </div>
                      <div style={{ color: 'var(--light)', fontSize: 10 }}>{ev.eventType.replace(/_/g, ' ')}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--light)', marginRight: 4 }}>Legend:</span>
        <span style={{ fontSize: 11, background: '#fff8e1', borderLeft: '3px solid #f57f17', padding: '2px 6px', borderRadius: 3 }}>Tasks</span>
        {Object.entries(EVENT_COLORS).slice(0, 4).map(([key, val]) => (
          <span key={key} style={{ fontSize: 11, background: val.bg, color: val.color, borderLeft: `3px solid ${val.color}`, padding: '2px 6px', borderRadius: 3 }}>
            {val.label}
          </span>
        ))}
      </div>
    </div>
  );
}

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
  const { data: allEvents } = useFetch(() => agentApi.getEvents(id, 1, 100), [id]);
  const { data: allTasks } = useFetch(() => agentApi.getTasks(id, 1, 100), [id]);
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

        {tab === 'schedule' && (
          <WeekCalendar events={allEvents} tasks={allTasks} />
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
