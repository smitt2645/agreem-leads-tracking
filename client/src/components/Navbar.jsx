import React from 'react';
import { Users, LogOut, UserCircle } from 'lucide-react';

export default function Navbar({ totalLeads, currentUser, onLogout }) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Users size={18} />
        </div>
        <span>LeadFlow CRM</span>
      </div>

      <div className="nav-stats">
        <span className="badge badge-new">
          Total Leads: {totalLeads}
        </span>

        {currentUser && (
          <div className="nav-user-menu">
            <div className="user-badge" title="Logged in user">
              <UserCircle size={16} />
              <span className="username-text">{currentUser.user || 'Admin'}</span>
            </div>
            <button
              className="btn btn-secondary nav-logout-btn"
              onClick={onLogout}
              title="Log out of session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
