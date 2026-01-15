'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLearning } from '@/context/LearningContext';
import ProficiencyTestQuestion from '@/components/proficiency-test/ProficiencyTestQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
  
  // Track if we've already initialized this test to prevent duplicate calls
  const hasInitializedRef = React.useRef<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const testId = typeof params.testId === 'string' ? params.testId : '';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isCriticalError, setIsCriticalError] = useState(false);
  const [submissionRetryCount, setSubmissionRetryCount] = useState(0);
  const [showManualRetry, setShowManualRetry] = useState(false);

  // Load saved answers from localStorage on mount
  useEffect(() => {
    if (testId) {
      const savedAnswers = localStorage.getItem(`test_answers_${testId}`);
      if (savedAnswers) {
        try {
          setUserAnswers(JSON.parse(savedAnswers));
        } catch (err) {
          console.error('Failed to parse saved answers:', err);
        }
      }
    }
  }, [testId]);

  // Auto-save answers to localStorage whenever they change
  useEffect(() => {
    if (testId && Object.keys(userAnswers).length > 0) {
      localStorage.setItem(`test_answers_${testId}`, JSON.stringify(userAnswers));
    }
  }, [userAnswers, testId]);

  useEffect(() => {
    const initializeTest = async () => {
      if (!testId) {
        setError('No test ID provided.');
        setIsCriticalError(true);
        return;
      }

      // Skip if we've already initialized this specific test
      if (hasInitializedRef.current === testId) {
        return;
      }

      try {
        setError(null);
        hasInitializedRef.current = testId; // Mark as initializing
        await startTest(testId);
        setRetryCount(0); // Reset retry count on success
      } catch (err: unknown) {
        console.error('Error loading test:', err);
        hasInitializedRef.current = null; // Reset on error to allow retry
        
        // Log error for administrative review
        const errorLog = {
          timestamp: new Date().toISOString(),
          testId,
          error: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          retryCount
        };
        console.error('Test loading error log:', errorLog);
        
        // Determine if this is a critical error
        const isCritical = retryCount >= 2 || 
                          (err instanceof Error && (err.message.includes('not found') || err.message.includes('unauthorized')));
        
        setIsCriticalError(isCritical);
        
        if (isCritical) {
          setError('Unable to load the test. This may be due to an invalid test ID or permission issues.');
        } else {
          setError('Failed to load test questions. Please try again.');
        }
      }
    };

    // Only initialize if we don't have a current test or it's a different test
    if (!currentTest || currentTest.id !== testId) {
      initializeTest();
    }
  }, [testId, currentTest, startTest, retryCount]);

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

  // Check if all questions are answered
  const getUnansweredCount = () => {
    if (!currentTest) return 0;
    return currentTest.questions.filter(q => !userAnswers[q.id]).length;
  };

  const handleFinish = async (isRetry: boolean = false) => {
    if (!testAttempt || !currentTest) return;

    // Validate all questions are answered
    const unansweredQuestions = currentTest.questions.filter(
      q => !userAnswers[q.id]
    );
    
    if (unansweredQuestions.length > 0 && !isRetry) {
      setError(`Please answer all questions before submitting. You have ${unansweredQuestions.length} unanswered question(s).`);
      // Navigate to first unanswered question
      const firstUnansweredIndex = currentTest.questions.findIndex(
        q => !userAnswers[q.id]
      );
      setCurrentQuestionIndex(firstUnansweredIndex);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
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
      
      // Clear saved answers from localStorage on successful submission
      localStorage.removeItem(`test_answers_${testId}`);
      
      // Navigate to results page with attemptId
      router.push(`/proficiency-test/results?attemptId=${result.attemptId}`);
    } catch (err: unknown) {
      console.error('Test submission error:', err);
      
      // Log error for administrative review
      const errorLog = {
        timestamp: new Date().toISOString(),
        testId,
        attemptId: testAttempt.id,
        error: err instanceof Error ? err.message : 'Unknown error',
        submissionRetryCount,
        answersCount: Object.keys(userAnswers).length
      };
      console.error('Test submission error log:', errorLog);
      
      // Implement exponential backoff retry logic
      if (submissionRetryCount < 3 && !isRetry) {
        const backoffDelay = Math.pow(2, submissionRetryCount) * 1000; // 1s, 2s, 4s
        setSubmissionRetryCount(prev => prev + 1);
        
        setError(`Submission failed. Retrying in ${backoffDelay / 1000} seconds... (Attempt ${submissionRetryCount + 1} of 3)`);
        
        setTimeout(() => {
          handleFinish(true);
        }, backoffDelay);
      } else {
        // Show manual retry option after 3 failed attempts
        setShowManualRetry(true);
        setError('Failed to submit test after multiple attempts. Your answers have been saved. Please check your connection and try again.');
      }
    } finally {
      if (showManualRetry || submissionRetryCount >= 3) {
        setIsSubmitting(false);
      }
    }
  };

  const handleManualRetry = () => {
    setSubmissionRetryCount(0);
    setShowManualRetry(false);
    handleFinish();
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleRedirectToSelection = () => {
    router.push('/proficiency-test/select');
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Test</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCriticalError && retryCount < 2 && (
              <div className="text-sm text-muted-foreground">
                <p>This could be due to a temporary network issue. You can try loading the test again.</p>
                <p className="mt-2">Retry attempt: {retryCount + 1} of 3</p>
              </div>
            )}
            {isCriticalError && (
              <div className="text-sm text-muted-foreground">
                <p>We were unable to load this test after multiple attempts. Please return to the test selection page and try a different test.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleRedirectToSelection}>
              Back to Test Selection
            </Button>
            {!isCriticalError && retryCount < 2 && (
              <Button onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </CardFooter>
        </Card>
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
          
          {/* Question Navigation Bar */}
          <div className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t">
            {currentTest.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                disabled={isSubmitting}
                className={`w-10 h-10 rounded-full font-medium text-sm transition-all border-2 ${
                  index === currentQuestionIndex
                    ? 'bg-signlang-primary border-signlang-primary text-white shadow-md scale-110'
                    : userAnswers[question.id]
                      ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-signlang-primary hover:text-signlang-primary'
                }`}
                title={userAnswers[question.id] ? `Question ${index + 1} (Answered)` : `Question ${index + 1} (Not answered)`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {/* Progress Indicator */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            {Object.keys(userAnswers).length} of {currentTest.questions.length} answered
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Validation Error Alert */}
          {error && !showManualRetry && submissionRetryCount === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Incomplete Test</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {showManualRetry && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Submission Failed</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  onClick={handleManualRetry} 
                  className="mt-2 w-full"
                  disabled={isSubmitting}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Submission
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {!showManualRetry && submissionRetryCount > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ProficiencyTestQuestion
            question={currentQuestion}
            selectedChoice={userAnswers[currentQuestion.id] || null}
            onSelectChoice={(choiceId) => handleAnswerSelect(currentQuestion.id, choiceId)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0 || isSubmitting}>
            Previous
          </Button>
          {currentQuestionIndex < currentTest.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>Next</Button>
          ) : (
            <Button 
              onClick={() => handleFinish()} 
              disabled={isSubmitting || showManualRetry}
              variant={getUnansweredCount() === 0 ? 'default' : 'outline'}
            >
              {isSubmitting ? 'Submitting...' : 
               getUnansweredCount() > 0 
                 ? `Finish (${getUnansweredCount()} unanswered)` 
                 : 'Finish Test'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProficiencyTestPage;