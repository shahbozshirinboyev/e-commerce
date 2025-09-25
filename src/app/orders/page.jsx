"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import OrderTable from '@/components/OrderTable';
import { formatPrice } from '@/utils/currency';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
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
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/orders', {
          params: {
            page,
            size,
            customerName: debouncedSearch || undefined,
            status: status !== 'ALL' ? status : undefined,
          },
          headers: {
            'Accept-Language': (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'uz',
          },
        });

        const payload = data?.data || data || {};
        setOrders(payload.content || []);
        setTotalPages(payload.totalPages || 0);
        setTotalElements(payload.totalElements || 0);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, size, debouncedSearch, status]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Buyurtmalar</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Mijoz nomi yoki email bo'yicha qidirish..."
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="ALL">Barcha buyurtmalar</option>
          <option value="PENDING">Kutilmoqda</option>
          <option value="DELIVERED">Yetkazib berildi</option>
          <option value="CANCELLED">Bekor qilindi</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Yuklanmoqda...</div>
        ) : orders.length === 0 ? (
          <div className="p-4 text-center text-gray-600">Buyurtmalar topilmadi</div>
        ) : (
          <OrderTable orders={orders} />
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Sahifadagi qatorlar:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0}
          >
            Oldingi
          </button>
          <span className="text-sm text-gray-700">
            {totalElements > 0 ? (
              <>
                {page * size + 1} - {Math.min((page + 1) * size, totalElements)} / {totalElements}
              </>
            ) : (
              '0 - 0 / 0'
            )}
          </span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
            disabled={page >= totalPages - 1}
          >
            Keyingi
          </button>
        </div>
      </div>
    </div>
  );
}
