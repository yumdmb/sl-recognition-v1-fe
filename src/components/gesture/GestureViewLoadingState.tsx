'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GestureViewLoadingState() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-6">
        {/* Table header skeleton */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
