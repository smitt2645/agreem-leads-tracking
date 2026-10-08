import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import CreateLeadPage from './pages/CreateLeadPage';
import EditLeadPage from './pages/EditLeadPage';
import LoginScreen from './components/LoginScreen';
import { getStoredAuth, clearStoredAuth } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredAuth());
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    const handleAuthRequired = () => {
      clearStoredAuth();
      setCurrentUser(null);
    };
    window.addEventListener('leads_auth_required', handleAuthRequired);
    return () => window.removeEventListener('leads_auth_required', handleAuthRequired);
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(auth) => setCurrentUser(auth)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar
          totalLeads={totalLeads}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={<LeadsListPage onStatsChange={(count) => setTotalLeads(count)} />}
          />
          <Route path="/leads" element={<Navigate to="/" replace />} />
          <Route path="/leads/new" element={<CreateLeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/leads/:id/edit" element={<EditLeadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
