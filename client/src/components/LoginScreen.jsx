import React, { useState } from 'react';
import { Users, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { checkAuth, setStoredAuth } from '../api';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await checkAuth(username.trim(), password.trim());
      const auth = setStoredAuth(username.trim(), password.trim());
      onLoginSuccess(auth);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand-header">
          <div className="login-icon-box">
            <Users size={28} />
          </div>
          <h2 className="login-title">LeadFlow CRM</h2>
          <p className="login-subtitle">Sign in to access your leads and client dashboard</p>
        </div>

        {error && (
          <div className="error-alert" style={{ marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-input with-left-icon"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input with-left-icon with-right-icon"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner-icon" style={{ color: '#fff' }} />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="login-hint-box">
          <div className="hint-header">
            <ShieldCheck size={14} />
            <span>Default Test Credentials</span>
          </div>
          <div className="hint-body">
            <code>admin</code> / <code>admin123</code>
            <button
              type="button"
              className="quick-fill-btn"
              onClick={handleQuickFill}
            >
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
