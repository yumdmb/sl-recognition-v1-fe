'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { useAdmin } from '@/context/AdminContext';
import { getQuizQuestions, saveQuizQuestion, deleteQuizQuestion, QuizQuestion, getQuizSets } from '@/data/contentData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface QuizQuestionEditorProps {
  setId: string;
  quizTitle: string;
}

export default function QuizQuestionEditor({ setId, quizTitle }: QuizQuestionEditorProps) {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    // Redirect non-admin users
    if (typeof window !== 'undefined') {
      const savedAdminStatus = localStorage.getItem('isAdmin');
      if (savedAdminStatus !== 'true') {
        router.push('/learning/quizzes');
        return;
      }    }

    // Get quiz questions - don't wait for quizTitle as it might be loading
    const quizQuestions = getQuizQuestions(setId);
    setQuestions(quizQuestions);
    setIsLoading(false);
  }, [setId, router]);

  // Separate effect to handle redirect when no quizTitle is found after loading
  useEffect(() => {
    // Only redirect if we have loaded and still no title
    if (!isLoading && !quizTitle && setId) {
      // Check if quiz set exists
      if (typeof window !== 'undefined') {
        const quizSets = getQuizSets();
        const quizSet = quizSets.find(set => set.id === setId);
        if (!quizSet) {
          router.push('/learning/quizzes');
          return;
        }
      }
    }
  }, [isLoading, quizTitle, setId, router]);

  // Function to handle adding a new question
  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a question
  const handleEditQuestion = (question: QuizQuestion) => {
    setCurrentQuestion({...question});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a question
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = deleteQuizQuestion(setId, questionId);
      setQuestions(updatedQuestions);
      toast.success('Question deleted successfully');
    }
  };

  // Function to save question (add or update)
  const handleSaveQuestion = (question: QuizQuestion) => {
    // Form validation
    if (!question.question || !question.explanation || question.options.some(option => !option) || !question.correctAnswer) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate correctAnswer is one of the options
    if (!question.options.includes(question.correctAnswer)) {
      toast.error('The correct answer must be one of the options');
      return;
    }

    try {
      const updatedQuestions = saveQuizQuestion(setId, question);
      setQuestions(updatedQuestions);
      setEditDialogOpen(false);
      toast.success(`Question ${question.id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Error saving question');
      console.error(error);
    }
  };

  // Function to update option at specific index
  const updateOption = (index: number, value: string) => {
    if (!currentQuestion) return;
    
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/learning/quizzes')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quiz Sets
        </Button>
      </div>      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Questions: {quizTitle || setId}</h1>
        <Button onClick={handleAddQuestion}>
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading questions...</p>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-4">{question.question}</p>
                <div className="space-y-2 mb-6">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex} 
                      className={`p-3 border rounded-md ${
                        option === question.correctAnswer 
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {option}
                      {option === question.correctAnswer && (
                        <span className="ml-2 text-green-600 text-sm">(Correct Answer)</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1">Explanation:</h4>
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                </div>
                {question.videoUrl && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-1">Video:</h4>
                    <p className="text-sm text-blue-600">{question.videoUrl}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No questions available for this quiz. Add a question to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentQuestion?.id ? 'Edit' : 'Add'} Question</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">Question</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Options</Label>
                <div className="col-span-3 space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant={currentQuestion.correctAnswer === option ? "default" : "outline"}
                        onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: option})}
                        size="sm"
                      >
                        {currentQuestion.correctAnswer === option ? "Correct" : "Mark Correct"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="explanation" className="text-right">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoUrl" className="text-right">Video URL (optional)</Label>
                <Input
                  id="videoUrl"
                  value={currentQuestion.videoUrl || ''}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, videoUrl: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={currentQuestion.imageUrl || ''}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, imageUrl: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => currentQuestion && handleSaveQuestion(currentQuestion)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 