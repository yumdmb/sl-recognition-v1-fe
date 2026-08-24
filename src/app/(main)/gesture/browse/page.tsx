'use client'

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from 'next/navigation';
import GestureBrowseHeader from '@/components/gesture/GestureBrowseHeader';
import GestureBrowseGrid from '@/components/gesture/GestureBrowseGrid';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { GestureContributionFilters } from '@/types/gestureContributions';

export default function GestureBrowse() {
  const router = useRouter();
  const {
    contributions,
    isLoading,
    userRole,
    filters,
    updateFilters,
  } = useGestureContributions({
    status: 'approved'
  });

  // Preserve origin backend: redirect to unified dictionary while keeping botanical fallback UI
  // If origin prefers redirect, we keep it commented for reference but show botanical browse UI
  // useEffect(() => {
  //   router.replace('/gesture-recognition/search');
  // }, [router]);

  return (
    <div className="container py-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <GestureBrowseHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 space-y-6"
      >
        <GestureFilters
          filters={filters || { status: 'approved' }}
          onFiltersChange={updateFilters}
          userRole={userRole}
          hiddenFilters={['status']}
          showStatusFilter={false}
        />

        <GestureBrowseGrid
          contributions={contributions}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
