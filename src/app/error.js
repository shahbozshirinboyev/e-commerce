"use client";
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-3">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">{String(error?.message || error)}</pre>
      <button onClick={() => reset()} className="px-3 py-1 rounded bg-gray-900 text-white">Try again</button>
    </div>
  );
}
