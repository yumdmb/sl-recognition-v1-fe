'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from 'lucide-react';
import { QuizSetWithProgress } from '@/types/database';

interface QuizCardProps {
  quizSet: QuizSetWithProgress;
  isAdmin: boolean;
  onStartQuiz: (setId: string) => void;
  onEditQuestions: (setId: string) => void;
  onEditQuizSet: (quizSet: QuizSetWithProgress) => void;
  onDeleteQuizSet: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quizSet,
  isAdmin,
  onStartQuiz,
  onEditQuestions,
  onEditQuizSet,
  onDeleteQuizSet
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{quizSet.title}</CardTitle>
        <CardDescription>{quizSet.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          <p>{quizSet.questionCount} questions · {quizSet.language}</p>
          {quizSet.progress && (
            <p className="mt-1">
              Last score: {quizSet.progress.score}/{quizSet.progress.total_questions} ({Math.round((quizSet.progress.score / quizSet.progress.total_questions) * 100)}%)
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isAdmin && (
          <>
            <Button size="sm" variant="outline" onClick={() => onEditQuizSet(quizSet)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Set
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEditQuestions(quizSet.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Questions
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDeleteQuizSet(quizSet.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
        <Button size="sm" onClick={() => onStartQuiz(quizSet.id)}>Start Quiz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
