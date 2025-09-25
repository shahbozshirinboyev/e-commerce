export default function ProductCard({ product, onAdd }) {
  return (
    <div className="border rounded p-4 flex flex-col gap-2 bg-white/70">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-gray-900 truncate" title={product?.name}>{product?.name}</div>
        <span
          className={`shrink-0 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${product?.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
        >
          {product?.isActive ? 'Faol' : 'Nofaol'}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {product?.id != null && (
          <span className="rounded bg-gray-50 border border-gray-200 px-2 py-0.5">ID: {product.id}</span>
        )}
        {product?.category && (
          <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">{product.category}</span>
        )}
      </div>

      {/* Price */}
      <div className="mt-1 text-lg font-semibold text-gray-800">
        {Number(product?.price || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}
      </div>

      {/* Stock & CreatedAt */}
      <div className="text-sm text-gray-600 flex flex-col gap-1">
        {product?.stock != null && (
          <div>
            Omborda: <span className="font-medium text-gray-800">{product.stock}</span> dona
          </div>
        )}
        {product?.createdAt && (
          <div className="text-xs text-gray-500">
            Yaratilgan: {new Date(product.createdAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Actions */}
      <button
        onClick={() => onAdd?.(product)}
        className="mt-2 px-3 py-2 rounded bg-gray-900 text-white hover:bg-gray-800 active:bg-black transition-colors text-sm"
      >
        Savatga qo'shish
      </button>
    </div>
  );
}
