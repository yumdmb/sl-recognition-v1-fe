'use client'

import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const QuizProgress = () => {
  const { currentUser } = useAuth();
  const { quizSets, getQuizSets, quizSetsLoading, proficiencyLevel } = useLearning();

  // Map proficiency level to the format expected by getQuizSets
  const userLevel = useMemo(() => {
    const level = currentUser?.proficiency_level || proficiencyLevel;
    if (!level) return undefined;
    return level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
  }, [currentUser?.proficiency_level, proficiencyLevel]);

  useEffect(() => {
    if (currentUser && userLevel) {
      // Filter quizzes by user's proficiency level
      getQuizSets(undefined, userLevel);
    } else if (currentUser) {
      // If no level set, don't fetch any quizzes
      getQuizSets();
    }
  }, [currentUser, userLevel, getQuizSets]);

  const attemptedQuizzes = quizSets.filter(q => q.progress);
  const totalQuizzes = quizSets.length;
  
  const overallCompletion = totalQuizzes > 0
    ? Math.round((attemptedQuizzes.length / totalQuizzes) * 100)
    : 0;

  // Get display text for level
  const levelDisplayText = userLevel 
    ? userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    : null;

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

  // Show message if user hasn't taken proficiency test
  if (!userLevel) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5" /> Quiz Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              Complete the proficiency test to unlock quizzes tailored to your level.
            </p>
            <Link href="/learning/proficiency-test">
              <Button variant="outline" size="sm">
                Take Proficiency Test
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5" /> Quiz Progress
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {levelDisplayText} Level
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-signlang-primary">{overallCompletion}%</div>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              {levelDisplayText} Quizzes Completed
            </p>
            <Progress value={overallCompletion} className="h-3 md:h-4 mt-2" />
          </div>

          {totalQuizzes === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">
                No quizzes available for {levelDisplayText} level yet.
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
              {quizSets.map(quizSet => {
                const progress = quizSet.progress;
                const progressPercentage = progress ? (progress.score / progress.total_questions) * 100 : 0;
                
                return (
                  <div key={quizSet.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm md:text-base truncate pr-2">{quizSet.title}</span>
                      <span className="text-sm md:text-base font-medium flex-shrink-0">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 md:h-3" />
                    {progress && (
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Score: {progress.score}/{progress.total_questions}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizProgress;
