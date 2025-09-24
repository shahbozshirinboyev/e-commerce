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
      const { data } = await api.get(`/orders/${id}`, {
        headers: {
          'Accept-Language': (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'en',
        },
      });
      setOrder(data?.data || data);
    })();
  }, [id]);

  const onChange = async (status) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, { status }, {
        headers: {
          'Accept-Language': (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'en',
        },
      });
      setOrder(data?.data || data);
      toast.success('Status updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
          <div className="text-sm text-gray-600 mt-1">
            <div><span className="font-medium">Customer:</span> {order.customerName} ({order.customerEmail})</div>
            <div><span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleString()}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">Total: {Number(order.totalAmount || 0).toLocaleString()} so'm</div>
          <div className="mt-2">
            <span className="mr-2 font-medium">Status:</span>
            <StatusDropdown status={order.status} onChange={onChange} />
          </div>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.orderItems || []).map((it) => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.id}</td>
                <td className="p-2">{it.productName}</td>
                <td className="p-2">{it.quantity}</td>
                <td className="p-2">{Number(it.unitPrice || 0).toLocaleString()} so'm</td>
                <td className="p-2 font-medium">{Number(it.totalPrice || 0).toLocaleString()} so'm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

