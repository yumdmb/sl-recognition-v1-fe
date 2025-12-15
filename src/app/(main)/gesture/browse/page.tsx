'use client'

import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import GestureBrowseHeader from '@/components/gesture/GestureBrowseHeader';
import GestureBrowseGrid from '@/components/gesture/GestureBrowseGrid';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { GestureContributionFilters } from '@/types/gestureContributions';

export default function GestureBrowse() {
  const {
    contributions,
    isLoading,
    userRole,
    filters,
    updateFilters,
  } = useGestureContributions({
    status: 'approved' // Default to approved for browsing
  });


  return (
    <div className="container py-6">
      <Toaster />
      <GestureBrowseHeader userRole={userRole} />

      <div className="space-y-4 md:space-y-6">
        <GestureFilters 
          filters={filters || { status: 'approved' }}
          onFiltersChange={updateFilters}
          userRole={userRole}
          hiddenFilters={['status']} // Status is fixed to 'approved', so hide the filter UI
          showStatusFilter={false} // Explicitly hide status filter UI
        />

        <GestureBrowseGrid
          contributions={contributions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
