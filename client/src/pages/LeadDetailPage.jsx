import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, Calendar, MessageSquare, Send, 
  Trash2, Edit2, Loader2, AlertCircle, CheckCircle2, Maximize2 
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import NoteViewModal from '../components/NoteViewModal';
import { fetchLeadById, createLeadNote, updateLead, deleteLead } from '../api';

const STATUS_BADGES = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  qualified: 'badge-qualified',
  lost: 'badge-lost'
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [noteContent, setNoteContent] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [noteSuccess, setNoteSuccess] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadLead = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchLeadById(id);
      setLead(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load lead details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      setNoteError('Note content cannot be empty.');
      return;
    }

    try {
      setNoteLoading(true);
      setNoteError('');
      setNoteSuccess('');
      await createLeadNote(id, { content: noteContent.trim() });
      setNoteContent('');
      setNoteSuccess('Note added successfully!');
      setTimeout(() => setNoteSuccess(''), 3000);
      loadLead();
    } catch (err) {
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!lead || lead.status === newStatus) return;
    try {
      setError('');
      setLead((prev) => (prev ? { ...prev, status: newStatus } : prev));
      await updateLead(lead.id, { status: newStatus });
      loadLead();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleUpdateLead = async (formData) => {
    await updateLead(lead.id, formData);
    setIsEditing(false);
    loadLead();
  };

  const handleDeleteLead = async () => {
    try {
      setDeleteLoading(true);
      await deleteLead(lead.id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
      setIsDeleting(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container" style={{ minHeight: '50vh' }}>
          <Loader2 size={36} className="spinner-icon" />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>Loading lead details...</p>
        </div>
      </main>
    );
  }

  if (error || !lead) {
    return (
      <main className="main-content">
        <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
          <div className="error-alert" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error || 'Lead not found (404)'}</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <ArrowLeft size={16} />
              Back to Leads List
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="detail-page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to Leads
        </button>

        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/leads/${id}/edit`)}>
            <Edit2 size={15} />
            Edit Info
          </button>
          <button className="btn btn-danger" onClick={() => setIsDeleting(true)}>
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-card lead-summary-card">
          <div className="lead-summary-header">
            <div className="avatar-circle">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="lead-detail-name">{lead.name}</h2>
              <span className={`badge ${STATUS_BADGES[lead.status] || 'badge-new'}`}>
                {lead.status}
              </span>
            </div>
          </div>

          <div className="summary-info-list">
            <div className="summary-info-row">
              <span className="summary-icon"><Mail size={16} /></span>
              <div>
                <span className="summary-label">Email Address</span>
                <span className="summary-value">{lead.email}</span>
              </div>
            </div>

            <div className="summary-info-row">
              <span className="summary-icon"><Phone size={16} /></span>
              <div>
                <span className="summary-label">Phone Number</span>
                <span className="summary-value">{lead.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="summary-info-row">
              <span className="summary-icon"><Calendar size={16} /></span>
              <div>
                <span className="summary-label">Created Date</span>
                <span className="summary-value">{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="status-quick-change">
            <label className="form-label" style={{ fontSize: '0.8125rem' }}>Update Status:</label>
            <select
              className="form-select"
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="detail-card notes-card">
          <div className="card-header-with-badge">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} className="text-primary" />
              <h3 className="section-title">Activity & Notes</h3>
            </div>
            <span className="badge badge-new">{lead.notes?.length || 0} notes</span>
          </div>

          <form onSubmit={handleAddNote} className="add-note-form">
            {noteError && <div className="error-alert" style={{ padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>{noteError}</div>}
            {noteSuccess && (
              <div className="success-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={15} />
                <span>{noteSuccess}</span>
              </div>
            )}
            <textarea
              className="form-textarea"
              placeholder="Write a note or call summary for this lead..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              disabled={noteLoading}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.625rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={noteLoading || !noteContent.trim()}
              >
                {noteLoading ? (
                  <>
                    <Loader2 size={15} className="spinner-icon" style={{ color: '#fff' }} />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Add Note
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="notes-list-timeline">
            {!lead.notes || lead.notes.length === 0 ? (
              <div className="empty-notes-state">
                <MessageSquare size={32} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
                <p>No notes logged yet for this lead.</p>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>
                  Add communications, client requirements, or demo outcomes above.
                </span>
              </div>
            ) : (
              lead.notes.map((note) => (
                <div key={note.id} className="timeline-note-item">
                  <div className="timeline-dot" />
                  <div
                    className="timeline-note-content-box"
                    onClick={() => setSelectedNote(note)}
                    title="Click to view full note details"
                  >
                    <div className="timeline-note-header">
                      <span className="note-author">Team Note</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="note-date">{formatDate(note.createdAt)}</span>
                        <Maximize2 size={13} style={{ color: 'var(--text-light)' }} />
                      </div>
                    </div>
                    <p className="note-body-text">{note.content}</p>
                    <span className="note-view-hint">
                      <MessageSquare size={12} />
                      Click to expand full note
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <NoteViewModal
        isOpen={!!selectedNote}
        note={selectedNote}
        leadName={lead.name}
        onClose={() => setSelectedNote(null)}
      />

      <LeadModal
        isOpen={isEditing}
        initialData={lead}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdateLead}
      />

      <DeleteConfirmModal
        isOpen={isDeleting}
        lead={lead}
        loading={deleteLoading}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDeleteLead}
      />
    </main>
  );
}
