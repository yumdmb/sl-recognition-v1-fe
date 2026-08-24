'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const QuizLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <Skeleton className="size-11 rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-5 w-2/3 rounded-lg" />
          <Skeleton className="mt-2.5 h-4 w-full rounded-lg" />
          <Skeleton className="mt-1.5 h-4 w-4/5 rounded-lg" />
          <div className="mt-5 flex gap-2 border-t border-border pt-4">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizLoadingState;
