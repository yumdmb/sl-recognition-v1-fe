'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { WordSubmission } from '@/hooks/useWordSubmission';
import { getStatusBadge } from './WordViewUtils';

interface WordSubmissionRowProps {
  submission: WordSubmission;
  userRole?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WordSubmissionRow({ 
  submission, 
  userRole, 
  onApprove, 
  onReject, 
  onDelete 
}: WordSubmissionRowProps) {
  return (
    <TableRow key={submission.id}>
      <TableCell className="font-medium">{submission.word}</TableCell>
      <TableCell>{submission.language}</TableCell>
      <TableCell>{submission.submittedBy.name}</TableCell>
      <TableCell>
        {getStatusBadge(submission.status)}
      </TableCell>
      <TableCell>
        {submission.mediaType === 'image' ? (
          <img 
            src={submission.mediaUrl} 
            alt={`Sign language gesture for ${submission.word}`}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <video 
            src={submission.mediaUrl}
            className="w-16 h-16 object-cover rounded"
            controls
          />
        )}
      </TableCell>
      <TableCell>
        {userRole === 'admin' && submission.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => onApprove(submission.id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(submission.id)}
            >
              Reject
            </Button>
          </div>
        )}
        {userRole === 'admin' && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(submission.id)}
            className="mt-2"
          >
            Delete
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
