// Event Simulator page — lets developers send fake agent events to test the system without a real agent
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { agentApi } from '../api/agentApi';
import { agentEventApi } from '../api/agentEventApi';
import { useFetch } from '../hooks/useFetch';
import ErrorBox from '../components/ErrorBox';

const INIT = {
  agentId: '',
  eventType: 'OUTPUT_GENERATED',
  channel: '',
  customerName: '',
  customerContact: '',
  message: '',
  output: '',
  requiresReview: false,
};

const EVENT_TYPES = [
  'MESSAGE_RECEIVED', 'MESSAGE_SENT', 'TASK_STARTED', 'TASK_COMPLETED',
  'TASK_FAILED', 'OUTPUT_GENERATED', 'STATUS_CHANGE', 'ERROR', 'CUSTOM',
];

export default function EventSimulator() {
  const [form, setForm] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState(null);

  const { data: agents, loading, error } = useFetch(() => agentApi.getAll(1, 100));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAgentChange = (agentId) => {
    set('agentId', agentId);
    const agent = agents?.find(a => a.id === agentId);
    if (agent) {
      set('channel', agent.channel || '');
      setForm(f => ({ ...f, agentId, channel: agent.channel || '', requiresReview: agent.reviewRequired || false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agentId) { setFormError('Select an agent.'); return; }
    if (!form.output && !form.message) { setFormError('Provide a message or output.'); return; }
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await agentEventApi.simulate({ ...form, requiresReview: form.requiresReview === true || form.requiresReview === 'true' });
      setResult(res.data?.data);
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Simulation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setResult(null); setForm(INIT); setFormError(null); };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Event Simulator</div>
          <div className="topbar-sub">Send a test event from any connected agent</div>
        </div>
      </div>
      <div className="page-body" style={{ maxWidth: 680 }}>
        <ErrorBox message={error} />

        {result ? (
          <div className="card">
            <div className="card-header"><span className="card-title">Event Received</span></div>
            <div className="card-body" style={{ padding: 24 }}>
              <div className="form-notice" style={{ background: 'var(--green-pale)', border: '1px solid var(--border)', marginBottom: 20 }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>Success — event sent to {result.agentName}</strong>
                Event ID: <code style={{ fontFamily: 'monospace', fontSize: 12 }}>{result.eventId}</code>
                {result.requiresReview && (
                  <div style={{ marginTop: 8 }}>A review item was created — it is waiting in the <Link to="/review-queue" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Review Queue</Link>.</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={reset}>Simulate another</button>
                {result.requiresReview && (
                  <Link to="/review-queue" className="btn btn-ghost">Go to Review Queue</Link>
                )}
                <Link to="/agents" className="btn btn-ghost">View Agents</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header"><span className="card-title">Simulate Agent Event</span></div>
            <div className="card-body" style={{ padding: 24 }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                {formError && <div className="form-error">{formError}</div>}

                <label className="field">
                  <span>Agent</span>
                  {loading ? <select disabled><option>Loading...</option></select> : (
                    <select value={form.agentId} onChange={e => handleAgentChange(e.target.value)} required>
                      <option value="">Select an agent</option>
                      {agents?.map(a => <option key={a.id} value={a.id}>{a.name} ({a.channel || a.type})</option>)}
                    </select>
                  )}
                </label>

                <div className="field-2col">
                  <label className="field">
                    <span>Event type</span>
                    <select value={form.eventType} onChange={e => set('eventType', e.target.value)}>
                      {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>Channel</span>
                    <input value={form.channel} onChange={e => set('channel', e.target.value)} placeholder="WhatsApp" />
                  </label>
                </div>

                <div className="field-2col">
                  <label className="field">
                    <span>Customer name</span>
                    <input value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Jane Smith" />
                  </label>
                  <label className="field">
                    <span>Customer contact</span>
                    <input value={form.customerContact} onChange={e => set('customerContact', e.target.value)} placeholder="+1-555-0100" />
                  </label>
                </div>

                <label className="field">
                  <span>Incoming message (from customer)</span>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={2} placeholder="Hi, I want to know about your pricing..." />
                </label>

                <label className="field">
                  <span>Agent output (response generated)</span>
                  <textarea value={form.output} onChange={e => set('output', e.target.value)} rows={3} placeholder="Thank you for reaching out! Our plans start at..." />
                </label>

                <label className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={form.requiresReview} onChange={e => set('requiresReview', e.target.checked)} style={{ width: 'auto' }} />
                  <span style={{ marginBottom: 0 }}>Send to review queue before sending to customer</span>
                </label>

                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 4 }}>
                  {submitting ? 'Sending...' : 'Send Simulated Event'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
