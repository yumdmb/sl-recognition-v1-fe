'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from 'lucide-react';
import { QuizSet } from '@/data/contentData';

interface QuizCardProps {
  quizSet: QuizSet;
  isAdmin: boolean;
  onStartQuiz: (setId: string) => void;
  onEditQuestions: (setId: string) => void;
  onEditQuizSet: (quizSet: QuizSet) => void;
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
        <div className="mb-4 text-sm text-gray-500">
          {quizSet.questionCount} questions
        </div>
        <Button 
          onClick={() => onStartQuiz(quizSet.id)} 
          className="bg-primary hover:bg-primary/90"
        >
          Start Quiz
        </Button>
      </CardContent>
      {isAdmin && (
        <CardFooter className="flex justify-end space-x-2 pt-0">
          <Button variant="outline" size="sm" onClick={() => onEditQuestions(quizSet.id)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Questions
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEditQuizSet(quizSet)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Details
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDeleteQuizSet(quizSet.id)}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuizCard;
