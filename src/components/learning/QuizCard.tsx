'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, ListChecks, Trash2, Play, ClipboardList } from 'lucide-react';
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
  const progress = quizSet.progress;
  const pct = progress
    ? Math.round((progress.score / progress.total_questions) * 100)
    : null;

  return (
    <Card className="card-lift gap-0 py-5">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <ClipboardList className="size-5" />
          </span>
          <Badge variant="outline" className="border-border text-muted-foreground">
            {quizSet.questionCount} questions
          </Badge>
        </div>

        <h3 className="font-display mt-4 text-lg font-bold leading-snug">{quizSet.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {quizSet.description}
        </p>

        {progress && pct !== null && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Last attempt</span>
              <span className="font-bold text-primary">{progress.score}/{progress.total_questions} · {pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button size="sm" onClick={() => onStartQuiz(quizSet.id)} className="group">
            <Play />
            {progress ? 'Retake' : 'Start quiz'}
          </Button>
          {isAdmin && (
            <>
              <Button size="sm" variant="ghost" onClick={() => onEditQuizSet(quizSet)}>
                <Edit />
                Set
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onEditQuestions(quizSet.id)}>
                <ListChecks />
                Questions
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDeleteQuizSet(quizSet.id)}
              >
                <Trash2 />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
