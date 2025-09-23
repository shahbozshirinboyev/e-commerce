"use client";

export default function OrderTable({ orders = [], onSort }) {
  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2 text-left">#</th>
          <th className="p-2 text-left">Customer</th>
          <th className="p-2 text-left">Total</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="border-t">
            <td className="p-2">{o.id}</td>
            <td className="p-2">{o.customer}</td>
            <td className="p-2">${o.total?.toFixed(2)}</td>
            <td className="p-2">{o.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
