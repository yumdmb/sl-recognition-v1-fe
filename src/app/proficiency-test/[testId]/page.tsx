'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLearning } from '@/context/LearningContext';
import ProficiencyTestQuestion from '@/components/proficiency-test/ProficiencyTestQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type UserAnswers = {
  [questionId: string]: string; // questionId: choiceId
};

const ProficiencyTestPage = () => {
  const { 
    startTest, 
    submitAnswer: submitAnswerToContext, 
    submitTest, 
    currentTest, 
    testAttempt,
    proficiencyTestLoading 
  } = useLearning();
  
  const router = useRouter();
  const params = useParams();
  const testId = typeof params.testId === 'string' ? params.testId : '';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializeTest = async () => {
      if (!testId) {
        setError('No test ID provided.');
        return;
      }

      try {
        await startTest(testId);
      } catch (err) {
        setError('Failed to load the proficiency test. Please try again later.');
        console.error(err);
      }
    };

    // Only initialize if we don't have a current test or it's a different test
    if (!currentTest || currentTest.id !== testId) {
      initializeTest();
    }
  }, [testId, currentTest, startTest]);

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleNext = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (!testAttempt || !currentTest) return;

    setIsSubmitting(true);
    try {
      // Submit all answers first
      for (const question of currentTest.questions) {
        const choiceId = userAnswers[question.id];
        if (choiceId) {
          await submitAnswerToContext(question.id, choiceId);
        }
      }

      // Submit the test and get results
      const result = await submitTest();
      
      // Navigate to results page with attemptId
      router.push(`/proficiency-test/results?attemptId=${result.attemptId}`);
    } catch (err) {
      setError('An error occurred while submitting your answers.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (proficiencyTestLoading || !currentTest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!currentTest.questions || currentTest.questions.length === 0) {
    return <div className="text-center p-8">No questions found for this test.</div>;
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{currentTest.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {currentTest.questions.length}
          </p>
        </CardHeader>
        <CardContent>
          <ProficiencyTestQuestion
            question={currentQuestion}
            selectedChoice={userAnswers[currentQuestion.id] || null}
            onSelectChoice={(choiceId) => handleAnswerSelect(currentQuestion.id, choiceId)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          {currentQuestionIndex < currentTest.questions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Finish Test'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProficiencyTestPage;