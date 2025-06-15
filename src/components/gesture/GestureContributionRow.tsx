'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GestureContribution } from '@/types/gestureContributions';
import { Check, X, Trash2, Eye, Edit3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from 'next/link'; // For edit button

interface GestureContributionRowProps {
  contribution: GestureContribution;
  userRole?: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void; // Allow passing reason for rejection
  onDelete: (id: string) => void;
  isMySubmissionsView?: boolean;
}

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

export default function GestureContributionRow({
  contribution,
  userRole,
  onApprove,
  onReject,
  onDelete,
  isMySubmissionsView = false
}: GestureContributionRowProps) {
  const isAdmin = userRole === 'admin';
  const isPending = contribution.status === 'pending';
  const isOwner = contribution.submitter?.id === contribution.submitted_by; // Check if current user is the owner

  // Users can delete their own pending or rejected submissions.
  // Admins can delete any submission.
  const canDelete = isAdmin || (isOwner && (contribution.status === 'pending' || contribution.status === 'rejected'));
  
  // Users can edit their own pending submissions.
  const canEdit = isOwner && contribution.status === 'pending';

  // TODO: Implement a modal for admin to provide rejection reason
  const handleRejectClick = () => {
    if (isAdmin) {
      const reason = prompt("Enter reason for rejection (optional):");
      onReject(contribution.id, reason || undefined);
    } else {
      // Non-admins should not be able to trigger this directly if UI is correct
      onReject(contribution.id);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{contribution.title}</div>
          <div className="text-xs text-muted-foreground truncate max-w-xs">{contribution.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{contribution.language}</Badge>
      </TableCell>
      {!isMySubmissionsView && (
        <TableCell>
          <div>
            <div className="font-medium">{contribution.submitter?.name || 'Unknown'}</div>
            {contribution.submitter?.email && <div className="text-sm text-muted-foreground">{contribution.submitter.email}</div>}
          </div>
        </TableCell>
      )}
      <TableCell>
        <div>
          {getStatusBadge(contribution.status)}
          {contribution.status === 'rejected' && contribution.rejection_reason && (
            <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]" title={contribution.rejection_reason}>
              Reason: {contribution.rejection_reason}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{contribution.title}</DialogTitle>
              <DialogDescription>{contribution.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {contribution.media_type === 'image' ? (
                <img
                  src={contribution.media_url}
                  alt={contribution.title}
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={contribution.media_url}
                  controls
                  className="w-full max-h-[70vh] rounded-lg"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
            {new Date(contribution.created_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          {/* Admin actions for pending contributions */}
          {isAdmin && isPending && (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onApprove(contribution.id)}
                className="text-green-600 hover:text-green-700"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRejectClick} // Use new handler
                className="text-red-600 hover:text-red-700"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Edit action for owners of pending submissions */}
          {/* TODO: Link to an edit page, e.g., /gesture/edit/[id] */}
          {/* {canEdit && (
            <Button asChild size="icon" variant="ghost" title="Edit">
              <Link href={`/gesture/edit/${contribution.id}`}> 
                <Edit3 className="h-4 w-4" />
              </Link>
            </Button>
          )} */} 

          {/* Delete action */}
          {canDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(contribution.id)}
              className="text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
