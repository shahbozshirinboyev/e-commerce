"use client";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { formatPrice } from '@/utils/currency';

export default function CartItem({ item, onQty, onRemove }) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{item.name}</div>
        <div className="text-sm text-gray-600 mt-1">
          {formatPrice(item.price)} x {item.quantity}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {formatPrice(itemTotal)}
          </div>
        </div>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onQty?.(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1 text-center"
        />
        <button
          type="button"
          onClick={() => onRemove?.()}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}
