'use client'

import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import WordViewHeader from '@/components/word/WordViewHeader';
import WordViewLoadingState from '@/components/word/WordViewLoadingState';
import WordViewEmptyState from '@/components/word/WordViewEmptyState';
import WordSubmissionsTable from '@/components/word/WordSubmissionsTable';
import { useWordSubmissionsView } from '@/hooks/useWordSubmissionsView';

export default function WordView() {
  const {
    submissions,
    isLoading,
    userRole,
    handleApprove,
    handleReject,
    handleDelete
  } = useWordSubmissionsView();

  return (
    <div className="container py-6">
      <Toaster />
      <WordViewHeader userRole={userRole} />

      {isLoading ? (
        <WordViewLoadingState />
      ) : submissions.length > 0 ? (
        <WordSubmissionsTable
          submissions={submissions}
          userRole={userRole}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      ) : (
        <WordViewEmptyState userRole={userRole} />
      )}
    </div>
  );
}