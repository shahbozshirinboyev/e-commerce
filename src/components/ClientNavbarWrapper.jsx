"use client";

import { useEffect, useState } from 'react';
import ClientNavbar from './ClientNavbar';

export default function ClientNavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return null;
  }

  return <ClientNavbar />;
}
