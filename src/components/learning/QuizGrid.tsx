'use client'

import React from 'react';
import { QuizSet } from '@/data/contentData';
import QuizCard from './QuizCard';

interface QuizGridProps {
  quizSets: QuizSet[];
  isAdmin: boolean;
  onStartQuiz: (setId: string) => void;
  onEditQuestions: (setId: string) => void;
  onEditQuizSet: (quizSet: QuizSet) => void;
  onDeleteQuizSet: (id: string) => void;
}

const QuizGrid: React.FC<QuizGridProps> = ({
  quizSets,
  isAdmin,
  onStartQuiz,
  onEditQuestions,
  onEditQuizSet,
  onDeleteQuizSet
}) => {
  return (
    <div className="space-y-6">
      {quizSets.map((set) => (
        <QuizCard
          key={set.id}
          quizSet={set}
          isAdmin={isAdmin}
          onStartQuiz={onStartQuiz}
          onEditQuestions={onEditQuestions}
          onEditQuizSet={onEditQuizSet}
          onDeleteQuizSet={onDeleteQuizSet}
        />
      ))}
    </div>
  );
};

export default QuizGrid;
