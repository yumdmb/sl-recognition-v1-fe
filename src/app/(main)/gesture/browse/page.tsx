'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect from old /gesture/browse to the unified Gesture Dictionary
 * All approved gestures are now shown in /gesture-recognition/search
 */
export default function GestureBrowseRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/gesture-recognition/search');
  }, [router]);

  return (
    <div className="container py-6 text-center">
      <p className="text-muted-foreground">Redirecting to Gesture Dictionary...</p>
    </div>
  );
}
