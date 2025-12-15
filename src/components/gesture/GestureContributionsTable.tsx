'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GestureContribution } from '@/types/gestureContributions';
import GestureContributionRow from './GestureContributionRow';

interface GestureContributionsTableProps {
  contributions: GestureContribution[];
  userRole?: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  isMySubmissionsView?: boolean; // To tailor row actions/display if needed
}

export default function GestureContributionsTable({
  contributions,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onRefresh,
  isMySubmissionsView = false
}: GestureContributionsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Language</TableHead>
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
                isMySubmissionsView={isMySubmissionsView}
              />
            ))}
            {contributions.length === 0 && (
              <TableRow>
                <TableCell colSpan={isMySubmissionsView ? 6 : 8} className="text-center">
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
