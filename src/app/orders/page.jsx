"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import OrderTable from '@/components/OrderTable';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/orders');
      setOrders(data.items || []);
    })();
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
