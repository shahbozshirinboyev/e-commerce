"use client";

import Link from 'next/link';

export default function OrderTable({ orders = [], onSort }) {
  const badgeClass = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'DELIVERED') return 'bg-green-100 text-green-700 ring-1 ring-green-200';
    if (s === 'PENDING') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
    if (s === 'CANCELLED') return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200';
    return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
          <th className="p-3 text-left font-medium">Customer</th>
          <th className="p-3 text-right font-medium">Total</th>
          <th className="p-3 text-left font-medium">Status</th>
          <th className="p-3 text-right font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td className="p-6 text-center text-gray-500" colSpan={4}>No orders found</td>
          </tr>
        ) : (
          orders.map((o, idx) => (
            <tr key={o.id} className={idx % 2 ? 'bg-white border-t' : 'bg-gray-50/30 border-t'}>
              <td className="p-3 align-middle">{o.customer}</td>
              <td className="p-3 align-middle text-right whitespace-nowrap">{Number(o.total || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}</td>
              <td className="p-3 align-middle">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass(o.status)}`}>
                  {o.status}
                </span>
              </td>
              <td className="p-3 align-middle text-right">
                <Link
                  href={`/orders/${o.id}`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded hover:bg-blue-50 text-blue-600"
                  title={`View order #${o.id}`}
                >
                  <span className="material-symbols-outlined" aria-hidden>info</span>
                  <span className="sr-only">View</span>
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

