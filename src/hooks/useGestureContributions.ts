'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { GestureContribution, GestureContributionFilters } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

export function useGestureContributions(filters?: GestureContributionFilters) {
  const [contributions, setContributions] = useState<GestureContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

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

  return {
    contributions,
    isLoading,
    error,
    userRole: currentUser?.role,
    handleApprove,
    handleReject,
    handleDelete,
    refreshContributions,
  };
}
