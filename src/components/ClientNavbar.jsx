"use client";

import dynamic from 'next/dynamic';

// Disable SSR for the Navbar component
const Navbar = dynamic(() => import('./Navbar'), { 
  ssr: false,
  loading: () => (
    <nav className="w-full bg-white/20 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3" />
    </nav>
  )
});

export default function ClientNavbar() {
  return <Navbar />;
}
