'use client'

import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';

interface LearningProgressProps {
  language: 'ASL' | 'MSL';
}

const LearningProgress: React.FC<LearningProgressProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const { tutorials, getTutorials } = useLearning();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    const loadData = async () => {
      try {
        if (getTutorials) {
          await getTutorials(language); // Filter by language
        }
      } catch (error) {
        console.error('Error loading tutorials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser?.id, language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter by language (in case context doesn't filter)
  const languageFilteredTutorials = tutorials.filter(t => t.language === language);
  
  // Calculate progress metrics
  const startedTutorials = languageFilteredTutorials.filter(t => t.status === 'started' || t.status === 'completed');
  const inProgressTutorials = languageFilteredTutorials.filter(t => t.status === 'started');
  const completedTutorials = languageFilteredTutorials.filter(t => t.status === 'completed');

  const totalProgress = startedTutorials.length > 0 
    ? Math.round((completedTutorials.length / startedTutorials.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-48 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary mx-auto" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full min-h-[200px] relative overflow-hidden group">
      {/* Card Header */}
      <div className="z-10 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {language} Learning
          </span>
          <BookOpen size={20} className="text-signlang-primary" />
        </div>
        
        {/* Main Stat */}
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
          {totalProgress}%
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {completedTutorials.length} of {startedTutorials.length} tutorials completed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-4 z-10 relative">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">{startedTutorials.length}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Started</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">{inProgressTutorials.length}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">{completedTutorials.length}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-4 z-10 relative">
        <div 
          className="bg-signlang-primary h-2 rounded-full transition-all duration-500" 
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* Decorative Background Element */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-signlang-accent dark:bg-signlang-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
    </div>
  );
};

export default LearningProgress;


