"use client";
import createCache from '@emotion/cache';

// On the client side, create an Emotion cache that uses the insertion point
// provided in app/layout.js: <meta name="emotion-insertion-point" content="" />
export default function createEmotionCache() {
  let insertionPoint;

  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="emotion-insertion-point"]');
    insertionPoint = meta ?? undefined;
  }

  return createCache({ key: 'mui', insertionPoint });
}
