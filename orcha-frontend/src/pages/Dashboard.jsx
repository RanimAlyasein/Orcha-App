// Main dashboard — shows summary stats, event/task charts, and recent activity feed
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { dashboardApi } from '../api/dashboardApi';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = { TODO: '#6366F1', IN_PROGRESS: '#B7770D', DONE: '#1E4D35', CANCELLED: '#aaa' };
const EVENT_COLORS = {
  MESSAGE_RECEIVED: '#1E4D35', MESSAGE_SENT: '#2E6B4A', TASK_STARTED: '#6366F1',
  TASK_COMPLETED: '#059669', TASK_FAILED: '#EF4444', OUTPUT_GENERATED: '#8B5CF6',
  ERROR: '#EF4444', CUSTOM: '#888',
};
const EVENT_BADGE_CLASS = {
  MESSAGE_RECEIVED: 'log-event log-event-green', MESSAGE_SENT: 'log-event log-event-green',
  TASK_STARTED: 'log-event log-event-blue', TASK_COMPLETED: 'log-event log-event-green',
  TASK_FAILED: 'log-event log-event-red', OUTPUT_GENERATED: 'log-event log-event-purple',
  ERROR: 'log-event log-event-red', STATUS_CHANGED: 'log-event log-event-amber',
};
const EVENT_DOT_CLASS = {
  ERROR: 'log-dot log-dot-error', TASK_FAILED: 'log-dot log-dot-error',
  STATUS_CHANGED: 'log-dot log-dot-status',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function fmtT(d) {
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const TooltipStyle = { background: '#fff', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: summary, loading: sLoading } = useFetch(() => dashboardApi.summary());
  const { data: tasksByStatus } = useFetch(() => dashboardApi.tasksByStatus());
  const { data: eventsByType } = useFetch(() => dashboardApi.eventsByType());
  const { data: recentActivity } = useFetch(() => dashboardApi.recentActivity());

  const taskChartData = tasksByStatus
    ? Object.entries(tasksByStatus).map(([status, count]) => ({ name: status.replace(/_/g, ' '), status, count }))
    : [];

  const eventChartData = Array.isArray(eventsByType)
    ? eventsByType.map(e => ({ name: e.type.replace(/_/g, ' '), type: e.type, count: e.count }))
    : [];

  const pendingCount = summary?.pendingReviews ?? 0;
  const firstName = user?.name?.split(' ')?.[0] || 'there';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">{getGreeting()}, {firstName}</div>
          <div className="topbar-sub">{today}</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/event-simulator')}>
          ⚡ Simulate Event
        </button>
      </div>

      <div className="page-body">
        {sLoading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card stat-card--green">
                <div className="stat-icon">🤖</div>
                <div className="stat-label">Connected Agents</div>
                <div className="stat-value">{summary?.connectedAgents ?? 0}</div>
                <div className="stat-sub">Live &amp; active</div>
              </div>

              <div className="stat-card stat-card--blue">
                <div className="stat-icon">⚡</div>
                <div className="stat-label">Events Today</div>
                <div className="stat-value">{summary?.eventsToday ?? 0}</div>
                <div className="stat-sub">Received today</div>
              </div>

              <div
                className={`stat-card${pendingCount > 0 ? ' stat-card--amber' : ''}`}
                style={{ cursor: pendingCount > 0 ? 'pointer' : 'default' }}
                onClick={() => pendingCount > 0 && navigate('/review-queue')}
              >
                <div className="stat-icon">📋</div>
                <div className="stat-label">Pending Reviews</div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-sub">
                  {pendingCount > 0 ? <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Tap to review →</span> : 'All clear'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🤝</div>
                <div className="stat-label">Team Members</div>
                <div className="stat-value">{summary?.members ?? 0}</div>
                <div className="stat-sub">In workspace</div>
              </div>
            </div>

            {/* Charts */}
            <div className="dashboard-charts">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Events by Type</span>
                  <span className="card-meta">{eventChartData.reduce((a, b) => a + b.count, 0)} total</span>
                </div>
                <div className="card-body" style={{ paddingTop: 8 }}>
                  {eventChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={eventChartData} margin={{ top: 4, right: 4, left: -20, bottom: 24 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip contentStyle={TooltipStyle} cursor={{ fill: 'var(--bg)' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {eventChartData.map((entry, i) => (
                            <Cell key={i} fill={EVENT_COLORS[entry.type] || '#C8DDD1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty">
                      No events yet.{' '}
                      <span style={{ color: 'var(--green-dark)', cursor: 'pointer' }} onClick={() => navigate('/event-simulator')}>
                        Simulate one →
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Tasks by Status</span>
                  <span className="card-meta">{taskChartData.reduce((a, b) => a + b.count, 0)} total</span>
                </div>
                <div className="card-body" style={{ paddingTop: 8 }}>
                  {taskChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={taskChartData} margin={{ top: 4, right: 4, left: -20, bottom: 24 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip contentStyle={TooltipStyle} cursor={{ fill: 'var(--bg)' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {taskChartData.map((entry, i) => (
                            <Cell key={i} fill={STATUS_COLORS[entry.status] || '#C8DDD1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty">No tasks yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ marginTop: 20 }}>
              <div className="card-header">
                <span className="card-title">Recent Activity</span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/activity-logs')}>View all →</button>
              </div>
              <div className="log-list">
                {!recentActivity?.length ? (
                  <div className="empty">No recent activity.</div>
                ) : (
                  recentActivity.slice(0, 10).map(log => (
                    <div key={log.id} className="log-item">
                      <div className={EVENT_DOT_CLASS[log.eventType] || 'log-dot'} style={{ marginTop: 6 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span className={EVENT_BADGE_CLASS[log.eventType] || 'log-event'}>{log.eventType?.replace(/_/g, ' ')}</span>
                          {log.agent && <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>{log.agent.name}</span>}
                          <span className="log-time" style={{ marginTop: 0, marginLeft: 'auto' }}>{fmtT(log.createdAt)}</span>
                        </div>
                        <div className="log-message">{log.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
