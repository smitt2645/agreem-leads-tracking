import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { total, page, limit, totalPages } = pagination;

  if (total === 0) return null;

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <strong>{startIdx}</strong> to <strong>{endIdx}</strong> of <strong>{total}</strong> leads
      </div>

      <div className="pagination-controls">
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          style={{ padding: '0.375rem 0.625rem' }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={{ padding: '0.375rem 0.625rem' }}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
