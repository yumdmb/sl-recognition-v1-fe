'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';

const LearningProgress: React.FC = () => {
  const { currentUser } = useAuth();
  const { tutorials, getTutorials } = useLearning();
  const [isLoading, setIsLoading] = useState(true);  useEffect(() => {
    // Only run if we have currentUser
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    const loadData = async () => {
      try {
        // Get fresh reference to getTutorials from context
        if (getTutorials) {
          await getTutorials();
        }
      } catch (error) {
        console.error('Error loading tutorials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser?.id]); // Simplified dependency array

  // Calculate progress metrics based on new status system
  const startedTutorials = tutorials.filter(t => t.status === 'started' || t.status === 'completed');
  const inProgressTutorials = tutorials.filter(t => t.status === 'started');
  const completedTutorials = tutorials.filter(t => t.status === 'completed');

  // Calculate overall completion percentage based on started tutorials
  const totalProgress = startedTutorials.length > 0 
    ? Math.round((completedTutorials.length / startedTutorials.length) * 100)
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
      </CardHeader>      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl font-bold text-signlang-primary">{totalProgress}%</div>
            <p className="text-sm md:text-base text-gray-500 mt-1">Overall Completion</p>
            <Progress value={totalProgress} className="h-3 md:h-4 mt-2" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
            <div className="bg-gray-50 p-3 md:p-4 rounded-md">
              <div className="text-lg md:text-xl font-bold">{startedTutorials.length}</div>
              <p className="text-xs md:text-sm text-gray-500">Started</p>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-md">
              <div className="text-lg md:text-xl font-bold">{inProgressTutorials.length}</div>
              <p className="text-xs md:text-sm text-gray-500">In Progress</p>
            </div>
            <div className="bg-gray-50 p-3 md:p-4 rounded-md">
              <div className="text-lg md:text-xl font-bold">{completedTutorials.length}</div>
              <p className="text-xs md:text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
