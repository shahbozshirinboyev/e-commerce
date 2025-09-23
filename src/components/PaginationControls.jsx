"use client";

export default function PaginationControls({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm">{page} / {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
