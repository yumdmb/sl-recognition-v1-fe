'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Pencil, Trash2, Check, ListChecks, Image as ImageIcon, Video } from "lucide-react";
import { useAdmin } from '@/context/AdminContext';
import { useLearning } from '@/context/LearningContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { QuizQuestion } from '@/types/database';
import { ImageUploadField } from '@/components/ui/image-upload-field';

interface QuizQuestionEditorProps {
  setId: string;
  quizTitle: string;
}

export default function QuizQuestionEditor({ setId, quizTitle }: QuizQuestionEditorProps) {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const { getQuizSetWithQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } = useLearning();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin) {
      router.push('/learning/quizzes');
      return;
    }

    // Get quiz questions from Supabase
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        const quizSet = await getQuizSetWithQuestions(setId);
        if (!quizSet) {
          router.push('/learning/quizzes');
          return;
        }
        setQuestions(quizSet.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [setId, router, isAdmin]); // Removed getQuizSetWithQuestions from dependencies

  // Handle adding a new question
  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: '',
      quiz_set_id: setId,
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      video_url: null,
      image_url: null,
      order_index: questions.length,
      created_at: new Date().toISOString()
    });
    setEditDialogOpen(true);
  };

  // Handle editing an existing question
  const handleEditQuestion = (question: QuizQuestion) => {
    setCurrentQuestion({...question});
    setEditDialogOpen(true);
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuizQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
      // Note: Success toast is shown in LearningContext
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  // Handle saving a question (new or updated)
  const handleSaveQuestion = async () => {
    if (!currentQuestion) return;

    // Validation
    if (!currentQuestion.question) {
      toast.error('Question text is required');
      return;
    }

    if (!currentQuestion.options.every(option => option.trim())) {
      toast.error('All options must be filled in');
      return;
    }

    if (!currentQuestion.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    if (!currentQuestion.explanation) {
      toast.error('Explanation is required');
      return;
    }

    try {
      if (!currentQuestion.id) {
        // Create new question
        await createQuizQuestion({
          quiz_set_id: setId,
          question: currentQuestion.question,
          options: currentQuestion.options,
          correct_answer: currentQuestion.correct_answer,
          explanation: currentQuestion.explanation,
          video_url: currentQuestion.video_url,
          image_url: currentQuestion.image_url,
          order_index: currentQuestion.order_index
        });

        // Refresh questions after creating a new one
        const updatedQuizSet = await getQuizSetWithQuestions(setId);
        if (updatedQuizSet) {
          setQuestions(updatedQuizSet.questions);
        }
        // Note: Success toast is shown in LearningContext
      } else {
        // Update existing question
        await updateQuizQuestion(currentQuestion.id, {
          question: currentQuestion.question,
          options: currentQuestion.options,
          correct_answer: currentQuestion.correct_answer,
          explanation: currentQuestion.explanation,
          video_url: currentQuestion.video_url,
          image_url: currentQuestion.image_url,
          order_index: currentQuestion.order_index
        });

        // Refresh questions after updating
        const refreshedQuizSet = await getQuizSetWithQuestions(setId);
        if (refreshedQuizSet) {
          setQuestions(refreshedQuizSet.questions);
        }
        // Note: Success toast is shown in LearningContext
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  // Handle updating the current question being edited
  const handleQuestionChange = (field: string, value: { index: number; text: string } | string) => {
    if (!currentQuestion) return;

    if (field === 'options' && typeof value === 'object' && 'index' in value) {
      const newOptions = [...currentQuestion.options];
      newOptions[value.index] = value.text;
      setCurrentQuestion({...currentQuestion, options: newOptions});
    } else if (typeof value === 'string') {
      setCurrentQuestion({...currentQuestion, [field]: value});
    }
  };

  // Handle setting the correct answer
  const handleSetCorrectAnswer = (option: string) => {
    if (!currentQuestion) return;
    setCurrentQuestion({...currentQuestion, correct_answer: option});
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-7 w-56 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Quiz builder</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            {quizTitle || 'Questions'}
          </h2>
          <p className="mt-1.5 text-muted-foreground">
            {questions.length} question{questions.length === 1 ? '' : 's'} in this set
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => router.push('/learning/quizzes')}>
            <ArrowLeft />
            Back
          </Button>
          <Button onClick={handleAddQuestion}>
            <Plus />
            Add question
          </Button>
        </div>
      </div>

      {/* Questions list */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ListChecks className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">No questions yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Add your first question to start building this quiz set.
          </p>
          <Button className="mt-6" onClick={handleAddQuestion}>
            <Plus />
            Add question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="card-lift gap-0">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span className="font-display grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <p className="pt-1 font-semibold leading-snug">{question.question}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEditQuestion(question)} aria-label="Edit question">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteQuestion(question.id)}
                      aria-label="Delete question"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="ml-11 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {question.options.map((option, i) => {
                    const isCorrect = option === question.correct_answer;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm ${
                          isCorrect
                            ? 'border-primary/40 bg-primary-soft font-semibold text-primary'
                            : 'border-border bg-card text-foreground/80'
                        }`}
                      >
                        {isCorrect && <Check className="size-4 shrink-0" />}
                        <span className="truncate">{option}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="ml-11 rounded-xl bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground/70">Explanation: </span>
                  {question.explanation}
                </p>
                {(question.image_url || question.video_url) && (
                  <div className="ml-11 flex gap-2 items-center text-sm text-muted-foreground">
                    {question.image_url && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                        <ImageIcon className="size-3.5" />
                        Image attached
                      </span>
                    )}
                    {question.video_url && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-xs font-semibold text-sky">
                        <Video className="size-3.5" />
                        Video attached
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {currentQuestion?.id ? 'Edit question' : 'New question'}
            </DialogTitle>
            <DialogDescription>
              Fill in the question, four options, and mark the correct one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={currentQuestion?.question || ''}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                placeholder="e.g. What sign is shown for “thank you”?"
              />
            </div>

            <div className="space-y-2.5">
              <Label>Options — tap one to mark it correct</Label>
              {currentQuestion?.options.map((option, idx) => {
                const isCorrect = option === currentQuestion?.correct_answer;
                return (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleQuestionChange('options', { index: idx, text: e.target.value })}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={isCorrect ? "default" : "outline"}
                      size="sm"
                      className="shrink-0"
                      onClick={() => handleSetCorrectAnswer(option)}
                    >
                      {isCorrect ? (
                        <>
                          <Check />
                          Correct
                        </>
                      ) : (
                        'Set correct'
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                value={currentQuestion?.explanation || ''}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                placeholder="Explain why the correct answer is right"
              />
            </div>

            <ImageUploadField
              value={currentQuestion?.image_url || ''}
              onChange={(url) => handleQuestionChange('image_url', url)}
              folder="quiz-questions"
              label="Question Image"
            />

            <div className="space-y-2">
              <Label htmlFor="video_url" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Video URL (optional)
              </Label>
              <Input
                id="video_url"
                value={currentQuestion?.video_url || ''}
                onChange={(e) => handleQuestionChange('video_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuestion}>Save question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
