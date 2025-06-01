'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface QuizEmptyStateProps {
  language: string;
}

const QuizEmptyState: React.FC<QuizEmptyStateProps> = ({ language }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">No {language} quizzes available.</p>
      </CardContent>
    </Card>
  );
};

export default QuizEmptyState;
