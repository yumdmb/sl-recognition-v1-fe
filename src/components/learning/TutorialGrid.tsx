'use client'

import React from 'react';
import { Tutorial } from '@/data/contentData';
import TutorialCard from './TutorialCard';

interface TutorialGridProps {
  tutorials: Tutorial[];
  isAdmin: boolean;
  onEditTutorial: (tutorial: Tutorial) => void;
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
