import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, lead, loading }) {
  if (!isOpen || !lead) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
            <AlertTriangle size={20} />
            <h3 className="modal-title" style={{ color: '#dc2626' }}>Delete Lead</h3>
          </div>
          <button className="icon-btn" onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>
            Are you sure you want to delete lead <strong>{lead.name}</strong> ({lead.email})?
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            This action cannot be undone. All associated notes for this lead will also be permanently removed.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger-solid"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner-icon" style={{ color: '#fff' }} />
                Deleting...
              </>
            ) : (
              'Delete Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
