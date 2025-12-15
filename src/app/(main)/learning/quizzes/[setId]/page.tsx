'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useLearning } from "@/context/LearningContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { QuizQuestion } from "@/types/database";

export default function QuizPage() {
  const params = useParams();
  const setId = params?.setId as string;
  const router = useRouter();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const { getQuizSetWithQuestions, submitQuizAnswers } = useLearning();
  
  const [quizSet, setQuizSet] = useState<any>(null);
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Loading Quiz...</h1>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <p className="mb-4">This quiz may not be available in {language}.</p>
        <Button
          onClick={() => router.push("/learning/quizzes")}
        >
          Back to Quiz List
        </Button>
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
    <div className="max-w-3xl mx-auto">
      <Button
        className="mb-4"
        onClick={() => router.push("/learning/quizzes")}
      >
        ← Back to Quiz List
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Quiz: {formatQuizTitle()}</h1>
      <p className="mb-8 text-gray-600">
        Answer all questions below and submit to see your score and explanations.
      </p>

      <form onSubmit={handleSubmit}>
        {questions.map((question, idx) => (
          <Card key={question.id} className="mb-6">
            <CardHeader>
              <CardTitle>Question {idx + 1}</CardTitle>
              <CardDescription className="text-lg font-medium text-black">
                {question.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-4 border rounded-md cursor-pointer ${
                    selectedAnswers[question.id] === option
                      ? "border-primary bg-primary/5"
                      : "hover:border-gray-400"
                  } ${
                    showResults
                      ? option === question.correct_answer
                        ? "border-green-500 bg-green-50"
                        : selectedAnswers[question.id] === option
                        ? "border-red-500 bg-red-50"
                        : ""
                      : ""
                  }`}
                  onClick={() => !showResults && handleSelect(question.id, option)}
                >
                  <div className="flex items-start">
                    <div className="flex-1">{option}</div>
                    {showResults && option === question.correct_answer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showResults &&
                      option === selectedAnswers[question.id] &&
                      option !== question.correct_answer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                  </div>
                </div>
              ))}

              {showResults && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 mb-16 flex justify-between items-center">
          {!showResults ? (
            <Button type="submit">Submit Quiz</Button>
          ) : (
            <div className="w-full space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg border">
                <h2 className="text-lg md:text-xl font-bold mb-2">Quiz Results</h2>
                <p className="text-lg">
                  You scored{" "}
                  <span className="font-bold">
                    {correctCount} out of {totalQuestions}
                  </span>{" "}
                  ({Math.round((correctCount / totalQuestions) * 100)}%)
                </p>
                <div className="mt-3">
                  {quizResults?.passed ? (
                    <Badge className="bg-green-500">Passed</Badge>
                  ) : (
                    <Badge variant="destructive">Not Passed</Badge>
                  )}
                </div>
              </div>
              <Button onClick={handleRetry}>Try Again</Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}