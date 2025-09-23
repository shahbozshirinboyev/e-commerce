"use client";

export default function CartItem({ item, onQty }) {
  return (
    <div className="flex items-center justify-between border-b py-2">
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">${item.price?.toFixed(2)}</div>
      </div>
      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => onQty?.(Number(e.target.value))}
        className="w-20 border rounded px-2 py-1"
      />
    </div>
  );
}
