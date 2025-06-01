'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getQuizSets, getUserProgress, getOverallQuizProgress } from '@/data/contentData';

const QuizProgress = () => {
  const [quizProgress, setQuizProgress] = useState<{ completion: number; score: number }>({ completion: 0, score: 0 });
  const [quizSets, setQuizSets] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user ID from localStorage or your auth system
    const userId = localStorage.getItem('userId') || 'default-user';
    
    // Fetch quiz sets and user progress
    const quizSetsData = getQuizSets();
    const userProgressData = getUserProgress(userId);
    const overallProgress = getOverallQuizProgress(userId);
    
    setQuizSets(quizSetsData);
    setUserProgress(userProgressData);
    setQuizProgress(overallProgress);
    setIsLoading(false);
  }, []);

  if (isLoading) {
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
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-signlang-primary">{quizProgress.score}%</div>
            <p className="text-sm text-gray-500 mt-1">Average Score</p>
            <Progress value={quizProgress.score} className="h-3 mt-2" />
          </div>

          {quizSets.map(quizSet => {
            const progress = userProgress?.quizzes.find((q: any) => q.quizId === quizSet.id);
            const progressPercentage = progress ? (progress.score / progress.totalQuestions) * 100 : 0;
            
            return (
              <div key={quizSet.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{quizSet.title}</span>
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                {progress && (
                  <p className="text-xs text-gray-500 mt-1">
                    Score: {progress.score}/{progress.totalQuestions} questions
                  </p>
                )}
              </div>
            );
          })}
          
          <div className="bg-signlang-muted p-4 rounded-md mt-6">
            <h4 className="font-medium mb-2">Quiz Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {quizProgress.score >= 90 && <Badge>Perfect Score</Badge>}
              {quizProgress.completion >= 75 && <Badge>Fast Learner</Badge>}
              {userProgress?.quizzes.length >= 5 && <Badge>Consistent Practice</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizProgress;
