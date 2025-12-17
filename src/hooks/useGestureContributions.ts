'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { GestureContribution, GestureContributionFilters } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

export function useGestureContributions(initialFilters?: GestureContributionFilters) {
  const [contributions, setContributions] = useState<GestureContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState<GestureContributionFilters | undefined>(initialFilters);

  const updateFilters = useCallback((newFilters: Partial<GestureContributionFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  // Reset filters completely (replaces instead of merging)
  const resetFilters = useCallback((newFilters: GestureContributionFilters) => {
    setFilters(newFilters);
  }, []);

  const loadContributions = useCallback(async () => {
    if (!currentUser && !filters?.status) {
      if (filters?.status !== 'approved') {
        setContributions([]);
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await GestureContributionService.getContributions(filters);
      
      if (fetchError) {
        setError('Failed to load gesture contributions');
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
  }, [currentUser, filters]);

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);


  const handleApprove = async (contributionId: string, categoryId?: number | null) => {
    try {
      const { error: approveError } = await GestureContributionService.approveContribution(contributionId, categoryId);
      
      if (approveError) {
        const errorMessage = approveError instanceof Error ? approveError.message : "Please try again.";
        toast.error("Failed to approve gesture", {
          description: errorMessage
        });
        return;
      }
      
      setContributions(prev => 
        prev.map(contribution => 
          contribution.id === contributionId 
            ? { 
                ...contribution, 
                status: 'approved', 
                reviewed_at: new Date().toISOString(),
                category_id: categoryId !== undefined ? categoryId : contribution.category_id
              } 
            : contribution
        )
      );
      
      toast.success("Gesture Approved", {
        description: "The gesture has been approved and published to the dictionary."
      });
    } catch (err: unknown) {
      toast.error("An error occurred while approving the gesture", { description: err instanceof Error ? err.message : 'Unknown error' });
    }
  };

  const handleUpdateCategory = async (contributionId: string, categoryId: number | null) => {
    try {
      const { error: updateError } = await GestureContributionService.updateCategory(contributionId, categoryId);
      
      if (updateError) {
        const errorMessage = updateError instanceof Error ? updateError.message : "Please try again.";
        toast.error("Failed to update category", {
          description: errorMessage
        });
        return;
      }

      // Fetch the category details to update the state with full object
      let categoryObject = null;
      if (categoryId) {
        const { data: categories } = await GestureContributionService.getCategories();
        categoryObject = categories?.find(cat => cat.id === categoryId) || null;
      }
      
      setContributions(prev => 
        prev.map(contribution => 
          contribution.id === contributionId 
            ? { 
                ...contribution, 
                category_id: categoryId,
                category: categoryObject ? {
                  id: categoryObject.id,
                  name: categoryObject.name,
                  icon: categoryObject.icon || undefined
                } : undefined
              } 
            : contribution
        )
      );
      
      toast.success("Category Updated", {
        description: "The gesture category has been updated."
      });
    } catch (err: unknown) {
      toast.error("An error occurred while updating the category", { description: err instanceof Error ? err.message : 'Unknown error' });
    }
  };

  const handleReject = async (contributionId: string, reason?: string) => {
    try {
      const { error: rejectError } = await GestureContributionService.rejectContribution(contributionId, reason);
      
      if (rejectError) {
        const errorMessage = rejectError instanceof Error ? rejectError.message : "Please try again.";
        toast.error("Failed to reject gesture", {
          description: errorMessage
        });
        return;
      }
      
      setContributions(prev => 
        prev.map(contribution => 
          contribution.id === contributionId 
            ? { 
                ...contribution, 
                status: 'rejected', 
                rejection_reason: reason,
                reviewed_at: new Date().toISOString() 
              }
            : contribution
        )
      );
      
      toast.error("Gesture Rejected", { // Using error style for rejection notification
        description: "The gesture has been rejected."
      });
    } catch (err: unknown) {
      toast.error("An error occurred while rejecting the gesture", { description: err instanceof Error ? err.message : 'Unknown error' });
    }
  };

  const handleDelete = async (contributionId: string) => {
    try {
      const { error: deleteError } = await GestureContributionService.deleteContribution(contributionId);
      
      if (deleteError) {
        const errorMessage = deleteError instanceof Error ? deleteError.message : "Please try again.";
        toast.error("Failed to delete gesture", {
          description: errorMessage
        });
        return;
      }
      
      setContributions(prev => 
        prev.filter(contribution => contribution.id !== contributionId)
      );
      
      toast.success("Gesture Deleted", {
        description: "The gesture has been permanently deleted."
      });
    } catch (err: unknown) {
      toast.error("An error occurred while deleting the gesture", { description: err instanceof Error ? err.message : 'Unknown error' });
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
    handleApprove,
    handleReject,
    handleDelete,
    handleUpdateCategory,
    refreshContributions,
    filters,
    updateFilters,
    resetFilters,
  };
}
