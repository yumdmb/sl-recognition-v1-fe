'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GestureContribution } from '@/types/gestureContributions';
import GestureContributionRow from './GestureContributionRow';

interface GestureContributionsTableProps {
  contributions: GestureContribution[];
  userRole?: string;
  onApprove?: (id: string, categoryId?: number | null) => void;
  onReject?: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onUpdateCategory?: (id: string, categoryId: number | null) => void;
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
  onRefresh,
  onUpdateCategory,
  isMySubmissionsView = false,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: GestureContributionsTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-soft">
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Title</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Language</TableHead>
                {!isMySubmissionsView && <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Submitted By</TableHead>}
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Media</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Submitted At</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
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
                />
              ))}
              {contributions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMySubmissionsView ? 6 : 7} className="py-10 text-center text-sm text-muted-foreground">
                    No contributions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
