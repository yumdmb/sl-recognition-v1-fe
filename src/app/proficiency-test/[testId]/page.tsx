'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLearning } from '@/context/LearningContext';
import ProficiencyTestQuestion from '@/components/proficiency-test/ProficiencyTestQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, ArrowLeft, ArrowRight, CheckCircle2, Loader2, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="container mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center py-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36 rounded-lg" />
          <Skeleton className="h-9 w-2/3 rounded-xl" />
        </div>
        <Skeleton className="mt-8 h-2.5 w-full rounded-full" />
        <Skeleton className="mt-6 h-80 w-full rounded-2xl" />
        <div className="mt-6 flex justify-between">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
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
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <Card className="max-w-lg w-full rounded-2xl shadow-soft">
          <CardContent className="space-y-4 p-6">
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Test</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
          <CardFooter className="flex gap-2 justify-end px-6 pb-6">
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
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center py-10">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ClipboardList className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">No questions found</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            This test does not have any questions yet. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const totalQuestions = currentTest.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Proficiency Test</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">{currentTest.title}</h1>
          <p className="mt-1.5 max-w-xl text-muted-foreground">
            Take your time — you can go back and change any answer before finishing.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Question <span className="font-bold text-foreground">{currentQuestionIndex + 1}</span> of{' '}
            {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Navigation Bar with botanical style */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {currentTest.questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => setCurrentQuestionIndex(index)}
            disabled={isSubmitting}
            className={`size-10 rounded-full font-medium text-sm transition-all border-2 ${
              index === currentQuestionIndex
                ? 'bg-primary border-primary text-primary-foreground shadow-soft scale-110'
                : userAnswers[question.id]
                  ? 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/20'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
            title={userAnswers[question.id] ? `Question ${index + 1} (Answered)` : `Question ${index + 1} (Not answered)`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        {Object.keys(userAnswers).length} of {totalQuestions} answered
      </p>

      {/* Validation Error Alert */}
      {error && !showManualRetry && submissionRetryCount === 0 && (
        <Alert variant="destructive" className="mt-4 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Test</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showManualRetry && (
        <Alert className="mt-4 rounded-2xl">
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
        <Alert className="mt-4 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6"
      >
        <Card className="card-lift gap-0 py-6 shadow-soft rounded-2xl">
          <CardContent>
            <ProficiencyTestQuestion
              question={currentQuestion}
              selectedChoice={userAnswers[currentQuestion.id] || null}
              onSelectChoice={(choiceId) => handleAnswerSelect(currentQuestion.id, choiceId)}
            />
          </CardContent>
          <CardFooter className="mt-6 flex items-center justify-between gap-4 px-6">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
            >
              <ArrowLeft />
              Back
            </Button>
            {currentQuestionIndex < currentTest.questions.length - 1 ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
                <ArrowRight />
              </Button>
            ) : (
              <Button 
                onClick={() => handleFinish()} 
                disabled={isSubmitting || showManualRetry}
                variant={getUnansweredCount() === 0 ? 'default' : 'outline'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Submitting...
                  </>
                ) : getUnansweredCount() > 0 
                  ? `Finish (${getUnansweredCount()} unanswered)` 
                  : (
                    <>
                      <CheckCircle2 />
                      Finish Test
                    </>
                  )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProficiencyTestPage;
