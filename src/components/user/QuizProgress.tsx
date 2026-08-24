'use client';

import React, { useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
      <Card>
        <CardContent className="grid min-h-[220px] place-items-center">
          <div className="text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Loading quiz progress…</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if user hasn't taken proficiency test for this language
  if (!userLevel) {
    return (
      <Card className="card-lift gap-0">
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-sun/10 text-sun">
              <Award className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold">{language} Quizzes</h3>
              <p className="text-xs text-muted-foreground">Unlock with proficiency test</p>
            </div>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-4 py-6 text-center bg-muted/20">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm text-muted-foreground mb-3 max-w-[220px]">
              Take the {language} proficiency test to unlock quizzes.
            </p>
            <Link 
              href="/proficiency-test/select"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-full transition-colors text-sm hover:bg-primary/90"
            >
              Take Test
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 card-lift">
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sun/10 text-sun">
            <Award className="size-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-bold flex items-center gap-2">
              {language} Quizzes
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                {levelDisplayText}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">Attempted vs. available sets</p>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="font-display text-4xl font-extrabold tracking-tight">{overallCompletion}%</span>
            <span className="text-xs font-medium text-muted-foreground">
              {attemptedQuizzes.length} of {totalQuizzes} attempted
            </span>
          </div>
          <Progress value={overallCompletion} className="mt-3 h-2.5" />
        </div>

        {totalQuizzes === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
            No {language} quizzes available for {levelDisplayText} level yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
            {languageFilteredQuizzes.slice(0, 4).map(quizSet => {
              const progress = quizSet.progress;
              const progressPercentage = progress ? (progress.score / progress.total_questions) * 100 : 0;
              const hasProgress = !!progress;

              return (
                <div key={quizSet.id}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">{quizSet.title}</span>
                    {hasProgress ? (
                      <span className="shrink-0 text-xs font-semibold text-primary">
                        {progress.score}/{progress.total_questions}
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground/60">Not attempted</span>
                    )}
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                </div>
              );
            })}
          </div>
        )}

        {totalQuizzes > 4 && (
          <Link 
            href="/learning/quizzes"
            className="flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View All Quizzes
            <ChevronRight size={14} />
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizProgress;
