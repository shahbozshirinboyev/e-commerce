"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatusDropdown from '@/components/StatusDropdown';
import toast from 'react-hot-toast';

export default function OrderDetail({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    })();
  }, [id]);

  const onChange = async (status) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, { status });
      setOrder(data);
      toast.success('Status updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
      <div>Total: ${order.total?.toFixed(2)}</div>
      <div>
        Status:
        <StatusDropdown status={order.status} onChange={onChange} />
      </div>
    </div>
  );
}
