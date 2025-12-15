'use client'

import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import GestureViewHeader from '@/components/gesture/GestureViewHeader';
import GestureViewLoadingState from '@/components/gesture/GestureViewLoadingState';
import GestureViewEmptyState from '@/components/gesture/GestureViewEmptyState';
import GestureContributionsTable from '@/components/gesture/GestureContributionsTable';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useMyContributions } from '@/hooks/useMyContributions';
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFilters } from '@/types/gestureContributions';

// Note: Admin users are redirected to /gesture/manage-contributions via middleware

export default function GestureView() {
  const { currentUser, isLoading: authLoading } = useAuth();
  
  // Use dedicated hook that always filters by current user
  const {
    contributions,
    isLoading,
    userRole,
    handleDelete,
    refreshContributions,
    updateFilters,
    filters
  } = useMyContributions();

  const handleFilterChange = (newFilters: GestureContributionFilters) => {
    updateFilters(newFilters);
  };

  if (authLoading) {
    return (
      <div className="container py-6">
        <GestureViewLoadingState />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-6 text-center">
        <p>Please log in to view your contributions.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Toaster />
      <GestureViewHeader userRole={userRole} />

      <div className="space-y-6">
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
      </div>
    </div>
  );
}
