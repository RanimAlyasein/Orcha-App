import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SidebarLink({ to, icon, label, end, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
      <span className="icon">{icon}</span> {label}
    </NavLink>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, org, logout, isAdmin, canManage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
      <div className="sidebar-logo">
        <div className="name">Orcha</div>
        <div className="tagline">AI Agent Management</div>
      </div>

      {isAdmin ? (
        <>
          <div className="sidebar-section">Platform</div>
          <SidebarLink to="/admin" icon="🛡️" label="Admin Panel" onClick={onClose} />
        </>
      ) : (
        <>
          <div className="sidebar-section">Workspace</div>
          <SidebarLink to="/dashboard" icon="🏠" label="Dashboard" end onClick={onClose} />
          <SidebarLink to="/agents" icon="🤖" label="Agents" onClick={onClose} />
          <SidebarLink to="/review-queue" icon="📋" label="Review Queue" onClick={onClose} />
          <SidebarLink to="/event-simulator" icon="⚡" label="Event Simulator" onClick={onClose} />
          <SidebarLink to="/tasks" icon="✅" label="Tasks" onClick={onClose} />

          <div className="sidebar-section">Organization</div>
          {canManage && <SidebarLink to="/team" icon="🤝" label="Team" onClick={onClose} />}
          <SidebarLink to="/activity-logs" icon="📜" label="Activity Logs" onClick={onClose} />
        </>
      )}

      <div className="sidebar-footer">
        <div className="customer-chip">
          <span>{initials}</span>
          <div>
            <strong>{user?.name || user?.email || 'User'}</strong>
            <small>{isAdmin ? 'Platform Admin' : (org?.name || 'Orcha')}</small>
          </div>
        </div>
        <NavLink to="/profile" onClick={onClose} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} style={{ marginTop: 8, paddingLeft: 0 }}>
          <span className="icon">⚙️</span> Profile &amp; Settings
        </NavLink>
        <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  );
}
