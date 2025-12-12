'use client'

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TutorialLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-[180px] w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default TutorialLoadingState;
