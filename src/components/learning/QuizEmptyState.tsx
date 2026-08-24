'use client'

import React from 'react';
import { ClipboardList } from 'lucide-react';

interface QuizEmptyStateProps {
  language: string;
}

const QuizEmptyState: React.FC<QuizEmptyStateProps> = ({ language }) => {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <ClipboardList className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">No {language} quizzes yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Quiz sets for this language will appear here. Check the other language or come back soon.
      </p>
    </div>
  );
};

export default QuizEmptyState;
