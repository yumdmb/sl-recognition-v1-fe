'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const TutorialLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-2.5 p-5">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <div className="flex gap-2 pt-3">
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TutorialLoadingState;
