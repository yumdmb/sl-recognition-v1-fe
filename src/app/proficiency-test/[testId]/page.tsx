'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  getProficiencyTest,
  createTestAttempt,
  submitAnswer,
  calculateResultAndAssignProficiency,
  ProficiencyTest as FullProficiencyTest,
} from '@/lib/services/proficiencyTestService';
import ProficiencyTestQuestion from '@/components/proficiency-test/ProficiencyTestQuestion';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type UserAnswers = {
  [questionId: string]: string; // questionId: choiceId
};

const ProficiencyTestPage = () => {
  const auth = useAuth();
  const user = auth?.currentUser;
  const params = useParams();
  const testId = typeof params.testId === 'string' ? params.testId : '';

  const [testData, setTestData] = useState<FullProficiencyTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializeTest = async () => {
      if (!user) {
        setError('You must be logged in to take the proficiency test.');
        setIsLoading(false);
        return;
      }

      if (!testId) {
        setError('No test ID provided.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const test = await getProficiencyTest(testId);
        if (test) {
          setTestData(test);
          const attempt = await createTestAttempt(user.id, test.id);
          if (attempt) {
            setTestAttemptId(attempt.id);
          } else {
            setError('Failed to create a test attempt.');
          }
        } else {
          setError('Proficiency test not found.');
        }
      } catch (err) {
        setError('Failed to load the proficiency test. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTest();
  }, [user, testId]);

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleNext = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (!testAttemptId || !testData || !user) return;

    setIsSubmitting(true);
    try {
      for (const question of testData.questions) {
        const choiceId = userAnswers[question.id];
        if (choiceId) {
          await submitAnswer(testAttemptId, question.id, choiceId);
        }
      }

      const finalResult = await calculateResultAndAssignProficiency(testAttemptId, user.id);
      if (finalResult) {
        // Redirect to results page with attemptId
        window.location.href = `/proficiency-test/results?attemptId=${testAttemptId}`;
      } else {
        setError('Failed to calculate your result.');
      }
    } catch (err) {
      setError('An error occurred while submitting your answers.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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

  if (!testData || testData.questions.length === 0) {
    return <div className="text-center p-8">No questions found for this test.</div>;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{testData.title}</CardTitle>
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
          {currentQuestionIndex < testData.questions.length - 1 ? (
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