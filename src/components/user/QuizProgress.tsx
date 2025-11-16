'use client'

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';

const QuizProgress = () => {
  const { currentUser } = useAuth();
  const { quizSets, getQuizSets, quizSetsLoading } = useLearning();

  useEffect(() => {
    if (currentUser) {
      getQuizSets();
    }
  }, [currentUser, getQuizSets]);

  const attemptedQuizzes = quizSets.filter(q => q.progress);
  const totalQuizzes = quizSets.length;
  
  const overallCompletion = totalQuizzes > 0
    ? Math.round((attemptedQuizzes.length / totalQuizzes) * 100)
    : 0;

  if (quizSetsLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading quiz progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5" /> Quiz Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-signlang-primary">{overallCompletion}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
            <Progress value={overallCompletion} className="h-3 mt-2" />
          </div>

          <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
            {quizSets.map(quizSet => {
              const progress = quizSet.progress;
              const progressPercentage = progress ? (progress.score / progress.total_questions) * 100 : 0;
              
              return (
                <div key={quizSet.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{quizSet.title}</span>
                    <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  {progress && (
                    <p className="text-xs text-gray-500 mt-1">
                      Score: {progress.score}/{progress.total_questions}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizProgress;
