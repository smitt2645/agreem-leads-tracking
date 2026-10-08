import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Calendar, Mail, Phone, Clock } from 'lucide-react';
import { fetchLeadById, createLeadNote, updateLead } from '../api';

const STATUS_BADGES = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  qualified: 'badge-qualified',
  lost: 'badge-lost'
};

export default function LeadDetailModal({ leadId, isOpen, onClose, onLeadUpdated }) {
  const [lead, setLead] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState('');

  const loadLeadDetails = async () => {
    if (!leadId) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetchLeadById(leadId);
      setLead(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && leadId) {
      loadLeadDetails();
    } else {
      setLead(null);
      setNoteContent('');
      setError('');
    }
  }, [isOpen, leadId]);

  if (!isOpen) return null;

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setAddingNote(true);
      setError('');
      const res = await createLeadNote(leadId, { content: noteContent.trim() });
      setLead((prev) => ({
        ...prev,
        notes: [res.data, ...(prev.notes || [])]
      }));
      setNoteContent('');
    } catch (err) {
      setError(err.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setError('');
      const res = await updateLead(leadId, { status: newStatus });
      setLead((prev) => ({
        ...prev,
        status: res.data.status
      }));
      if (onLeadUpdated) {
        onLeadUpdated(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 className="modal-title">{lead?.name || 'Lead Details'}</h3>
            {lead && (
              <span className={`badge ${STATUS_BADGES[lead.status] || 'badge-new'}`}>
                {lead.status}
              </span>
            )}
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-alert">{error}</div>}

          {loading ? (
            <div className="empty-state">
              <p>Loading lead details...</p>
            </div>
          ) : lead ? (
            <>
              <div className="lead-overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    LEAD OVERVIEW
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Status:
                    </label>
                    <select
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem', width: 'auto' }}
                      value={lead.status}
                      onChange={handleStatusChange}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>

                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Email</span>
                    <span className="overview-val" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      {lead.email}
                    </span>
                  </div>

                  <div className="overview-item">
                    <span className="overview-label">Phone</span>
                    <span className="overview-val" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Phone size={14} color="var(--text-muted)" />
                      {lead.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="overview-item">
                    <span className="overview-label">Created At</span>
                    <span className="overview-val" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  <div className="overview-item">
                    <span className="overview-label">Lead ID</span>
                    <span className="overview-val">#{lead.id}</span>
                  </div>
                </div>
              </div>

              <div className="notes-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <MessageSquare size={18} color="var(--primary)" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Notes & Activity</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({lead.notes?.length || 0})
                  </span>
                </div>

                <form onSubmit={handleAddNote} style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <textarea
                      className="form-textarea"
                      placeholder="Add a new note, meeting update, or follow-up details..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={addingNote || !noteContent.trim()}
                      style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
                    >
                      <Send size={14} />
                      {addingNote ? 'Adding...' : 'Add Note'}
                    </button>
                  </div>
                </form>

                <div className="notes-timeline">
                  {lead.notes && lead.notes.length > 0 ? (
                    lead.notes.map((note) => (
                      <div key={note.id} className="note-card">
                        <div className="note-header">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} />
                            {formatDate(note.createdAt)}
                          </span>
                          <span>Note #{note.id}</span>
                        </div>
                        <div className="note-content">{note.content}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      No notes added yet. Add the first note above.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
