'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { useAdmin } from '@/context/AdminContext';
import { useLearning } from '@/context/LearningContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { QuizQuestion } from '@/types/database';

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
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Loading questions...</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push('/learning/quizzes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
        <h1 className="text-2xl font-bold">{quizTitle ? `Edit ${quizTitle} Questions` : 'Edit Questions'}</h1>
      </div>

      {/* Add new question button */}
      <Button onClick={handleAddQuestion} className="mb-8">
        <Plus className="h-4 w-4 mr-2" />
        Add New Question
      </Button>

      {/* Questions list */}
      {questions.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No questions added yet. Click &ldquo;Add New Question&rdquo; to get started.</p>
          </CardContent>
        </Card>
      ) : (
        questions.map((question, index) => (
          <Card key={question.id} className="mb-6">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Question {index + 1}</CardTitle>
                <div className="space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(question)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteQuestion(question.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
              <CardDescription className="text-lg font-medium text-black pt-2">
                {question.question}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option, i) => (
                  <div 
                    key={i} 
                    className={`p-3 border rounded-md ${option === question.correct_answer ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    {option} {option === question.correct_answer && '✓'}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-gray-600">
                <p><span className="font-medium">Explanation:</span> {question.explanation}</p>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentQuestion?.id ? 'Edit' : 'Add'} Question</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea 
                id="question"
                value={currentQuestion?.question || ''}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                placeholder="Enter question text"
              />
            </div>

            <div className="space-y-4">
              <Label>Options</Label>
              {currentQuestion?.options.map((option, idx) => (
                <div key={idx} className="flex space-x-2">
                  <Input 
                    value={option}
                    onChange={(e) => handleQuestionChange('options', { index: idx, text: e.target.value })}
                    placeholder={`Option ${idx + 1} (e.g., A)`}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant={option === currentQuestion?.correct_answer ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetCorrectAnswer(option)}
                  >
                    {option === currentQuestion?.correct_answer ? '✓ Correct' : 'Set as Correct'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea 
                id="explanation"
                value={currentQuestion?.explanation || ''}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                placeholder="Explain the correct answer"
              />
            </div>
            
            {/* Difficulty level field has been removed as it doesn't exist in the database schema */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuestion}>Save Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
