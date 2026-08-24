'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useLearning } from "@/context/LearningContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { QuizQuestion } from "@/types/database";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const params = useParams();
  const setId = params?.setId as string;
  const router = useRouter();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const { getQuizSetWithQuestions, submitQuizAnswers } = useLearning();

  const [quizSet, setQuizSet] = useState<{ title: string; language: string; questions: QuizQuestion[] } | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: string | null }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalQuestions: number;
    passed: boolean;
  } | null>(null);

  // Load quiz data from Supabase
  useEffect(() => {
    async function loadQuizData() {
      try {
        setIsLoading(true);
        const data = await getQuizSetWithQuestions(setId);

        if (!data) {
          throw new Error("Quiz not found");
        }

        // Check if this quiz belongs to the selected language
        if (data.language !== language) {
          router.push("/learning/quizzes");
          return;
        }

        setQuizSet(data);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast.error("Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuizData();
  }, [setId, language, router, getQuizSetWithQuestions]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-9 w-2/3 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl opacity-60" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-bold">Quiz not found</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            This quiz may not be available in {language}. Head back to the quiz list to pick another.
          </p>
          <Button className="mt-6" onClick={() => router.push("/learning/quizzes")}>
            <ArrowLeft />
            Back to quizzes
          </Button>
        </div>
      </div>
    );
  }

  const handleSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all questions have been answered
    const unanswered = questions.filter(q => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      toast.warning(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    try {
      if (!currentUser) {
        toast.error("Please log in to submit your quiz");
        return;
      }

      // Format answers for submission
      const answers = Object.keys(selectedAnswers).map(questionId => ({
        questionId,
        answer: selectedAnswers[questionId] || ""
      }));

      // Submit answers to Supabase
      const results = await submitQuizAnswers(setId, answers);
      setQuizResults(results);
      setShowResults(true);

      // Show toast based on results
      if (results.passed) {
        toast.success(`Congratulations! You passed with ${results.score}/${results.totalQuestions}`);
      } else {
        toast.info(`Quiz completed. Score: ${results.score}/${results.totalQuestions}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  // Calculate results
  const correctCount = quizResults?.score || 0;
  const totalQuestions = questions.length;
  const answeredCount = questions.filter(q => selectedAnswers[q.id]).length;

  // Format quiz title
  const formatQuizTitle = () => {
    if (quizSet?.title) return quizSet.title;

    // Fallback to formatting from setId
    if (!setId) return "";
    const parts = setId.split('-');
    if (parts.length < 2) return setId;
    return `${parts[0].toUpperCase()} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => router.push("/learning/quizzes")}
      >
        <ArrowLeft />
        Back to quizzes
      </Button>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Quizzes</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
          {formatQuizTitle()}
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Answer all {totalQuestions} question{totalQuestions === 1 ? '' : 's'} and submit to see your score and explanations.
        </p>
      </div>

      {!showResults && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{answeredCount} of {totalQuestions} answered</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-8 space-y-5">
          {questions.map((question, idx) => (
            <Card key={question.id} className="card-lift gap-0 py-5">
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <span className="font-display grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-sm font-bold text-mint">
                    {idx + 1}
                  </span>
                  <p className="pt-1 text-[15px] font-semibold leading-relaxed">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-2.5 pl-[46px]">
                  {question.options.map((option, i) => {
                    const selected = selectedAnswers[question.id] === option;
                    const isCorrect = option === question.correct_answer;
                    const isWrongPick =
                      showResults && selected && option !== question.correct_answer;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all",
                          !showResults && "hover:border-primary/40 hover:bg-accent",
                          selected && !showResults && "border-primary bg-primary-soft/60 shadow-soft",
                          showResults && isCorrect && "border-primary bg-primary-soft",
                          isWrongPick && "border-destructive/50 bg-destructive/5"
                        )}
                        onClick={() => !showResults && handleSelect(question.id, option)}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-colors",
                            selected || (showResults && isCorrect)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground",
                            isWrongPick && "border-destructive bg-destructive text-white"
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                        {showResults && isCorrect && (
                          <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-primary" />
                        )}
                        {isWrongPick && (
                          <XCircle className="mt-0.5 size-4.5 shrink-0 text-destructive" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="ml-[46px] flex items-start gap-3 rounded-xl border border-sky/25 bg-sky/5 p-4">
                    <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-sky" />
                    <div className="text-sm">
                      <p className="font-semibold">Explanation</p>
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 mb-8">
          {!showResults ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="text-sm text-muted-foreground">
                {answeredCount === totalQuestions ? (
                  <span className="font-medium text-foreground">All set — ready when you are.</span>
                ) : (
                  <span>
                    <span className="font-semibold text-foreground">{totalQuestions - answeredCount}</span>{" "}
                    question{totalQuestions - answeredCount === 1 ? '' : 's'} left to answer
                  </span>
                )}
              </div>
              <Button type="submit" size="lg">
                Submit quiz
              </Button>
            </div>
          ) : (
            <Card className="gap-0 overflow-hidden">
              <div className="relative overflow-hidden bg-ink px-8 py-10 text-center text-mint-soft">
                <div className="bg-dots absolute inset-0 opacity-30" aria-hidden />
                <div className="absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden />
                <div className="relative">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Trophy className="size-6" />
                  </span>
                  <p className="font-display mt-4 text-5xl font-extrabold tracking-tight text-white">
                    {correctCount}
                    <span className="text-2xl text-mint-soft/50"> / {totalQuestions}</span>
                  </p>
                  <p className="mt-2 text-sm text-mint-soft/70">
                    {Math.round((correctCount / totalQuestions) * 100)}% · {quizResults?.passed ? "Passed" : "Not passed this time"}
                  </p>
                  <div className="mt-4">
                    {quizResults?.passed ? (
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Passed
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive/15 text-red-300 hover:bg-destructive/15">
                        Not passed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <p className="text-sm text-muted-foreground">
                  Review the explanations above, then retake it when you're ready.
                </p>
                <div className="flex gap-2.5">
                  <Button variant="outline" onClick={() => router.push("/learning/quizzes")}>
                    All quizzes
                  </Button>
                  <Button onClick={handleRetry}>
                    <RotateCcw />
                    Try again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
}
