"use client";
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(q);
      }}
      className="flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="border px-3 py-2 rounded w-full"
      />
      <button className="px-4 py-2 rounded bg-gray-900 text-white">Search</button>
    </form>
  );
}
