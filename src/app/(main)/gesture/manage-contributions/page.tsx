'use client'

import React, { useCallback, useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import GestureViewHeader from '@/components/gesture/GestureViewHeader';
import GestureViewLoadingState from '@/components/gesture/GestureViewLoadingState';
import GestureViewEmptyState from '@/components/gesture/GestureViewEmptyState';
import GestureContributionsTable from '@/components/gesture/GestureContributionsTable';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFilters } from '@/types/gestureContributions';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Note: Non-admin users are redirected to /gesture/view via middleware

export default function ManageContributions() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | 'delete' | null>(null);
  
  const {
    contributions,
    isLoading,
    userRole,
    handleApprove,
    handleReject,
    handleDelete,
    handleUpdateCategory,
    refreshContributions,
    updateFilters,
    filters
  } = useGestureContributions({ status: 'all' });

  const handleFilterChange = useCallback((newFilters: GestureContributionFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(contributions.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  }, [contributions]);

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  }, []);

  const handleBulkApprove = async () => {
    const pendingSelected = contributions.filter(c => selectedIds.includes(c.id) && c.status === 'pending');
    if (pendingSelected.length === 0) {
      toast.error("No pending contributions selected");
      return;
    }

    for (const contribution of pendingSelected) {
      await handleApprove(contribution.id, contribution.category_id);
    }
    setSelectedIds([]);
    setBulkAction(null);
    toast.success(`Approved ${pendingSelected.length} contribution(s)`);
  };

  const handleBulkReject = async () => {
    const pendingSelected = contributions.filter(c => selectedIds.includes(c.id) && c.status === 'pending');
    if (pendingSelected.length === 0) {
      toast.error("No pending contributions selected");
      return;
    }

    const reason = prompt("Enter rejection reason (optional):");
    for (const contribution of pendingSelected) {
      await handleReject(contribution.id, reason || undefined);
    }
    setSelectedIds([]);
    setBulkAction(null);
    toast.success(`Rejected ${pendingSelected.length} contribution(s)`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("No contributions selected");
      return;
    }

    for (const id of selectedIds) {
      await handleDelete(id);
    }
    setSelectedIds([]);
    setBulkAction(null);
    toast.success(`Deleted ${selectedIds.length} contribution(s)`);
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
        <p>Please log in to manage contributions.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Toaster />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background pb-4 border-b mb-4">
        <GestureViewHeader userRole={userRole} isManageView />
        
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => setBulkAction('approve')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Bulk Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setBulkAction('reject')}
              >
                <X className="h-4 w-4 mr-1" />
                Bulk Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Bulk Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-[120px] z-10 bg-background pb-4 mb-4">
        <GestureFilters 
          filters={filters || { status: 'all' }}
          onFiltersChange={handleFilterChange}
          userRole={userRole}
          showStatusFilter={true}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <GestureViewLoadingState />
      ) : contributions.length > 0 ? (
        <GestureContributionsTable
          contributions={contributions}
          userRole={userRole}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onUpdateCategory={handleUpdateCategory}
          onRefresh={refreshContributions}
          isMySubmissionsView={false}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
        />
      ) : (
        <GestureViewEmptyState isMySubmissions={false} />
      )}

      {/* Bulk Action Confirmations */}
      <AlertDialog open={bulkAction === 'approve'} onOpenChange={(open) => !open && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Approve Contributions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedIds.length} contribution(s)? This will publish them to the dictionary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700">
              Approve All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkAction === 'reject'} onOpenChange={(open) => !open && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Reject Contributions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedIds.length} contribution(s)?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkReject} className="bg-red-600 hover:bg-red-700">
              Reject All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkAction === 'delete'} onOpenChange={(open) => !open && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Delete Contributions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedIds.length} contribution(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
