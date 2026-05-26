// Agents page — lists all connected AI agents and lets users add or manage them
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentApi } from '../api/agentApi';
import { useFetch } from '../hooks/useFetch';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ErrorBox from '../components/ErrorBox';

const INIT = {
  name: '', type: 'SUPPORT', provider: 'WEBSITE_CHATBOT', channel: 'Website Chat',
  connectionStatus: 'PENDING_SETUP', reviewRequired: false, language: 'English', description: '',
};

const PROVIDER_OPTIONS = [
  ['WHATSAPP_BOT', 'WhatsApp Bot'],
  ['MESSENGER_BOT', 'Messenger Bot'],
  ['WEBSITE_CHATBOT', 'Website Chatbot'],
  ['VOICE_AGENT', 'Voice Agent'],
  ['EMAIL_BOT', 'Email Bot'],
  ['CUSTOM_API', 'Custom API'],
  ['DEMO_CHANNEL', 'Demo Channel'],
  ['OTHER', 'Other'],
];

const CHANNEL_OPTIONS = ['WhatsApp', 'Messenger', 'Website Chat', 'Voice', 'Email', 'Custom API', 'Demo', 'Other'];

const PROVIDER_ICONS = {
  WHATSAPP_BOT: '💬', MESSENGER_BOT: '📱', WEBSITE_CHATBOT: '🌐',
  VOICE_AGENT: '📞', EMAIL_BOT: '📧', CUSTOM_API: '⚙️', DEMO_CHANNEL: '🎮', OTHER: '🤖',
};

export default function Agents() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INIT);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);

  const { data: agents, meta, loading, error, refetch } = useFetch(() => agentApi.getAll(page, 20), [page]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const close = () => {
    if (!saving) { setShowModal(false); setForm(INIT); setFormError(null); setNewApiKey(null); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      const res = await agentApi.create({ ...form, reviewRequired: form.reviewRequired === true || form.reviewRequired === 'true' });
      const created = res.data?.data;
      if (created?.apiKey) setNewApiKey(created.apiKey);
      else { close(); }
      setPage(1);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Could not connect agent.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString() : 'Never';

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Agents</div>
          <div className="topbar-sub">{meta?.total ?? 0} agents connected</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Connect Agent</button>
      </div>
      <div className="page-body">
        <ErrorBox message={error} onRetry={refetch} />
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading agents...</div>
        ) : (
          <>
            <div className="agent-grid">
              {agents?.map(agent => (
                <div key={agent.id} className="agent-card" onClick={() => navigate(`/agents/${agent.id}`)}>
                  <div className="agent-card-top">
                    <div className="agent-avatar">{PROVIDER_ICONS[agent.provider] || '🤖'}</div>
                    <StatusBadge value={agent.connectionStatus} />
                  </div>
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-role">{agent.channel || agent.type}</div>
                  <div className="agent-dept" style={{ fontSize: 12, color: 'var(--light)', marginTop: 2 }}>
                    Last event: {formatDate(agent.lastEventAt)}
                  </div>
                  <div className="agent-footer">
                    <div className="agent-stat">
                      <div className="agent-stat-num">{agent._count?.agentEvents ?? 0}</div>
                      <div className="agent-stat-label">Events</div>
                    </div>
                    <div className="agent-stat">
                      <div className="agent-stat-num">{agent._count?.reviewItems ?? 0}</div>
                      <div className="agent-stat-label">Reviews</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>View →</span>
                  </div>
                </div>
              ))}
              {agents?.length === 0 && (
                <div className="empty" style={{ gridColumn: '1/-1' }}>No agents connected yet. Click "Connect Agent" to register your first external agent.</div>
              )}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        )}
      </div>

      {showModal && (
        <Modal title={newApiKey ? 'Agent Connected' : 'Connect Agent'} subtitle={newApiKey ? 'Save your API key — it will only be shown once.' : 'Register an external AI agent'} onClose={close}>
          {newApiKey ? (
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="form-notice" style={{ background: 'var(--green-pale)', border: '1px solid var(--border)' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Agent connected successfully.</strong>
                Copy this API key and configure it in your agent. It will not be shown again.
              </div>
              <label className="field">
                <span>API Key</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input readOnly value={newApiKey} style={{ fontFamily: 'monospace', fontSize: 13 }} />
                  <button type="button" className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(newApiKey)}>Copy</button>
                </div>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-primary" onClick={close}>Done</button>
              </div>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleCreate}>
              {formError && <div className="form-error">{formError}</div>}
              <label className="field field-full">
                <span>Agent name</span>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Sara Sales Bot" autoFocus required />
              </label>
              <label className="field">
                <span>Provider type</span>
                <select value={form.provider} onChange={e => set('provider', e.target.value)}>
                  {PROVIDER_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Channel</span>
                <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                  {CHANNEL_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Type</span>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="SUPPORT">Support</option>
                  <option value="SALES">Sales</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="CALL_CENTER">Call Center</option>
                  <option value="BOOKING">Booking</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </label>
              <label className="field">
                <span>Language</span>
                <select value={form.language} onChange={e => set('language', e.target.value)}>
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="field field-full" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={form.reviewRequired} onChange={e => set('reviewRequired', e.target.checked)} style={{ width: 'auto' }} />
                <span style={{ marginBottom: 0 }}>Require human review for agent outputs</span>
              </label>
              <label className="field field-full">
                <span>Description (optional)</span>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What this agent does and how it connects" rows={2} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Connecting...' : 'Connect Agent'}</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
