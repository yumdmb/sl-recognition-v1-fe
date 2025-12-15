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
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-lg md:text-xl">{quizSet.title}</CardTitle>
        <CardDescription>{quizSet.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="text-sm text-gray-500">
          <p>{quizSet.questionCount} questions · {quizSet.language}</p>
          {quizSet.progress && (
            <p className="mt-1">
              Last score: {quizSet.progress.score}/{quizSet.progress.total_questions} ({Math.round((quizSet.progress.score / quizSet.progress.total_questions) * 100)}%)
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 px-4 md:px-6">
        {isAdmin && (
          <>
            <Button size="sm" variant="outline" onClick={() => onEditQuizSet(quizSet)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit Set
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEditQuestions(quizSet.id)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit Questions
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDeleteQuizSet(quizSet.id)} className="w-full sm:w-auto">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
        <Button size="sm" onClick={() => onStartQuiz(quizSet.id)} className="w-full sm:w-auto">Start Quiz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
