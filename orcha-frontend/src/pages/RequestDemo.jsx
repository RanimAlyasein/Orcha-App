import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RequestDemo() {
  const [form, setForm] = useState({ name: '', email: '', company: '', agents: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="site-shell">
      <nav className="site-nav">
        <div className="site-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span>Orcha</span>
            <small>AI Agent Management</small>
          </Link>
        </div>
        <div className="site-actions">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--bg)' }}>
        <div className="request-demo-layout">

          {/* Left copy */}
          <div>
            <div className="hero-kicker" style={{ marginBottom: 20, display: 'inline-flex' }}>Managed Setup</div>
            <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.1, color: 'var(--ink)', letterSpacing: 0, marginBottom: 16 }}>
              Request a guided demo of Orcha
            </h1>
            <p style={{ fontSize: 16, color: 'var(--light)', lineHeight: 1.7, marginBottom: 28 }}>
              Our team will walk you through connecting your existing AI agents, setting up your workspace,
              and configuring role-based access for your organization.
            </p>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: '🔌', t: 'Connect your agents', d: 'We help you register and configure agents from any channel — WhatsApp, voice, website chat, or custom API.' },
                { icon: '📊', t: 'Live demo of the dashboard', d: 'See real monitoring, task tracking, output review, and analytics working with live data.' },
                { icon: '🚀', t: 'Custom onboarding plan', d: 'Leave with a step-by-step plan tailored to your team size, agent types, and use case.' },
              ].map(item => (
                <div key={item.t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--green-pale)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{item.t}</div>
                    <div style={{ fontSize: 13, color: 'var(--light)', lineHeight: 1.55 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="card" style={{ padding: 0 }}>
            <div className="card-header">
              <span className="card-title">Request your demo</span>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              {submitted ? (
                <div className="form-notice">
                  <strong style={{ display: 'block', marginBottom: 6 }}>Request received!</strong>
                  We'll reach out to {form.email} within one business day to schedule your demo.
                  <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                    <Link to="/register" className="btn btn-primary btn-sm">Create account now</Link>
                    <Link to="/" className="btn btn-ghost btn-sm">Back to home</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
                  <label className="field">
                    <span>Full name</span>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" required autoFocus />
                  </label>
                  <label className="field">
                    <span>Work email</span>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" required />
                  </label>
                  <label className="field">
                    <span>Company name</span>
                    <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" required />
                  </label>
                  <label className="field">
                    <span>What type of agents are you running?</span>
                    <select value={form.agents} onChange={e => set('agents', e.target.value)}>
                      <option value="">Select an option</option>
                      <option>WhatsApp / Messenger bots</option>
                      <option>Voice agents</option>
                      <option>Website chat agents</option>
                      <option>Sales / CRM agents</option>
                      <option>Custom API agents</option>
                      <option>Multiple types</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Anything specific you'd like to see?</span>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3} placeholder="Optional — mention your team size, current tools, or questions." />
                  </label>
                  <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
                    {loading ? 'Submitting...' : 'Request demo'}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--light)', textAlign: 'center' }}>
                    Or <Link to="/register" className="auth-link">create a free account</Link> and explore on your own.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
