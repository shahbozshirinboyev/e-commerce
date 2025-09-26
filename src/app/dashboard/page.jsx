"use client";

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import HydrationTest from '@/components/HydrationTest';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    delivered: 0,
    pending: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const lang = (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'en';

        // 1) Recent Orders (used for display and as fallback for overview/top-products)
        const ordersRes = await api.get('/orders', {
          params: { page: 0, size: 5, sort: 'orderDate,desc' },
          headers: { 'Accept-Language': lang },
        });
        const ordersPayload = ordersRes?.data?.data || ordersRes?.data || {};
        const recent = (ordersPayload.content || []).map((o) => ({
          id: o.id,
          customer: o.customerName,
          total: o.totalAmount,
          status: o.status,
          date: o.orderDate,
          items: o.orderItems || [],
        }));
        setRecentOrders(recent);

        // 2) Overview stats (admins call endpoint; others use fallback)
        if (isAdmin) {
          try {
            const overviewRes = await api.get('/stats/overview', { headers: { 'Accept-Language': lang } });
            const ov = overviewRes?.data?.data || overviewRes?.data || {};
            setOverview({
              totalOrders: ov.totalOrders ?? ordersPayload.totalElements ?? recent.length,
              totalRevenue: ov.totalRevenue ?? 0,
              delivered: ov.delivered ?? 0,
              pending: ov.pending ?? 0,
            });
          } catch {
            const delivered = recent.filter((o) => String(o.status).toUpperCase() === 'DELIVERED').length;
            const pending = recent.filter((o) => String(o.status).toUpperCase() === 'PENDING').length;
            setOverview({
              totalOrders: ordersPayload.totalElements ?? recent.length,
              totalRevenue: recent.reduce((s, o) => s + (o.total || 0), 0),
              delivered,
              pending,
            });
          }
        } else {
          const delivered = recent.filter((o) => String(o.status).toUpperCase() === 'DELIVERED').length;
          const pending = recent.filter((o) => String(o.status).toUpperCase() === 'PENDING').length;
          setOverview({
            totalOrders: ordersPayload.totalElements ?? recent.length,
            totalRevenue: recent.reduce((s, o) => s + (o.total || 0), 0),
            delivered,
            pending,
          });
        }

        // 3) Top products (admins call endpoint; others use fallback)
        if (isAdmin) {
          try {
            const topRes = await api.get('/stats/top-products', {
              params: { size: 5 },
              headers: { 'Accept-Language': lang },
            });
            const tp = topRes?.data?.data || topRes?.data || [];
            const normalized = Array.isArray(tp)
              ? tp.map((p, idx) => ({
                  id: p.id ?? idx,
                  name: p.name ?? p.productName ?? 'Product',
                  sold: p.sold ?? p.quantity ?? 0,
                  revenue: p.revenue ?? 0,
                }))
              : [];
            setTopProducts(normalized);
          } catch {
            const map = new Map();
            for (const o of recent) {
              for (const it of o.items) {
                const key = it.productId ?? it.productName;
                const entry = map.get(key) || { id: key, name: it.productName, sold: 0, revenue: 0 };
                entry.sold += it.quantity || 0;
                entry.revenue += it.totalPrice || (it.unitPrice || 0) * (it.quantity || 0);
                map.set(key, entry);
              }
            }
            const arr = Array.from(map.values())
              .sort((a, b) => b.sold - a.sold)
              .slice(0, 5);
            setTopProducts(arr);
          }
        } else {
          const map = new Map();
          for (const o of recent) {
            for (const it of o.items) {
              const key = it.productId ?? it.productName;
              const entry = map.get(key) || { id: key, name: it.productName, sold: 0, revenue: 0 };
              entry.sold += it.quantity || 0;
              entry.revenue += it.totalPrice || (it.unitPrice || 0) * (it.quantity || 0);
              map.set(key, entry);
            }
          }
          const arr = Array.from(map.values())
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);
          setTopProducts(arr);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  const cards = useMemo(() => ([
    { title: 'Total Orders', value: overview.totalOrders },
    { title: 'Total Revenue', value: `${Number(overview.totalRevenue || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}` },
    { title: 'Delivered / Pending', value: `${overview.delivered} / ${overview.pending}` },
  ]), [overview]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <HydrationTest />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded border p-4 bg-white/60">
            <div className="text-sm text-gray-600">{c.title}</div>
            <div className="mt-1 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded border bg-white/60">
          <header className="px-4 py-3 border-b text-sm font-medium">Recent Orders</header>
          {loading ? (
            <div className="p-4 text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td className="p-4 text-center text-gray-500" colSpan={4}>No recent orders</td></tr>
                  ) : (
                    recentOrders.map((o, i) => (
                      <tr key={o.id} className={i % 2 ? 'bg-white border-t' : 'bg-gray-50/30 border-t'}>
                        <td className="p-3">{o.customer}</td>
                        <td className="p-3">{o.status}</td>
                        <td className="p-3 text-right whitespace-nowrap">{Number(o.total || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}</td>
                        <td className="p-3">{o.date ? new Date(o.date).toLocaleString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded border bg-white/60">
          <header className="px-4 py-3 border-b text-sm font-medium">Top Products</header>
          {loading ? (
            <div className="p-4 text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-right">Sold</th>
                    <th className="p-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr><td className="p-4 text-center text-gray-500" colSpan={3}>No data</td></tr>
                  ) : (
                    topProducts.map((p, i) => (
                      <tr key={p.id ?? i} className={i % 2 ? 'bg-white border-t' : 'bg-gray-50/30 border-t'}>
                        <td className="p-3">{p.name}</td>
                        <td className="p-3 text-right">{p.sold}</td>
                        <td className="p-3 text-right whitespace-nowrap">{Number(p.revenue || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
