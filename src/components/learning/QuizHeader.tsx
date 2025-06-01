'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface QuizHeaderProps {
  isAdmin: boolean;
  onAddQuizSet: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  isAdmin,
  onAddQuizSet
}) => {
  if (!isAdmin) return null;

  return (
    <div className="flex justify-end mb-6">
      <Button onClick={onAddQuizSet}>
        <Plus className="h-4 w-4 mr-2" /> Add Quiz Set
      </Button>
    </div>
  );
};

export default QuizHeader;
