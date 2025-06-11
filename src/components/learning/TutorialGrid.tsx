'use client'

import React from 'react';
import { TutorialWithProgress } from '@/types/database';
import TutorialCard from './TutorialCard';

interface TutorialGridProps {
  tutorials: TutorialWithProgress[];
  isAdmin: boolean;
  onEditTutorial: (tutorial: TutorialWithProgress) => void;
  onDeleteTutorial: (id: string) => void;
}

const TutorialGrid: React.FC<TutorialGridProps> = ({
  tutorials,
  isAdmin,
  onEditTutorial,
  onDeleteTutorial
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tutorials.map(tutorial => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          isAdmin={isAdmin}
          onEdit={onEditTutorial}
          onDelete={onDeleteTutorial}
        />
      ))}
    </div>
  );
};

export default TutorialGrid;
