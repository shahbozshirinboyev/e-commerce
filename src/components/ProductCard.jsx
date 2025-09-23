export default function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded p-3 flex flex-col">
      <div className="font-medium">{product.name}</div>
      <div className="text-sm text-gray-600">${product.price?.toFixed(2)}</div>
      <button onClick={() => onAdd?.(product)} className="mt-3 px-3 py-1 rounded bg-gray-900 text-white">
        Add to cart
      </button>
    </div>
  );
}
