import React from 'react';
import { X, MessageSquare, Calendar, UserCheck } from 'lucide-react';

export default function NoteViewModal({ isOpen, onClose, note, leadName }) {
  if (!isOpen || !note) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="modal-title">Note Details</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Lead: <strong>{leadName}</strong>
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="note-modal-meta">
            <span className="note-modal-meta-item">
              <UserCheck size={14} />
              <span>Logged by Team</span>
            </span>
            <span className="note-modal-meta-item">
              <Calendar size={14} />
              <span>{formatDate(note.createdAt)}</span>
            </span>
          </div>

          <div className="note-modal-content-box">
            <p className="note-modal-text">{note.content}</p>
          </div>
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
