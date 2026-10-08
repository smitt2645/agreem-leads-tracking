import React from 'react';
import { Phone, MessageSquare, Edit2, Trash2, FolderSearch, Loader2 } from 'lucide-react';

const STATUS_BADGES = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  qualified: 'badge-qualified',
  lost: 'badge-lost'
};

export default function LeadTable({ leads, onView, onEdit, onDelete, onStatusChange, loading }) {
  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner-icon" size={32} />
        <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="empty-state">
        <FolderSearch className="empty-icon" size={44} />
        <h3 className="empty-title">No leads found</h3>
        <p>Try adjusting your search criteria or add a new lead.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-responsive">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Lead Info</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className="lead-name-cell clickable-lead" onClick={() => onView(lead)} title="Open lead details & notes">
                  <span className="lead-name">{lead.name}</span>
                  <span className="lead-email">{lead.email}</span>
                </div>
              </td>
              <td>
                {lead.phone ? (
                  <span className="lead-phone">
                    <Phone size={13} />
                    {lead.phone}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-light)' }}>-</span>
                )}
              </td>
              <td>
                <select
                  className={`status-badge-select ${STATUS_BADGES[lead.status] || 'badge-new'}`}
                  value={lead.status}
                  onChange={(e) => onStatusChange && onStatusChange(lead.id, e.target.value)}
                  title="Click to update lead status directly"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </td>
              <td>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {formatDate(lead.createdAt)}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    className="icon-btn highlight-notes-btn"
                    title="View & Add Notes"
                    onClick={() => onView(lead)}
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    title="Edit lead"
                    onClick={() => onEdit(lead)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-btn danger"
                    title="Delete lead"
                    onClick={() => onDelete(lead)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
