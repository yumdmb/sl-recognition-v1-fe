'use client'

import React, { useCallback } from 'react';
import { Toaster } from "@/components/ui/sonner";
import GestureViewHeader from '@/components/gesture/GestureViewHeader';
import GestureViewLoadingState from '@/components/gesture/GestureViewLoadingState';
import GestureViewEmptyState from '@/components/gesture/GestureViewEmptyState';
import GestureContributionsTable from '@/components/gesture/GestureContributionsTable';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFilters } from '@/types/gestureContributions';

// Note: Non-admin users are redirected to /gesture/view via middleware

export default function ManageContributions() {
  const { currentUser, isLoading: authLoading } = useAuth();
  
  const {
    contributions,
    isLoading,
    userRole,
    handleApprove,
    handleReject,
    handleDelete,
    refreshContributions,
    updateFilters,
    filters
  } = useGestureContributions({ status: 'all' });

  const handleFilterChange = useCallback((newFilters: GestureContributionFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

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
        <p>Please log in to manage contributions.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Toaster />
      <GestureViewHeader userRole={userRole} isManageView />

      <div className="space-y-6">
        <GestureFilters 
          filters={filters || { status: 'all' }}
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
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            onRefresh={refreshContributions}
            isMySubmissionsView={false}
          />
        ) : (
          <GestureViewEmptyState isMySubmissions={false} />
        )}
      </div>
    </div>
  );
}
