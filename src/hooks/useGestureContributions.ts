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

  const loadContributions = useCallback(async () => {
    if (!currentUser && !filters?.status) { // Allow loading approved gestures if not logged in for browse page
      // If no specific status filter and not logged in, don't load anything yet or load public approved ones.
      // For browse page, filters.status will be 'approved'.
      // For view page (my submissions), currentUser is required.
      if (filters?.status !== 'approved') {
        setContributions([]);
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    let effectiveFilters = { ...filters }; 

    // If the intention is to view "My Submissions", ensure submitted_by is set.
    // This will be controlled by the page calling the hook.
    // For example, view/page.tsx will set filters.submitted_by = currentUser.id

    try {
      const { data, error: fetchError } = await GestureContributionService.getContributions(effectiveFilters);
      
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
  }, [currentUser, filters]); // Dependency on stringified filters might be too much, direct filters is better if stable.

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  const handleApprove = async (contributionId: string) => {
    try {
      const { error: approveError } = await GestureContributionService.approveContribution(contributionId);
      
      if (approveError) {
        toast.error("Failed to approve gesture", {
          description: approveError.message || "Please try again."
        });
        return;
      }
      
      setContributions(prev => 
        prev.map(contribution => 
          contribution.id === contributionId 
            ? { ...contribution, status: 'approved', reviewed_at: new Date().toISOString() } 
            : contribution
        )
      );
      
      toast.success("Gesture Approved", {
        description: "The gesture has been approved and published."
      });
    } catch (err: any) {
      toast.error("An error occurred while approving the gesture", { description: err.message });
    }
  };

  const handleReject = async (contributionId: string, reason?: string) => {
    try {
      const { error: rejectError } = await GestureContributionService.rejectContribution(contributionId, reason);
      
      if (rejectError) {
        toast.error("Failed to reject gesture", {
          description: rejectError.message || "Please try again."
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
    } catch (err: any) {
      toast.error("An error occurred while rejecting the gesture", { description: err.message });
    }
  };

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

  const refreshContributions = useCallback(() => { // Also wrap refreshContributions if it's a dependency elsewhere
    loadContributions();
  }, [loadContributions]);

  // Function to update filters from the component
  const updateFilters = useCallback((newFilters: GestureContributionFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []); // Empty dependency array as setFilters from useState is stable

  return {
    contributions,
    isLoading,
    error,
    userRole: currentUser?.role,
    handleApprove,
    handleReject,
    handleDelete,
    refreshContributions,
    updateFilters, // Expose a way to update filters
    filters // Expose current filters
  };
}
