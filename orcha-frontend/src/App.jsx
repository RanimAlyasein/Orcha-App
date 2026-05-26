// ─── App Router ───────────────────────────────────────────────────────────────
// Defines the entire client-side routing structure using React Router.
// Routes are split into two groups:
//
//   Public routes  — anyone can visit (landing, login, register, legal pages)
//   Protected routes — require a valid login session (dashboard, agents, etc.)
//
// Protected routes are wrapped in <ProtectedRoute> which checks the auth context
// and redirects to /login if no session exists.
//
// AppShell is the layout component that renders the sidebar + mobile header for
// all authenticated pages. <Outlet /> is where the active page renders inside it.
// ──────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RequestDemo from './pages/RequestDemo';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AcceptInvitation from './pages/AcceptInvitation';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import Tasks from './pages/Tasks';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import ActivityLogs from './pages/ActivityLogs';
import Team from './pages/Team';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import EventSimulator from './pages/EventSimulator';
import ReviewQueue from './pages/ReviewQueue';

// AppShell — the persistent layout for authenticated pages.
// Renders the sidebar (collapsible on mobile) and the page content area.
// <Outlet /> is a React Router placeholder — it renders whichever child route
// is currently active (e.g. <Dashboard />, <Agents />, etc.).
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      {/* Dark overlay behind the sidebar on mobile — clicking it closes the sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content">
        {/* Mobile-only top bar with hamburger menu and logo */}
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <span className="mobile-logo">Orcha</span>
        </div>
        {/* Active page renders here */}
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public routes — no login required ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/request-demo" element={<RequestDemo />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms"   element={<Terms />} />

      {/* ── Protected routes — redirect to /login if not authenticated ── */}
      {/* ProtectedRoute wraps AppShell so the sidebar only renders when logged in */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/agents"         element={<Agents />} />
        <Route path="/agents/:id"     element={<AgentDetail />} />       {/* Dynamic route: :id = agent's UUID */}
        <Route path="/tasks"          element={<Tasks />} />
        <Route path="/customers"      element={<Customers />} />
        <Route path="/customers/:id"  element={<CustomerDetail />} />
        <Route path="/activity-logs"  element={<ActivityLogs />} />
        <Route path="/team"           element={<Team />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/event-simulator" element={<EventSimulator />} />
        <Route path="/review-queue"   element={<ReviewQueue />} />

        {/* Admin panel — requires SYSTEM_ADMIN role (second ProtectedRoute check) */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch-all — any unknown URL renders the branded 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
