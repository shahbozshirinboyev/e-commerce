"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cart';

export default function ProductDetail({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    })();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <div className="text-gray-700">${product.price?.toFixed(2)}</div>
      <button onClick={() => addItem(product)} className="px-3 py-1 rounded bg-gray-900 text-white">Add to cart</button>
    </div>
  );
}
