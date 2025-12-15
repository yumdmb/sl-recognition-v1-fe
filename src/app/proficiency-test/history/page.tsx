'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  History, 
  TrendingUp, 
  Calendar,
  Award,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface TestAttempt {
  id: string;
  test_id: string;
  score: number | null;
  completed_at: string | null;
  created_at: string;
  test: {
    id: string;
    title: string;
    description: string | null;
    language: string;
  };
}

const ProficiencyTestHistoryPage = () => {
  const { currentUser } = useAuth();
  const { getTestHistory, proficiencyTestLoading } = useLearning();
  const router = useRouter();
  
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      if (!currentUser) {
        return;
      }

      try {
        setIsLoading(true);
        const history = await getTestHistory();
        if (isMounted) {
          setAttempts(history);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching test history:', err);
        if (isMounted) {
          setError('Failed to load test history. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [currentUser]); // Only depend on currentUser

  const getProficiencyLevel = (score: number | null): string => {
    if (score === null) return 'Incomplete';
    if (score < 50) return 'Beginner';
    if (score <= 80) return 'Intermediate';
    return 'Advanced';
  };

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'beginner':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Prepare chart data
  const chartData = attempts
    .filter(attempt => attempt.completed_at && attempt.score !== null)
    .reverse()
    .map((attempt, index) => ({
      attempt: `Test ${index + 1}`,
      score: attempt.score,
      date: format(new Date(attempt.completed_at!), 'MMM dd'),
      fullDate: format(new Date(attempt.completed_at!), 'PPP'),
    }));

  // Calculate statistics
  const completedAttempts = attempts.filter(a => a.completed_at && a.score !== null);
  const averageScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length)
    : 0;
  const highestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map(a => a.score || 0))
    : 0;
  const latestLevel = completedAttempts.length > 0
    ? getProficiencyLevel(completedAttempts[0].score)
    : 'None';

  // Show loading state while checking auth or fetching data
  if (!currentUser) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6" />
              Test History
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Test History</h3>
            <p className="text-muted-foreground mb-6">
              You haven't taken any proficiency tests yet. Take your first test to get started!
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/proficiency-test/select">Take a Test</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            Test History
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your proficiency test progress over time
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedAttempts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getProficiencyColor(latestLevel)} text-lg px-3 py-1`}>
              {latestLevel}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Highest: {highestScore}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.attempt}</p>
                          <p className="text-sm text-muted-foreground">{data.fullDate}</p>
                          <p className="text-lg font-bold text-primary mt-1">
                            {data.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Level: {getProficiencyLevel(data.score)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Test Attempts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            All Test Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attempts.map((attempt, index) => {
              const level = getProficiencyLevel(attempt.score);
              const isCompleted = attempt.completed_at && attempt.score !== null;
              
              return (
                <div 
                  key={attempt.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                      {attempts.length - index}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{attempt.test.title}</h3>
                      </div>
                      {attempt.test.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {attempt.test.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(attempt.created_at), 'PPP')}
                        </div>
                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isCompleted ? (
                      <>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {attempt.score}%
                          </p>
                          <Badge className={`${getProficiencyColor(level)} mt-1`}>
                            {level}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/proficiency-test/results?attemptId=${attempt.id}`)}
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <Badge variant="secondary">Incomplete</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link href="/proficiency-test/select">
            Take Another Test
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProficiencyTestHistoryPage;
