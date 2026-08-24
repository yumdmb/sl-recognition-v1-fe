'use client'

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";
import GestureViewHeader from '@/components/gesture/GestureViewHeader';
import GestureViewLoadingState from '@/components/gesture/GestureViewLoadingState';
import GestureViewEmptyState from '@/components/gesture/GestureViewEmptyState';
import GestureContributionsTable from '@/components/gesture/GestureContributionsTable';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useMyContributions } from '@/hooks/useMyContributions';
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFilters } from '@/types/gestureContributions';
import { Lock } from 'lucide-react';

// Note: Admin users are redirected to /gesture/manage-contributions via middleware

export default function GestureView() {
  const { currentUser, isLoading: authLoading } = useAuth();
  
  // Use dedicated hook that always filters by current user - origin backend
  const {
    contributions,
    isLoading,
    userRole,
    handleDelete,
    refreshContributions,
    updateFilters,
    filters
  } = useMyContributions();

  const handleFilterChange = useCallback((newFilters: GestureContributionFilters) => {
    // Preserve origin backend logic: just update filters, hook handles user scoping
    // Also ensure submitted_by is preserved for botanical UI compatibility
    if (currentUser) {
      updateFilters({ ...newFilters, submitted_by: currentUser.id } as GestureContributionFilters);
    } else {
      updateFilters(newFilters);
    }
  }, [currentUser, updateFilters]);

  if (authLoading) {
    return (
      <div className="container py-6">
        <GestureViewLoadingState />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container max-w-xl py-16">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Lock className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">Sign in required</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Please log in to view your contributions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <GestureViewHeader userRole={userRole} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 space-y-6"
      >
        <GestureFilters
          filters={filters || { submitted_by: currentUser.id, status: 'all' }}
          onFiltersChange={handleFilterChange}
          userRole={userRole}
          showStatusFilter={true}
        />

        {isLoading ? (
          <GestureViewLoadingState />
        ) : contributions.length > 0 ? (
          <GestureContributionsTable
            contributions={contributions}
            userRole={userRole}
            onDelete={handleDelete}
            onRefresh={refreshContributions}
            isMySubmissionsView={true}
          />
        ) : (
          <GestureViewEmptyState isMySubmissions={true} />
        )}
      </motion.div>
    </div>
  );
}
