"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/PaginationControls';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/stores/cart';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  const fetchData = async (opts = {}) => {
    const params = { page, q, ...opts };
    const { data } = await api.get('/products', { params });
    setItems(data.items);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => { fetchData(); }, [page, q]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <SearchBar onSearch={(val) => { setPage(1); setQ(val); }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addItem} />
        ))}
      </div>
      <div className="flex justify-center">
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
