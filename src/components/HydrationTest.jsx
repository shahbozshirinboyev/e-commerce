"use client";

import { useEffect, useState } from 'react';

export default function HydrationTest() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3>Hydration Test</h3>
      <p>Is Client: {isClient ? 'Yes' : 'No'}</p>
      <p>Current Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
