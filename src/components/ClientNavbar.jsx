"use client";

import { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function ClientNavbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for hydration to complete before rendering the actual navbar
    setMounted(true);
  }, []);

  // Don't render the Navbar until the component is mounted on the client and hydration is complete
  if (!mounted) {
    return (
      <div className="w-full bg-white/20 backdrop-blur sticky top-0 z-50" suppressHydrationWarning={true}>
        <div className="max-w-6xl mx-auto px-4 py-3"></div>
      </div>
    );
  }

  return <Navbar />;
}
