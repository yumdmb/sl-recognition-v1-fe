'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GestureContribution } from '@/types/gestureContributions';
import { Check, X, Trash2, Eye, Copy, AlertTriangle, Calendar, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GestureContributionCardProps {
  contribution: GestureContribution;
  userRole?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
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

export default function GestureContributionCard({
  contribution,
  userRole,
  onApprove,
  onReject,
  onDelete,
  isMySubmissionsView = false
}: GestureContributionCardProps) {
  const isAdmin = userRole === 'admin';
  const isPending = contribution.status === 'pending';
  const isOwner = contribution.submitter?.id === contribution.submitted_by;

  const canDelete = isAdmin || (isOwner && (contribution.status === 'pending' || contribution.status === 'rejected'));

  const handleRejectClick = () => {
    if (!onReject) return;
    if (isAdmin) {
      const reason = prompt("Enter reason for rejection (optional):");
      onReject(contribution.id, reason || undefined);
    } else {
      onReject(contribution.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight mb-1">{contribution.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{contribution.description}</p>
          </div>
          <Badge variant="outline" className="shrink-0">{contribution.language}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Category */}
        {contribution.category && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-[60px]">Category:</span>
            <Badge variant="secondary">
              {contribution.category.icon && <span className="mr-1">{contribution.category.icon}</span>}
              {contribution.category.name}
            </Badge>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-[60px]">Status:</span>
          <div className="flex-1">
            {getStatusBadge(contribution.status)}
            {contribution.status === 'rejected' && contribution.rejection_reason && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Reason: {contribution.rejection_reason}
              </p>
            )}
          </div>
        </div>

        {/* Submitter (only for admin view) */}
        {!isMySubmissionsView && contribution.submitter && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{contribution.submitter.name || 'Unknown'}</p>
              {contribution.submitter.email && (
                <p className="text-xs text-muted-foreground truncate">{contribution.submitter.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Duplicate status (only for admin view) */}
        {!isMySubmissionsView && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-[60px]">Duplicate:</span>
            <div className="flex-1">
              {contribution.is_duplicate ? (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Copy className="h-3 w-3" />
                    Duplicate
                  </Badge>
                  {contribution.duplicate_of && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Duplicate Details</DialogTitle>
                          <DialogDescription>
                            This contribution appears to be a duplicate of existing content.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          {contribution.duplicate_of}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Unique
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Submitted date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{new Date(contribution.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-3 border-t">
        {/* View Media Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
              <Eye className="h-4 w-4 mr-1" />
              View Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{contribution.title}</DialogTitle>
              <DialogDescription>{contribution.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {contribution.media_url ? (
                contribution.media_type === 'image' ? (
                  <div className="relative w-full max-h-[70vh] aspect-video">
                    <Image
                      src={contribution.media_url}
                      alt={contribution.title}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 95vw, 672px"
                    />
                  </div>
                ) : (
                  <video
                    src={contribution.media_url}
                    controls
                    className="w-full max-h-[70vh] rounded-lg"
                  />
                )
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                  <Eye className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin actions for pending contributions */}
        {isAdmin && isPending && onApprove && onReject && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => onApprove(contribution.id)}
              className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRejectClick}
              className="flex-1 min-w-[100px]"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </>
        )}

        {/* Delete action */}
        {canDelete && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(contribution.id)}
            className="flex-1 min-w-[100px] text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
