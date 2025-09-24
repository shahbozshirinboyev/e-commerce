"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import OrderTable from '@/components/OrderTable';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0); // zero-based
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState('ALL');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/orders', {
          params: {
            page,
            size,
            // Search: try multiple common param names to maximize compatibility
            customer: debouncedSearch || undefined,
            email: debouncedSearch || undefined,
            customerName: debouncedSearch || undefined,
            customerEmail: debouncedSearch || undefined,
            query: debouncedSearch || undefined,
            q: debouncedSearch || undefined,
            // Status
            status: status && status !== 'ALL' ? String(status).toUpperCase() : undefined,
            orderStatus: status && status !== 'ALL' ? String(status).toUpperCase() : undefined,
            state: status && status !== 'ALL' ? String(status).toUpperCase() : undefined,
          },
          headers: {
            'Accept-Language': (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'en',
          },
        });
        const payload = data?.data || data || {};
        const list = (payload.content || []).map((o) => ({
          id: o.id,
          customer: o.customerName,
          email: o.customerEmail,
          total: o.totalAmount,
          status: o.status,
        }));

        // Client-side fallback filtering in case backend ignores filters
        let filtered = list;
        if (status && status !== 'ALL') {
          const s = String(status).toUpperCase();
          filtered = filtered.filter((x) => String(x.status).toUpperCase() === s);
        }
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          filtered = filtered.filter((x) =>
            (x.customer || '').toLowerCase().includes(q) || (x.email || '').toLowerCase().includes(q)
          );
        }

        // If client-side filtering changed the list, reflect counts and slice locally
        const usedClientFilter = (status && status !== 'ALL') || !!debouncedSearch;
        if (usedClientFilter) {
          const total = filtered.length;
          const pages = Math.max(1, Math.ceil(total / Math.max(1, size)));
          // Ensure current page is within bounds
          const currentPage = Math.min(page, pages - 1);
          const start = currentPage * size;
          const end = start + size;
          setOrders(filtered.slice(start, end));
          setTotalPages(pages);
          setTotalElements(total);
          if (currentPage !== page) {
            // If page was out of range (e.g., after narrowing filter), reset it silently
            setPage(currentPage);
          }
        } else {
          setOrders(list);
          setTotalPages(payload.totalPages ?? 0);
          setTotalElements(payload.totalElements ?? list.length);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [page, size, debouncedSearch, status]);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <div className="mb-3 flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // reset to first page on new search
          }}
          placeholder="Search by customer name or email..."
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="border rounded px-2 py-2 text-sm"
        >
          {["ALL", "PENDING", "DELIVERED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="border rounded overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading...</div>
        ) : (
          <OrderTable orders={orders} />
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page <= 0}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">Page {page + 1} of {Math.max(totalPages, 1)}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={!(page + 1 < totalPages)}
        >
          Next
        </button>
        <div className="flex-1" />
        <label className="text-sm text-gray-700">Page size:</label>
        <select
          value={size}
          onChange={(e) => {
            setPage(0);
            setSize(Number(e.target.value));
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">Total: {totalElements}</span>
      </div>
    </div>
  );
}
