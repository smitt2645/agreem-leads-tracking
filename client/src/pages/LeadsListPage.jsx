import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCw, Loader2, X } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import LeadTable from '../components/LeadTable';
import LeadModal from '../components/LeadModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Pagination from '../components/Pagination';
import { fetchLeads, updateLead, deleteLead } from '../api';

export default function LeadsListPage({ onStatsChange }) {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [stats, setStats] = useState({ new: 0, contacted: 0, qualified: 0, lost: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== debouncedSearch) {
      setIsDebouncing(true);
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadStats = async () => {
    try {
      const allLeadsRes = await fetchLeads({ limit: 100 });
      const counts = { new: 0, contacted: 0, qualified: 0, lost: 0 };
      allLeadsRes.data.forEach((l) => {
        if (counts[l.status] !== undefined) {
          counts[l.status]++;
        }
      });
      setStats(counts);
      if (onStatsChange) onStatsChange(allLeadsRes.pagination.total);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLeads = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchLeads({
        search: debouncedSearch,
        status: statusFilter,
        page,
        limit: 10
      });
      setLeads(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    loadLeads(1);
    loadStats();
  }, [loadLeads]);

  const handleUpdateLead = async (formData) => {
    if (!editingLead) return;
    await updateLead(editingLead.id, formData);
    setEditingLead(null);
    loadLeads(pagination.page);
    loadStats();
  };

  const handleDeleteLead = async () => {
    if (!deletingLead) return;
    try {
      setDeleteLoading(true);
      await deleteLead(deletingLead.id);
      setDeletingLead(null);
      loadLeads(pagination.page);
      loadStats();
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadLeads(pagination.page), loadStats()]);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const handleInlineStatusChange = async (leadId, newStatus) => {
    try {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
      await updateLead(leadId, { status: newStatus });
      loadStats();
    } catch (err) {
      setError(err.message || 'Failed to update status');
      loadLeads(pagination.page);
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads Management</h1>
          <p className="page-subtitle">Track, qualify, and manage client communications and notes</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            title="Refresh list"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spinner-icon' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/leads/new')}
          >
            <Plus size={16} />
            Add New Lead
          </button>
        </div>
      </div>

      <StatsBar stats={stats} />

      {error && <div className="error-alert">{error}</div>}

      <div className="controls-card">
        <div className="search-filter-group">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <LeadTable
          leads={leads}
          loading={loading}
          onView={(lead) => navigate(`/leads/${lead.id}`)}
          onEdit={(lead) => navigate(`/leads/${lead.id}/edit`)}
          onDelete={(lead) => setDeletingLead(lead)}
          onStatusChange={handleInlineStatusChange}
        />

        <Pagination
          pagination={pagination}
          onPageChange={(newPage) => loadLeads(newPage)}
        />
      </div>

      <LeadModal
        isOpen={!!editingLead}
        initialData={editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdateLead}
      />

      <DeleteConfirmModal
        isOpen={!!deletingLead}
        lead={deletingLead}
        loading={deleteLoading}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteLead}
      />
    </main>
  );
}
