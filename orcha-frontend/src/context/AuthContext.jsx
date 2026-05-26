// ─── Auth Context ──────────────────────────────────────────────────────────────
// Provides global authentication state to the entire React app.
// Instead of passing user/token data as props through every component, any
// component can call useAuth() to access the current user, their role, and
// login/logout functions.
//
// This follows the React Context + Provider pattern:
//   AuthProvider wraps the app and holds state
//   useAuth() is the hook that any child component uses to read that state
// ──────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // full user object from the backend
  const [org, setOrg] = useState(null);     // the user's current organization
  const [loading, setLoading] = useState(true); // true while the initial auth check runs

  // On first load, check if a token already exists in localStorage.
  // If it does, fetch the user profile from the backend to restore the session.
  // This means the user stays logged in after refreshing the page.
  useEffect(() => {
    const token = localStorage.getItem('orcha_token');
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then(res => {
        const u = res.data.data;
        setUser(u);
        // Extract the user's first organization membership for the org context
        const membership = u?.memberships?.[0];
        if (membership) setOrg(membership.organization);
      })
      .catch(() => localStorage.removeItem('orcha_token')) // token is invalid — clear it
      .finally(() => setLoading(false));
  }, []);

  // Called after a successful login or register.
  // Stores the JWT in localStorage and saves the user data in context.
  const login = (token, userData) => {
    localStorage.setItem('orcha_token', token);
    setUser(userData);
    const membership = userData?.memberships?.[0];
    if (membership) setOrg(membership.organization);
  };

  // Called when the user clicks "Log out".
  // Clears the JWT and resets state — the user will be redirected to /login.
  const logout = () => {
    localStorage.removeItem('orcha_token');
    setUser(null);
    setOrg(null);
  };

  // Re-fetches the user profile from the backend to sync state after edits
  // (e.g. after the user updates their name on the Profile page).
  const refreshUser = () =>
    authApi.me().then(res => {
      const u = res.data.data;
      setUser(u);
      const membership = u?.memberships?.[0];
      if (membership) setOrg(membership.organization);
    }).catch(() => {});

  // Derived permission flags — computed from the user's role and membership.
  // Components use these instead of checking role strings directly.
  const isAdmin = user?.role === 'SYSTEM_ADMIN';         // platform-wide admin
  const orgRole = user?.memberships?.[0]?.role;           // role within the organization
  const canManage = isAdmin || orgRole === 'COMPANY_ADMIN' || orgRole === 'MANAGER'; // can manage team/settings

  return (
    <AuthContext.Provider value={{ user, org, loading, login, logout, refreshUser, isAdmin, orgRole, canManage }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components import this instead of useContext(AuthContext) directly
export const useAuth = () => useContext(AuthContext);
