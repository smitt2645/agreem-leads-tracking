import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchLeadById, updateLead } from '../api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new'
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const loadLead = useCallback(async () => {
    try {
      setInitialLoading(true);
      setErrors([]);
      const res = await fetchLeadById(id);
      const lead = res.data;
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status || 'new'
      });
    } catch (err) {
      setErrors([err.message || 'Failed to load lead for editing']);
    } finally {
      setInitialLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!formData.name.trim()) validationErrors.push('Name is required');
    if (!formData.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      validationErrors.push('Please enter a valid email address');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors([]);
      setSuccess('');

      await updateLead(id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        status: formData.status
      });

      setSuccess('Lead updated successfully!');
      setTimeout(() => {
        navigate(`/leads/${id}`);
      }, 700);
    } catch (err) {
      setErrors([err.message || 'Failed to update lead']);
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="main-content">
        <div className="loading-container" style={{ minHeight: '50vh' }}>
          <Loader2 size={36} className="spinner-icon" />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>Loading lead information...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="detail-page-header">
        <button className="btn btn-secondary" onClick={() => navigate(`/leads/${id}`)}>
          <ArrowLeft size={16} />
          Back to Lead Details
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="detail-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
              <Edit3 size={20} />
            </div>
            <div>
              <h2 className="page-title" style={{ fontSize: '1.35rem' }}>Edit Lead #{id}</h2>
              <p className="page-subtitle">Update contact information and qualification status</p>
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

          {success && (
            <div className="success-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={16} />
              <span>{success}</span>
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
                name="name"
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                required
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
                  name="email"
                  className="form-input"
                  placeholder="e.g. sarah@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-phone">
                  Phone Number
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="e.g. +1 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lead-status">
                Status
              </label>
              <select
                id="lead-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/leads/${id}`)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" style={{ color: '#fff' }} />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
