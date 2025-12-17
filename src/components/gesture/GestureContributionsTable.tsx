'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  // Desktop view: Table layout
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckboxes && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
              )}
              <TableHead>Title</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Category</TableHead>
              {!isMySubmissionsView && <TableHead>Submitted By</TableHead>}
              <TableHead>Status</TableHead>
              {!isMySubmissionsView && <TableHead>Duplicate</TableHead>}
              <TableHead>Media</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
              <TableRow>
                <TableCell colSpan={showCheckboxes ? (isMySubmissionsView ? 8 : 10) : (isMySubmissionsView ? 7 : 9)} className="text-center">
                  No contributions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
