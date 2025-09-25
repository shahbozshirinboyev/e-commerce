"use client";

import { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function ClientNavbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the Navbar until the component is mounted on the client
  if (!mounted) {
    return (
      <nav className="w-full bg-white/20 backdrop-blur sticky top-0 z-50" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto px-4 py-3" />
      </nav>
    );
  }

  return <Navbar />;
}
