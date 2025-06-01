'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WordSubmission } from '@/hooks/useWordSubmission';
import WordSubmissionRow from './WordSubmissionRow';

interface WordSubmissionsTableProps {
  submissions: WordSubmission[];
  userRole?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WordSubmissionsTable({ 
  submissions, 
  userRole, 
  onApprove, 
  onReject, 
  onDelete 
}: WordSubmissionsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <WordSubmissionRow
                key={submission.id}
                submission={submission}
                userRole={userRole}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
