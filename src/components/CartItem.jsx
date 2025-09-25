"use client";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CartItem({ item, onQty, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-2 gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">${item.price?.toFixed(2)}</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onQty?.(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
        />
        <button
          type="button"
          onClick={() => onRemove?.()}
          className="px-2 py-1 text-sm rounded border hover:bg-black/5"
          aria-label="Remove item"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}
