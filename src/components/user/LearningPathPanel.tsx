'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Brain, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTestResultsWithAnalysis } from '@/lib/services/proficiencyTestService';
import { LearningRecommendation } from '@/lib/services/recommendationEngine';

const LearningPathPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasNewRecommendations, lastUpdateTrigger, clearNewRecommendationsFlag } = useLearning();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser?.id || !currentUser?.proficiency_level) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get the user's most recent test attempt
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: latestAttempt, error: attemptError } = await supabase
          .from('proficiency_test_attempts')
          .select('id')
          .eq('user_id', currentUser.id)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (attemptError || !latestAttempt) {
          setError('No test results found');
          setLoading(false);
          return;
        }

        // Get comprehensive results with recommendations
        const results = await getTestResultsWithAnalysis(latestAttempt.id, currentUser.id);
        setRecommendations(results.recommendations);
        setError(null);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'tutorial':
        return <BookOpen className="h-5 w-5" />;
      case 'quiz':
        return <Brain className="h-5 w-5" />;
      case 'material':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role?: 'deaf' | 'non-deaf' | 'all') => {
    switch (role) {
      case 'deaf':
        return { label: 'Deaf', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'non-deaf':
        return { label: 'Non-Deaf', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'all':
      default:
        return { label: 'Universal', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const handleStartLearning = (item: LearningRecommendation) => {
    // Navigate based on content type
    switch (item.type) {
      case 'tutorial':
        router.push('/learning/tutorials');
        break;
      case 'quiz':
        router.push(`/learning/quizzes/${item.id}`);
        break;
      case 'material':
        router.push('/learning/materials');
        break;
    }
  };

  if (!currentUser?.proficiency_level) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Take a proficiency test to get personalized learning recommendations
            </p>
            <Button onClick={() => router.push('/proficiency-test/select')}>
              Take Proficiency Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {error || 'No recommendations available at this time'}
            </p>
            <Button variant="outline" onClick={() => router.push('/proficiency-test/select')}>
              Retake Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show top 5 recommendations on dashboard
  const topRecommendations = recommendations.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Path
            {hasNewRecommendations && (
              <Badge 
                variant="default" 
                className="bg-green-500 hover:bg-green-600 text-white animate-pulse"
                onClick={() => clearNewRecommendationsFlag()}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="capitalize">
            {currentUser.proficiency_level}
          </Badge>
        </CardTitle>
        {hasNewRecommendations && lastUpdateTrigger && (
          <p className="text-sm text-muted-foreground mt-2">
            {lastUpdateTrigger}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topRecommendations.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mt-1 text-gray-600">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex gap-1 shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(item.priority)}`}
                    >
                      Priority {item.priority}
                    </Badge>
                    {item.recommended_for_role && item.recommended_for_role !== 'all' && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRoleLabel(item.recommended_for_role).color}`}
                      >
                        {getRoleLabel(item.recommended_for_role).label}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 italic mb-2">
                  {item.reason}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => handleStartLearning(item)}
                >
                  Start Learning
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length > 5 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/learning-path')}
            >
              View Full Learning Path ({recommendations.length} items)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPathPanel;
