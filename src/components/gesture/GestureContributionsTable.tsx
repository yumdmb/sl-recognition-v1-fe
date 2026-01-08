'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GestureContribution } from '@/types/gestureContributions';
import GestureContributionRow from './GestureContributionRow';
import GestureContributionCard from './GestureContributionCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface GestureContributionsTableProps {
  contributions: GestureContribution[];
  userRole?: string;
  onApprove?: (id: string, categoryId?: number | null) => void;
  onReject?: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
  onUpdateCategory?: (id: string, categoryId: number | null) => void;
  onRefresh?: () => void;
  isMySubmissionsView?: boolean;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectOne?: (id: string, checked: boolean) => void;
}

export default function GestureContributionsTable({
  contributions,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onUpdateCategory,
  onRefresh,
  isMySubmissionsView = false,
  selectedIds = [],
  onSelectAll,
  onSelectOne
}: GestureContributionsTableProps) {
  // Suppress unused variable warning
  void onRefresh;
  const isMobile = useIsMobile();
  const showCheckboxes = !isMySubmissionsView && selectedIds !== undefined && !!onSelectAll && !!onSelectOne;
  const allSelected = showCheckboxes && contributions.length > 0 && contributions.every(c => selectedIds.includes(c.id));

  // Mobile view: Card-based layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {contributions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No contributions found.
            </CardContent>
          </Card>
        ) : (
          contributions.map((contribution) => (
            <GestureContributionCard
              key={contribution.id}
              contribution={contribution}
              userRole={userRole}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              isMySubmissionsView={isMySubmissionsView}
            />
          ))
        )}
      </div>
    );
  }

  // Desktop view: Table layout with sticky header
  // Using thead with sticky positioning - the scrollable container must be the parent
  const thBaseClass = "h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-background";
  
  return (
    <table className="w-full caption-bottom text-sm">
      <thead className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
        <tr>
          {showCheckboxes && (
            <th className={`${thBaseClass} w-12`}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll?.(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </th>
          )}
          <th className={thBaseClass}>Title</th>
          <th className={thBaseClass}>Language</th>
          <th className={thBaseClass}>Category</th>
          {!isMySubmissionsView && <th className={thBaseClass}>Submitted By</th>}
          <th className={thBaseClass}>Status</th>
          {!isMySubmissionsView && <th className={thBaseClass}>Duplicate</th>}
          <th className={thBaseClass}>Media</th>
          <th className={thBaseClass}>Submitted At</th>
          <th className={thBaseClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contributions.map((contribution) => (
          <GestureContributionRow
            key={contribution.id}
            contribution={contribution}
            userRole={userRole}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            onUpdateCategory={onUpdateCategory}
            isMySubmissionsView={isMySubmissionsView}
            showCheckbox={showCheckboxes}
            isSelected={selectedIds.includes(contribution.id)}
            onSelect={(checked) => onSelectOne?.(contribution.id, checked)}
          />
        ))}
        {contributions.length === 0 && (
          <tr>
            <td colSpan={showCheckboxes ? (isMySubmissionsView ? 8 : 10) : (isMySubmissionsView ? 7 : 9)} className="p-4 text-center">
              No contributions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
