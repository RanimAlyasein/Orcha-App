// Tasks page — displays all tasks assigned to agents and allows status updates
import { useState } from 'react';
import { taskApi } from '../api/taskApi';
import { agentApi } from '../api/agentApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ErrorBox from '../components/ErrorBox';

const INIT = { title: '', description: '', agentId: '', status: 'TODO', priority: 'MEDIUM' };

const STATUS_TABS = [
  { label: 'All',         value: '' },
  { label: 'To Do',       value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done',        value: 'DONE' },
  { label: 'Cancelled',   value: 'CANCELLED' },
];

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: '' },
  { label: 'Urgent',         value: 'URGENT' },
  { label: 'High',           value: 'HIGH' },
  { label: 'Medium',         value: 'MEDIUM' },
  { label: 'Low',            value: 'LOW' },
];

function fmt(d) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function Tasks() {
  const [page, setPage]           = useState(1);
  const [statusFilter, setStatus] = useState('');
  const [priorityFilter, setPriority] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(INIT);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving]       = useState(false);

  const filters = {};
  if (statusFilter)   filters.status   = statusFilter;
  if (priorityFilter) filters.priority = priorityFilter;
  if (agentFilter)    filters.agentId  = agentFilter;

  const { data: tasks, meta, loading, error, refetch } = useFetch(
    () => taskApi.getAll(page, 20, filters),
    [page, statusFilter, priorityFilter, agentFilter]
  );
  const { data: agents } = useFetch(() => agentApi.getAll(1, 100));

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => { if (!saving) { setShowModal(false); setForm(INIT); setFormError(null); } };

  const changeTab = (val) => { setStatus(val); setPage(1); };
  const changePriority = (val) => { setPriority(val); setPage(1); };
  const changeAgent = (val) => { setAgentFilter(val); setPage(1); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      await taskApi.create(form);
      close();
      setPage(1);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Could not create task.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateStatus(taskId, newStatus);
      refetch();
    } catch {
      // silently ignore
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Tasks</div>
          <div className="topbar-sub">{meta?.total ?? 0} tasks{statusFilter ? ` · ${STATUS_TABS.find(t => t.value === statusFilter)?.label}` : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div className="page-body">
        <ErrorBox message={error} onRetry={refetch} />

        {/* ── Filters ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => changeTab(tab.value)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: statusFilter === tab.value ? 600 : 400,
                  background: statusFilter === tab.value ? 'var(--primary)' : 'transparent',
                  color: statusFilter === tab.value ? '#fff' : 'var(--text)',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority dropdown */}
          <select
            value={priorityFilter}
            onChange={e => changePriority(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}
          >
            {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Agent dropdown */}
          {agents?.length > 0 && (
            <select
              value={agentFilter}
              onChange={e => changeAgent(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}
            >
              <option value="">All Agents</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          )}
        </div>

        <div className="card">
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading tasks...</div>
          ) : tasks?.length === 0 ? (
            <div className="empty">No tasks{statusFilter ? ` with status "${STATUS_TABS.find(t => t.value === statusFilter)?.label}"` : ''} found.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Title</th><th>Agent</th><th>Status</th><th>Priority</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    {tasks?.map(task => (
                      <tr key={task.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{task.title}</div>
                          {task.description && <div style={{ fontSize: 11, color: 'var(--light)' }}>{task.description}</div>}
                        </td>
                        <td style={{ fontSize: 12 }}>{task.agent?.name || '—'}</td>
                        <td>
                          <select
                            value={task.status}
                            onChange={e => handleStatusChange(task.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="TODO">Todo</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td><StatusBadge value={task.priority} /></td>
                        <td style={{ fontSize: 12 }}>{fmt(task.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination meta={meta} page={page} onPage={setPage} />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Task" onClose={close}>
          <form className="form-grid" onSubmit={handleCreate}>
            {formError && <div className="form-error">{formError}</div>}
            <label className="field field-full">
              <span>Title</span>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Task title" autoFocus />
            </label>
            <label className="field">
              <span>Agent</span>
              <select value={form.agentId} onChange={e => set('agentId', e.target.value)}>
                <option value="">— Unassigned —</option>
                {agents?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
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
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </label>
            <label className="field field-full">
              <span>Description</span>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Optional details" />
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
