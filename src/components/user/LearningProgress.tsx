'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTutorials, getUserProgress } from '@/data/contentData';

const LearningProgress: React.FC = () => {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user ID from localStorage or your auth system
    const userId = localStorage.getItem('userId') || 'default-user';
    
    // Fetch tutorials and user progress
    const tutorialsData = getTutorials();
    const userProgressData = getUserProgress(userId);
    
    setTutorials(tutorialsData);
    setUserProgress(userProgressData);
    setIsLoading(false);
  }, []);

  const totalProgress = tutorials.length > 0 
    ? Math.round(tutorials.reduce((sum, tutorial) => {
        const progress = userProgress?.tutorials.find((t: any) => t.tutorialId === tutorial.id);
        return sum + (progress?.progress || 0);
      }, 0) / tutorials.length)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading your progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="mr-2 h-5 w-5" /> Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-signlang-primary">{totalProgress}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
            <Progress value={totalProgress} className="h-3 mt-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">{tutorials.length}</div>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {userProgress?.tutorials.filter((t: any) => t.progress === 100).length || 0}
              </div>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {userProgress?.tutorials.length || 0}
              </div>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
          
          {tutorials.map(tutorial => {
            const progress = userProgress?.tutorials.find((t: any) => t.tutorialId === tutorial.id);
            const progressPercentage = progress?.progress || 0;
            
            return (
              <div key={tutorial.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm">{tutorial.title}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 capitalize ${
                        tutorial.level === 'beginner' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : tutorial.level === 'intermediate'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      {tutorial.level}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {progress ? `Last updated: ${new Date(progress.lastUpdated).toLocaleDateString()}` : 'Not started'}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
