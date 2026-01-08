'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Brain, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LearningRecommendation, getSimpleRecommendationsForLanguage } from '@/lib/services/recommendationEngine';

type LanguageTab = 'ASL' | 'MSL';

const LearningPathPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasNewRecommendations, lastUpdateTrigger, clearNewRecommendationsFlag } = useLearning();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<LanguageTab>('ASL');
  const [aslRecommendations, setAslRecommendations] = useState<LearningRecommendation[]>([]);
  const [mslRecommendations, setMslRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Get proficiency levels
  const aslLevel = currentUser?.asl_proficiency_level;
  const mslLevel = currentUser?.msl_proficiency_level;
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch recommendations for both languages in parallel
        const [aslRecs, mslRecs] = await Promise.all([
          aslLevel ? getSimpleRecommendationsForLanguage('ASL', aslLevel) : Promise.resolve([]),
          mslLevel ? getSimpleRecommendationsForLanguage('MSL', mslLevel) : Promise.resolve([]),
        ]);
        
        setAslRecommendations(aslRecs);
        setMslRecommendations(mslRecs);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, aslLevel, mslLevel]);

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

  const handleStartLearning = (item: LearningRecommendation) => {
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

  // Check if user has any proficiency level set
  const hasAnyProficiency = aslLevel || mslLevel;

  if (!hasAnyProficiency) {
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

  const activeRecommendations = activeTab === 'ASL' ? aslRecommendations : mslRecommendations;
  const activeLevel = activeTab === 'ASL' ? aslLevel : mslLevel;

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
        </CardTitle>
        {hasNewRecommendations && lastUpdateTrigger && (
          <p className="text-sm text-muted-foreground mt-2">
            {lastUpdateTrigger}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* Language Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab('ASL')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'ASL'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>🇺🇸</span>
            <span>ASL</span>
            {aslLevel && (
              <Badge variant="outline" className="capitalize text-xs">
                {aslLevel}
              </Badge>
            )}
            {!aslLevel && (
              <Badge variant="outline" className="text-xs text-gray-400">
                Not Set
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('MSL')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'MSL'
                ? 'border-green-500 text-green-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>🇲🇾</span>
            <span>MSL</span>
            {mslLevel && (
              <Badge variant="outline" className="capitalize text-xs">
                {mslLevel}
              </Badge>
            )}
            {!mslLevel && (
              <Badge variant="outline" className="text-xs text-gray-400">
                Not Set
              </Badge>
            )}
          </button>
        </div>

        {/* Content Area */}
        {!activeLevel ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Take the {activeTab} proficiency test to unlock learning content
            </p>
            <Button 
              size="sm" 
              onClick={() => router.push('/proficiency-test/select')}
            >
              Take {activeTab} Test
            </Button>
          </div>
        ) : activeRecommendations.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              No {activeTab} content available for {activeLevel} level yet
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => router.push('/learning/tutorials')}
            >
              Browse All Tutorials
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRecommendations.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="mt-1 text-gray-600">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.reason}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => handleStartLearning(item)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {activeRecommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/learning/tutorials')}
            >
              View All {activeTab} Content
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPathPanel;
