'use client'

import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import GestureBrowseHeader from '@/components/gesture/GestureBrowseHeader';
import GestureBrowseGrid from '@/components/gesture/GestureBrowseGrid';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { GestureContributionFilters } from '@/types/gestureContributions';

export default function GestureBrowse() {
  const [filters, setFilters] = useState<GestureContributionFilters>({
    status: 'approved' // Default to approved for browsing
  });
  
  const {
    contributions,
    isLoading,
    userRole
  } = useGestureContributions(filters);

  // Ensure that the status filter is always set to 'approved' for this page
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      status: 'approved'
    }));
  }, []);

  return (
    <div className="container py-6">
      <Toaster />
      <GestureBrowseHeader />

      <div className="space-y-6">
        <GestureFilters 
          filters={filters}
          onFiltersChange={setFilters}
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
