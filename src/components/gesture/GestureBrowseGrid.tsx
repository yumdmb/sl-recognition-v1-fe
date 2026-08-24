'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GestureContribution } from '@/types/gestureContributions';
import { Play, Image as ImageIcon, Hand } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GestureBrowseGridProps {
  contributions: GestureContribution[];
  isLoading: boolean;
}

// Status badge helper (approved-only view, kept for detail dialog)
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-primary-soft text-primary border-transparent">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-destructive/10 text-destructive border-transparent">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-sun/10 text-sun border-transparent">Pending</Badge>;
  }
};

// Single gesture card component
function GestureCard({ contribution }: { contribution: GestureContribution }) {
  return (
    <Card className="card-lift overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {contribution.media_type === 'image' ? (
          <img
            src={contribution.media_url ?? undefined}
            alt={contribution.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <video
              src={contribution.media_url ?? undefined}
              className="h-full w-full object-cover"
              muted
              // Consider adding a poster attribute for videos if a thumbnail_url is available
              // poster={contribution.thumbnail_url}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-ink/60 p-3 backdrop-blur-sm">
                <Play className="h-6 w-6 text-mint-soft" />
              </div>
            </div>
          </div>
        )}

        {/* Media type indicator */}
        <div className="absolute right-2 top-2">
          <Badge className="border-transparent bg-ink/70 text-mint-soft">
            {contribution.media_type === 'image' ? (
              <ImageIcon className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            {contribution.media_type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and language */}
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 font-semibold leading-snug">{contribution.title}</h3>
            <Badge>{contribution.language}</Badge>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {contribution.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="text-xs text-muted-foreground">
              By {contribution.submitter?.name || 'Unknown'}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-extrabold tracking-tight">{contribution.title}</DialogTitle>
                  <DialogDescription>{contribution.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Media */}
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                    {contribution.media_type === 'image' ? (
                      <img
                        src={contribution.media_url ?? undefined}
                        alt={contribution.title}
                        className="max-h-96 w-full object-contain"
                      />
                    ) : (
                      <video
                        src={contribution.media_url ?? undefined}
                        controls
                        className="max-h-96 w-full"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Language:</span> {contribution.language}
                    </div>
                    <div>
                      <span className="font-semibold">Contributed by:</span> {contribution.submitter?.name || 'Unknown User'}
                    </div>
                     <div>
                      <span className="font-semibold">Status:</span> {getStatusBadge(contribution.status)}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Hand className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">No Gestures Found</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        There are no community-contributed gestures available at the moment.
      </p>
    </div>
  );
}

export default function GestureBrowseGrid({ contributions, isLoading }: GestureBrowseGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // As per requirements, browse gestures should only show approved ones.
  // This filtering should ideally happen at the data fetching layer (hook/service).
  // However, adding a client-side filter here as a safeguard or if props aren't pre-filtered.
  const approvedContributions = contributions.filter(c => c.status === 'approved');

  if (approvedContributions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {approvedContributions.map((contribution) => (
        <GestureCard key={contribution.id} contribution={contribution} />
      ))}
    </div>
  );
}
