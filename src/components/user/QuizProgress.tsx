'use client'

import React, { useEffect, useMemo } from 'react';
import { Award, BookOpen, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import Link from 'next/link';

interface QuizProgressProps {
  language: 'ASL' | 'MSL';
}

const QuizProgress: React.FC<QuizProgressProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const { quizSets, getQuizSets, quizSetsLoading } = useLearning();

  // Get language-specific proficiency level
  const userLevel = useMemo(() => {
    const level = language === 'ASL' 
      ? currentUser?.asl_proficiency_level 
      : currentUser?.msl_proficiency_level;
    if (!level) return undefined;
    return level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
  }, [currentUser?.asl_proficiency_level, currentUser?.msl_proficiency_level, language]);

  useEffect(() => {
    if (currentUser && userLevel) {
      getQuizSets(language, userLevel);
    } else if (currentUser) {
      getQuizSets(language);
    }
  }, [currentUser, userLevel, language, getQuizSets]);

  // Filter by language
  const languageFilteredQuizzes = quizSets.filter(q => q.language === language);
  
  const attemptedQuizzes = languageFilteredQuizzes.filter(q => q.progress);
  const totalQuizzes = languageFilteredQuizzes.length;
  
  const overallCompletion = totalQuizzes > 0
    ? Math.round((attemptedQuizzes.length / totalQuizzes) * 100)
    : 0;

  const levelDisplayText = userLevel 
    ? userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    : null;

  if (quizSetsLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-48 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary mx-auto" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  // Show message if user hasn't taken proficiency test for this language
  if (!userLevel) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center h-auto min-h-[200px] relative overflow-hidden">
        <div className="z-10 relative text-center">
          <div className="flex items-center justify-between w-full mb-6">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language} Quizzes
            </span>
            <Award size={20} className="text-signlang-primary" />
          </div>
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">
            Take the {language} proficiency test to unlock quizzes.
          </p>
          <Link 
            href="/proficiency-test/select"
            className="inline-flex items-center px-4 py-2 bg-signlang-primary hover:bg-signlang-primary/90 text-signlang-dark font-medium rounded-lg transition-colors text-sm"
          >
            Take Test
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        {/* Decorative Background */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-signlang-accent dark:bg-signlang-primary/10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[200px] relative overflow-hidden group">
      {/* Card Header */}
      <div className="z-10 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {language} Quizzes
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-signlang-accent dark:bg-signlang-primary/20 text-signlang-dark dark:text-signlang-primary text-xs font-bold rounded">
              {levelDisplayText}
            </span>
            <Award size={20} className="text-signlang-primary" />
          </div>
        </div>
        
        {/* Main Stat */}
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
          {overallCompletion}%
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {attemptedQuizzes.length} of {totalQuizzes} quizzes attempted
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-4 z-10 relative">
        <div 
          className="bg-signlang-primary h-2 rounded-full transition-all duration-500" 
          style={{ width: `${overallCompletion}%` }}
        />
      </div>

      {/* Quiz List */}
      {totalQuizzes === 0 ? (
        <div className="text-center py-4 mt-4 z-10 relative">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No {language} quizzes available for {levelDisplayText} level yet.
          </p>
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto mt-4 space-y-2 z-10 relative pr-1">
          {languageFilteredQuizzes.slice(0, 4).map(quizSet => {
            const progress = quizSet.progress;
            const progressPercentage = progress ? (progress.score / progress.total_questions) * 100 : 0;
            
            return (
              <div 
                key={quizSet.id}
                className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{quizSet.title}</span>
                  <span className="text-xs font-bold text-signlang-primary flex-shrink-0">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                  <div 
                    className="bg-signlang-primary h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Link */}
      {totalQuizzes > 4 && (
        <Link 
          href="/learning/quizzes"
          className="mt-3 text-xs font-bold text-slate-500 hover:text-signlang-primary uppercase tracking-wide flex items-center justify-center gap-1 transition-colors z-10"
        >
          View All Quizzes
          <ChevronRight size={14} />
        </Link>
      )}

      {/* Decorative Background Element */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-signlang-accent dark:bg-signlang-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
    </div>
  );
};

export default QuizProgress;


