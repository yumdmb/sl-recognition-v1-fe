'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { GestureContribution, GestureContributionFilters } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

/**
 * Hook specifically for viewing current user's own contributions.
 * Always filters by the current user's ID - cannot show other users' contributions.
 */
export function useMyContributions() {
  const [contributions, setContributions] = useState<GestureContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'ASL' | 'MSL' | undefined>(undefined);
  const [searchFilter, setSearchFilter] = useState<string | undefined>(undefined);

  const loadContributions = useCallback(async () => {
    if (!currentUser) {
      setContributions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Always filter by current user's ID
      const filters: GestureContributionFilters = {
        submitted_by: currentUser.id,
        status: statusFilter,
        language: languageFilter,
        search: searchFilter,
      };

      const { data, error: fetchError } = await GestureContributionService.getContributions(filters);
      
      if (fetchError) {
        setError('Failed to load your contributions');
        console.error('Error loading contributions:', fetchError);
        setContributions([]);
        return;
      }
      
      setContributions(data || []);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading contributions:', err);
      setContributions([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, statusFilter, languageFilter, searchFilter]);

  // Load contributions when dependencies change
  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  const updateFilters = useCallback((newFilters: Partial<GestureContributionFilters>) => {
    if (newFilters.status !== undefined) {
      setStatusFilter(newFilters.status as 'all' | 'pending' | 'approved' | 'rejected');
    }
    if (newFilters.language !== undefined) {
      setLanguageFilter(newFilters.language as 'all' | 'ASL' | 'MSL' | undefined);
    }
    if (newFilters.search !== undefined) {
      setSearchFilter(newFilters.search);
    }
    // Ignore submitted_by - always use current user
  }, []);

  const handleDelete = async (contributionId: string) => {
    try {
      const { error: deleteError } = await GestureContributionService.deleteContribution(contributionId);
      
      if (deleteError) {
        toast.error("Failed to delete gesture", {
          description: deleteError.message || "Please try again."
        });
        return;
      }
      
      setContributions(prev => 
        prev.filter(contribution => contribution.id !== contributionId)
      );
      
      toast.success("Gesture Deleted", {
        description: "The gesture has been permanently deleted."
      });
    } catch (err: any) {
      toast.error("An error occurred while deleting the gesture", { description: err.message });
    }
  };

  const refreshContributions = useCallback(() => {
    loadContributions();
  }, [loadContributions]);

  return {
    contributions,
    isLoading,
    error,
    userRole: currentUser?.role,
    handleDelete,
    refreshContributions,
    filters: {
      submitted_by: currentUser?.id,
      status: statusFilter,
      language: languageFilter,
      search: searchFilter,
    },
    updateFilters,
  };
}
