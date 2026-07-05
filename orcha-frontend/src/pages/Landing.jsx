import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../landing.css';

/* ═══════════════════════════════════════════════════════════════
   MOCK PRODUCT SCREENS
   ═══════════════════════════════════════════════════════════════ */

function Chrome({ url }) {
  return (
    <div className="lp-chrome">
      <span className="lp-chrome-dot" style={{ background: '#FF5F57' }} />
      <span className="lp-chrome-dot" style={{ background: '#FFBD2E' }} />
      <span className="lp-chrome-dot" style={{ background: '#28CA41' }} />
      <span className="lp-chrome-url">{url}</span>
    </div>
  );
}

function ScreenDashboard() {
  const s = { fontSize: 8, fontFamily: 'Inter, sans-serif' };
  return (
    <div style={{ background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Chrome url="app.orcha.io/dashboard" />
      <div style={{ display: 'flex', height: 390 }}>
        <div style={{ width: 148, background: '#112219', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-.3px' }}>Orcha</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,.28)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>Demo Workspace</div>
          </div>
          <div style={{ padding: '10px 0', flex: 1 }}>
            {[
              { icon: '⊞', label: 'Dashboard',    active: true  },
              { icon: '◈', label: 'Agents',        active: false },
              { icon: '◻', label: 'Review Queue',  active: false },
              { icon: '▷', label: 'Simulator',     active: false },
              { icon: '☰', label: 'Tasks',         active: false },
              { icon: '♦', label: 'Customers',     active: false },
            ].map(({ icon, label, active }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#fff' : 'rgba(255,255,255,.4)',
                background: active ? 'rgba(255,255,255,.07)' : 'transparent',
                borderLeft: `2px solid ${active ? '#3ECF6E' : 'transparent'}`,
              }}>
                <span style={{ fontSize: 11 }}>{icon}</span>{label}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ width: 28, height: 28, background: '#3ECF6E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#031A0B' }}>M</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#F3F8F5', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ background: '#fff', borderBottom: '1px solid #D6EAE0', padding: '0 16px', height: 42, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ ...s, fontSize: 12, fontWeight: 700, color: '#0C1710' }}>Dashboard</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ height: 24, padding: '0 10px', background: '#1A4731', borderRadius: 5, display: 'flex', alignItems: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>+ Add Agent</div>
              <div style={{ width: 24, height: 24, background: '#F3F8F5', border: '1px solid #D6EAE0', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🔔</div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
              {[
                { n: '4',   l: 'Active Agents',  c: '#1A4731' },
                { n: '23',  l: 'Events Today',   c: '#0369A1' },
                { n: '2',   l: 'Pending Reviews',c: '#B45309' },
                { n: '91%', l: 'Approval Rate',  c: '#166534' },
              ].map(({ n, l, c }) => (
                <div key={l} style={{ background: '#fff', border: '1px solid #D6EAE0', borderRadius: 7, padding: '10px 10px 8px' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 7.5, color: '#526B5C', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0 }}>
              <div style={{ background: '#fff', border: '1px solid #D6EAE0', borderRadius: 7, padding: '10px', overflow: 'hidden' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#0C1710', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Review Queue
                  <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 7.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>2 pending</span>
                </div>
                {[
                  { agent: 'Sara Sales Bot', ch: 'WhatsApp', msg: '"Hi! Our plans start at $49/mo. Want a demo?"', time: '2m' },
                  { agent: 'Support AI',     ch: 'Website',  msg: '"I can connect you with our team right now."', time: '8m' },
                ].map((r, i) => (
                  <div key={i} style={{ border: '1px solid #E8F2EC', borderRadius: 6, padding: 7, background: '#F9FDF9', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#0C1710' }}>{r.agent}</span>
                      <span style={{ fontSize: 7, padding: '1px 5px', background: '#E6F2EC', color: '#1A4731', borderRadius: 8, fontWeight: 700 }}>{r.ch}</span>
                    </div>
                    <div style={{ fontSize: 7.5, color: '#526B5C', marginBottom: 5, lineHeight: 1.4 }}>{r.msg}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ fontSize: 7.5, padding: '2px 7px', background: '#D1FAE5', color: '#065F46', borderRadius: 4, fontWeight: 700 }}>✓ Approve</span>
                      <span style={{ fontSize: 7.5, padding: '2px 7px', background: '#FEF3C7', color: '#92400E', borderRadius: 4, fontWeight: 700 }}>Edit</span>
                      <span style={{ fontSize: 7.5, padding: '2px 7px', background: '#FEE2E2', color: '#991B1B', borderRadius: 4, fontWeight: 700 }}>Reject</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', border: '1px solid #D6EAE0', borderRadius: 7, padding: '10px', overflow: 'hidden' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#0C1710', marginBottom: 8 }}>Activity Feed</div>
                {[
                  { t: 'MESSAGE_RECEIVED', a: 'Sara Sales Bot', c: '#0369A1', ch: 'WhatsApp', ago: '2m'  },
                  { t: 'OUTPUT_GENERATED', a: 'Support AI',     c: '#7C3AED', ch: 'Website',  ago: '6m'  },
                  { t: 'REVIEW_APPROVED',  a: 'Sara Sales Bot', c: '#065F46', ch: 'WhatsApp', ago: '9m'  },
                  { t: 'TASK_COMPLETED',   a: 'Booking Bot',    c: '#166534', ch: 'Email',    ago: '14m' },
                ].map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: '1px solid #F0F5F2', fontSize: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.c, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'monospace', background: '#F0F5F2', color: e.c, padding: '1px 4px', borderRadius: 3, fontSize: 7, fontWeight: 700 }}>{e.t}</span>
                      <span style={{ color: '#526B5C', marginLeft: 4, fontSize: 7.5 }}>{e.a}</span>
                    </div>
                    <span style={{ color: '#8BA898', flexShrink: 0 }}>{e.ago}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenReview() {
  return (
    <div style={{ background: '#F3F8F5', fontFamily: 'Inter, sans-serif' }}>
      <Chrome url="app.orcha.io/review-queue" />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0C1710' }}>Review Queue</div>
            <div style={{ fontSize: 10, color: '#526B5C', marginTop: 1 }}>3 outputs awaiting review</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((f, i) => (
              <div key={f} style={{ height: 26, padding: '0 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', background: i === 1 ? '#1A4731' : '#fff', color: i === 1 ? '#fff' : '#526B5C', border: '1px solid', borderColor: i === 1 ? '#1A4731' : '#D6EAE0' }}>{f}</div>
            ))}
          </div>
        </div>
        {[
          { agent: 'Sara Sales Bot', ch: 'WhatsApp', type: 'OUTBOUND_MESSAGE', msg: '"Hi Alice! Just following up on your demo request. Our Growth plan at $49/month includes everything you need. Would tomorrow at 2pm work for a call?"', status: 'pending', time: '2 min ago' },
          { agent: 'Support AI',     ch: 'Website',  type: 'SUPPORT_REPLY',    msg: '"I completely understand your frustration. Let me escalate this to our senior team and we\'ll have a resolution within 2 hours."', status: 'pending', time: '7 min ago' },
          { agent: 'Booking Bot',    ch: 'Email',    type: 'BOOKING_CONFIRM',  msg: '"Your appointment has been confirmed for Thursday May 15th at 3:00 PM. A calendar invite has been sent to your email."', status: 'approved', time: '12 min ago' },
        ].map((r, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid', borderColor: r.status === 'approved' ? '#D1FAE5' : '#D6EAE0', borderRadius: 9, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, background: '#E6F2EC', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🤖</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0C1710' }}>{r.agent}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 2 }}>
                  <span style={{ fontSize: 8.5, padding: '1px 6px', background: '#E6F2EC', color: '#1A4731', borderRadius: 8, fontWeight: 700 }}>{r.ch}</span>
                  <span style={{ fontSize: 8.5, padding: '1px 6px', background: '#F0F5F2', color: '#526B5C', borderRadius: 8, fontWeight: 600, fontFamily: 'monospace' }}>{r.type}</span>
                </div>
              </div>
              <div>
                {r.status === 'approved'
                  ? <span style={{ fontSize: 9, padding: '3px 9px', background: '#D1FAE5', color: '#065F46', borderRadius: 20, fontWeight: 800 }}>✓ Approved</span>
                  : <span style={{ fontSize: 9, padding: '3px 9px', background: '#FEF9C3', color: '#854D0E', borderRadius: 20, fontWeight: 800 }}>⏳ Pending</span>
                }
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#1E3028', lineHeight: 1.55, background: '#F9FDF9', border: '1px solid #E6F2EC', borderRadius: 6, padding: '8px 10px', marginBottom: 10 }}>{r.msg}</div>
            {r.status === 'pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1, height: 28, background: '#1A4731', color: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>✓ Approve</div>
                <div style={{ flex: 1, height: 28, background: '#fff', color: '#526B5C', border: '1px solid #D6EAE0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>✎ Edit</div>
                <div style={{ flex: 1, height: 28, background: '#FEF2F2', color: '#991B1B', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>✕ Reject</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenActivity() {
  const events = [
    { type: 'MESSAGE_RECEIVED', agent: 'Sara Sales Bot', ch: 'WhatsApp', detail: 'Incoming from +1 555 012 3456',          color: '#2563EB', bg: '#EFF6FF', time: '09:42:17' },
    { type: 'OUTPUT_GENERATED', agent: 'Sara Sales Bot', ch: 'WhatsApp', detail: 'Pricing reply generated — requires review', color: '#7C3AED', bg: '#F5F3FF', time: '09:42:18' },
    { type: 'REVIEW_QUEUED',    agent: 'Sara Sales Bot', ch: 'WhatsApp', detail: 'Output queued for manager review',          color: '#B45309', bg: '#FFFBEB', time: '09:42:18' },
    { type: 'REVIEW_APPROVED',  agent: 'Sara Sales Bot', ch: 'WhatsApp', detail: 'Approved by manager@orcha.demo',            color: '#065F46', bg: '#ECFDF5', time: '09:43:55' },
    { type: 'MESSAGE_SENT',     agent: 'Sara Sales Bot', ch: 'WhatsApp', detail: 'Message delivered to customer',             color: '#166534', bg: '#F0FDF4', time: '09:43:56' },
    { type: 'TASK_CREATED',     agent: 'Sara Sales Bot', ch: 'System',   detail: 'Follow-up task: Demo call Thu 3pm',         color: '#1A4731', bg: '#F0FDF4', time: '09:44:01' },
    { type: 'MESSAGE_RECEIVED', agent: 'Support AI',     ch: 'Website',  detail: 'Support ticket #4412 opened',               color: '#2563EB', bg: '#EFF6FF', time: '09:38:22' },
    { type: 'TASK_COMPLETED',   agent: 'Booking Bot',    ch: 'Email',    detail: 'Booking confirmed — John D. Thu 3pm',        color: '#065F46', bg: '#ECFDF5', time: '09:31:05' },
  ];
  return (
    <div style={{ background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Chrome url="app.orcha.io/activity-logs" />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#0C1710' }}>Activity Log</div>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ height: 24, padding: '0 10px', background: '#F3F8F5', border: '1px solid #D6EAE0', borderRadius: 5, fontSize: 9, fontWeight: 600, color: '#526B5C', display: 'flex', alignItems: 'center' }}>Filter</div>
            <div style={{ height: 24, padding: '0 10px', background: '#F3F8F5', border: '1px solid #D6EAE0', borderRadius: 5, fontSize: 9, fontWeight: 600, color: '#526B5C', display: 'flex', alignItems: 'center' }}>Export</div>
          </div>
        </div>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#8BA898', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Today — 8 events</div>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '6px 0', borderBottom: '1px solid #F0F5F2' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: e.color, flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 7.5, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: e.bg, color: e.color }}>{e.type}</span>
                <span style={{ fontSize: 7.5, fontWeight: 600, color: '#1E3028' }}>{e.agent}</span>
                <span style={{ fontSize: 7, padding: '1px 5px', background: '#F0F5F2', color: '#526B5C', borderRadius: 8 }}>{e.ch}</span>
              </div>
              <div style={{ fontSize: 8, color: '#526B5C', lineHeight: 1.4 }}>{e.detail}</div>
            </div>
            <div style={{ fontSize: 7.5, color: '#8BA898', flexShrink: 0, fontFamily: 'monospace' }}>{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const NAV = [
  { href: '#features',   label: 'Features'     },
  { href: '#how',        label: 'How It Works'  },
  { href: '#pricing',    label: 'Pricing'       },
  { href: '#faq',        label: 'FAQ'           },
];

const CHANNELS = [
  { icon: '💬', label: 'WhatsApp'    },
  { icon: '🌐', label: 'Website Chat' },
  { icon: '📞', label: 'Voice AI'    },
  { icon: '📧', label: 'Email'       },
  { icon: '📱', label: 'Messenger'   },
  { icon: '⚙️', label: 'Custom API'  },
  { icon: '📲', label: 'Telegram'    },
  { icon: '💌', label: 'SMS'         },
  { icon: '🎯', label: 'Slack'       },
  { icon: '🤖', label: 'Any LLM'     },
];

const STATS = [
  { n: '< 5',  unit: 'min', label: 'To connect your first agent and see live events',  icon: '⚡' },
  { n: '100',  unit: '%',   label: 'Of all agent outputs captured in an immutable log', icon: '🔒' },
  { n: '99.9', unit: '%',   label: 'Uptime SLA — your monitoring never goes dark',      icon: '📡' },
  { n: '10x',  unit: '',    label: 'Faster compliance reviews vs manual log searches',  icon: '🚀' },
];

const TESTIMONIALS = [
  {
    quote: "Before Orcha, we had no idea what our WhatsApp bot was actually saying to leads. Three weeks in, we caught a pricing error before it reached 200 people. That alone paid for the platform.",
    name: 'Carlos Mendoza', role: 'VP Operations', company: 'Growlytics', color: '#1A4731',
  },
  {
    quote: "The review queue changed how we think about AI agents entirely. Our support AI drafts, our team approves, and customer satisfaction went up 23% in 30 days. We'd never go back.",
    name: 'Priya Sharma', role: 'Head of CX', company: 'Stackr', color: '#2563EB',
  },
  {
    quote: "Compliance was our biggest concern with AI agents. Orcha gave us the audit trail our legal team needed. Every message, every decision, timestamped and exportable. Problem solved.",
    name: "James O'Brien", role: 'CTO', company: 'NovaTech', color: '#7C3AED',
  },
];

const PRICING = [
  {
    tier: 'Starter',
    price: 'Free', annualPrice: 'Free',
    desc: 'For teams exploring AI agent management. No credit card required.',
    features: [
      '1 connected agent',
      '500 events / month',
      'Review queue (50 reviews / mo)',
      'Activity log (7-day retention)',
      'Email support',
    ],
    cta: 'Start for free',
    pop: false,
  },
  {
    tier: 'Growth',
    price: '49', annualPrice: '39',
    desc: 'For growing teams managing multiple agents across channels.',
    features: [
      'Up to 10 connected agents',
      'Unlimited events',
      'Unlimited review queue',
      'Activity log (90-day retention)',
      'Analytics & performance reports',
      'API access + webhooks',
      'Priority support',
    ],
    cta: 'Start free trial',
    pop: true,
  },
  {
    tier: 'Enterprise',
    price: 'Custom', annualPrice: 'Custom',
    desc: 'For organisations with custom compliance and scale requirements.',
    features: [
      'Unlimited agents',
      'Unlimited events & reviews',
      'Activity log (unlimited retention)',
      'SSO / SAML authentication',
      'Custom SLA & dedicated support',
      'On-premise deployment option',
      'Custom role permissions',
    ],
    cta: 'Contact sales',
    pop: false,
  },
];

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [navOpen,  setNavOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [annual,   setAnnual]   = useState(false);
  const [openFaq,  setOpenFaq]  = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.lp-r');
    if (!els.length) return;
    // Fallback: if IntersectionObserver not supported, show all immediately
    if (!window.IntersectionObserver) {
      els.forEach(el => el.classList.add('lp-r-in'));
      return;
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('lp-r-in'); obs.unobserve(e.target); }
      }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    els.forEach(el => obs.observe(el));
    // Safety fallback: show all after 1.5s regardless
    const t = setTimeout(() => els.forEach(el => el.classList.add('lp-r-in')), 1500);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  const close = () => setNavOpen(false);
  const getPrice = p => (annual ? p.annualPrice : p.price);

  return (
    <div className="lp">

      {/* ─── NAVBAR ─────────────────────────────────────────────── */}
      <nav className={`lp-nav${scrolled ? ' lp-nav-on' : ''}`}>
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand" onClick={close}>
            <span className="lp-brand-name">Orcha</span>
            <span className="lp-brand-tag">AI Agent Management</span>
          </Link>
          <ul className="lp-nav-links">
            {NAV.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
          <div className="lp-nav-btns">
            <Link to="/login"    className="lp-btn lp-btn-ghost">Sign In</Link>
            <Link to="/register" className="lp-btn lp-btn-accent">Try Orcha free</Link>
          </div>
          <button
            className={`lp-ham${navOpen ? ' lp-ham-x' : ''}`}
            onClick={() => setNavOpen(o => !o)}
            aria-label="Menu" type="button"
          ><span /><span /><span /></button>
        </div>
      </nav>

      {/* ─── MOBILE NAV ─────────────────────────────────────────── */}
      {navOpen && (
        <div className="lp-mnav">
          {NAV.map(l => <a key={l.href} href={l.href} onClick={close}>{l.label}</a>)}
          <div className="lp-mnav-acts">
            <Link to="/login"    className="lp-btn lp-btn-ghost"  onClick={close} style={{ flex: 1 }}>Sign In</Link>
            <Link to="/register" className="lp-btn lp-btn-accent" onClick={close} style={{ flex: 1 }}>Try Orcha free</Link>
          </div>
        </div>
      )}

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-body">
          <div className="lp-hero-inner">

            <div className="lp-hero-copy">
              <div className="lp-live lp-hero-el" style={{ '--i': 0 }}>
                <span className="lp-live-dot" />
                Real-time monitoring · Live
              </div>
              <h1 className="lp-hero-h1 lp-hero-el" style={{ '--i': 1 }}>
                Your AI agents,<br />
                <em>fully under control.</em>
              </h1>
              <p className="lp-hero-p lp-hero-el" style={{ '--i': 2 }}>
                Orcha connects to your existing AI agents via webhooks and gives your
                team real-time visibility, a human-in-the-loop review queue, and a
                complete audit trail — no infrastructure changes needed.
              </p>
              <div className="lp-hero-acts lp-hero-el" style={{ '--i': 3 }}>
                <Link to="/register" className="lp-btn lp-btn-accent lp-btn-lg">
                  Start for free — no card needed
                </Link>
                <Link to="/request-demo" className="lp-btn lp-btn-ghost lp-btn-lg">
                  See a demo →
                </Link>
              </div>
              <div className="lp-hero-proof lp-hero-el" style={{ '--i': 4 }}>
                <div className="lp-proof-item">
                  <div className="lp-proof-val">4,200+</div>
                  <div className="lp-proof-lbl">Agents connected</div>
                </div>
                <div className="lp-proof-sep" />
                <div className="lp-proof-item">
                  <div className="lp-proof-val">Zero</div>
                  <div className="lp-proof-lbl">Infrastructure changes</div>
                </div>
                <div className="lp-proof-sep" />
                <div className="lp-proof-item">
                  <div className="lp-proof-val">99.9%</div>
                  <div className="lp-proof-lbl">Uptime SLA</div>
                </div>
              </div>
            </div>

            <div className="lp-hero-vis lp-hero-el" style={{ '--i': 2 }}>
              <div className="lp-hero-glow" />
              <div className="lp-fc lp-fc-a">
                <span className="lp-fc-dot lp-fc-dot-g" />
                <div>
                  <div>Output approved</div>
                  <div className="lp-fc-sub">Sara Sales Bot · just now</div>
                </div>
              </div>
              <div className="lp-fc lp-fc-b">
                <span className="lp-fc-dot lp-fc-dot-a" />
                <div>
                  <div>2 reviews pending</div>
                  <div className="lp-fc-sub">Review Queue</div>
                </div>
              </div>
              <div className="lp-hero-screen">
                <ScreenDashboard />
              </div>
            </div>

          </div>
        </div>
        <div className="lp-hero-fade" />
      </section>

      {/* ─── CHANNEL MARQUEE ────────────────────────────────────── */}
      <div className="lp-logos">
        <p className="lp-logos-label">Works across every channel your agents operate on</p>
        <div className="lp-marquee-wrap">
          <div className="lp-marquee-track">
            {[...CHANNELS, ...CHANNELS].map((c, i) => (
              <span key={i} className="lp-ch-tag">
                <span>{c.icon}</span>{c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FEATURE 1: Real-time monitoring ────────────────────── */}
      <div id="features" className="lp-sec lp-sec-pale">
        <div className="lp-wrap">
          <div className="lp-feat-row lp-r">
            <div className="lp-feat-copy">
              <div className="lp-eyebrow">Real-time monitoring</div>
              <h2 className="lp-h2">See every action your agents take, as it happens.</h2>
              <p className="lp-lead">
                Every event your AI agent fires is captured, structured, and surfaced in a
                live activity feed. No log parsing, no guesswork — ever.
              </p>
              <div className="lp-feat-checks">
                {[
                  { icon: '⚡', title: 'Structured event stream',   desc: 'Agents POST events via a single webhook endpoint. Orcha handles ingestion, storage, and display.' },
                  { icon: '🔍', title: 'Channel-level filtering',   desc: 'Filter by agent, channel, event type, or time range. Find exactly what you need in seconds.' },
                  { icon: '🔒', title: 'Immutable audit trail',     desc: 'Every event is timestamped and immutable. Export the full log for compliance review at any time.' },
                ].map(c => (
                  <div key={c.title} className="lp-feat-check-item">
                    <div className="lp-feat-check-icon">{c.icon}</div>
                    <div className="lp-feat-check-text">
                      <strong>{c.title}</strong>
                      <span>{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-feat-vis">
              <div className="lp-screen">
                <ScreenActivity />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FEATURE 2: Review queue ────────────────────────────── */}
      <div className="lp-sec lp-sec-dark">
        <div className="lp-wrap">
          <div className="lp-feat-row lp-feat-row-alt lp-r">
            <div className="lp-feat-copy">
              <div className="lp-eyebrow">Human-in-the-loop</div>
              <h2 className="lp-h2">Review AI outputs before they reach a single customer.</h2>
              <p className="lp-lead">
                Any agent output can be flagged for review. Managers approve, edit, or reject
                directly in Orcha — nothing is sent without sign-off.
              </p>
              <div className="lp-feat-checks">
                {[
                  { icon: '⚙️', title: 'Configurable review triggers', desc: 'Flag outputs based on event type, keyword, channel, or custom rules set by your team.' },
                  { icon: '✏️', title: 'Approve, edit, or reject',     desc: 'Managers see the full message context, can edit the output inline, and submit with one click.' },
                  { icon: '👤', title: 'Reviewer attribution',         desc: "Every decision is logged with the reviewer's name, timestamp, and any edits made — full accountability." },
                ].map(c => (
                  <div key={c.title} className="lp-feat-check-item">
                    <div className="lp-feat-check-icon">{c.icon}</div>
                    <div className="lp-feat-check-text">
                      <strong>{c.title}</strong>
                      <span>{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-feat-vis">
              <div className="lp-screen">
                <ScreenReview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FEATURE 3: RBAC + How it works ─────────────────────── */}
      <div className="lp-sec lp-sec-white">
        <div className="lp-wrap">
          <div className="lp-feat-row lp-r">
            <div className="lp-feat-copy">
              <div className="lp-eyebrow">Access control</div>
              <h2 className="lp-h2">Role-based permissions built in from day one.</h2>
              <p className="lp-lead">
                Give each team member exactly the access they need — no more, no less.
                Five granular roles cover every team structure from startup to enterprise.
              </p>
              <div className="lp-feat-checks">
                {[
                  { icon: '🛡️', title: 'Five role tiers',          desc: 'System Admin, Company Admin, Manager, Member, and Read-only — each with scoped permissions.' },
                  { icon: '🏢', title: 'Multi-tenant isolation',   desc: 'Each organisation is fully isolated. Data, agents, and users never cross workspace boundaries.' },
                  { icon: '✉️', title: 'Invite-based onboarding',  desc: 'Admins send role-specific invites. New team members are set up in under a minute.' },
                ].map(c => (
                  <div key={c.title} className="lp-feat-check-item">
                    <div className="lp-feat-check-icon">{c.icon}</div>
                    <div className="lp-feat-check-text">
                      <strong>{c.title}</strong>
                      <span>{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lp-role-pills">
                {['System Admin', 'Company Admin', 'Manager', 'Member', 'Read-only'].map(r => (
                  <span key={r} className="lp-role-pill">{r}</span>
                ))}
              </div>
            </div>
            <div className="lp-feat-vis" id="how">
              <div className="lp-steps">
                {[
                  { n: '01', title: 'Create your workspace',      body: 'Register your organisation and invite your team. Each workspace is fully isolated with its own billing, agents, and settings.' },
                  { n: '02', title: 'Connect your AI agents',     body: 'Register each agent and get a dedicated API key and webhook URL. No SDK needed — just a single POST endpoint.' },
                  { n: '03', title: 'Agents stream events',       body: 'As your agents operate they POST structured events to Orcha. Everything is captured, logged, and surfaced in real time.' },
                  { n: '04', title: 'Your team reviews and acts', body: 'Managers see pending reviews, approve outputs, close tasks, and access the full audit log — all from one place.' },
                ].map((s, i) => (
                  <div key={s.n} className="lp-step">
                    <div className="lp-step-num">{s.n}</div>
                    <div className="lp-step-body">
                      <div className="lp-step-title">{s.title}</div>
                      <div className="lp-step-desc">{s.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS ──────────────────────────────────────────────── */}
      <div className="lp-sec lp-sec-dark2" style={{ paddingBlock: '80px' }}>
        <div className="lp-wrap">
          <div className="lp-stats-grid">
            {STATS.map((s, i) => (
              <div key={s.n} className="lp-stat-cell lp-r" style={{ '--d': `${i * 0.08}s` }}>
                <div className="lp-stat-icon">{s.icon}</div>
                <div className="lp-stat-num">{s.n}<em>{s.unit}</em></div>
                <div className="lp-stat-txt">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <div className="lp-sec lp-sec-pale">
        <div className="lp-wrap">
          <div className="lp-r">
            <div className="lp-eyebrow">What teams say</div>
            <h2 className="lp-h2">Trusted by teams building with AI agents</h2>
          </div>

          {/* Featured quote */}
          <div className="lp-testi-feat lp-r" style={{ '--d': '0.1s' }}>
            <div className="lp-testi-feat-inner">
              <div className="lp-stars lp-testi-feat-stars">★★★★★</div>
              <blockquote className="lp-testi-feat-q">
                "Before Orcha, we had no idea what our WhatsApp bot was actually saying
                to leads. Three weeks in, we caught a pricing error before it reached
                200 people. <em>That alone paid for the platform.</em>"
              </blockquote>
              <div className="lp-testi-auth">
                <div className="lp-avatar" style={{ background: '#1A4731' }}>CM</div>
                <div>
                  <div className="lp-auth-name">Carlos Mendoza</div>
                  <div className="lp-auth-role">VP Operations, Growlytics</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lp-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="lp-testi-card lp-r" style={{ '--d': `${i * 0.1}s` }}>
                <div className="lp-stars">★★★★★</div>
                <p className="lp-testi-q">&ldquo;{t.quote}&rdquo;</p>
                <div className="lp-testi-auth">
                  <div className="lp-avatar" style={{ background: t.color }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="lp-auth-name">{t.name}</div>
                    <div className="lp-auth-role">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PRICING ────────────────────────────────────────────── */}
      <div id="pricing" className="lp-sec lp-sec-white">
        <div className="lp-wrap">
          <div className="lp-pricing-head lp-r">
            <div className="lp-eyebrow">Pricing</div>
            <h2 className="lp-h2">Simple, transparent pricing</h2>
            <p className="lp-lead">
              Start free. Scale as you grow. No hidden fees, no per-seat surprises.
            </p>

            <div className="lp-billing-toggle">
              <button
                className={`lp-bill-btn${!annual ? ' lp-bill-active' : ''}`}
                onClick={() => setAnnual(false)}
                type="button"
              >Monthly</button>
              <button
                className={`lp-bill-btn${annual ? ' lp-bill-active' : ''}`}
                onClick={() => setAnnual(true)}
                type="button"
              >
                Annual
                <span className="lp-bill-save">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="lp-price-grid">
            {PRICING.map((p, i) => (
              <div key={p.tier} className={`lp-price-card${p.pop ? ' lp-price-pop' : ''} lp-r`} style={{ '--d': `${i * 0.1}s` }}>
                {p.pop && <div className="lp-price-badge">Most popular</div>}
                <div className="lp-price-tier">{p.tier}</div>
                <div className="lp-price-amount">
                  {getPrice(p) === 'Free' || getPrice(p) === 'Custom' ? (
                    <div className="lp-price-main">{getPrice(p)}</div>
                  ) : (
                    <div className="lp-price-main">
                      <span className="lp-price-dollar">$</span>{getPrice(p)}
                      {annual && (
                        <span className="lp-price-was">${p.price}</span>
                      )}
                    </div>
                  )}
                </div>
                {getPrice(p) !== 'Free' && getPrice(p) !== 'Custom' && (
                  <div className="lp-price-period">per month{annual ? ', billed annually' : ''}</div>
                )}
                <div className="lp-price-desc">{p.desc}</div>
                <ul className="lp-price-feats">
                  {p.features.map(f => (
                    <li key={f}>
                      <span className="lp-price-tick">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.price === 'Custom' ? (
                  <Link to="/request-demo" className="lp-price-btn">{p.cta}</Link>
                ) : (
                  <Link to="/register" className={`lp-price-btn${p.pop ? ' lp-price-btn-p' : ''}`}>{p.cta}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="lp-sec lp-sec-pale">
        <div className="lp-wrap">
          <div className="lp-faq-header lp-r">
            <div className="lp-eyebrow">FAQ</div>
            <h2 className="lp-h2">Everything you need to know</h2>
            <p className="lp-lead" style={{ margin: '14px auto 0', textAlign: 'center', maxWidth: 560 }}>
              Still have questions? <Link to="/request-demo" style={{ color: 'var(--accent)', fontWeight: 700 }}>Talk to our team →</Link>
            </p>
          </div>
          <div className="lp-faq-grid lp-r" style={{ '--d': '0.1s' }}>
            {[
              {
                q: 'How do I connect my AI agent to Orcha?',
                a: 'Register your agent inside Orcha — give it a name and channel. Orcha generates a unique API key for it. You paste that key and the agent\'s ID into your agent\'s code, then call our webhook endpoint every time the agent fires. That\'s the entire setup. No SDK, no plugin, no infrastructure changes.',
              },
              {
                q: 'Do I need to rewrite my agent\'s code?',
                a: 'No. You only add a single HTTP POST call at the point in your code where your agent does something worth tracking. If your agent already sends messages or generates output, you add one call after that. Everything else stays exactly as it is.',
              },
              {
                q: 'What AI platforms and tools are compatible?',
                a: 'Any platform that can make an HTTP request works — Python scripts, Node.js, n8n, Make.com, Zapier, Vapi voice agents, Botpress, Flowise, or a fully custom LLM pipeline. Orcha is platform-agnostic by design. If it can call a URL, it works.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes. All data is transmitted over HTTPS. Each agent has its own unique API key — a compromised key cannot access any other agent or organisation. Passwords are hashed with bcrypt and never stored in plain text. Authentication uses short-lived JWT tokens. Access to production infrastructure is restricted to authorised personnel only.',
              },
              {
                q: 'What is the Review Queue and do I need it?',
                a: 'The Review Queue is a human-in-the-loop approval layer. When your agent generates an output, it can flag it for review before it reaches a customer. A manager approves, edits, or rejects it directly in Orcha. It\'s optional — you control per-agent whether review is required. Useful for high-stakes channels like sales or support where you want a human to sign off.',
              },
              {
                q: 'What happens if my agent goes offline?',
                a: 'Nothing breaks in Orcha. Agents that stop sending events are simply shown as inactive on the dashboard. When they come back online and start posting events again, their status automatically updates to Connected. Orcha is a passive receiver — it doesn\'t depend on your agents being reachable.',
              },
              {
                q: 'Can multiple team members use the same workspace?',
                a: 'Yes. Orcha supports full role-based access control. You can invite team members as Members, Managers, or Admins. Managers can approve items in the Review Queue. Admins manage the workspace and team. Everyone sees data scoped to your organisation only — nothing leaks between workspaces.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes. If you\'re on a paid plan and are not satisfied within the first 14 days, contact us and we will issue a full refund — no questions asked. After 14 days, you can cancel any time and your plan remains active until the end of the billing period. We do not charge cancellation fees.',
              },
              {
                q: 'Can I export my data?',
                a: 'Yes. Your agent event history, activity logs, tasks, and customer records all belong to you. You can request a full data export at any time by contacting support. If you decide to leave Orcha, we will send you a complete export before your account is closed.',
              },
              {
                q: 'How is Orcha different from just reading my agent\'s own logs?',
                a: 'Raw logs are unstructured, hard to search, and only visible to developers. Orcha turns those events into a structured, searchable, role-based dashboard your whole team can use — including managers who don\'t write code. It also adds the Review Queue, task management, customer tracking, and a tamper-proof audit trail that raw logs cannot provide.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`lp-faq-item${openFaq === i ? ' lp-faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="lp-faq-q">
                  <span>{item.q}</span>
                  <div className="lp-faq-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {openFaq === i && (
                  <div className="lp-faq-a">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="lp-cta-sec">
        <div className="lp-wrap">
          <div className="lp-cta-inner lp-r">
            <h2 className="lp-cta-h2">
              Your AI agents are already working.<br />
              <em>Now see exactly what they're doing.</em>
            </h2>
            <p className="lp-cta-sub">
              No credit card required. Connect your first agent and have your team
              reviewing live activity within five minutes.
            </p>
            <div className="lp-cta-acts">
              <Link to="/register"     className="lp-btn lp-btn-accent lp-btn-lg">Create free account</Link>
              <Link to="/request-demo" className="lp-btn lp-btn-ghost  lp-btn-lg">Request a demo</Link>
            </div>
          </div>
          <div className="lp-demo-wrap lp-r" style={{ '--d': '0.15s' }}>
            <button
              className={`lp-demo-toggle${demoOpen ? ' lp-demo-open' : ''}`}
              onClick={() => setDemoOpen(o => !o)}
              type="button"
            >
              <span>🔑 Explore the live demo workspace</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {demoOpen && (
              <div className="lp-demo-body">
                <div className="lp-demo-row">
                  <span className="lp-demo-pill lp-demo-pill-g">Company Admin</span>
                  <div className="lp-demo-info">
                    <code>manager@orcha.demo</code>
                    <small>Dashboard → Agents, Review Queue, Tasks, Customers, Activity Logs</small>
                  </div>
                </div>
                <div className="lp-demo-pw">Shared password: <code>password123</code></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div>
              <div className="lp-footer-brand-name">Orcha</div>
              <div className="lp-footer-brand-sub">AI Agent Management</div>
              <p className="lp-footer-brand-p">
                Operational visibility, human-in-the-loop review, and a complete
                audit trail for every AI agent your business runs.
              </p>
            </div>
            <div className="lp-footer-cols">
              <div>
                <div className="lp-footer-col-h">Product</div>
                <a href="#features" className="lp-footer-a">Features</a>
                <a href="#how"      className="lp-footer-a">How It Works</a>
                <a href="#pricing"  className="lp-footer-a">Pricing</a>
                <Link to="/request-demo" className="lp-footer-a">Request Demo</Link>
              </div>
              <div>
                <div className="lp-footer-col-h">Developers</div>
                <a href="#" className="lp-footer-a">API Reference</a>
                <a href="#" className="lp-footer-a">Webhook Docs</a>
                <a href="#" className="lp-footer-a">Event Schema</a>
                <a href="#" className="lp-footer-a">Changelog</a>
              </div>
              <div>
                <div className="lp-footer-col-h">Account</div>
                <Link to="/login"        className="lp-footer-a">Sign In</Link>
                <Link to="/register"     className="lp-footer-a">Create Account</Link>
                <Link to="/request-demo" className="lp-footer-a">Contact Sales</Link>
              </div>
            </div>
          </div>
          <div className="lp-footer-btm">
            <div className="lp-footer-copy">
              © {new Date().getFullYear()} Orcha. All rights reserved.
            </div>
            <div className="lp-footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
