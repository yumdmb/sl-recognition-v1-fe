'use client';

import React from 'react';
import { FolderOpen } from 'lucide-react';

interface MaterialEmptyStateProps {
  language: string;
}

const MaterialEmptyState: React.FC<MaterialEmptyStateProps> = ({ language }) => {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <FolderOpen className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">No {language} materials yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Downloadable guides and references will appear here once they're published.
      </p>
    </div>
  );
};

export default MaterialEmptyState;
