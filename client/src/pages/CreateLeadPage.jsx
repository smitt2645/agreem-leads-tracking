import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { createLead, createLeadNote } from '../api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateLeadPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('new');
  const [initialNote, setInitialNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!name.trim()) validationErrors.push('Name is required');
    if (!email.trim()) {
      validationErrors.push('Email is required');
    } else if (!EMAIL_REGEX.test(email.trim())) {
      validationErrors.push('Please enter a valid email address');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

      const leadPayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        status
      };

      const res = await createLead(leadPayload);
      const newLead = res.data;

      if (initialNote.trim() && newLead && newLead.id) {
        try {
          await createLeadNote(newLead.id, { content: initialNote.trim() });
        } catch (err) {
          console.error('Failed to create initial note', err);
        }
      }

      navigate(`/leads/${newLead.id}`);
    } catch (err) {
      setErrors([err.message || 'Failed to create lead']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="detail-page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to Leads
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="detail-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="page-title" style={{ fontSize: '1.35rem' }}>Create New Lead</h2>
              <p className="page-subtitle">Enter lead details to track status and log communication notes</p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-alert">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: errors.length > 1 ? '0.375rem' : 0 }}>
                <AlertCircle size={16} />
                <strong>Please fix the following:</strong>
              </div>
              {errors.length === 1 ? (
                <span>{errors[0]}</span>
              ) : (
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="lead-name">
                Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="lead-email">
                  Email Address <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-phone">
                  Phone Number
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lead-status">
                Initial Status
              </label>
              <select
                id="lead-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lead-note">
                Initial Note (Optional)
              </label>
              <textarea
                id="lead-note"
                className="form-textarea"
                placeholder="e.g. Lead signed up via website form seeking enterprise pricing..."
                value={initialNote}
                onChange={(e) => setInitialNote(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" style={{ color: '#fff' }} />
                    Creating Lead...
                  </>
                ) : (
                  'Create Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
