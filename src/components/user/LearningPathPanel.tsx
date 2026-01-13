'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Brain, ChevronRight, Loader2, Sparkles, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LearningRecommendation, getSimpleRecommendationsForLanguage } from '@/lib/services/recommendationEngine';

interface LearningPathPanelProps {
  language: 'ASL' | 'MSL';
}

const LearningPathPanel: React.FC<LearningPathPanelProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const { hasNewRecommendations, lastUpdateTrigger, clearNewRecommendationsFlag, tutorials, quizSets, getTutorials, getQuizSets } = useLearning();
  const router = useRouter();
  
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Get language-specific proficiency level
  const proficiencyLevel = language === 'ASL' 
    ? currentUser?.asl_proficiency_level 
    : currentUser?.msl_proficiency_level;
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Load tutorials and quizzes to get progress
        await Promise.all([
          getTutorials(language),
          getQuizSets(language)
        ]);
        
        const recs = proficiencyLevel 
          ? await getSimpleRecommendationsForLanguage(language, proficiencyLevel)
          : [];
        setRecommendations(recs);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, proficiencyLevel, language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Create maps for progress status
  const tutorialProgressMap = new Map(tutorials.map(t => [t.id, t.status]));
  const quizProgressMap = new Map(quizSets.map(q => [q.id, q.progress?.score !== undefined]));

  // Filter out completed items for dynamic feel
  const incompleteRecommendations = recommendations.filter(rec => {
    if (rec.type === 'tutorial') {
      return tutorialProgressMap.get(rec.id) !== 'completed';
    }
    if (rec.type === 'quiz') {
      return !quizProgressMap.get(rec.id);
    }
    return true; // Keep materials
  });

  // Shuffle and limit to show only 3-4 items at a time for progressive feel
  // Use a seeded shuffle based on user ID to keep consistent during session
  const shuffleWithSeed = (array: LearningRecommendation[]) => {
    const seed = userId ? userId.charCodeAt(0) : 42;
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((Math.abs(Math.sin(seed * i)) * (i + 1)));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Limit to first 4 incomplete items (shuffled)
  const filteredRecommendations = shuffleWithSeed(incompleteRecommendations).slice(0, 4);

  const getIcon = (type: string) => {
    switch (type) {
      case 'tutorial':
        return <PlayCircle size={16} className="text-blue-500" />;
      case 'quiz':
        return <Brain size={16} className="text-amber-500" />;
      case 'material':
        return <FileText size={16} className="text-purple-500" />;
      default:
        return <BookOpen size={16} className="text-slate-500" />;
    }
  };

  const handleStartLearning = (item: LearningRecommendation) => {
    switch (item.type) {
      case 'tutorial':
        router.push(`/learning/tutorials/${item.id}`);
        break;
      case 'quiz':
        router.push(`/learning/quizzes/${item.id}`);
        break;
      case 'material':
        router.push('/learning/materials');
        break;
    }
  };

  // No proficiency level for this language
  if (!proficiencyLevel) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen size={20} className="text-signlang-primary" />
            {language} Learning Path
          </h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Take the {language} proficiency test to get personalized learning recommendations
          </p>
          <Button onClick={() => router.push('/proficiency-test/select')}>
            Take {language} Proficiency Test
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen size={20} className="text-signlang-primary" />
            {language} Learning Path
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen size={20} className="text-signlang-primary" />
            {language} Learning Path
          </h2>
          <span className="text-xs px-2 py-0.5 bg-signlang-accent dark:bg-signlang-primary/20 text-signlang-dark dark:text-signlang-primary rounded font-bold capitalize">
            {proficiencyLevel}
          </span>
          {hasNewRecommendations && (
            <Badge 
              variant="default" 
              className="bg-green-500 hover:bg-green-600 text-white animate-pulse cursor-pointer"
              onClick={() => clearNewRecommendationsFlag()}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
        </div>
      </div>

      {/* Update Trigger Message */}
      {hasNewRecommendations && lastUpdateTrigger && (
        <div className="px-6 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400">
            {lastUpdateTrigger}
          </p>
        </div>
      )}

      {/* Content Area */}
      {filteredRecommendations.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            {recommendations.length > 0 
              ? `🎉 Great job! You've completed all ${language} content for ${proficiencyLevel} level!`
              : `No ${language} content available for ${proficiencyLevel} level yet`
            }
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
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {filteredRecommendations.slice(0, 5).map((item, idx) => (
            <div 
              key={item.id} 
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group flex items-center gap-4 relative"
            >
              {/* Timeline connector */}
              {idx !== Math.min(filteredRecommendations.length - 1, 4) && (
                <div className="absolute left-9 top-14 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-700 -z-10 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors" />
              )}

              {/* Status Icon */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ring-4 ring-white dark:ring-slate-800
                ${item.type === 'quiz' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 
                  item.type === 'tutorial' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}
              `}>
                {getIcon(item.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-signlang-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                    {item.type}
                  </Badge>
                  <span className="truncate">{item.reason}</span>
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleStartLearning(item)}
                className="p-2 text-slate-300 dark:text-slate-600 hover:text-signlang-primary dark:hover:text-signlang-primary transition-colors bg-white dark:bg-slate-700 rounded-full hover:bg-signlang-accent dark:hover:bg-signlang-primary/10 shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {filteredRecommendations.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
          <button 
            onClick={() => router.push('/learning/tutorials')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-signlang-primary dark:hover:text-signlang-primary uppercase tracking-wide flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            View All {language} Content
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningPathPanel;


