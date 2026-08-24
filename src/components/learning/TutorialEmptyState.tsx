'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';

interface TutorialEmptyStateProps {
  language: string;
}

const TutorialEmptyState: React.FC<TutorialEmptyStateProps> = ({ language }) => {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <GraduationCap className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">No {language} tutorials here</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        There are no tutorials for this level and language yet. Try another level or check back soon.
      </p>
    </div>
  );
};

export default TutorialEmptyState;
