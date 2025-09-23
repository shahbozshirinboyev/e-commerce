"use client";

export default function StatusDropdown({ status, onChange }) {
  const disabled = status !== 'PENDING';
  return (
    <select
      disabled={disabled}
      value={status}
      onChange={(e) => onChange?.(e.target.value)}
      className="border rounded px-2 py-1 disabled:opacity-50"
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
