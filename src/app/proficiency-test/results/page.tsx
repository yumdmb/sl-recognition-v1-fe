"use client";

import React, {
  useEffect,
  useState,
  Suspense,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLearning } from "@/context/LearningContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Trophy,
  TrendingUp,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

function ProficiencyTestResultsContent() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { getTestResults } = useLearning();
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  // Use local loading state to prevent blinking from context updates
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{
    attempt: { score: number; test_id: string };
    proficiencyLevel: string;
    performanceAnalysis: {
      categoryPerformance: Array<{
        category: string;
        correct: number;
        total: number;
        percentage: number;
      }>;
      strengths: string[];
      weaknesses: string[];
      insights: string[];
    };
    knowledgeGaps: Array<{
      questionId: string;
      questionText: string;
      userAnswer: string;
      correctAnswer: string;
    }>;
    recommendations: Array<{
      type: string;
      title: string;
      description: string;
      reason: string;
      recommended_for_role?: "deaf" | "non-deaf" | "all";
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ref to prevent duplicate fetches
  const fetchedRef = useRef(false);
  // Ref to store the getTestResults function to avoid dependency issues
  const getTestResultsRef = useRef(getTestResults);
  getTestResultsRef.current = getTestResults;

  const fetchResults = useCallback(async () => {
    // Prevent duplicate fetches
    if (fetchedRef.current) return;

    if (!attemptId) {
      setError("No test attempt ID provided. Please complete a test first.");
      setIsLoading(false);
      return;
    }

    fetchedRef.current = true;
    setIsLoading(true);

    try {
      const data = await getTestResultsRef.current(attemptId);
      setResults(data);
    } catch (err) {
      console.error("Error fetching test results:", err);
      setError("Failed to load test results. Please try again.");
      // Reset fetchedRef on error to allow retry
      fetchedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    // Wait for auth to be loaded
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchResults();
  }, [authLoading, currentUser, router, fetchResults]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Unable to load results."}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { attempt, proficiencyLevel, performanceAnalysis, recommendations } =
    results;
  const score = attempt.score || 0;

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "advanced":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "beginner":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleLabel = (role?: "deaf" | "non-deaf" | "all") => {
    switch (role) {
      case "deaf":
        return {
          label: "Deaf",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "non-deaf":
        return {
          label: "Non-Deaf",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case "all":
      default:
        return {
          label: "Universal",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-4 md:space-y-6">
      {/* Score and Level Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-5xl font-bold text-primary">{score}%</p>
              <p className="text-muted-foreground mt-2">Your Score</p>
            </div>
            <div>
              <Badge
                className={`${getProficiencyColor(
                  proficiencyLevel
                )} text-white text-lg px-4 py-2`}
              >
                {proficiencyLevel}
              </Badge>
              <p className="text-muted-foreground mt-2">Proficiency Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceAnalysis.categoryPerformance.map(
            (category, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {category.correct} / {category.total} correct
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      category.percentage >= 70
                        ? "bg-green-500"
                        : category.percentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.percentage}%
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses Card */}
      <Card>
        <CardHeader>
          <CardTitle>Strengths & Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceAnalysis.strengths.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-600 mb-2">Strengths</h3>
              <ul className="list-disc list-inside space-y-1">
                {performanceAnalysis.strengths.map(
                  (strength: string, index: number) => (
                    <li key={index} className="text-sm">
                      {strength}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
          {performanceAnalysis.weaknesses.length > 0 && (
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">
                Areas for Improvement
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {performanceAnalysis.weaknesses.map(
                  (weakness: string, index: number) => (
                    <li key={index} className="text-sm">
                      {weakness}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
          {performanceAnalysis.insights.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Insights</h3>
              <ul className="space-y-2">
                {performanceAnalysis.insights.map(
                  (insight: string, index: number) => (
                    <li key={index} className="text-sm text-blue-700">
                      {insight}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Recommendations Card */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your performance, we recommend the following resources:
            </p>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, index: number) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        {rec.recommended_for_role &&
                          rec.recommended_for_role !== "all" && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                getRoleLabel(rec.recommended_for_role).color
                              }`}
                            >
                              {getRoleLabel(rec.recommended_for_role).label}
                            </Badge>
                          )}
                        <h4 className="font-medium">{rec.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">{rec.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button asChild variant="outline">
          <Link href="/proficiency-test/history">View Test History</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/proficiency-test/${attempt.test_id}`}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            <BookOpen className="h-4 w-4 mr-2" />
            View Learning Path
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ProficiencyTestResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <ProficiencyTestResultsContent />
    </Suspense>
  );
}
